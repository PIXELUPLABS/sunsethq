import assert from "node:assert/strict";
import { test } from "node:test";
import type { MessageBatch } from "@cloudflare/workers-types";
import { handleIntake, type IntakeEnv } from "../workers/lead-intake";
import { handleDelivery, type DeliveryEnv } from "../workers/lead-delivery";
import { AttioError, deliverToAttio } from "../modules/lead-capture/lib/attio-client";
import type { LeadMessage } from "../modules/lead-capture/lib/lead-schema";
import { testDatabase } from "./sqlite-d1";
import { leadHealth, persistLead, reconcileLeads, recordDelivered, SubmissionConflict } from "../modules/lead-capture/lib/lead-ledger";
import { createAttributionSession } from "../modules/attribution/lib/visit-attribution";

const submission = {
  submissionId: "8ad633d2-cf1e-4f14-b029-82e2b244f74f", companyName: "Replay Test",
  workEmail: "Test@Example.com", yearsOfOperation: "3 to 5 years", businessSize: "20 - 49",
  englishShare: "100%", turnstileToken: "token", campaign: { utm_source: "test", private: "discard" },
};
const message: LeadMessage = {
  version: 1, environment: "production", submissionId: submission.submissionId,
  submittedAt: "2026-09-18T14:00:00.000Z", sourceUrl: "https://example.com/value-my-data",
  lead: { companyName: "Replay Test", workEmail: "test@example.com", yearsOfOperation: "3 to 5 years", businessSize: "20 - 49", englishShare: "100%" }, campaign: {},
};
function intakeSetup() {
  const queued: LeadMessage[] = [];
  let verified = 0;
  const env = {
    LEAD_DB: testDatabase().db,
    APP_ENV: "production", ALLOWED_ORIGINS: "https://example.com", SITE_ORIGIN: "https://example.com",
    TURNSTILE_SECRET_KEY: "real-secret", LEAD_RATE_LIMITER: { limit: async () => ({ success: true }) },
    LEADS: { send: async (lead: LeadMessage) => { queued.push(lead); } },
  } as unknown as IntakeEnv;
  const verify = (async () => {
    verified++;
    return Response.json({ success: true, hostname: "example.com", action: "lead_capture" });
  }) as typeof fetch;
  const request = (body: unknown = submission, origin = "https://example.com") => new Request("https://example.com/api/leads", {
    method: "POST", headers: { origin, "content-type": "application/json", "cf-connecting-ip": "192.0.2.1" }, body: JSON.stringify(body),
  });
  return { queued, env, verify, request, verified: () => verified };
}

test("acceptance follows durable ledger storage; only normalized allowlisted fields enter the queue", async () => {
  const s = intakeSetup();
  const response = await handleIntake(s.request({ ...submission, ATTIO_LIST_ID: "attacker", destination: "https://bad.example" }), s.env, s.verify);
  assert.equal(response.status, 202);
  assert.equal(s.queued.length, 1);
  assert.equal(s.queued[0].lead.workEmail, "test@example.com");
  assert.deepEqual(s.queued[0].campaign, { utm_source: "test" });
  assert.ok(!JSON.stringify(s.queued).includes("attacker"));
  assert.ok(!JSON.stringify(s.queued).includes("token"));
});
test("invalid origins, enum values, bodies, and rate limits never reach the queue", async () => {
  const s = intakeSetup();
  assert.equal((await handleIntake(s.request(submission, "https://bad.example"), s.env, s.verify)).status, 403);
  assert.equal((await handleIntake(s.request({ ...submission, businessSize: "invalid" }), s.env, s.verify)).status, 400);
  assert.equal((await handleIntake(s.request({ ...submission, extra: "x".repeat(9000) }), s.env, s.verify)).status, 413);
  s.env.LEAD_RATE_LIMITER.limit = async () => ({ success: false });
  assert.equal((await handleIntake(s.request(), s.env, s.verify)).status, 429);
  assert.equal(s.verified(), 0);
  assert.equal(s.queued.length, 0);
});
test("first-touch landing pages use the server's origin and survive duplicate receipt retries", async () => {
  const s = intakeSetup();
  const body = { ...submission, landingPath: "/data-and-trust", campaign: { utm_source: "newsletter", landing_page: "https://attacker.example" } };
  assert.equal((await handleIntake(s.request(body), s.env, s.verify)).status, 202);
  assert.equal((await handleIntake(s.request(body), s.env, s.verify)).status, 202);
  assert.equal(s.queued.length, 1);
  assert.deepEqual(s.queued[0].campaign, { utm_source: "newsletter", landing_page: "https://example.com/data-and-trust" });
  assert.equal(s.queued[0].sourceUrl, "https://example.com/value-my-data");
  assert.equal((await handleIntake(s.request({ ...body, landingPath: "/" }), s.env, s.verify)).status, 202);
  assert.equal(s.queued.length, 1);
  assert.equal(s.queued[0].campaign.landing_page, "https://example.com/data-and-trust");
});
test("consent withdrawal during an uncertain receipt does not create or replace an inquiry", async () => {
  const s = intakeSetup();
  const body = { ...submission, landingPath: "/" };
  assert.equal((await handleIntake(s.request(body), s.env, s.verify)).status, 202);
  assert.equal((await handleIntake(s.request({ ...submission, campaign: {} }), s.env, s.verify)).status, 202);
  assert.equal(s.queued.length, 1);
  assert.equal(s.queued[0].campaign.utm_source, "test");
});
test("legacy receipt hashes survive the deployment and consent changes", async () => {
  const s = intakeSetup();
  const original = { ...message, campaign: { utm_source: "original" } };
  await persistLead(s.env, original);
  const legacyIdentity = JSON.stringify([original.environment, original.sourceUrl, original.lead, Object.entries(original.campaign)]);
  const legacyHash = Buffer.from(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(legacyIdentity))).toString("hex");
  await s.env.LEAD_DB.prepare("UPDATE lead_submissions SET payload_hash = ?").bind(legacyHash).run();
  assert.deepEqual((await persistLead(s.env, { ...original, campaign: {} })).message.campaign, original.campaign);
  await assert.rejects(persistLead(s.env, { ...original, lead: { ...original.lead, companyName: "different" } }), SubmissionConflict);
  await s.env.LEAD_DB.prepare("UPDATE lead_submissions SET status = 'delivered', payload = NULL").run();
  assert.equal((await persistLead(s.env, original)).delivered, true);
});
test("invalid landing pages are discarded without rejecting an otherwise valid inquiry", async () => {
  for (const landingPath of ["//attacker.example", "https://attacker.example", "/?email=private@example.com", "/%2f%2fattacker.example"]) {
    const s = intakeSetup();
    assert.equal((await handleIntake(s.request({ ...submission, landingPath }), s.env, s.verify)).status, 202);
    assert.deepEqual(s.queued[0].campaign, { utm_source: "test" });
  }
});
test("unavailable verification is accepted only with enabled, separately rate-limited manual review", async () => {
  const s = intakeSetup();
  const body = { ...submission, turnstileToken: "", verificationFallback: "script_unavailable", verification: { status: "verified" } };
  assert.equal((await handleIntake(s.request(body), s.env, s.verify)).status, 503);
  s.env.UNVERIFIED_LEADS_ENABLED = "true";
  assert.equal((await handleIntake(s.request(body), s.env, s.verify)).status, 503);
  let limited = 0;
  s.env.UNVERIFIED_RATE_LIMITER = { limit: async ({ key }) => { assert.equal(key, "192.0.2.1"); limited++; return { success: true }; } };
  const response = await handleIntake(s.request(body), s.env, s.verify);
  assert.equal(response.status, 202);
  assert.equal((await response.json() as { verification: string }).verification, "unverified");
  assert.deepEqual(s.queued[0].verification, { status: "unverified", reason: "script_unavailable" });
  assert.equal(s.verified(), 0);
  assert.equal(limited, 1);
  // Acquiring a token later cannot relabel the already saved inquiry.
  const retry = await handleIntake(s.request(submission), s.env, s.verify);
  assert.equal(retry.status, 202);
  assert.equal((await retry.json() as { verification: string }).verification, "unverified");
  s.env.UNVERIFIED_RATE_LIMITER.limit = async () => ({ success: false });
  const throttled = await handleIntake(s.request(body), s.env, s.verify);
  assert.equal(throttled.status, 429);
  assert.equal(throttled.headers.get("Retry-After"), "60");
  assert.equal(s.queued.length, 1);
});
test("a verification service outage can use manual review; explicit rejections still fail", async () => {
  const s = intakeSetup();
  s.env.UNVERIFIED_LEADS_ENABLED = "true";
  s.env.UNVERIFIED_RATE_LIMITER = { limit: async () => ({ success: true }) };
  for (const result of [{ success: false }, { success: true, hostname: "attacker.example", action: "lead_capture" }, { success: true, hostname: "example.com", action: "wrong" }]) {
    assert.equal((await handleIntake(s.request(), s.env, async () => Response.json(result))).status, 400);
  }
  assert.equal((await handleIntake(s.request({ ...submission, turnstileToken: "", verificationFallback: "made_up" }), s.env, s.verify)).status, 400);
  assert.equal((await handleIntake(s.request({ ...submission, turnstileToken: "" }), s.env, s.verify)).status, 400);
  assert.equal((await handleIntake(s.request(), s.env, async () => { throw new Error("offline"); })).status, 202);
  assert.deepEqual(s.queued[0].verification, { status: "unverified", reason: "service_unavailable" });
});
test("a tagged landing-page visit reaches an accepted unverified inquiry with its original attribution", async () => {
  const capture = createAttributionSession();
  capture("https://example.com/?utm_source=launch&utm_campaign=first");
  const attribution = capture("https://example.com/value-my-data");
  const s = intakeSetup();
  s.env.UNVERIFIED_LEADS_ENABLED = "true";
  s.env.UNVERIFIED_RATE_LIMITER = { limit: async () => ({ success: true }) };
  assert.equal((await handleIntake(s.request({ ...submission, ...attribution, turnstileToken: "", verificationFallback: "verification_timeout" }), s.env, s.verify)).status, 202);
  assert.deepEqual(s.queued[0].campaign, { utm_source: "launch", utm_campaign: "first", landing_page: "https://example.com/" });
  assert.equal(s.queued[0].verification?.status, "unverified");
});
test("production refuses dummy secrets and invalid verification including hostname/action", async () => {
  const s = intakeSetup();
  for (const result of [{ success: false }, { success: true, hostname: "bad.example", action: "lead_capture" }, { success: true, hostname: "example.com", action: "other" }]) {
    assert.equal((await handleIntake(s.request(), s.env, async () => Response.json(result))).status, 400);
  }
  s.env.TURNSTILE_SECRET_KEY = "1x0000000000000000000000000000000AA";
  assert.equal((await handleIntake(s.request(), s.env, s.verify)).status, 503);
  s.env.TURNSTILE_SECRET_KEY = "real-secret";
  s.env.APP_ENV = undefined as unknown as IntakeEnv["APP_ENV"];
  assert.equal((await handleIntake(s.request(), s.env, s.verify)).status, 503);
  assert.equal(s.queued.length, 0);
});
test("a queue outage retains an accepted submission and reconciliation re-enqueues it", async () => {
  const s = intakeSetup();
  s.env.LEADS.send = async () => { throw new Error("offline"); };
  assert.equal((await handleIntake(s.request(), s.env, s.verify)).status, 202);
  const stored = await s.env.LEAD_DB.prepare("SELECT status, payload FROM lead_submissions").first<{ status: string; payload: string }>();
  assert.equal(stored?.status, "pending");
  assert.equal(JSON.parse(stored!.payload).lead.workEmail, "test@example.com");
  s.env.LEADS.send = async lead => { s.queued.push(lead); return { metadata: { metrics: { backlogCount: 1, backlogBytes: 100 } } }; };
  await reconcileLeads(s.env, Date.now() + 301_000);
  assert.equal(s.queued.length, 1);
  assert.equal(s.queued[0].submissionId, submission.submissionId);
});

test("database failure never reports success; conflicting reuse of an ID cannot replace a saved lead", async () => {
  const s = intakeSetup();
  assert.equal((await handleIntake(s.request(), s.env, s.verify)).status, 202);
  assert.equal((await handleIntake(s.request({ ...submission, companyName: "Different answers" }), s.env, s.verify)).status, 409);
  s.env.LEAD_DB = { prepare() { throw new Error("database unavailable"); } } as unknown as IntakeEnv["LEAD_DB"];
  assert.equal((await handleIntake(s.request(), s.env, s.verify)).status, 503);
  assert.equal(s.queued.length, 1);
});

test("stalled and expired-queue submissions remain recoverable; delivered payloads expire after 30 days", async () => {
  const s = intakeSetup();
  const now = Date.now();
  const savedMessage = { ...message, submittedAt: new Date(now).toISOString() };
  await persistLead(s.env, savedMessage, now);
  await reconcileLeads(s.env, now + 2 * 86400_000);
  assert.equal(s.queued.length, 1);
  assert.equal((await leadHealth(s.env, now + 2 * 86400_000)).healthy, false);
  await recordDelivered(s.env, message.submissionId, "entry", now);
  await reconcileLeads(s.env, now + 31 * 86400_000);
  const row = await s.env.LEAD_DB.prepare("SELECT payload, attio_entry_id FROM lead_submissions").first<{ payload: string | null; attio_entry_id: string }>();
  assert.equal(row?.payload, null);
  assert.equal(row?.attio_entry_id, "entry");
  assert.equal((await persistLead(s.env, savedMessage, now + 32 * 86400_000)).delivered, true);
  assert.equal(s.queued.length, 1);
});

test("health fails for stale recovery, dependency outages, dead letters, and an old pending submission", async () => {
  const s = intakeSetup();
  const now = Date.now();
  await reconcileLeads(s.env, now);
  assert.equal((await leadHealth(s.env, now)).healthy, false);
  await s.env.LEAD_DB.prepare("UPDATE lead_monitor SET dependency_ok = 1").run();
  assert.equal((await leadHealth(s.env, now)).healthy, true);
  assert.equal((await leadHealth(s.env, now + 180_000)).healthy, false);
  await s.env.LEAD_DB.prepare("UPDATE lead_monitor SET failed_queue_count = 1").run();
  assert.equal((await leadHealth(s.env, now)).healthy, false);
  await s.env.LEAD_DB.prepare("UPDATE lead_monitor SET failed_queue_count = 0").run();
  await persistLead(s.env, message, now - 300_000);
  assert.equal((await leadHealth(s.env, now)).healthy, false);
});

test("an uncertain ledger receipt retries safely and an acknowledged lead is never written again", async () => {
  const { db } = testDatabase();
  let acknowledgements = 0;
  let retries = 0;
  let calls = 0;
  const batch = { messages: [{ body: message, attempts: 1, ack: () => acknowledgements++, retry: () => retries++ }] } as unknown as MessageBatch<LeadMessage>;
  const env = { ...config, APP_ENV: "production", LEAD_DB: {
    prepare(sql: string) {
      if (sql.startsWith("UPDATE lead_submissions SET status")) throw new Error("ledger unavailable after Attio commit");
      return db.prepare(sql);
    },
  } } as DeliveryEnv;
  const deliver = async () => { calls++; return { entryId: "same-idempotent-entry", duplicate: calls > 1 }; };
  await handleDelivery(batch, env, deliver);
  assert.equal(acknowledgements, 0);
  assert.equal(retries, 1);
  env.LEAD_DB = db;
  await handleDelivery(batch, env, deliver);
  await handleDelivery(batch, env, deliver);
  assert.equal(acknowledgements, 2);
  assert.equal(calls, 2);
});

const config = { ATTIO_API_KEY: "private-token", ATTIO_WORKSPACE_ID: "sandbox", ATTIO_LIST_ID: "leads" };
test("CRM integration creates a person and preserves the entire inquiry in a unique list entry", async () => {
  const calls: { url: string; body: unknown }[] = [];
  const fetcher = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), body: init?.body ? JSON.parse(String(init.body)) : null });
    if (String(url).endsWith("/self")) return Response.json({ workspace_id: "sandbox" });
    if (String(url).endsWith("/query")) return Response.json({ data: [] });
    if (String(url).includes("/people/")) return Response.json({ data: { id: { record_id: "person" } } });
    return Response.json({ data: { id: { entry_id: "entry" } } });
  }) as typeof fetch;
  const attributedMessage: LeadMessage = { ...message, campaign: { utm_source: "newsletter", landing_page: "https://example.com/data-and-trust" }, verification: { status: "unverified", reason: "script_unavailable" } };
  assert.deepEqual(await deliverToAttio(attributedMessage, config, fetcher), { entryId: "entry", duplicate: false });
  assert.deepEqual(calls[2].body, { data: { values: { email_addresses: ["test@example.com"] } } });
  const entry = calls[3].body as { data: { entry_values: Record<string, string> } };
  assert.equal(entry.data.entry_values.replay_company_name, "Replay Test");
  assert.equal(entry.data.entry_values.replay_submission_id, submission.submissionId);
  assert.deepEqual(JSON.parse(entry.data.entry_values.replay_campaign), attributedMessage.campaign);
  assert.equal(entry.data.entry_values.replay_verification_status, "Unverified");
  assert.equal(entry.data.entry_values.replay_verification_reason, "script_unavailable");
});
test("duplicate deliveries do not create more people or entries", async () => {
  const calls: string[] = [];
  const fetcher = (async (url: string | URL | Request) => {
    calls.push(String(url));
    return Response.json(String(url).endsWith("/self") ? { workspace_id: "sandbox" } : { data: [{ id: { entry_id: "existing" } }] });
  }) as typeof fetch;
  assert.deepEqual(await deliverToAttio(message, config, fetcher), { entryId: "existing", duplicate: true });
  assert.equal(calls.length, 2);
});
test("an uncertain committed Attio response is reconciled using submission ID", async () => {
  let queries = 0;
  const fetcher = (async (url: string | URL | Request) => {
    if (String(url).endsWith("/self")) return Response.json({ workspace_id: "sandbox" });
    if (String(url).endsWith("/query")) return Response.json({ data: ++queries === 1 ? [] : [{ id: { entry_id: "committed" } }] });
    if (String(url).includes("/people/")) return Response.json({ data: { id: { record_id: "person" } } });
    throw new Error("connection lost after commit");
  }) as typeof fetch;
  assert.deepEqual(await deliverToAttio(message, config, fetcher), { entryId: "committed", duplicate: true });
});
test("wrong-workspace tokens cannot write records", async () => {
  let calls = 0;
  await assert.rejects(deliverToAttio(message, config, async () => { calls++; return Response.json({ workspace_id: "production" }); }), /workspace mismatch/);
  assert.equal(calls, 1);
});
test("failed deliveries retry with backoff, successes ack, and environment mismatches never write", async () => {
  let acked = false;
  let delay = 0;
  let writes = 0;
  const batch = { messages: [{ body: message, attempts: 2, ack: () => { acked = true; }, retry: (options: { delaySeconds: number }) => { delay = options.delaySeconds; } }] } as unknown as MessageBatch<LeadMessage>;
  const env = { ...config, APP_ENV: "production", LEAD_DB: testDatabase().db } as DeliveryEnv;
  await handleDelivery(batch, env, async () => { throw new AttioError(429, "rate_limit", 120); });
  assert.equal(delay, 120);
  assert.equal(acked, false);
  await handleDelivery(batch, { ...env, APP_ENV: "development" }, async () => { writes++; return { entryId: "bad", duplicate: false }; });
  assert.equal(writes, 0);
  await handleDelivery(batch, env, async () => ({ entryId: "entry", duplicate: false }));
  assert.equal(acked, true);
});

test("recovery respects queue backoff and can recover a retry that never runs", async () => {
  const s = intakeSetup();
  const env = { ...s.env, ...config } as unknown as DeliveryEnv;
  let delay = 0;
  const batch = { messages: [{ body: message, attempts: 8, ack: () => assert.fail("failed delivery must not ack"), retry: (options: { delaySeconds: number }) => { delay = options.delaySeconds; } }] } as unknown as MessageBatch<LeadMessage>;
  await handleDelivery(batch, env, async () => { throw new AttioError(503, "unavailable", 0); });
  assert.equal(delay, 3600);
  await reconcileLeads(env, Date.now() + 301_000);
  assert.equal(s.queued.length, 0, "a pending queue retry must not cause extra dispatches every five minutes");
  await reconcileLeads(env, Date.now() + 3661_000);
  assert.equal(s.queued.length, 1, "a missing retry remains recoverable after its lease");
  assert.equal(s.queued[0].submissionId, message.submissionId);
});
