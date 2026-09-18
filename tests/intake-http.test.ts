import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { handleIntake, type IntakeEnv } from "../workers/lead-intake";
import { testDatabase } from "./sqlite-d1";

const origin = "https://www.replay.ai";
const submission = {
  submissionId: "519bb340-a25e-42eb-a5f3-b8e6d6b6b435",
  companyName: "HTTP boundary test", workEmail: "http-test@example.com",
  yearsOfOperation: "3 to 5 years", businessSize: "20 - 49", englishShare: "100%",
  turnstileToken: "test-token",
};

function setup(t: TestContext) {
  const { db, sqlite } = testDatabase();
  t.after(() => sqlite.close());
  let verificationCalls = 0;
  let queueCalls = 0;
  const env = {
    APP_ENV: "production", SITE_ORIGIN: origin, ALLOWED_ORIGINS: origin,
    TURNSTILE_SECRET_KEY: "test-only-private-key", LEAD_DB: db,
    LEAD_RATE_LIMITER: { limit: async () => ({ success: true }) },
    LEADS: { send: async () => { queueCalls++; } },
  } as unknown as IntakeEnv;
  const verify = (async () => {
    verificationCalls++;
    return Response.json({ success: true, hostname: "www.replay.ai", action: "lead_capture" });
  }) as typeof fetch;
  const request = (overrides: RequestInit = {}) => new Request(`${origin}/api/leads`, {
    method: "POST", body: JSON.stringify(submission),
    headers: { Origin: origin, "Content-Type": "application/json", "CF-Connecting-IP": "192.0.2.1" },
    ...overrides,
  });
  const assertNoSideEffects = () => {
    assert.equal(verificationCalls, 0);
    assert.equal(queueCalls, 0);
    assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM lead_submissions").get()?.count, 0);
  };
  return { env, verify, request, assertNoSideEffects };
}

test("CORS preflight permits only the configured origin and never processes a signup", async t => {
  const s = setup(t);
  const allowed = await handleIntake(s.request({ method: "OPTIONS", body: undefined }), s.env, s.verify);
  assert.equal(allowed.status, 204);
  assert.equal(allowed.headers.get("Access-Control-Allow-Origin"), origin);
  assert.equal(allowed.headers.get("Access-Control-Allow-Methods"), "POST");
  assert.equal(allowed.headers.get("Access-Control-Allow-Headers"), "Content-Type");
  assert.equal(allowed.headers.get("Vary"), "Origin");
  for (const untrusted of ["https://www.replay.ai.attacker.example", "null"]) {
    const response = await handleIntake(s.request({ method: "OPTIONS", body: undefined, headers: { Origin: untrusted } }), s.env, s.verify);
    assert.equal(response.status, 403);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
  }
  s.assertNoSideEffects();
});

test("malformed JSON, invalid body shapes, unsupported methods, and media types have no side effects", async t => {
  const s = setup(t);
  const cases: [Request, number][] = [
    [s.request({ method: "GET", body: undefined }), 405],
    [s.request({ body: "{" }), 400],
    [s.request({ body: "null" }), 400],
    [s.request({ body: "[]" }), 400],
    [s.request({ body: undefined }), 400],
    [s.request({ headers: { Origin: origin, "CF-Connecting-IP": "192.0.2.1", "Content-Type": "text/plain" } }), 415],
  ];
  for (const [request, status] of cases) {
    const response = await handleIntake(request, s.env, s.verify);
    assert.equal(response.status, status);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(response.headers.get("Content-Type"), "application/json");
  }
  s.assertNoSideEffects();
});

test("production cannot substitute caller-controlled forwarding headers for the Cloudflare client IP", async t => {
  const s = setup(t);
  const response = await handleIntake(s.request({ headers: {
    Origin: origin, "Content-Type": "application/json", "X-Forwarded-For": "192.0.2.1", "X-Real-IP": "192.0.2.1",
  } }), s.env, s.verify);
  assert.equal(response.status, 403);
  s.assertNoSideEffects();
});

test("chunked bodies enforce a byte limit even without or with a false Content-Length", async t => {
  const s = setup(t);
  const payload = JSON.stringify({ ...submission, ignored: "é".repeat(6000) });
  assert.ok(payload.length < 8192, "the UTF-16 string length alone would incorrectly pass");
  for (const contentLength of [undefined, "1"]) {
    let cancelled = false;
    let offset = 0;
    const bytes = new TextEncoder().encode(payload);
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        if (offset >= bytes.length) controller.close();
        else { controller.enqueue(bytes.subarray(offset, offset + 1024)); offset += 1024; }
      },
      cancel() { cancelled = true; },
    });
    const headers = { Origin: origin, "Content-Type": "application/json", "CF-Connecting-IP": "192.0.2.1",
      ...(contentLength ? { "Content-Length": contentLength } : {}),
    };
    const request = s.request({ body, headers, duplex: "half" } as RequestInit);
    assert.equal((await handleIntake(request, s.env, s.verify)).status, 413);
    assert.equal(cancelled, true, "the oversized request stream must be cancelled");
  }
  s.assertNoSideEffects();
});

test("a valid signup at exactly the body byte limit is still accepted", async t => {
  const s = setup(t);
  const emptyPadding = JSON.stringify({ ...submission, ignored: "" });
  const body = JSON.stringify({ ...submission, ignored: " ".repeat(8192 - Buffer.byteLength(emptyPadding)) });
  assert.equal(Buffer.byteLength(body), 8192);
  const response = await handleIntake(s.request({ body }), s.env, s.verify);
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { accepted: true, submissionId: submission.submissionId, verification: "verified" });
});
