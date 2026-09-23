import type { MessageBatch } from "@cloudflare/workers-types";
import { AttioError, attioClient, deliverToAttio, type AttioConfig } from "../../modules/lead-capture/lib/attio-client";
import type { LeadMessage } from "../../modules/lead-capture/lib/lead-schema";
import { persistLead, recordAttempt, recordDelivered, recordFailure, reconcileLeads, type LedgerEnv } from "../../modules/lead-capture/lib/lead-ledger";
import type { Queue } from "@cloudflare/workers-types";
import { notifyUnverifiedLead, type NotificationEnv } from "../../modules/lead-capture/lib/unverified-notification";
import { enqueueFailedLead, reconcileFailedLeads, recordTerminalFailure } from "../../modules/lead-capture/lib/failed-leads";

export type DeliveryEnv = AttioConfig & LedgerEnv & NotificationEnv & { APP_ENV: "local" | "development" | "production"; LEADS: Queue<LeadMessage>; FAILED_LEADS: Queue<LeadMessage> };

export async function handleDelivery(batch: MessageBatch<LeadMessage>, env: DeliveryEnv, deliver = deliverToAttio) {
  for (const message of batch.messages) {
    try {
      if (message.body.version !== 1 || message.body.environment !== env.APP_ENV) throw new Error("Queue environment mismatch");
      const saved = await persistLead(env, message.body);
      if (saved.delivered) { message.ack(); continue; }
      if (saved.failed) {
        await enqueueFailedLead(env, message.body.submissionId);
        message.ack();
        continue;
      }
      await recordAttempt(env, message.body.submissionId);
      await notifyUnverifiedLead(saved.message, env);
      const result = await deliver(saved.message, env);
      await recordDelivered(env, message.body.submissionId, result.entryId);
      console.info(JSON.stringify({ event: "lead_delivered", submissionId: message.body.submissionId, ...result }));
      message.ack();
    } catch (error) {
      const permanent = error instanceof AttioError && error.status >= 400 && error.status < 500 && ![408, 429].includes(error.status);
      if (permanent && message.body.environment === env.APP_ENV) {
        try {
          await recordTerminalFailure(env, message.body.submissionId, `attio_${error.status}`);
          await enqueueFailedLead(env, message.body.submissionId);
          console.error(JSON.stringify({ event: "lead_delivery_terminal", submissionId: message.body.submissionId, status: error.status }));
          message.ack();
          continue;
        } catch {
          console.error(JSON.stringify({ event: "lead_terminal_recovery_pending", submissionId: message.body.submissionId }));
        }
      }
      const delaySeconds = Math.min(3600, Math.max(error instanceof AttioError ? error.retryAfter : 0, 30 * 2 ** Math.min(message.attempts - 1, 7)));
      if (message.body.environment === env.APP_ENV) {
        try { await recordFailure(env, message.body.submissionId, error instanceof AttioError ? `attio_${error.status}` : "delivery_error", Date.now() + delaySeconds * 1000); }
        catch { console.error(JSON.stringify({ event: "lead_ledger_update_failed", submissionId: message.body.submissionId })); }
      }
      console.error(JSON.stringify({ event: "lead_delivery_failed", submissionId: message.body.submissionId, attempt: message.attempts, status: error instanceof AttioError ? error.status : undefined }));
      message.retry({ delaySeconds });
    }
  }
}

export async function handleScheduled(env: DeliveryEnv, fetcher: typeof fetch = fetch) {
  // Operational signals contain no form data and need only short retention.
  try {
    await env.LEAD_DB.prepare("DELETE FROM signup_signals WHERE environment = ? AND created_at < ?")
      .bind(env.APP_ENV, Date.now() - 86400_000).run();
  } catch { console.error(JSON.stringify({ event: "signup_signal_cleanup_failed" })); }
  let reconciliationOk = true;
  for (const [phase, reconcile] of [["pending", reconcileLeads], ["failed", reconcileFailedLeads]] as const) {
    try { await reconcile(env); }
    catch {
      reconciliationOk = false;
      console.error(JSON.stringify({ event: "lead_reconciliation_failed", phase }));
    }
  }
  let dependencyOk = false;
  let failedCount = 0;
  try {
    const attio = attioClient(env.ATTIO_API_KEY, fetcher);
    const identity = await attio<{ workspace_id: string }>("self");
    if (identity.workspace_id !== env.ATTIO_WORKSPACE_ID) throw new Error("Workspace mismatch");
    await attio(`lists/${env.ATTIO_LIST_ID}`);
    const metrics = await env.FAILED_LEADS.metrics();
    failedCount = metrics.backlogCount;
    dependencyOk = reconciliationOk;
  } catch { console.error(JSON.stringify({ event: "lead_dependency_check_failed" })); }
  await env.LEAD_DB.prepare(`INSERT INTO lead_monitor (environment, dependency_ok, failed_queue_count) VALUES (?, ?, ?)
    ON CONFLICT(environment) DO UPDATE SET dependency_ok = excluded.dependency_ok, failed_queue_count = excluded.failed_queue_count`)
    .bind(env.APP_ENV, dependencyOk ? 1 : 0, failedCount).run();
  console.info(JSON.stringify({ event: "lead_reconciled", dependencyOk, failedQueueCount: failedCount }));
}

// No public fetch handler. The schedule recovers even after queue retention expires.
const worker = {
  queue: (batch: MessageBatch<LeadMessage>, env: DeliveryEnv) => handleDelivery(batch, env),
  scheduled: (_event: unknown, env: DeliveryEnv) => handleScheduled(env),
};
export default worker;
