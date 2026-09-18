import { CAMPAIGN_KEYS, parseCampaign, parseLandingPath } from "@/modules/lead-capture/lib/campaign-attribution";
import { hasMarketingConsent } from "@/modules/consent/lib/cookie-consent";

const STORAGE_KEY = "replay.visit-attribution.v1";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
type Storage = Pick<globalThis.Storage, "getItem" | "setItem">;
export type VisitAttribution = { campaign: Record<string, string>; landingPath?: string };
type StoredVisit = VisitAttribution & { capturedAt: number; origin: string };

function parseVisit(value: unknown, origin: string, now: number): StoredVisit | null {
  if (!value || typeof value !== "object") return null;
  const visit = value as Partial<StoredVisit>;
  if (visit.origin !== origin || typeof visit.capturedAt !== "number" || !Number.isFinite(visit.capturedAt) ||
      visit.capturedAt > now || now - visit.capturedAt >= MAX_AGE_MS) return null;
  return { origin, capturedAt: visit.capturedAt, campaign: parseCampaign(visit.campaign), landingPath: parseLandingPath(visit.landingPath) };
}

export function createAttributionSession() {
  // Keep the first touch during client navigation even when storage is blocked.
  let memory: StoredVisit | null = null;
  return (href: string, storage?: Storage, now = Date.now()): VisitAttribution => {
    const url = new URL(href);
    let visit = parseVisit(memory, url.origin, now);
    if (!visit) {
      try { visit = parseVisit(JSON.parse(storage?.getItem(STORAGE_KEY) ?? "null"), url.origin, now); }
      catch { /* Malformed or unavailable storage must not block the form. */ }
    }
    if (!visit) {
      visit = {
        capturedAt: now, origin: url.origin,
        campaign: parseCampaign(Object.fromEntries(CAMPAIGN_KEYS.map(key => [key, url.searchParams.get(key)]))),
        landingPath: parseLandingPath(url.pathname),
      };
    }
    memory = visit;
    try { storage?.setItem(STORAGE_KEY, JSON.stringify(visit)); }
    catch { /* The in-memory copy still survives client navigation. */ }
    return { campaign: { ...visit.campaign }, ...(visit.landingPath ? { landingPath: visit.landingPath } : {}) };
  };
}

let capture = createAttributionSession();

export function clearVisitAttribution() {
  capture = createAttributionSession();
  try { window.sessionStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be unavailable. */ }
}

export function captureVisitAttribution(): VisitAttribution {
  if (!hasMarketingConsent()) {
    clearVisitAttribution();
    return { campaign: {} };
  }
  let storage: Storage | undefined;
  try { storage = window.sessionStorage; } catch { /* Private browsing may deny the getter. */ }
  return capture(window.location.href, storage);
}
