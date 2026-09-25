import { AttioError } from "./attio-client";
import { qualifiesForBooking } from "./booking-qualification";
import { DataDealConfigError, deliverDataDeal, type DataDealConfig } from "./data-deal-client";
import type { LedgerEnv } from "./lead-ledger";
import type { LeadMessage } from "./lead-schema";

import { dataDealKey, type DataDealJob } from "./data-deal-job";
export type { DataDealJob } from "./data-deal-job";

export async function saveDataDealJob(env: LedgerEnv, job: DataDealJob, now = Date.now()) {
  if (job.kind === "booking" && !job.lead) {
    // Prefer the hidden submission reference, cross-checked with booker email.
    // Legacy/direct bookings may use the most recent preceding form instead.
    // Snapshot now so lead-payload retention cannot erase queued CRM context.
    const bookedAt = Date.parse(job.booking.createdAt);
    const saved = await env.LEAD_DB.prepare(`SELECT payload FROM lead_submissions WHERE environment = ? AND payload IS NOT NULL
      AND lower(json_extract(payload, '$.lead.workEmail')) = ?
      AND created_at <= ? AND created_at >= ? AND (? IS NULL OR submission_id = ?)
      ORDER BY created_at DESC, submission_id DESC LIMIT 1`)
      .bind(env.APP_ENV, job.booking.email, bookedAt, bookedAt - 30 * 86400_000, job.booking.submissionId ?? null, job.booking.submissionId ?? null).first<{ payload: string }>();
    job = { kind: "booking", booking: job.booking, ...(saved ? { lead: JSON.parse(saved.payload) as LeadMessage } : {}) };
  }
  await env.LEAD_DB.prepare(`INSERT INTO data_deal_jobs (job_id, environment, payload, created_at, next_attempt_at)
    VALUES (?, ?, ?, ?, ?) ON CONFLICT(job_id) DO NOTHING`)
    .bind(dataDealKey(job, env.APP_ENV), env.APP_ENV, JSON.stringify(job), now, now).run();
}

export async function saveIneligibleDeal(env: LedgerEnv & { ATTIO_DATA_DEALS_ENABLED?: string }, lead: LeadMessage) {
  if (env.ATTIO_DATA_DEALS_ENABLED === "true" && lead.verification?.status === "verified" && !qualifiesForBooking(lead.lead)) {
    await saveDataDealJob(env, { kind: "ineligible", lead });
  }
}

export async function reconcileDataDeals(env: LedgerEnv & DataDealConfig, fetcher: typeof fetch = fetch, now = Date.now(), deliver = deliverDataDeal) {
  if (env.ATTIO_DATA_DEALS_ENABLED !== "true") return;
  const pending = await env.LEAD_DB.prepare(`SELECT job_id FROM data_deal_jobs
    WHERE environment = ? AND status = 'pending' AND next_attempt_at <= ? ORDER BY next_attempt_at LIMIT 10`)
    .bind(env.APP_ENV, now).all<{ job_id: string }>();
  for (const { job_id: id } of pending.results) {
    const lease = crypto.randomUUID();
    const row = await env.LEAD_DB.prepare(`UPDATE data_deal_jobs SET lease_token = ?, next_attempt_at = ?, attempts = attempts + 1
      WHERE job_id = ? AND environment = ? AND status = 'pending' AND next_attempt_at <= ? RETURNING payload, attempts`)
      .bind(lease, now + 300_000, id, env.APP_ENV, now).first<{ payload: string; attempts: number }>();
    if (!row) continue;
    try {
      const result = await deliver(JSON.parse(row.payload) as DataDealJob, env, env.APP_ENV, fetcher);
      await env.LEAD_DB.prepare(`UPDATE data_deal_jobs SET status = 'delivered', delivered_at = ?, attio_record_id = ?,
        last_failure_code = NULL, lease_token = NULL WHERE job_id = ? AND lease_token = ?`)
        .bind(now, result.recordId, id, lease).run();
      console.info(JSON.stringify({ event: "data_deal_delivered", jobId: id, recordId: result.recordId }));
    } catch (error) {
      const permanent = error instanceof DataDealConfigError || (error instanceof AttioError && error.status >= 400 && error.status < 500 && ![408, 429].includes(error.status));
      const code = error instanceof DataDealConfigError ? error.code : error instanceof AttioError ? `attio_${error.status}` : "delivery_error";
      const delay = Math.min(3600, Math.max(error instanceof AttioError ? error.retryAfter : 0, 30 * 2 ** Math.min(row.attempts, 7)));
      await env.LEAD_DB.prepare(`UPDATE data_deal_jobs SET status = ?, last_failure_code = ?, next_attempt_at = ?, lease_token = NULL
        WHERE job_id = ? AND lease_token = ?`).bind(permanent ? "failed" : "pending", code, now + delay * 1000, id, lease).run();
      console.error(JSON.stringify({ event: "data_deal_delivery_failed", jobId: id, code, permanent }));
    }
  }
  await env.LEAD_DB.prepare("UPDATE data_deal_jobs SET payload = NULL WHERE environment = ? AND status = 'delivered' AND delivered_at < ? AND payload IS NOT NULL")
    .bind(env.APP_ENV, now - 30 * 86400_000).run();
  const unhealthy = await env.LEAD_DB.prepare(`SELECT COUNT(*) AS count FROM data_deal_jobs
    WHERE environment = ? AND (status = 'failed' OR (status = 'pending' AND created_at < ?))`)
    .bind(env.APP_ENV, now - 300_000).first<{ count: number }>();
  if (unhealthy?.count) throw new Error("Data deal delivery needs attention");
}
