import type { Queue } from "@cloudflare/workers-types";
import type { LeadMessage } from "./lead-schema";
import type { LedgerEnv } from "./lead-ledger";

type FailedLeadEnv = LedgerEnv & { FAILED_LEADS: Queue<LeadMessage> };

/** Stop automatic CRM retries while retaining the original inquiry for operator recovery. */
export async function recordTerminalFailure(env: LedgerEnv, id: string, code: string, now = Date.now()) {
  await env.LEAD_DB.prepare(`UPDATE lead_submissions SET status = 'failed', failed_at = ?, last_failure_code = ?
    WHERE submission_id = ? AND environment = ? AND status = 'pending'`)
    .bind(now, code, id, env.APP_ENV).run();
}

/** Queue terminal failures at least once; do not acknowledge the source until this succeeds. */
export async function enqueueFailedLead(env: FailedLeadEnv, id: string, now = Date.now()) {
  const leaseUntil = now + 300_000;
  const claimed = await env.LEAD_DB.prepare(`UPDATE lead_submissions SET failed_queue_lease_until = ?
    WHERE submission_id = ? AND environment = ? AND status = 'failed'
    AND failed_queue_sent_at IS NULL AND failed_queue_lease_until <= ? RETURNING payload`)
    .bind(leaseUntil, id, env.APP_ENV, now).first<{ payload: string }>();
  if (!claimed) {
    const row = await env.LEAD_DB.prepare("SELECT status, failed_queue_sent_at FROM lead_submissions WHERE submission_id = ? AND environment = ?")
      .bind(id, env.APP_ENV).first<{ status: string; failed_queue_sent_at: number | null }>();
    if (row?.status === "delivered" || row?.failed_queue_sent_at != null) return;
    throw new Error("Failed lead dispatch is unavailable or already in progress");
  }
  try {
    await env.FAILED_LEADS.send(JSON.parse(claimed.payload) as LeadMessage);
    await env.LEAD_DB.prepare(`UPDATE lead_submissions SET failed_queue_sent_at = ?, failed_queue_lease_until = 0
      WHERE submission_id = ? AND environment = ? AND status = 'failed' AND failed_queue_lease_until = ?`)
      .bind(now, id, env.APP_ENV, leaseUntil).run();
  } catch {
    await env.LEAD_DB.prepare(`UPDATE lead_submissions SET failed_queue_lease_until = 0
      WHERE submission_id = ? AND environment = ? AND failed_queue_lease_until = ?`)
      .bind(id, env.APP_ENV, leaseUntil).run();
    throw new Error("Failed lead queue dispatch failed");
  }
}

/** Recover interrupted failed-queue sends without retrying terminal inquiries in Attio. */
export async function reconcileFailedLeads(env: FailedLeadEnv, now = Date.now()) {
  const failed = await env.LEAD_DB.prepare(`SELECT submission_id FROM lead_submissions
    WHERE environment = ? AND status = 'failed' AND failed_queue_sent_at IS NULL
    AND failed_queue_lease_until <= ? ORDER BY failed_at LIMIT 25`)
    .bind(env.APP_ENV, now).all<{ submission_id: string }>();
  for (const row of failed.results) await enqueueFailedLead(env, row.submission_id, now);
}
