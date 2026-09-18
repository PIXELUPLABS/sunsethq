import assert from "node:assert/strict";
import { test } from "node:test";
import { createAttributionSession } from "../modules/attribution/lib/visit-attribution";
import { parseLandingPath } from "../modules/lead-capture/lib/campaign-attribution";

function storage() {
  const data = new Map<string, string>();
  return { data, getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); } };
}

test("a tagged homepage retains its first campaign and landing page through navigation and reload", () => {
  const saved = storage();
  const capture = createAttributionSession();
  const original = { campaign: { utm_source: "newsletter", utm_medium: "email", utm_campaign: "launch" }, landingPath: "/" };
  assert.deepEqual(capture("https://example.com/?utm_source=newsletter&utm_medium=email&utm_campaign=launch", saved, 1000), original);
  assert.deepEqual(capture("https://example.com/data-and-trust", saved, 2000), original);
  assert.deepEqual(capture("https://example.com/value-my-data?utm_source=internal-link", saved, 3000), original);
  assert.deepEqual(createAttributionSession()("https://example.com/value-my-data", saved, 4000), original);
});

test("direct arrivals stay direct, visits expire, and origins cannot share attribution", () => {
  const saved = storage();
  const capture = createAttributionSession();
  capture("https://example.com/data-and-trust", saved, 1000);
  assert.deepEqual(capture("https://example.com/value-my-data?utm_source=later", saved, 2000), { campaign: {}, landingPath: "/data-and-trust" });
  assert.deepEqual(capture("https://example.com/value-my-data?utm_source=new", saved, 1000 + 86400_000), { campaign: { utm_source: "new" }, landingPath: "/value-my-data" });
  assert.deepEqual(capture("https://staging.example.com/", saved, 1000 + 86400_000), { campaign: {}, landingPath: "/" });
});

test("attribution strips non-campaign queries and fragments, and bounds campaign values", () => {
  const saved = storage();
  const capture = createAttributionSession();
  assert.deepEqual(capture(`https://example.com/data-and-trust/?utm_source=mail%0A&utm_campaign=${"a".repeat(200)}&email=private%40example.com&token=private#private`, saved, 1000), {
    campaign: { utm_source: "mail", utm_campaign: "a".repeat(160) }, landingPath: "/data-and-trust",
  });
  assert.ok(![...saved.data.values()].join().includes("private"));
});

test("blocked or corrupt storage never breaks the form and memory survives navigation", () => {
  const blocked = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };
  const capture = createAttributionSession();
  capture("https://example.com/?utm_source=launch", blocked, 1000);
  assert.deepEqual(capture("https://example.com/value-my-data", blocked, 2000), { campaign: { utm_source: "launch" }, landingPath: "/" });
  assert.deepEqual(createAttributionSession()("https://example.com/", { ...blocked, getItem: () => "{broken" }, 1000), { campaign: {}, landingPath: "/" });
});

test("stored attribution is revalidated, never trusted as an arbitrary payload", () => {
  const saved = storage();
  const capture = createAttributionSession();
  capture("https://example.com/", saved, 1000);
  const key = [...saved.data.keys()][0];
  saved.setItem(key, JSON.stringify({ capturedAt: 1000, origin: "https://example.com", campaign: { utm_source: "a\nb", secret: "discard" }, landingPath: "//evil.example" }));
  assert.deepEqual(createAttributionSession()("https://example.com/value-my-data", saved, 2000), { campaign: { utm_source: "ab" } });
  saved.setItem(key, JSON.stringify({ capturedAt: 99999, origin: "https://example.com", campaign: { utm_source: "future" } }));
  assert.deepEqual(createAttributionSession()("https://example.com/value-my-data", saved, 3000), { campaign: {}, landingPath: "/value-my-data" });
});

test("landing pages cannot smuggle an external origin, query, fragment, or encoded identifier", () => {
  for (const value of ["https://evil.example", "//evil.example", "/\\evil", "/../admin", "/%2f%2fevil", "/?email=private", "/#private", "/private@example.com", "/a//b", "/a\nb", "/" + "a".repeat(512)]) {
    assert.equal(parseLandingPath(value), undefined, value);
  }
  assert.equal(parseLandingPath("/careers/roles/ab-123"), "/careers/roles/ab-123");
});
