import assert from "node:assert/strict";
import { test } from "node:test";
import { captureVisitAttribution, clearVisitAttribution } from "../modules/attribution/lib/visit-attribution";
import { CONSENT_KEY, CONSENT_MAX_AGE_MS, getConsentStatus, hasMarketingConsent, parseConsent, saveConsent, subscribeToConsent } from "../modules/consent/lib/cookie-consent";
import { readPendingSubmission, savePendingSubmission, stripPendingAttribution } from "../modules/value-my-data/lib/pending-submission";

function storage() {
  const data = new Map<string, string>();
  return { data, getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); }, removeItem: (key: string) => { data.delete(key); } };
}

test("consent requires a valid, current, explicit choice", () => {
  const now = CONSENT_MAX_AGE_MS * 2;
  for (const value of [null, "broken", "{}", JSON.stringify({ version: 1, marketing: "true", savedAt: now }),
    JSON.stringify({ version: 2, marketing: true, savedAt: now }), JSON.stringify({ version: 1, marketing: true, savedAt: now + 1 }),
    JSON.stringify({ version: 1, marketing: true, savedAt: now - CONSENT_MAX_AGE_MS })]) {
    assert.equal(parseConsent(value, now), null);
  }
  assert.equal(parseConsent(JSON.stringify({ version: 1, marketing: false, savedAt: now }), now)?.marketing, false);
  assert.equal(parseConsent(JSON.stringify({ version: 1, marketing: true, savedAt: now - CONSENT_MAX_AGE_MS + 1 }), now)?.marketing, true);
});

test("optional attribution is gated, persists after opt-in, and is erased on withdrawal including pending requests", () => {
  const local = storage();
  const session = storage();
  const browser = Object.assign(new EventTarget(), {
    localStorage: local, sessionStorage: session,
    location: { href: "https://www.replay.ai/?utm_source=consent-test" },
    setInterval, clearInterval,
  });
  const navigator = { globalPrivacyControl: false };
  Object.defineProperty(globalThis, "window", { configurable: true, value: browser });
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: session });
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: navigator });
  const sync = () => { captureVisitAttribution(); if (!hasMarketingConsent()) stripPendingAttribution(); };
  const unsubscribe = subscribeToConsent(sync);
  try {
    assert.equal(getConsentStatus(), "unknown");
    assert.deepEqual(captureVisitAttribution(), { campaign: {} });
    assert.equal(local.data.size, 0);
    assert.equal(session.data.size, 0);
    saveConsent(false);
    assert.equal(getConsentStatus(), "rejected");
    assert.equal(session.data.size, 0);

    saveConsent(true);
    assert.equal(getConsentStatus(), "accepted");
    assert.deepEqual(captureVisitAttribution(), { campaign: { utm_source: "consent-test" }, landingPath: "/" });
    browser.location.href = "https://www.replay.ai/value-my-data";
    assert.deepEqual(captureVisitAttribution(), { campaign: { utm_source: "consent-test" }, landingPath: "/" });
    const pending = { answers: { companyName: "Consent Test", workEmail: "test@example.com", yearsOfOperation: "3 to 5 years", businessSize: "20 - 49", englishShare: "100%" },
      campaign: { utm_source: "consent-test" }, landingPath: "/", id: "8ad633d2-cf1e-4f14-b029-82e2b244f74f", savedAt: Date.now() };
    savePendingSubmission(pending);
    assert.deepEqual(readPendingSubmission(), pending);
    saveConsent(false);
    assert.deepEqual(captureVisitAttribution(), { campaign: {} });
    assert.equal(session.data.has("replay.visit-attribution.v1"), false);
    assert.equal([...session.data.values()].some(value => value.includes("consent-test")), false);
    assert.deepEqual(readPendingSubmission(), { answers: pending.answers, campaign: {}, id: pending.id, savedAt: pending.savedAt });

    // A choice made in another tab must also clear this tab's attribution.
    saveConsent(true);
    assert.equal(session.data.has("replay.visit-attribution.v1"), true);
    local.setItem(CONSENT_KEY, JSON.stringify({ version: 1, marketing: false, savedAt: Date.now() }));
    browser.dispatchEvent(Object.assign(new Event("storage"), { key: CONSENT_KEY }));
    assert.equal(session.data.has("replay.visit-attribution.v1"), false);
    assert.equal(hasMarketingConsent(), false);
  } finally { unsubscribe(); clearVisitAttribution(); }
});

test("GPC overrides a prior acceptance; corrupt and expired choices fail closed; blocked writes retain the choice in memory", () => {
  const local = storage();
  const session = storage();
  const browser = Object.assign(new EventTarget(), { localStorage: local, sessionStorage: session, location: { href: "https://www.replay.ai/?utm_source=new" } });
  const navigator = { globalPrivacyControl: false };
  Object.defineProperty(globalThis, "window", { configurable: true, value: browser });
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: navigator });
  saveConsent(true);
  assert.equal(hasMarketingConsent(), true);
  navigator.globalPrivacyControl = true;
  assert.equal(hasMarketingConsent(), false);
  assert.deepEqual(captureVisitAttribution(), { campaign: {} });
  saveConsent(true);
  assert.equal(JSON.parse(local.getItem(CONSENT_KEY)!).marketing, false);
  navigator.globalPrivacyControl = false;
  local.setItem(CONSENT_KEY, "broken");
  assert.equal(getConsentStatus(), "unknown");
  local.setItem(CONSENT_KEY, JSON.stringify({ version: 1, marketing: true, savedAt: Date.now() - CONSENT_MAX_AGE_MS }));
  assert.equal(hasMarketingConsent(), false);
  const setItem = local.setItem;
  local.setItem = () => { throw new Error("quota exceeded"); };
  saveConsent(true);
  assert.equal(hasMarketingConsent(), true);
  saveConsent(false);
  assert.equal(hasMarketingConsent(), false);
  local.setItem = setItem;
  saveConsent(false);
});
