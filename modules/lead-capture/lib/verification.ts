export const VERIFICATION_FALLBACK_REASONS = ["script_unavailable", "challenge_unavailable", "verification_timeout"] as const;
export type VerificationFallbackReason = typeof VERIFICATION_FALLBACK_REASONS[number];
export type LeadVerification = { status: "verified" } | {
  status: "unverified";
  reason: VerificationFallbackReason | "service_unavailable";
};

export function parseVerificationFallback(value: unknown): VerificationFallbackReason | undefined {
  return typeof value === "string" && (VERIFICATION_FALLBACK_REASONS as readonly string[]).includes(value)
    ? value as VerificationFallbackReason : undefined;
}
