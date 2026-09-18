export const CONSENT_KEY = "replay.cookie-consent.v1";
export const CONSENT_EVENT = "replay:consent-changed";
export const COOKIE_SETTINGS_EVENT = "replay:cookie-settings-open";

export function openCookieSettings() {
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
}
export const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
export type ConsentStatus = "unknown" | "accepted" | "rejected";
type ConsentRecord = { version: 1; marketing: boolean; savedAt: number };

let memory: ConsentRecord | null = null;
let storageUnavailable = false;

export function parseConsent(raw: string | null, now = Date.now()): ConsentRecord | null {
  try {
    const value = JSON.parse(raw ?? "null");
    if (value?.version !== 1 || typeof value.marketing !== "boolean" ||
        typeof value.savedAt !== "number" || !Number.isFinite(value.savedAt) ||
        value.savedAt > now || now - value.savedAt >= CONSENT_MAX_AGE_MS) return null;
    return { version: 1, marketing: value.marketing, savedAt: value.savedAt };
  } catch { return null; }
}

export function hasGlobalPrivacyControl() {
  return typeof navigator !== "undefined" &&
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

export function getConsentStatus(): ConsentStatus {
  if (typeof window === "undefined") return "unknown";
  if (hasGlobalPrivacyControl()) return "rejected";
  let record: ConsentRecord | null;
  try { record = storageUnavailable ? parseConsent(JSON.stringify(memory)) : parseConsent(window.localStorage.getItem(CONSENT_KEY)); }
  catch { record = parseConsent(JSON.stringify(memory)); }
  return record ? (record.marketing ? "accepted" : "rejected") : "unknown";
}

export function hasMarketingConsent() {
  return getConsentStatus() === "accepted";
}

export function saveConsent(marketing: boolean) {
  memory = { version: 1, marketing: marketing && !hasGlobalPrivacyControl(), savedAt: Date.now() };
  try { window.localStorage.setItem(CONSENT_KEY, JSON.stringify(memory)); storageUnavailable = false; }
  catch { storageUnavailable = true; }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function subscribeToConsent(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY || event.key === null) { storageUnavailable = false; memory = null; callback(); }
  };
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener("storage", onStorage);
  window.addEventListener("pageshow", callback);
  window.addEventListener("focus", callback);
  // Recheck expiry even when a page stays open for a long time.
  const interval = window.setInterval(callback, 60_000);
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("pageshow", callback);
    window.removeEventListener("focus", callback);
    window.clearInterval(interval);
  };
}
