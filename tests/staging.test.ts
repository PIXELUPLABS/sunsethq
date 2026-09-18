import assert from "node:assert/strict";
import { test } from "node:test";
import { handleSite, type SiteEnv } from "../workers/site";
import { testDatabase } from "./sqlite-d1";
import { reconcileLeads } from "../modules/lead-capture/lib/lead-ledger";

test("static pages, assets, and missing pages retain status and receive staging/security headers", async () => {
  for (const [path, status, type] of [["/", 200, "text/html"], ["/site.js", 200, "application/javascript"], ["/missing", 404, "text/html"]] as const) {
    const env = { ASSETS: { fetch: async () => new Response("content", { status, headers: { "Content-Type": type } }) } } as unknown as SiteEnv;
    const response = await handleSite(new Request(`https://stage.example${path}`), env);
    assert.equal(response.status, status);
    assert.match(response.headers.get("X-Robots-Tag")!, /noindex/);
    assert.equal(response.headers.get("X-Frame-Options"), "DENY");
    if (type === "text/html") assert.match(response.headers.get("Content-Security-Policy")!, /challenges.cloudflare.com/);
  }
});

test("production is indexable only on its canonical host and never exposes detailed health", async () => {
  const env = { APP_ENV: "production", SITE_ORIGIN: "https://www.replay.ai", LEAD_DB: testDatabase().db,
    ASSETS: { fetch: async () => new Response("content", { headers: { "Content-Type": "text/html" } }) },
  } as unknown as SiteEnv;
  const response = await handleSite(new Request("https://www.replay.ai/"), env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("X-Robots-Tag"), null);
  assert.equal(response.headers.get("X-Frame-Options"), "DENY");
  for (const origin of ["http://replay.ai", "https://replay.ai", "http://www.replay.ai"]) {
    const redirect = await handleSite(new Request(`${origin}/value-my-data?utm_source=test`), env);
    assert.equal(redirect.status, 308);
    assert.equal(redirect.headers.get("Location"), "https://www.replay.ai/value-my-data?utm_source=test");
  }
  assert.equal((await handleSite(new Request("https://accidental.workers.dev/"), env)).status, 404);
  assert.equal((await handleSite(new Request("https://www.replay.ai/api/lead-health"), env)).status, 404);
  await reconcileLeads(env);
  await env.LEAD_DB.prepare("UPDATE lead_monitor SET dependency_ok = 1").run();
  const health = await handleSite(new Request("https://www.replay.ai/api/health"), env);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { healthy: true });
  assert.match(health.headers.get("X-Robots-Tag")!, /noindex/);
});

test("API routes never fall through to the website and retain intake origin/configuration checks", async () => {
  let assets = 0;
  const env = { ALLOWED_ORIGINS: "https://stage.example", ASSETS: { fetch: async () => { assets++; return new Response("wrong"); } } } as unknown as SiteEnv;
  assert.equal((await handleSite(new Request("https://stage.example/api/unknown"), env)).status, 404);
  assert.equal((await handleSite(new Request("https://stage.example/api/leads", { method: "POST", headers: { Origin: "https://bad.example" } }), env)).status, 403);
  assert.equal((await handleSite(new Request("https://stage.example/api/leads", { method: "POST", headers: { Origin: "https://stage.example" } }), env)).status, 503);
  assert.equal(assets, 0);
});
