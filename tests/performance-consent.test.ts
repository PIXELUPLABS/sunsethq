import assert from "node:assert/strict";
import { test } from "node:test";
import { CONSENT_KEY, hasPerformanceConsent, saveConsent } from "../modules/consent/lib/cookie-consent";
import { isAnalyticsEndpoint, startCloudflareAnalytics } from "../modules/performance/lib/cloudflare-analytics";

test("RUM endpoint matching is narrow", () => {
  assert.equal(isAnalyticsEndpoint("/cdn-cgi/rum", "https://www.replay.ai"), true);
  assert.equal(isAnalyticsEndpoint("https://cloudflareinsights.com/cdn-cgi/rum", "https://www.replay.ai"), true);
  assert.equal(isAnalyticsEndpoint("/api/leads", "https://www.replay.ai"), false);
  assert.equal(isAnalyticsEndpoint("https://example.com/cdn-cgi/rum", "https://www.replay.ai"), false);
});

test("analytics requires new explicit consent and blocks every transport after withdrawal", async () => {
  const storage = new Map<string, string>();
  const events = new EventTarget();
  let sends = 0;
  const scripts: unknown[] = [];
  const browser = Object.assign(events, {
    localStorage: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) },
    setInterval: () => 1, clearInterval: () => {},
    fetch: async () => { sends++; return new Response(null, { status: 204 }); },
  });
  class XHR {
    open() {}
    send() { sends++; }
    abort() {}
  }
  const replacements = {
    window: browser,
    navigator: { sendBeacon: () => { sends++; return true; }, globalPrivacyControl: false },
    location: { origin: "http://localhost:4173" },
    document: { createElement: () => ({ dataset: {} }), head: { append: (s: unknown) => scripts.push(s) } },
    XMLHttpRequest: XHR,
  };
  const originals = Object.fromEntries(Object.keys(replacements).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(replacements)) Object.defineProperty(globalThis, key, { configurable: true, value });
  let stop = () => {};
  try {
    const token = "a".repeat(32); // local test identifier, never a live property
    startCloudflareAnalytics(token);
    assert.equal(scripts.length, 0, "no analytics outside production origin");
    replacements.location.origin = "https://www.replay.ai";
    storage.set(CONSENT_KEY, JSON.stringify({ version: 1, marketing: true, savedAt: Date.now() }));
    assert.equal(hasPerformanceConsent(), false, "old campaign consent is not analytics consent");
    stop = startCloudflareAnalytics(token);
    assert.equal(scripts.length, 0);
    replacements.navigator.globalPrivacyControl = true;
    saveConsent(false, true);
    assert.equal(scripts.length, 0, "GPC prevents initial beacon load");
    replacements.navigator.globalPrivacyControl = false;
    saveConsent(false, true);
    assert.equal(scripts.length, 1);
    const endpoint = "https://cloudflareinsights.com/cdn-cgi/rum";
    navigator.sendBeacon(endpoint);
    await window.fetch(endpoint);
    const xhr = new XMLHttpRequest(); xhr.open("POST", endpoint); xhr.send();
    assert.equal(sends, 3);
    storage.set(CONSENT_KEY, JSON.stringify({ version: 1, marketing: false, performance: true, savedAt: 1 }));
    navigator.sendBeacon(endpoint);
    assert.equal(sends, 3, "expired consent blocks sends even before the subscription timer runs");
    saveConsent(false, true);
    navigator.sendBeacon(endpoint);
    await window.fetch(endpoint);
    xhr.send();
    assert.equal(sends, 3, "observed expiry latches off even if consent is renewed before the timer runs");
    saveConsent(false);
    assert.equal(navigator.sendBeacon(endpoint), false);
    await window.fetch(endpoint);
    xhr.send();
    assert.equal(sends, 3, "loaded beacon cannot send after rejection");
    navigator.sendBeacon("/api/leads");
    await window.fetch("/api/leads");
    const other = new XMLHttpRequest(); other.open("POST", "/api/leads"); other.send();
    assert.equal(sends, 6, "signup transports unchanged");
    saveConsent(false, true);
    navigator.sendBeacon(endpoint);
    assert.equal(sends, 6, "reaccept requires a fresh document, no queued measurements leak");
    assert.equal(scripts.length, 1, "no duplicate listeners");
    replacements.navigator.globalPrivacyControl = true;
    saveConsent(true, true);
    assert.equal(hasPerformanceConsent(), false);
  } finally {
    stop();
    for (const [key, descriptor] of Object.entries(originals)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
