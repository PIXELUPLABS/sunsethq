import assert from "node:assert/strict";
import { test } from "node:test";
import { readPendingSubmission, savePendingSubmission, clearPendingSubmission, stripPendingAttribution } from "../modules/value-my-data/lib/pending-submission";
import { CONSENT_KEY } from "../modules/consent/lib/cookie-consent";

test("uncertain submissions survive a reload with the same ID, expire, and clear on confirmation", () => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    localStorage: { getItem: (key: string) => key === CONSENT_KEY ? JSON.stringify({ version: 1, marketing: true, savedAt: Date.now() }) : null },
  } });
  const data = new Map<string, string>();
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value),
    removeItem: (key: string) => data.delete(key),
  } });
  const pending = { answers: { companyName: "Test", workEmail: "test@example.com", yearsOfOperation: "3 to 5 years", businessSize: "20 - 49", englishShare: "100%" }, campaign: { utm_source: "test" }, id: "8ad633d2-cf1e-4f14-b029-82e2b244f74f", savedAt: Date.now() };
  savePendingSubmission(pending);
  assert.deepEqual(readPendingSubmission(), pending);
  const attributed = { ...pending, landingPath: "/data-and-trust" };
  savePendingSubmission(attributed);
  assert.deepEqual(readPendingSubmission(), attributed);
  savePendingSubmission({ ...pending, landingPath: "//attacker.example" });
  assert.deepEqual(readPendingSubmission(), pending);
  clearPendingSubmission();
  assert.equal(readPendingSubmission(), null);
  savePendingSubmission({ ...pending, savedAt: Date.now() - 86400_001 });
  assert.equal(readPendingSubmission(), null);
  savePendingSubmission({ ...pending, id: "invalid" });
  assert.equal(readPendingSubmission(), null);
  const key = "replay.pending-valuation.v1";
  data.set(key, '{"campaign":{"utm_source":"private"},broken');
  assert.equal(readPendingSubmission(), null);
  assert.equal(data.has(key), false);
  data.set(key, '{"campaign":{"utm_source":"private"},broken');
  stripPendingAttribution();
  assert.equal(data.has(key), false, "consent withdrawal erases malformed pending attribution too");
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, get() { throw new Error("storage blocked"); } });
  assert.doesNotThrow(() => savePendingSubmission(pending));
  assert.equal(readPendingSubmission(), null);
  assert.doesNotThrow(clearPendingSubmission);
});
