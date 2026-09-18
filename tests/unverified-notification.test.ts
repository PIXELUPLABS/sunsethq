import assert from "node:assert/strict";
import { test } from "node:test";
import type { MessageBatch, SendEmail } from "@cloudflare/workers-types";
import { notifyUnverifiedLead, type NotificationEnv } from "../modules/lead-capture/lib/unverified-notification";
import type { LeadMessage } from "../modules/lead-capture/lib/lead-schema";
import { persistLead } from "../modules/lead-capture/lib/lead-ledger";
import { handleDelivery, type DeliveryEnv } from "../workers/lead-delivery";
import { testDatabase } from "./sqlite-d1";

const message: LeadMessage = {
  version: 1, environment: "development", submissionId: "8ad633d2-cf1e-4f14-b029-82e2b244f74f",
  submittedAt: "2026-09-18T16:00:00Z", sourceUrl: "https://stage.example/value-my-data",
  verification: { status: "unverified", reason: "challenge_unavailable" }, campaign: {},
  lead: { companyName: "Synthetic notification test", workEmail: "test@example.com", yearsOfOperation: "3 to 5 years", businessSize: "20 - 49", englishShare: "100%" },
};
function setup() {
  const sent: unknown[] = [];
  const env: NotificationEnv = { LEAD_DB: testDatabase().db, APP_ENV: "development",
    LEAD_ALERT_FROM: "leads@notifications.replay.ai", LEAD_ALERT_TO: "jono@sunsethq.com",
    LEAD_ALERT_EMAIL: { send: async (email: unknown) => { sent.push(email); return { messageId: "email-id" }; } } as SendEmail,
  };
  return { env, sent };
}

test("an unverified receipt sends one fixed-recipient email; successful sends survive retries", async () => {
  const { env, sent } = setup();
  await persistLead(env, message);
  await notifyUnverifiedLead(message, env);
  await notifyUnverifiedLead(message, env);
  assert.equal(sent.length, 1);
  const email = sent[0] as { to: string; subject: string; text: string; replyTo?: string };
  assert.equal(email.to, "jono@sunsethq.com");
  assert.match(email.subject, /\[TEST\].*unverified/);
  assert.match(email.text, /Verification: Unverified/);
  assert.ok(email.text.includes(message.submissionId));
  assert.equal(email.replyTo, undefined);
  const stored = await env.LEAD_DB.prepare("SELECT unverified_notified_at FROM lead_submissions").first<{ unverified_notified_at: number }>();
  assert.ok(stored?.unverified_notified_at);
});

test("verified and legacy receipts do not send alerts", async () => {
  const { env, sent } = setup();
  await notifyUnverifiedLead({ ...message, verification: { status: "verified" } }, env);
  await notifyUnverifiedLead({ ...message, verification: undefined }, env);
  assert.equal(sent.length, 0);
});

test("notification failures retry without acknowledging or losing the durable lead", async () => {
  const { env, sent } = setup();
  let fail = true;
  const sender = env.LEAD_ALERT_EMAIL!.send.bind(env.LEAD_ALERT_EMAIL);
  env.LEAD_ALERT_EMAIL = { send: async (email: unknown) => { if (fail) throw new Error("offline"); return sender(email as Parameters<SendEmail["send"]>[0]); } } as SendEmail;
  let ack = 0;
  let retries = 0;
  let crm = 0;
  const batch = { messages: [{ body: message, attempts: 1, ack: () => ack++, retry: () => retries++ }] } as unknown as MessageBatch<LeadMessage>;
  const deliver = async () => { crm++; return { entryId: "entry", duplicate: false }; };
  await handleDelivery(batch, env as DeliveryEnv, deliver);
  assert.equal(retries, 1);
  assert.equal(ack, 0);
  assert.equal(crm, 0);
  fail = false;
  await handleDelivery(batch, env as DeliveryEnv, deliver);
  await handleDelivery(batch, env as DeliveryEnv, deliver);
  assert.equal(ack, 2);
  assert.equal(crm, 1);
  assert.equal(sent.length, 1);
});

test("concurrent queue deliveries cannot both send the notification", async () => {
  const { env, sent } = setup();
  await persistLead(env, message);
  const results = await Promise.allSettled([notifyUnverifiedLead(message, env), notifyUnverifiedLead(message, env)]);
  assert.ok(results.some(result => result.status === "fulfilled"));
  assert.equal(sent.length, 1);
});

test("an interrupted notification lease expires and a missing sender cannot drop an alert", async () => {
  const { env, sent } = setup();
  const now = Date.now();
  await persistLead(env, message);
  await env.LEAD_DB.prepare("UPDATE lead_submissions SET unverified_notification_lease_until = ?").bind(now + 300_000).run();
  await assert.rejects(notifyUnverifiedLead(message, env, now), /already being sent/);
  await notifyUnverifiedLead(message, env, now + 300_001);
  assert.equal(sent.length, 1);
  await assert.rejects(notifyUnverifiedLead(message, { ...env, LEAD_ALERT_EMAIL: undefined }), /not configured/);
});
