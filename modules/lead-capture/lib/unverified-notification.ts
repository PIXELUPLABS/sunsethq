import type { SendEmail } from "@cloudflare/workers-types";
import type { LeadMessage } from "./lead-schema";
import type { LedgerEnv } from "./lead-ledger";

export type NotificationEnv = LedgerEnv & { LEAD_ALERT_EMAIL?: SendEmail; LEAD_ALERT_FROM?: string; LEAD_ALERT_TO?: string };

export async function notifyUnverifiedLead(message: LeadMessage, env: NotificationEnv, now = Date.now()) {
  if (message.verification?.status !== "unverified") return;
  if (!env.LEAD_ALERT_EMAIL || !env.LEAD_ALERT_FROM || !env.LEAD_ALERT_TO) throw new Error("Unverified lead notifications are not configured");
  const lease = await env.LEAD_DB.prepare(`UPDATE lead_submissions SET unverified_notification_lease_until = ?
    WHERE submission_id = ? AND environment = ? AND unverified_notified_at IS NULL
    AND unverified_notification_lease_until <= ? RETURNING submission_id`)
    .bind(now + 300_000, message.submissionId, env.APP_ENV, now).first();
  if (!lease) {
    const row = await env.LEAD_DB.prepare("SELECT unverified_notified_at FROM lead_submissions WHERE submission_id = ? AND environment = ?")
      .bind(message.submissionId, env.APP_ENV).first<{ unverified_notified_at: number | null }>();
    if (row?.unverified_notified_at != null) return;
    throw new Error("Unverified notification is already being sent");
  }
  try {
    await env.LEAD_ALERT_EMAIL.send({
      from: env.LEAD_ALERT_FROM, to: env.LEAD_ALERT_TO,
      subject: `${env.APP_ENV === "production" ? "" : "[TEST] "}Replay: unverified website inquiry`,
      text: [
        "A website inquiry was saved without successful bot verification. Review it before treating it as a qualified lead.",
        "", `Company (submitted): ${message.lead.companyName}`, `Work email (submitted): ${message.lead.workEmail}`,
        `Years of operation: ${message.lead.yearsOfOperation}`, `Business size: ${message.lead.businessSize}`,
        `English communications: ${message.lead.englishShare}`, "",
        `Verification: Unverified (${message.verification.reason})`, `Environment: ${message.environment}`,
        `Received: ${message.submittedAt}`, `Receipt: ${message.submissionId}`, `Form: ${message.sourceUrl}`,
        "", "The inquiry is saved in the delivery ledger and queued for Attio. Retrying the form retains this receipt.",
      ].join("\n"),
    });
    await env.LEAD_DB.prepare("UPDATE lead_submissions SET unverified_notified_at = ?, unverified_notification_lease_until = 0 WHERE submission_id = ? AND environment = ?")
      .bind(now, message.submissionId, env.APP_ENV).run();
    console.info(JSON.stringify({ event: "unverified_lead_notified", submissionId: message.submissionId }));
  } catch {
    // The queue retries; provider errors may contain recipient details, so do
    // not log their bodies. An ambiguous send can produce a duplicate email.
    await env.LEAD_DB.prepare("UPDATE lead_submissions SET unverified_notification_lease_until = 0 WHERE submission_id = ? AND environment = ?")
      .bind(message.submissionId, env.APP_ENV).run();
    throw new Error("Unverified lead notification failed");
  }
}
