import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import type { MessageBatch } from "@cloudflare/workers-types";
import { AttioError } from "../modules/lead-capture/lib/attio-client";
import { enqueueFailedLead, reconcileFailedLeads, recordTerminalFailure } from "../modules/lead-capture/lib/failed-leads";
import { leadHealth, persistLead, reconcileLeads } from "../modules/lead-capture/lib/lead-ledger";
import type { LeadMessage } from "../modules/lead-capture/lib/lead-schema";
import { handleDelivery, handleScheduled, type DeliveryEnv } from "../workers/lead-delivery";
import { testDatabase } from "./sqlite-d1";

const message: LeadMessage = {
  version: 1, environment: "production", submissionId: "8ad633d2-cf1e-4f14-b029-82e2b244f74f",
  submittedAt: "2026-09-18T14:00:00.000Z", sourceUrl: "https://example.com/value-my-data",
  lead: { companyName: "Synthetic terminal delivery", workEmail: "test@example.com", yearsOfOperation: "3 to 5 years", businessSize: "20 - 49", englishShare: "100%" },
  verification: { status: "verified" }, campaign: { utm_source: "test" },
};
function setup() {
  const { db, sqlite } = testDatabase();
  const queued: LeadMessage[] = [];
  const failed: LeadMessage[] = [];
  const events: string[] = [];
  const env = { APP_ENV: "production", LEAD_DB: db,
    LEADS: { send: async (body: LeadMessage) => { queued.push(body); } },
    FAILED_LEADS: { send: async (body: LeadMessage) => { events.push("failed-queue"); failed.push(body); } },
  } as unknown as DeliveryEnv;
  const batch = { messages: [{ body: message, attempts: 2, ack: () => events.push("ack"), retry: () => events.push("retry") }] } as unknown as MessageBatch<LeadMessage>;
  return { db, sqlite, env, queued, failed, events, batch };
}

test("terminal migration preserves pending/delivered receipts, notifications, and lookup indexes", async t => {
  const { db, sqlite } = testDatabase("0003_unverified_notifications.sql");
  t.after(() => sqlite.close());
  const env = { LEAD_DB: db, APP_ENV: "production" };
  await persistLead(env, message);
  await persistLead(env, { ...message, submissionId: "delivered-id" });
  sqlite.exec("UPDATE lead_submissions SET status = 'delivered', delivered_at = 456, attio_entry_id = 'entry', unverified_notified_at = 123, unverified_notification_lease_until = 789, attempts = 3 WHERE submission_id = 'delivered-id'");
  const before = sqlite.prepare("SELECT * FROM lead_submissions ORDER BY submission_id").all();
  sqlite.exec(readFileSync("workers/migrations/0004_terminal_failures.sql", "utf8"));
  const after = sqlite.prepare("SELECT * FROM lead_submissions ORDER BY submission_id").all();
  for (let i = 0; i < before.length; i++) for (const key of Object.keys(before[i])) assert.equal(after[i][key], before[i][key], key);
  assert.equal(after[0].failed_at, null);
  assert.equal(after[0].failed_queue_lease_until, 0);
  assert.equal(sqlite.prepare("PRAGMA integrity_check").get()!.integrity_check, "ok");
  const indexes = sqlite.prepare("PRAGMA index_list(lead_submissions)").all().map(row => row.name);
  for (const name of ["leads_pending_dispatch", "leads_pending_age", "leads_delivered_retention", "leads_failed_dispatch"]) assert.ok(indexes.includes(name));
  await recordTerminalFailure(env, message.submissionId, "attio_422");
  assert.equal((await persistLead(env, message)).failed, true);
  assert.equal((await persistLead(env, { ...message, submissionId: "delivered-id" })).delivered, true);
});

test("permanent Attio 4xx failures stop CRM retries and acknowledge only after durable failed-queue routing", async t => {
  for (const status of [400, 401, 403, 404, 409, 422]) {
    const s = setup();
    t.after(() => s.sqlite.close());
    let calls = 0;
    const deliver = async () => { calls++; throw new AttioError(status, "permanent"); };
    await handleDelivery(s.batch, s.env, deliver);
    assert.deepEqual(s.events, ["failed-queue", "ack"]);
    await handleDelivery(s.batch, s.env, deliver);
    assert.equal(calls, 1);
    assert.deepEqual(s.failed, [message]);
    assert.deepEqual(s.events, ["failed-queue", "ack", "ack"]);
    assert.equal((await persistLead(s.env, message)).failed, true);
    await reconcileLeads(s.env, Date.now() + 31 * 86400_000);
    assert.equal(s.queued.length, 0, "failed receipts never reenter the CRM queue automatically");
    await s.db.prepare("UPDATE lead_monitor SET dependency_ok = 1, failed_queue_count = 0").run();
    const health = await leadHealth(s.env, Date.now() + 31 * 86400_000);
    assert.equal(health.failed, 1);
    assert.equal(health.healthy, false, "terminal receipts remain visible after failed-queue retention expires");
  }
});

test("failed-queue outages keep the source unacknowledged and scheduled recovery never calls Attio", async t => {
  const s = setup();
  t.after(() => s.sqlite.close());
  let calls = 0;
  const deliver = async () => { calls++; throw new AttioError(422, "invalid_data"); };
  const send = s.env.FAILED_LEADS.send;
  s.env.FAILED_LEADS.send = async () => { throw new Error("queue offline"); };
  await handleDelivery(s.batch, s.env, deliver);
  await handleDelivery(s.batch, s.env, deliver);
  assert.equal(calls, 1);
  assert.deepEqual(s.events, ["retry", "retry"]);
  assert.equal((await persistLead(s.env, message)).failed, true);
  await assert.rejects(reconcileFailedLeads(s.env));
  s.env.FAILED_LEADS.send = send;
  await reconcileFailedLeads(s.env);
  await handleDelivery(s.batch, s.env, deliver);
  assert.deepEqual(s.failed, [message]);
  assert.deepEqual(s.events, ["retry", "retry", "failed-queue", "ack"]);
  assert.equal(calls, 1);
});

test("failed-queue leases expire after interruption and concurrent sends share one receipt", async t => {
  const s = setup();
  t.after(() => s.sqlite.close());
  const now = Date.now();
  await persistLead(s.env, message);
  await recordTerminalFailure(s.env, message.submissionId, "attio_400");
  await s.db.prepare("UPDATE lead_submissions SET failed_queue_lease_until = ?").bind(now + 300_000).run();
  await reconcileFailedLeads(s.env, now);
  assert.equal(s.failed.length, 0);
  const attempts = await Promise.allSettled([enqueueFailedLead(s.env, message.submissionId, now + 300_001), enqueueFailedLead(s.env, message.submissionId, now + 300_001)]);
  assert.ok(attempts.some(result => result.status === "fulfilled"));
  assert.equal(s.failed.length, 1);
  await reconcileFailedLeads(s.env, now + 600_001);
  assert.equal(s.failed.length, 1);
});

test("a lost failed-queue send receipt retries routing without retrying the CRM or acknowledging early", async t => {
  const s = setup();
  t.after(() => s.sqlite.close());
  let writes = 0;
  let failReceipt = true;
  const prepare = s.db.prepare.bind(s.db);
  s.env.LEAD_DB = { prepare(sql: string) {
    if (failReceipt && sql.includes("SET failed_queue_sent_at = ?")) throw new Error("receipt write unavailable");
    return prepare(sql);
  } } as DeliveryEnv["LEAD_DB"];
  const deliver = async () => { writes++; throw new AttioError(422, "invalid_data"); };
  await handleDelivery(s.batch, s.env, deliver);
  assert.deepEqual(s.events, ["failed-queue", "retry"]);
  failReceipt = false;
  await handleDelivery(s.batch, s.env, deliver);
  await handleDelivery(s.batch, s.env, deliver);
  assert.equal(writes, 1);
  assert.equal(s.failed.length, 2, "an ambiguous queue send is at least once, using the original ID");
  assert.ok(s.failed.every(lead => lead.submissionId === message.submissionId));
  assert.deepEqual(s.events, ["failed-queue", "retry", "failed-queue", "ack", "ack"]);
});

test("transient Attio, timeout, and network failures remain pending and retry", async t => {
  for (const error of [new AttioError(408, "timeout"), new AttioError(429, "rate_limit"), new AttioError(529, "overloaded"), new AttioError(500, "unavailable"), new AttioError(503, "unavailable"), new DOMException("timed out", "TimeoutError"), new TypeError("network")]) {
    const s = setup();
    t.after(() => s.sqlite.close());
    await handleDelivery(s.batch, s.env, async () => { throw error; });
    assert.deepEqual(s.events, ["retry"]);
    assert.equal((await persistLead(s.env, message)).failed, false);
    assert.equal(s.failed.length, 0);
  }
});

test("operator recovery reopens the original failed receipt without changing its inquiry ID", async t => {
  const s = setup();
  t.after(() => s.sqlite.close());
  await handleDelivery(s.batch, s.env, async () => { throw new AttioError(401, "invalid_token"); });
  await s.db.prepare(`UPDATE lead_submissions SET status = 'pending', failed_at = NULL,
    failed_queue_sent_at = NULL, failed_queue_lease_until = 0, next_dispatch_at = 0,
    last_failure_code = NULL WHERE submission_id = ? AND environment = ? AND status = 'failed'`)
    .bind(message.submissionId, s.env.APP_ENV).run();
  await reconcileLeads(s.env);
  assert.deepEqual(s.queued, [message]);
  await handleDelivery(s.batch, s.env, async saved => {
    assert.equal(saved.submissionId, message.submissionId);
    return { entryId: "recovered-entry", duplicate: false };
  });
  assert.equal((await persistLead(s.env, message)).delivered, true);
});

test("scheduled reconciliation failures still refresh dependency checks and force unhealthy monitor state", async t => {
  for (const phase of ["pending", "failed"] as const) {
    const s = setup();
    t.after(() => s.sqlite.close());
    s.env.ATTIO_WORKSPACE_ID = "sandbox";
    s.env.ATTIO_LIST_ID = "leads";
    s.env.ATTIO_API_KEY = "test-token";
    const calls: string[] = [];
    const fetcher = (async (url: string | URL | Request) => {
      calls.push(String(url));
      return Response.json(String(url).endsWith("/self") ? { workspace_id: "sandbox" } : { data: {} });
    }) as typeof fetch;
    let metricReads = 0;
    s.env.FAILED_LEADS.metrics = async () => { metricReads++; return { backlogCount: 4, backlogBytes: 100 }; };
    await persistLead(s.env, message);
    if (phase === "failed") {
      await recordTerminalFailure(s.env, message.submissionId, "attio_422");
      await s.db.prepare("INSERT INTO lead_monitor (environment, dependency_ok) VALUES (?, 1)").bind(s.env.APP_ENV).run();
    }
    const queue = phase === "pending" ? s.env.LEADS : s.env.FAILED_LEADS;
    const send = queue.send;
    queue.send = async () => { throw new Error("queue unavailable"); };
    await handleScheduled(s.env, fetcher);
    assert.deepEqual(calls, ["https://api.attio.com/v2/self", "https://api.attio.com/v2/lists/leads"]);
    assert.equal(metricReads, 1);
    const row = await s.db.prepare("SELECT dependency_ok, failed_queue_count FROM lead_monitor WHERE environment = ?")
      .bind(s.env.APP_ENV).first<{ dependency_ok: number; failed_queue_count: number }>();
    assert.equal(row?.dependency_ok, 0);
    assert.equal(row?.failed_queue_count, 4);
    assert.equal((await leadHealth(s.env)).dependenciesHealthy, false);
    queue.send = send;
    await handleScheduled(s.env, fetcher);
    assert.equal((await leadHealth(s.env)).dependenciesHealthy, true);
  }
});
