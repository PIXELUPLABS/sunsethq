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
    if (type === "text/html") {
      const directives = new Map(response.headers.get("Content-Security-Policy")!.split(";").map(directive => {
        const [name, ...sources] = directive.trim().split(/\s+/);
        return [name, sources] as const;
      }));
      assert.deepEqual(directives.get("frame-src"), ["https://challenges.cloudflare.com", "https://replaydata.cal.com"]);
      assert.deepEqual(directives.get("script-src"), ["'self'", "'unsafe-inline'", "https://challenges.cloudflare.com", "https://app.cal.com/embed/embed.js"]);
    }
    assert.equal(response.headers.get("Strict-Transport-Security"), null);
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
  assert.equal(response.headers.get("Strict-Transport-Security"), "max-age=31536000");
  for (const origin of ["http://replay.ai", "https://replay.ai", "http://www.replay.ai"]) {
    const redirect = await handleSite(new Request(`${origin}/value-my-data?utm_source=test`), env);
    assert.equal(redirect.status, 308);
    assert.equal(redirect.headers.get("Location"), "https://www.replay.ai/value-my-data?utm_source=test");
    assert.equal(redirect.headers.get("Strict-Transport-Security"), origin.startsWith("https:") ? "max-age=31536000" : null);
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

test("legacy privacy URLs permanently redirect before asset lookup and preserve queries", async () => {
  for (const production of [false, true]) {
    const origin = production ? "https://www.replay.ai" : "https://stage.example";
    const env = {
      APP_ENV: production ? "production" : "staging", SITE_ORIGIN: origin,
      ASSETS: { fetch: async () => { throw new Error("Legacy route reached assets"); } },
    } as unknown as SiteEnv;
    for (const path of ["/data-and-trust", "/data-and-privacy", "/data-and-trust/", "/data-and-privacy/"]) {
      const response = await handleSite(new Request(`${origin}${path}?utm_source=legacy`), env);
      assert.equal(response.status, 308);
      assert.equal(response.headers.get("Location"), `${origin}/data-privacy?utm_source=legacy`);
      assert.equal(response.headers.get("X-Frame-Options"), "DENY");
      assert.equal(response.headers.get("X-Robots-Tag"), production ? null : "noindex, nofollow, noarchive");
    }
  }
});

test("API routes never fall through to the website and retain intake origin/configuration checks", async () => {
  let assets = 0;
  const env = { ALLOWED_ORIGINS: "https://stage.example", ASSETS: { fetch: async () => { assets++; return new Response("wrong"); } } } as unknown as SiteEnv;
  assert.equal((await handleSite(new Request("https://stage.example/api/unknown"), env)).status, 404);
  assert.equal((await handleSite(new Request("https://stage.example/api/leads", { method: "POST", headers: { Origin: "https://bad.example" } }), env)).status, 403);
  assert.equal((await handleSite(new Request("https://stage.example/api/leads", { method: "POST", headers: { Origin: "https://stage.example" } }), env)).status, 503);
  assert.equal(assets, 0);
});

test("staging previews accept only their own HTTPS origin without changing shared bindings", async () => {
  const staging = "https://replay-marketing-staging.replay-marketing-dev.workers.dev";
  const preview = "https://b-feature-test-replay-marketing-staging.replay-marketing-dev.workers.dev";
  const env = { APP_ENV: "development", SITE_ORIGIN: staging, ALLOWED_ORIGINS: staging } as SiteEnv;
  const preflight = (target: string, origin: string, bindings = env) => handleSite(new Request(`${target}/api/leads`, {
    method: "OPTIONS", headers: { Origin: origin },
  }), bindings);
  const allowed = await preflight(preview, preview);
  assert.equal(allowed.status, 204);
  assert.equal(allowed.headers.get("Access-Control-Allow-Origin"), preview);
  assert.match(allowed.headers.get("X-Robots-Tag")!, /noindex/);
  assert.equal(env.SITE_ORIGIN, staging);
  assert.equal(env.ALLOWED_ORIGINS, staging);
  assert.equal((await preflight(preview, staging)).status, 403);
  assert.equal((await preflight(preview, "https://evil.example")).status, 403);
  for (const target of [preview.replace("https:", "http:"), `${preview}:8443`,
    `${preview}.evil.example`, preview.replace("replay-marketing-staging", "another-worker")]) {
    assert.equal((await preflight(target, target)).status, 403);
  }
  assert.equal((await preflight(preview, preview, { ...env, APP_ENV: "production" })).status, 404);
  assert.equal((await preflight(staging, staging)).status, 204);
});
