import assert from "node:assert/strict";
import { test } from "node:test";
import { createHmac } from "node:crypto";
import { handleCalWebhook, parseCalBooking } from "../modules/lead-capture/lib/cal-webhook";
import { deliverDataDeal, type DataDealConfig } from "../modules/lead-capture/lib/data-deal-client";
import { reconcileDataDeals, saveDataDealJob, saveIneligibleDeal, type DataDealJob } from "../modules/lead-capture/lib/data-deal-ledger";
import { AttioError } from "../modules/lead-capture/lib/attio-client";
import { persistLead } from "../modules/lead-capture/lib/lead-ledger";
import type { LeadMessage } from "../modules/lead-capture/lib/lead-schema";
import { testDatabase } from "./sqlite-d1";

const now = Date.parse("2026-09-23T23:20:25.000Z");
const lead: LeadMessage = { version: 1, environment: "production", submissionId: "8ad633d2-cf1e-4f14-b029-82e2b244f74f",
  submittedAt: new Date(now - 1000).toISOString(), sourceUrl: "https://www.replay.ai/value-my-data", verification: { status: "verified" },
  campaign: { utm_source: "test" }, lead: { companyName: "Example Inc", workEmail: "test@example.com", yearsOfOperation: "3 to 5 years", businessSize: "10 - 19", englishShare: "80% - 90%" } };
const payload = { triggerEvent: "BOOKING_CREATED", createdAt: new Date(now).toISOString(), payload: {
  uid: "cal-booking-uid", eventTypeId: 7202505, status: "ACCEPTED", eventTitle: "Data valuation call",
  startTime: "2026-09-24T16:00:00.000Z", endTime: "2026-09-24T16:30:00.000Z",
  attendees: [{ email: "Test@Example.com", name: "Example Founder", timeZone: "America/New_York" }],
  organizer: { email: "jackie@replay.ai", name: "Jackie" }, metadata: { videoCallUrl: "https://app.cal.com/video/cal-booking-uid" }, additionalNotes: "Discuss our data",
} };
const booking = parseCalBooking(payload, "7202505")!;
const config: DataDealConfig = { ATTIO_API_KEY: "test-key", ATTIO_WORKSPACE_ID: "workspace", ATTIO_LIST_ID: "list", ATTIO_DATA_DEALS_ENABLED: "true",
  ATTIO_DATA_DEAL_DEFAULT_OWNER: "brendan", ATTIO_CAL_HOST_OWNERS: JSON.stringify({ "jackie@replay.ai": "jackie" }) };
function setup() {
  const { db, sqlite } = testDatabase();
  const env = { ...config, LEAD_DB: db, APP_ENV: "production", CAL_WEBHOOK_SECRET: "test-signing-secret", CAL_EVENT_TYPE_ID: "7202505" };
  const request = (body: unknown = payload, secret = env.CAL_WEBHOOK_SECRET) => {
    const raw = typeof body === "string" ? body : JSON.stringify(body);
    return new Request("https://www.replay.ai/api/cal/bookings", { method: "POST", body: raw,
      headers: { "x-cal-signature-256": createHmac("sha256", secret).update(raw).digest("hex") } });
  };
  return { sqlite, env, request, jobs: () => sqlite.prepare("SELECT * FROM data_deal_jobs").all() };
}

test("only authentic confirmed event bookings are durably accepted, and retries deduplicate", async () => {
  const s = setup();
  await persistLead(s.env, lead, now - 1000);
  assert.equal((await handleCalWebhook(s.request(payload, "forged"), s.env)).status, 401);
  assert.equal((await handleCalWebhook(s.request("{"), s.env)).status, 400);
  assert.equal((await handleCalWebhook(s.request({ ...payload, payload: { ...payload.payload, uid: "" } }), s.env)).status, 400);
  assert.equal((await handleCalWebhook(s.request("x".repeat(128 * 1024 + 1)), s.env)).status, 413);
  assert.equal(s.jobs().length, 0);
  for (const ignored of [{ ...payload, triggerEvent: "BOOKING_REQUESTED" }, { ...payload, payload: { ...payload.payload, eventTypeId: 1 } }, { ...payload, payload: { ...payload.payload, status: "PENDING" } }]) {
    assert.equal((await handleCalWebhook(s.request(ignored), s.env)).status, 200);
  }
  assert.equal(s.jobs().length, 0);
  assert.equal((await handleCalWebhook(s.request(), s.env)).status, 202);
  assert.equal((await handleCalWebhook(s.request(), s.env)).status, 202);
  assert.equal(s.jobs().length, 1);
  const job = JSON.parse(s.jobs()[0].payload as string);
  assert.equal(job.lead.submissionId, lead.submissionId);
  assert.equal(job.booking.email, "test@example.com");
  s.sqlite.exec("DROP TABLE data_deal_jobs");
  assert.equal((await handleCalWebhook(s.request(), s.env)).status, 503);
});

test("matching uses latest preceding form, excludes other environments/future forms, and leaves direct bookings unassociated", async () => {
  const s = setup();
  await persistLead(s.env, lead, now - 1000);
  await persistLead(s.env, { ...lead, submissionId: "future", lead: { ...lead.lead, companyName: "Future" } }, now + 1000);
  await persistLead({ ...s.env, APP_ENV: "development" }, { ...lead, environment: "development", submissionId: "dev" }, now - 10);
  await saveDataDealJob(s.env, { kind: "booking", booking }, now);
  assert.equal(JSON.parse(s.jobs()[0].payload as string).lead.submissionId, lead.submissionId);
  await saveDataDealJob(s.env, { kind: "booking", booking: { ...booking, uid: "direct", email: "different@example.com" } }, now);
  assert.equal(JSON.parse(s.jobs()[1].payload as string).lead, undefined);
  await saveDataDealJob(s.env, { kind: "booking", booking: { ...booking, uid: "late", createdAt: new Date(now + 32 * 86400_000).toISOString() } }, now);
  assert.equal(JSON.parse(s.jobs()[2].payload as string).lead, undefined);
});

test("ineligible deals require verified form criteria failure, including the English threshold", async () => {
  const s = setup();
  await saveIneligibleDeal(s.env, lead);
  await saveIneligibleDeal(s.env, { ...lead, verification: { status: "unverified", reason: "script_unavailable" }, lead: { ...lead.lead, businessSize: "1 - 9" } });
  await saveIneligibleDeal({ ...s.env, ATTIO_DATA_DEALS_ENABLED: undefined }, { ...lead, lead: { ...lead.lead, businessSize: "1 - 9" } });
  assert.equal(s.jobs().length, 0);
  await saveIneligibleDeal(s.env, { ...lead, lead: { ...lead.lead, businessSize: "1 - 9" } });
  await saveIneligibleDeal(s.env, { ...lead, submissionId: "low-english", lead: { ...lead.lead, englishShare: "Less than 50%" } });
  assert.equal(s.jobs().length, 2);
});

function attioMock(lostResponse = false) {
  let record: { id: { record_id: string } } | undefined;
  const writes: Record<string, unknown>[] = [];
  const fetcher = (async (input: string | URL | Request, init?: RequestInit) => {
    const path = String(input).replace("https://api.attio.com/v2/", "");
    if (path === "self") return Response.json({ workspace_id: "workspace" });
    if (path.endsWith("/query")) return Response.json({ data: record ? [record] : [] });
    if (path.startsWith("objects/people/")) return Response.json({ data: { id: { record_id: "person-id" } } });
    assert.equal(path, "objects/data_deals/records");
    assert.equal(init?.method, "POST");
    writes.push(JSON.parse(init?.body as string).data.values);
    record = { id: { record_id: "deal-id" } };
    if (lostResponse) throw new Error("Response lost after commit");
    return Response.json({ data: record });
  }) as typeof fetch;
  return { fetcher, writes };
}

test("Booked maps actual host, person, booking details and every form answer; repeated/lost replies never reset sales changes", async () => {
  const mock = attioMock(true);
  const job: DataDealJob = { kind: "booking", booking, lead };
  assert.deepEqual(await deliverDataDeal(job, config, "production", mock.fetcher), { recordId: "deal-id" });
  await deliverDataDeal(job, config, "production", mock.fetcher);
  assert.equal(mock.writes.length, 1);
  const values = mock.writes[0];
  assert.equal(values.a_inventory, "Booked");
  assert.deepEqual(values.deal_owner, [{ referenced_actor_type: "workspace-member", referenced_actor_id: "jackie" }]);
  assert.deepEqual(values.associated_deal, [{ target_object: "people", target_record_id: "person-id" }]);
  assert.equal(values.replay_business_size, "10 - 19");
  assert.equal(values.replay_english_share, "80% - 90%");
  assert.equal(values.replay_booking_start, booking.startTime);
  assert.equal(values.replay_booking_notes, "Discuss our data");
  assert.equal(values.replay_campaign, '{"utm_source":"test"}');
});

test("nonqualifying form is placed in the requested stage and a wrong workspace refuses all writes", async () => {
  const mock = attioMock();
  const job: DataDealJob = { kind: "ineligible", lead: { ...lead, lead: { ...lead.lead, businessSize: "1 - 9" } } };
  await assert.rejects(deliverDataDeal(job, { ...config, ATTIO_WORKSPACE_ID: "wrong" }, "production", mock.fetcher), /workspace mismatch/);
  assert.equal(mock.writes.length, 0);
  await deliverDataDeal(job, config, "production", mock.fetcher);
  assert.equal(mock.writes[0].a_inventory, "Not eligible - Replay form");
  assert.equal(mock.writes[0].replay_ineligibility_reason, "Fewer than 10 employees");
});

test("outbox retries transient failure, recovers expired leases, and flags permanent failures without losing payload", async () => {
  const s = setup();
  await saveDataDealJob(s.env, { kind: "booking", booking }, now);
  let attempts = 0;
  const deliver = async () => { if (++attempts === 1) throw new AttioError(429, "rate_limited", 120); return { recordId: "deal-id" }; };
  await reconcileDataDeals(s.env, fetch, now, deliver);
  assert.equal(s.jobs()[0].status, "pending");
  assert.equal(s.jobs()[0].next_attempt_at, now + 120_000);
  await reconcileDataDeals(s.env, fetch, now + 1000, deliver);
  assert.equal(attempts, 1);
  // A process dies after claiming; another schedule recovers the expired lease.
  s.sqlite.prepare("UPDATE data_deal_jobs SET lease_token = 'dead-worker', next_attempt_at = ?").run(now + 300_000);
  await reconcileDataDeals(s.env, fetch, now + 300_000, deliver);
  assert.equal(s.jobs()[0].status, "delivered");
  assert.equal(s.jobs()[0].attio_record_id, "deal-id");
  await saveDataDealJob(s.env, { kind: "booking", booking: { ...booking, uid: "bad-schema" } }, now);
  await assert.rejects(reconcileDataDeals(s.env, fetch, now, async () => { throw new AttioError(400, "invalid_attribute"); }), /needs attention/);
  assert.equal(s.jobs()[1].status, "failed");
  assert.ok(s.jobs()[1].payload);
});

test("hidden reference selects the exact form and cannot associate another booker's form", async () => {
  const s = setup();
  await persistLead(s.env, lead, now - 1000);
  await persistLead(s.env, { ...lead, submissionId: "9ad633d2-cf1e-4f14-b029-82e2b244f74f" }, now - 500);
  const referenced = parseCalBooking({ ...payload, payload: { ...payload.payload, metadata: { replaySubmissionId: lead.submissionId } } }, "7202505")!;
  await saveDataDealJob(s.env, { kind: "booking", booking: referenced }, now);
  assert.equal(JSON.parse(s.jobs()[0].payload as string).lead.submissionId, lead.submissionId);
  await saveDataDealJob(s.env, { kind: "booking", booking: { ...referenced, uid: "wrong-email", email: "unrelated@example.com" } }, now);
  assert.equal(JSON.parse(s.jobs()[1].payload as string).lead, undefined);
});
