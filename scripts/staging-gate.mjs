const ACCESS_ORIGIN = "https://sunsethq.cloudflareaccess.com";
const ACCESS_AUDIENCE = "77040dd6766f9da2ac24f8564d7ae9d61b7ce5462cc4502af74d881568e88403";

export async function checkStagingGate(origin) {
  for (const pathname of ["/", "/value-my-data", "/api/leads", "/robots.txt", "/generated-images/access-check.webp"]) {
    let response;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await fetch(new URL(pathname, origin), {
          redirect: "manual", headers: { Accept: "text/html", Connection: "close" }, signal: AbortSignal.timeout(10_000),
        });
        break;
      } catch (error) { if (attempt === 2) throw error; }
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
