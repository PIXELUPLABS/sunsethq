import { setTimeout } from "node:timers/promises";

const ACCESS_ORIGIN = "https://sunsethq.cloudflareaccess.com";
const ACCESS_AUDIENCE = "77040dd6766f9da2ac24f8564d7ae9d61b7ce5462cc4502af74d881568e88403";

export async function checkStagingGate(origin) {
  for (const pathname of ["/", "/value-my-data", "/api/leads", "/robots.txt", "/generated-images/access-check.webp"]) {
    let response;
    for (let attempt = 0; attempt < 10; attempt++) {
      try {
        response = await fetch(new URL(pathname, origin), {
          redirect: "manual", headers: { Accept: "text/html", Connection: "close" }, signal: AbortSignal.timeout(10_000),
        });
        // A new preview route may briefly be absent while edge routing updates.
        // Never retry a publicly accessible response or an unexpected login.
        if (![404, 502, 503, 504].includes(response.status) || attempt === 9) break;
        await response.body?.cancel();
      } catch (error) { if (attempt === 9) throw error; }
      await setTimeout(1_000);
    }
    const location = response.headers.get("location");
    const login = location ? new URL(location) : null;
    if (response.status !== 302 || login?.origin !== ACCESS_ORIGIN ||
        login.pathname !== `/cdn-cgi/access/login/${new URL(origin).hostname}` ||
        login.searchParams.get("kid") !== ACCESS_AUDIENCE) {
      throw new Error(`Staging Access check failed for ${pathname} (HTTP ${response.status}).`);
    }
    await response.body?.cancel();
  }
  console.log("PASS: anonymous pages, assets, robots, and API requests require the expected Cloudflare Access application.");
}
