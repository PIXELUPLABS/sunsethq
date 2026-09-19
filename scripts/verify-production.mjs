import assert from "node:assert/strict";
const origin = "https://www.replay.ai";
for (const source of ["http://replay.ai", "https://replay.ai", "http://www.replay.ai"]) {
  const response = await fetch(`${source}/value-my-data?utm_source=redirect-check`, { redirect: "manual", signal: AbortSignal.timeout(15_000) });
  assert.ok([301, 308].includes(response.status), `${source}: missing permanent redirect`);
  const location = new URL(response.headers.get("location"));
  assert.equal(location.hostname, "www.replay.ai");
  assert.equal(location.protocol, "https:");
  assert.equal(location.pathname, "/value-my-data");
  assert.equal(location.search, "?utm_source=redirect-check");
}
async function request(path) {
  return fetch(`${origin}${path}`, { redirect: "manual", signal: AbortSignal.timeout(15_000) });
}
for (const path of ["/", "/value-my-data", "/careers", "/data-privacy"]) {
  const response = await request(path);
  assert.equal(response.status, 200, `${path}: unavailable or gated`);
  assert.ok(!response.headers.get("x-robots-tag")?.includes("noindex"), `${path}: noindex header`);
  const html = await response.text();
  assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/);
  assert.ok(html.includes(`${origin}${path === "/" ? "" : path}`), `${path}: production canonical missing`);
}
const robots = await (await request("/robots.txt")).text();
assert.match(robots, /^Allow: \/$/m);
assert.doesNotMatch(robots, /^Disallow: \/$/m);
const health = await request("/api/health");
assert.equal(health.status, 200);
assert.deepEqual(await health.json(), { healthy: true });
assert.equal((await request("/api/lead-health")).status, 404);
assert.equal((await request("/this-page-does-not-exist-production-check")).status, 404);
console.log("PASS: production pages, canonical origin, indexing, public health, private diagnostics, and real 404.");
