export const CAMPAIGN_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function parseCampaign(value: unknown): Record<string, string> {
  const campaign: Record<string, string> = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return campaign;
  for (const key of CAMPAIGN_KEYS) {
    const entry = (value as Record<string, unknown>)[key];
    if (typeof entry === "string") campaign[key] = entry.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 160);
  }
  return campaign;
}

// Accept pathnames only. The server supplies the origin; queries, fragments,
// encoded identifiers, and arbitrary external URLs never become landing pages.
export function parseLandingPath(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length > 512 || !value.startsWith("/")) return undefined;
  if (value === "/") return value;
  const path = value.endsWith("/") ? value.slice(0, -1) : value;
  if (path.slice(1).split("/").some(segment => !segment || /[^a-zA-Z0-9_-]/.test(segment))) return undefined;
  return path;
}
