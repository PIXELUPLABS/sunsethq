import { parseSubmission, type Lead } from "@/modules/lead-capture/lib/lead-schema";
import { hasMarketingConsent } from "@/modules/consent/lib/cookie-consent";

const KEY = "replay.pending-valuation.v1";
export type PendingSubmission = { answers: Lead; campaign: Record<string, string>; landingPath?: string; id: string; savedAt: number };

export function readPendingSubmission(): PendingSubmission | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
    if (!value || typeof value.savedAt !== "number" || !Number.isFinite(value.savedAt) || value.savedAt > Date.now() || Date.now() - value.savedAt > 86400_000) { clearPendingSubmission(); return null; }
    const parsed = parseSubmission({ ...value.answers, campaign: value.campaign, landingPath: value.landingPath, submissionId: value.id, turnstileToken: "restore" });
    if (!parsed) { clearPendingSubmission(); return null; }
    const { companyName, workEmail, yearsOfOperation, businessSize, englishShare } = parsed;
    const allowed = hasMarketingConsent();
    return { answers: { companyName, workEmail, yearsOfOperation, businessSize, englishShare }, campaign: allowed ? parsed.campaign : {},
      ...(allowed && parsed.landingPath ? { landingPath: parsed.landingPath } : {}), id: parsed.submissionId, savedAt: value.savedAt };
  } catch { clearPendingSubmission(); return null; }
}
export function savePendingSubmission(value: PendingSubmission) {
  const safe = hasMarketingConsent() ? value : { ...value, campaign: {}, landingPath: undefined };
  try { sessionStorage.setItem(KEY, JSON.stringify(safe)); } catch { /* Storage restrictions must not block submission. */ }
}
export function stripPendingAttribution() {
  const pending = readPendingSubmission();
  if (pending) savePendingSubmission({ ...pending, campaign: {}, landingPath: undefined });
}
export function clearPendingSubmission() {
  try { sessionStorage.removeItem(KEY); } catch { /* Private browsing may restrict storage. */ }
}
