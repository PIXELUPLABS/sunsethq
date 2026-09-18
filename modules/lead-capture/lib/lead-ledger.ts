import type { D1Database, Queue } from "@cloudflare/workers-types";
import type { LeadMessage } from "./lead-schema";

export type LedgerEnv = { LEAD_DB: D1Database; APP_ENV: string };
export class SubmissionConflict extends Error {}
type StoredLead = { payload: string | null; payload_hash: string; status: string };

const answerIdentity = (message: LeadMessage) => JSON.stringify([message.environment, message.sourceUrl,
  message.lead.companyName, message.lead.workEmail, message.lead.yearsOfOperation, message.lead.businessSize, message.lead.englishShare]);
const hashIdentity = async (identity: string) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(identity))), byte => byte.toString(16).padStart(2, "0")).join("");

export async function persistLead(env: LedgerEnv, message: LeadMessage, now = Date.now()) {
  // Only different answers conflict. A retry may have a valid token or omit
  // attribution after consent withdrawal; preserve the original receipt.
  const identity = answerIdentity(message);
  const hash = await hashIdentity(identity);
  await env.LEAD_DB.prepare(`INSERT INTO lead_submissions
    (submission_id, environment, payload, payload_hash, created_at, next_dispatch_at)
    VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(submission_id) DO NOTHING`)
    .bind(message.submissionId, env.APP_ENV, JSON.stringify(message), hash, now, now).run();
  const row = await env.LEAD_DB.prepare("SELECT payload, payload_hash, status FROM lead_submissions WHERE submission_id = ? AND environment = ?")
    .bind(message.submissionId, env.APP_ENV).first<StoredLead>();
  if (!row) throw new SubmissionConflict("Submission ID is already in use for different answers.");
  if (row.payload_hash !== hash) {
    // Older releases hashed attribution too. Pending legacy payloads allow a
    // business-answer comparison; scrubbed legacy receipts still match their
    // original complete hash. Never rewrite the accepted payload on a retry.
    const legacyHash = await hashIdentity(JSON.stringify([message.environment, message.sourceUrl, message.lead,
      Object.entries(message.campaign).sort(([a], [b]) => a.localeCompare(b))]));
    if (row.payload_hash !== legacyHash && (!row.payload || answerIdentity(JSON.parse(row.payload) as LeadMessage) !== identity)) {
      throw new SubmissionConflict("Submission ID is already in use for different answers.");
    }
  }
  return { delivered: row.status === "delivered", failed: row.status === "failed", message: row.payload ? JSON.parse(row.payload) as LeadMessage : message };
}

export async function enqueueSavedLead(env: LedgerEnv & { LEADS: Queue<LeadMessage> }, message: LeadMessage, now = Date.now()) {
  // A lease bounds duplicate dispatches. A crash or queue failure leaves the
  // durable row available for the scheduled reconciler after five minutes.
  const claimed = await env.LEAD_DB.prepare(`UPDATE lead_submissions SET next_dispatch_at = ?
    WHERE submission_id = ? AND environment = ? AND status = 'pending' AND next_dispatch_at <= ? RETURNING submission_id`)
    .bind(now + 300_000, message.submissionId, env.APP_ENV, now).first();
  if (claimed) await env.LEADS.send(message);
}

export async function recordAttempt(env: LedgerEnv, id: string, now = Date.now()) {
  await env.LEAD_DB.prepare("UPDATE lead_submissions SET attempts = attempts + 1, last_attempt_at = ? WHERE submission_id = ? AND environment = ? AND status = 'pending'")
    .bind(now, id, env.APP_ENV).run();
}
export async function recordDelivered(env: LedgerEnv, id: string, entryId: string, now = Date.now()) {
  await env.LEAD_DB.prepare("UPDATE lead_submissions SET status = 'delivered', delivered_at = ?, attio_entry_id = ?, last_failure_code = NULL WHERE submission_id = ? AND environment = ?")
    .bind(now, entryId, id, env.APP_ENV).run();
}
export async function recordFailure(env: LedgerEnv, id: string, code: string, retryAt: number) {
  // Let the queued retry run before dispatching another copy. Recovery remains
  // possible if that retry disappears or exhausts the queue's retry limit.
  await env.LEAD_DB.prepare("UPDATE lead_submissions SET last_failure_code = ?, next_dispatch_at = MAX(next_dispatch_at, ?) WHERE submission_id = ? AND environment = ? AND status = 'pending'")
    .bind(code, retryAt + 60_000, id, env.APP_ENV).run();
}

export async function reconcileLeads(env: LedgerEnv & { LEADS: Queue<LeadMessage> }, now = Date.now()) {
  const pending = await env.LEAD_DB.prepare(`SELECT payload FROM lead_submissions
    WHERE environment = ? AND status = 'pending' AND next_dispatch_at <= ? ORDER BY next_dispatch_at LIMIT 25`)
    .bind(env.APP_ENV, now).all<{ payload: string }>();
  let failures = 0;
  for (const row of pending.results) {
    const message = JSON.parse(row.payload) as LeadMessage;
    try { await enqueueSavedLead(env, message, now); }
    catch { failures++; console.error(JSON.stringify({ event: "lead_redispatch_failed", submissionId: message.submissionId })); }
  }
  if (failures) throw new Error("Lead redispatch failed");
  // Accepted-but-undelivered payloads never expire. Delivered PII is cleared
  // after 30 days; the hash/receipt remains for deduplication and audit.
  await env.LEAD_DB.prepare("UPDATE lead_submissions SET payload = NULL WHERE status = 'delivered' AND delivered_at < ? AND payload IS NOT NULL")
    .bind(now - 30 * 86400_000).run();
  await env.LEAD_DB.prepare(`INSERT INTO lead_monitor(environment, last_reconciled_at) VALUES (?, ?)
    ON CONFLICT(environment) DO UPDATE SET last_reconciled_at = excluded.last_reconciled_at`).bind(env.APP_ENV, now).run();
}

export async function leadHealth(env: LedgerEnv, now = Date.now()) {
  const failed = await env.LEAD_DB.prepare("SELECT COUNT(*) AS count FROM lead_submissions WHERE environment = ? AND status = 'failed'")
    .bind(env.APP_ENV).first<{ count: number }>();
  const pending = await env.LEAD_DB.prepare("SELECT COUNT(*) AS count, MIN(created_at) AS oldest FROM lead_submissions WHERE environment = ? AND status = 'pending'")
    .bind(env.APP_ENV).first<{ count: number; oldest: number | null }>();
  const monitor = await env.LEAD_DB.prepare("SELECT last_reconciled_at, last_alert_at, incident_open, dependency_ok, failed_queue_count FROM lead_monitor WHERE environment = ?")
    .bind(env.APP_ENV).first<{ last_reconciled_at: number; last_alert_at: number; incident_open: number; dependency_ok: number; failed_queue_count: number }>();
  const oldestPendingSeconds = pending?.oldest == null ? 0 : Math.floor((now - pending.oldest) / 1000);
  const reconcilerAgeSeconds = monitor ? Math.floor((now - monitor.last_reconciled_at) / 1000) : null;
  return {
    healthy: failed?.count === 0 && oldestPendingSeconds < 300 && reconcilerAgeSeconds !== null && reconcilerAgeSeconds < 180 && monitor?.dependency_ok === 1 && monitor.failed_queue_count === 0,
    failed: failed?.count ?? 0,
    pending: pending?.count ?? 0, oldestPendingSeconds, reconcilerAgeSeconds,
    lastAlertAt: monitor?.last_alert_at ?? 0, incidentOpen: !!monitor?.incident_open,
    dependenciesHealthy: monitor?.dependency_ok === 1, failedQueueCount: monitor?.failed_queue_count ?? 0,
  };
}
