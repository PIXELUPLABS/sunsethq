import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { handleSignupSignal, recordSignupSignal, signupHealth } from "../modules/lead-capture/lib/signup-monitor";
import { handleIntake, type IntakeEnv } from "../workers/lead-intake";
import { handleSite, type SiteEnv } from "../workers/site";
import { testDatabase } from "./sqlite-d1";

const origin = "https://www.replay.ai";
const answers = { submissionId: "519bb340-a25e-42eb-a5f3-b8e6d6b6b435", companyName: "Test", workEmail: "test@example.com",
  yearsOfOperation: "3 to 5 years", businessSize: "20 - 49", englishShare: "100%", turnstileToken: "test-token" };
function setup(t: TestContext) {
  const { db, sqlite } = testDatabase();
  t.after(() => sqlite.close());
  let queued = 0;
  const env = {
    APP_ENV: "production", LEAD_DB: db, SITE_ORIGIN: origin, ALLOWED_ORIGINS: origin,
    SIGNUP_MONITORING_ENABLED: "true",
    SIGNUP_SIGNAL_RATE_LIMITER: { limit: async () => ({ success: true }) },
    LEAD_RATE_LIMITER: { limit: async () => ({ success: true }) },
    UNVERIFIED_RATE_LIMITER: { limit: async () => ({ success: true }) },
    UNVERIFIED_LEADS_ENABLED: "true", TURNSTILE_SECRET_KEY: "private-test-key",
    LEADS: { send: async () => { queued++; } },
  } as unknown as IntakeEnv;
  const request = (path: string, body?: unknown, headers: Record<string, string> = {}) => new Request(origin + path, {
    method: "POST", headers: { Origin: origin, "Content-Type": "application/json", "CF-Connecting-IP": "192.0.2.1", ...headers },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const verify = (async () => Response.json({ success: true, hostname: "www.replay.ai", action: "lead_capture" })) as typeof fetch;
  return { env, sqlite, request, verify, queued: () => queued };
}

test("repeated failures turn health red, deduplicate retries, isolate environments, and expire", async t => {
  const s = setup(t), now = Date.now();
  const id = crypto.randomUUID();
  for (let i = 0; i < 5; i++) await recordSignupSignal(s.env, "bootstrap_timeout", id, now);
  await recordSignupSignal({ ...s.env, APP_ENV: "development" }, "bootstrap_timeout", crypto.randomUUID(), now);
  assert.equal((await signupHealth(s.env, now)).healthy, true);
  for (let i = 0; i < 2; i++) await recordSignupSignal(s.env, "bootstrap_timeout", crypto.randomUUID(), now);
  assert.equal((await signupHealth(s.env, now)).healthy, false);
  assert.equal((await signupHealth(s.env, now + 15 * 60_000 + 1)).healthy, true);
});

test("browser telemetry is bounded, enumerated, origin checked, and separately rate limited", async t => {
  const s = setup(t), id = crypto.randomUUID();
  assert.equal((await handleSignupSignal(s.request("/api/signup-signal", { id, code: "javascript_error" }), s.env)).status, 204);
  assert.equal((await handleSignupSignal(s.request("/api/signup-signal", { id, code: "user@example.com" }), s.env)).status, 400);
  assert.equal((await handleSignupSignal(s.request("/api/signup-signal", { id, code: "intake_unavailable" }), s.env)).status, 400);
  assert.equal((await handleSignupSignal(s.request("/api/signup-signal", { id, code: "javascript_error" }, { Origin: "https://evil.example" }), s.env)).status, 403);
  assert.equal((await handleSignupSignal(s.request("/api/signup-signal", { id, code: "a".repeat(512) }), s.env)).status, 413);
  const limited = { ...s.env, SIGNUP_SIGNAL_RATE_LIMITER: { limit: async () => ({ success: false }) } } as IntakeEnv;
  assert.equal((await handleSignupSignal(s.request("/api/signup-signal", { id, code: "javascript_error" }), limited)).status, 429);
  // Operational telemetry outages must not stop normal intake.
  assert.equal((await handleIntake(s.request("/api/leads", answers), limited, s.verify)).status, 202);
  const stored = s.sqlite.prepare("SELECT * FROM signup_signals").all();
  assert.equal(stored.length, 1);
  assert.deepEqual(Object.keys(stored[0]), ["environment", "signal_id", "code", "created_at"]);
});

test("public health incorporates pre-acceptance monitoring without leaking diagnostics", async t => {
  const s = setup(t), now = Date.now();
  s.sqlite.prepare("INSERT INTO lead_monitor(environment,last_reconciled_at,dependency_ok) VALUES ('production',?,1)").run(now);
  const request = new Request(origin + "/api/health");
  const healthy = await handleSite(request, s.env as SiteEnv);
  assert.equal(healthy.status, 200);
  assert.deepEqual(await healthy.json(), { healthy: true });
  assert.equal(healthy.headers.get("Cache-Control"), "no-store");
  for (let i = 0; i < 3; i++) await recordSignupSignal(s.env, "submission_failed");
  const unhealthy = await handleSite(request, s.env as SiteEnv);
  assert.equal(unhealthy.status, 503);
  assert.deepEqual(await unhealthy.json(), { healthy: false });
});

test("an unavailable telemetry store does not turn a real lead acceptance into a failure", async t => {
  const s = setup(t);
  const original = s.env.LEAD_DB;
  s.env.LEAD_DB = { prepare(sql: string) {
    if (sql.includes("signup_")) throw new Error("Telemetry unavailable");
    return original.prepare(sql);
  } } as typeof original;
  const accepted = await handleIntake(s.request("/api/leads", answers), s.env, s.verify);
  assert.equal(accepted.status, 202);
  assert.equal(s.queued(), 1);
  const rejected = await handleIntake(s.request("/api/leads", { ...answers, submissionId: crypto.randomUUID() }), s.env, async () => Response.json({ success: false }));
  assert.equal(rejected.status, 400);
  const signal = await handleSignupSignal(s.request("/api/signup-signal", { id: crypto.randomUUID(), code: "javascript_error" }), s.env);
  assert.equal(signal.status, 503);
});

for (const code of ["verification_rejected", "intake_unavailable"] as const) {
  test(`${code} reaches health monitoring before a lead is accepted`, async t => {
    const s = setup(t);
    if (code === "intake_unavailable") s.env.TURNSTILE_SECRET_KEY = "";
    for (let i = 0; i < 3; i++) {
      const response = await handleIntake(s.request("/api/leads", { ...answers, submissionId: crypto.randomUUID() }),
        s.env, async () => Response.json({ success: false }));
      assert.equal(response.status, code === "verification_rejected" ? 400 : 503);
    }
    assert.equal(s.queued(), 0);
    assert.equal(s.sqlite.prepare("SELECT COUNT(*) AS count FROM lead_submissions").get()?.count, 0);
    assert.equal(s.sqlite.prepare("SELECT COUNT(*) AS count FROM signup_signals WHERE code = ?").get(code)?.count, 3);
    assert.equal((await signupHealth(s.env)).healthy, false);
  });
}
