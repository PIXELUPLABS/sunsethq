import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { handleSignupSignal, recordSignupProbe, recordSignupSignal, signupHealth, PROBE_HEADER } from "../modules/lead-capture/lib/signup-monitor";
import { handleIntake, type IntakeEnv } from "../workers/lead-intake";
import { handleSite, type SiteEnv } from "../workers/site";
import { testDatabase } from "./sqlite-d1";

const origin = "https://www.replay.ai";
const secret = "synthetic-only-test-credential-32-characters";
const answers = { submissionId: "519bb340-a25e-42eb-a5f3-b8e6d6b6b435", companyName: "Test", workEmail: "test@example.com",
  yearsOfOperation: "3 to 5 years", businessSize: "20 - 49", englishShare: "100%", turnstileToken: "test-token" };
function setup(t: TestContext) {
  const { db, sqlite } = testDatabase();
  t.after(() => sqlite.close());
  let queued = 0, verifications = 0;
  const env = {
    APP_ENV: "production", LEAD_DB: db, SITE_ORIGIN: origin, ALLOWED_ORIGINS: origin,
    SIGNUP_MONITORING_ENABLED: "true", SIGNUP_PROBE_SECRET: secret,
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
  const verify = (async () => { verifications++; return Response.json({ success: true, hostname: "www.replay.ai", action: "lead_capture" }); }) as typeof fetch;
  return { env, sqlite, request, verify, queued: () => queued, verifications: () => verifications };
}

test("probe passes real intake and verification without creating a lead, queue message, or calendar offer", async t => {
  const s = setup(t);
  const result = await handleIntake(s.request("/api/leads", answers, { [PROBE_HEADER]: secret }), s.env, s.verify);
  assert.equal(result.status, 202);
  assert.deepEqual(await result.json(), { accepted: true, synthetic: true, submissionId: answers.submissionId, verification: "verified", bookingUrl: null });
  assert.equal(s.verifications(), 1);
  assert.equal(s.queued(), 0);
  assert.equal(s.sqlite.prepare("SELECT COUNT(*) AS count FROM lead_submissions").get()?.count, 0);
  assert.equal((await signupHealth(s.env)).healthy, true);
});

test("probe credentials cannot bypass validation, verification, or pollute the real lead ledger", async t => {
  const s = setup(t);
  assert.equal((await handleIntake(s.request("/api/leads", answers, { [PROBE_HEADER]: "wrong" }), s.env, s.verify)).status, 401);
  assert.equal(s.verifications(), 0);
  assert.equal((await handleIntake(s.request("/api/leads", { ...answers, workEmail: "invalid" }, { [PROBE_HEADER]: secret }), s.env, s.verify)).status, 400);
  const rejected = await handleIntake(s.request("/api/leads", answers, { [PROBE_HEADER]: secret }), s.env, async () => Response.json({ success: false }));
  assert.equal(rejected.status, 400);
  const unavailable = await handleIntake(s.request("/api/leads", answers, { [PROBE_HEADER]: secret }), s.env, async () => { throw new Error("Provider unavailable"); });
  assert.equal(unavailable.status, 503);
  assert.equal((await signupHealth(s.env)).healthy, false);
  const fallback = { ...answers, turnstileToken: "", verificationFallback: "script_unavailable" };
  assert.equal((await handleIntake(s.request("/api/leads", fallback, { [PROBE_HEADER]: secret }), s.env, s.verify)).status, 503);
  assert.equal(s.queued(), 0);
  assert.equal(s.sqlite.prepare("SELECT COUNT(*) AS count FROM lead_submissions").get()?.count, 0);
});

test("the external report can mark a failure but cannot manufacture success", async t => {
  const s = setup(t);
  await recordSignupProbe(s.env, true);
  assert.equal((await handleSignupSignal(s.request("/api/signup-probe", { healthy: true }), s.env)).status, 401);
  assert.equal((await signupHealth(s.env)).healthy, true);
  assert.equal((await handleSignupSignal(s.request("/api/signup-probe", { healthy: true }, { [PROBE_HEADER]: secret }), s.env)).status, 204);
  assert.equal((await signupHealth(s.env)).healthy, false);
});

test("missing, failed, or stale probes fail closed, independently of browser traffic", async t => {
  const s = setup(t), now = Date.now();
  assert.equal((await signupHealth(s.env, now)).healthy, false);
  await recordSignupProbe(s.env, true, now);
  assert.equal((await signupHealth(s.env, now + 20 * 60_000 - 1)).healthy, true);
  assert.equal((await signupHealth(s.env, now + 20 * 60_000)).healthy, false);
  assert.equal((await signupHealth({ ...s.env, SIGNUP_PROBE_SECRET: undefined }, now)).healthy, false);
  await recordSignupProbe(s.env, false, now + 1000);
  await recordSignupProbe(s.env, true, now); // A late older result cannot hide a newer failure.
  assert.equal((await signupHealth(s.env, now + 1000)).healthy, false);
});

test("repeated failures turn health red, deduplicate retries, isolate environments, and expire", async t => {
  const s = setup(t), now = Date.now();
  await recordSignupProbe(s.env, true, now);
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
  const unhealthy = await handleSite(request, s.env as SiteEnv);
  assert.equal(unhealthy.status, 503);
  assert.deepEqual(await unhealthy.json(), { healthy: false });
  await recordSignupProbe(s.env, true, now);
  const healthy = await handleSite(request, s.env as SiteEnv);
  assert.equal(healthy.status, 200);
  assert.deepEqual(await healthy.json(), { healthy: true });
  assert.equal(healthy.headers.get("Cache-Control"), "no-store");
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
