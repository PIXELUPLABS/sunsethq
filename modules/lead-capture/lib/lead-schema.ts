import { parseCampaign, parseLandingPath } from "./campaign-attribution";
import { parseVerificationFallback, type LeadVerification, type VerificationFallbackReason } from "./verification";

export { CAMPAIGN_KEYS } from "./campaign-attribution";

export const YEARS_OF_OPERATION_OPTIONS = [
  "Under 2 Years", "2-3 years", "3 to 5 years", "5 to 10 years", "10+",
] as const;
export const BUSINESS_SIZE_OPTIONS = [
  "1 to 9 people", "10 - 19", "20 - 49", "50 - 199", "200 or more",
] as const;
export const ENGLISH_SHARE_OPTIONS = ["100%", "80% - 90%", "Less than 80%"] as const;

export type Lead = {
  companyName: string;
  workEmail: string;
  yearsOfOperation: string;
  businessSize: string;
  englishShare: string;
};
export type LeadSubmission = Lead & {
  submissionId: string;
  turnstileToken: string;
  campaign: Record<string, string>;
  landingPath?: string;
  verificationFallback?: VerificationFallbackReason;
};
export type LeadMessage = {
  version: 1;
  environment: string;
  submissionId: string;
  submittedAt: string;
  sourceUrl: string;
  verification?: LeadVerification;
  lead: Lead;
  campaign: Record<string, string>;
};

export function parseSubmission(value: unknown): LeadSubmission | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const text = (key: string, max: number) => {
    const raw = input[key];
    return typeof raw === "string" && raw.length <= max && !/[\u0000-\u001f\u007f]/.test(raw)
      ? raw.trim() : "";
  };
  const companyName = text("companyName", 200);
  const workEmail = text("workEmail", 254).toLowerCase();
  const submissionId = text("submissionId", 36);
  const turnstileToken = text("turnstileToken", 2048);
  const verificationFallback = parseVerificationFallback(input.verificationFallback);
  const yearsOfOperation = text("yearsOfOperation", 40);
  const businessSize = text("businessSize", 40);
  const englishShare = text("englishShare", 40);
  if (!companyName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail) ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId) ||
      (!turnstileToken && !verificationFallback) || !(YEARS_OF_OPERATION_OPTIONS as readonly string[]).includes(yearsOfOperation) ||
      !(BUSINESS_SIZE_OPTIONS as readonly string[]).includes(businessSize) ||
      !(ENGLISH_SHARE_OPTIONS as readonly string[]).includes(englishShare)) return null;
  const campaign = parseCampaign(input.campaign);
  const landingPath = parseLandingPath(input.landingPath);
  return { companyName, workEmail, submissionId, turnstileToken, yearsOfOperation, businessSize, englishShare, campaign,
    ...(landingPath ? { landingPath } : {}),
    ...(verificationFallback ? { verificationFallback } : {}),
  };
}
