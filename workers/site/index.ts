import { handleSignupSignal, signupHealth } from "../../modules/lead-capture/lib/signup-monitor";
import { handleIntake, type IntakeEnv } from "../lead-intake";
import { leadHealth } from "../../modules/lead-capture/lib/lead-ledger";

export type SiteEnv = IntakeEnv & {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
};

export async function handleSite(request: Request, env: SiteEnv) {
  const url = new URL(request.url);
  // Only this staging Worker's HTTPS preview hosts may use same-origin intake.
  // Copy bindings per request; never mutate the shared environment object.
  if (env.APP_ENV === "development" && url.protocol === "https:" && !url.port &&
      /^[a-z0-9][a-z0-9-]*-replay-marketing-staging\.replay-marketing-dev\.workers\.dev$/.test(url.hostname)) {
    env = { ...env, SITE_ORIGIN: url.origin, ALLOWED_ORIGINS: url.origin };
  }
  let response: Response;
  if (env.APP_ENV === "production") {
    const canonical = new URL(env.SITE_ORIGIN);
    if ((url.hostname === "replay.ai" || url.hostname === canonical.hostname) && url.origin !== canonical.origin) {
      url.protocol = canonical.protocol;
      url.host = canonical.host;
      return new Response(null, { status: 308, headers: {
        Location: url.href,
        ...(new URL(request.url).protocol === "https:" ? { "Strict-Transport-Security": "max-age=31536000" } : {}),
      } });
    }
  }
  if (env.APP_ENV === "production" && url.origin !== env.SITE_ORIGIN) {
    return new Response("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  }
  if ((url.pathname === "/api/health" || (url.pathname === "/api/lead-health" && env.APP_ENV !== "production")) && request.method === "GET") {
    try {
      const [delivery, signup] = await Promise.all([leadHealth(env), signupHealth(env)]);
      const health = { ...delivery, healthy: delivery.healthy && signup.healthy, signup };
      response = Response.json(url.pathname === "/api/health" ? { healthy: health.healthy } : health, { status: health.healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } });
    } catch { response = Response.json({ healthy: false }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
  } else if (url.pathname === "/api/signup-signal") {
    try { response = await handleSignupSignal(request, env); }
    catch { response = new Response(null, { status: 503, headers: { "Cache-Control": "no-store" } }); }
  } else if (url.pathname === "/api/leads") {
    response = await handleIntake(request, env);
  } else if (url.pathname.startsWith("/api/")) {
    response = new Response("Not found", { status: 404 });
  } else if (/^\/data-and-(trust|privacy)\/?$/.test(url.pathname)) {
    // Next.js redirects are not emitted by the static export.
    url.pathname = "/data-privacy";
    response = new Response(null, { status: 308, headers: { Location: url.href } });
  } else {
    response = await env.ASSETS.fetch(request);
  }
  const result = new Response(response.body, response);
  if (env.APP_ENV !== "production" || url.pathname.startsWith("/api/") || response.status >= 400) {
    result.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  result.headers.set("X-Content-Type-Options", "nosniff");
  result.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  result.headers.set("X-Frame-Options", "DENY");
  result.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (env.APP_ENV === "production" && url.protocol === "https:") result.headers.set("Strict-Transport-Security", "max-age=31536000");
  if (result.headers.get("Content-Type")?.includes("text/html")) {
    // Next's exported bootstrap currently uses inline scripts/styles. Restrict
    // external origins while preserving Turnstile and the on-demand Cal embed.
    result.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://app.cal.com/embed/embed.js; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; media-src 'self'; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com https://replaydata.cal.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
  }
  return result;
}

const worker = { fetch: (request: Request, env: SiteEnv) => handleSite(request, env) };
export default worker;
