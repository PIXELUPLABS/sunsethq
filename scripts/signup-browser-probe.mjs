import { chromium } from "@playwright/test";

// This uses the live page, live application chunks, and real Turnstile. The
// secret is injected server-side by Playwright's network route, never into DOM,
// page JavaScript, URLs, traces, screenshots, or logs.
export async function probeSignup({ origin, secret, browserType = chromium, fetcher = fetch }) {
  if (!secret || secret.length < 32) throw new Error("SIGNUP_PROBE_SECRET must contain at least 32 characters.");
  if (origin !== "https://www.replay.ai" && !/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) throw new Error("Unexpected signup probe origin.");
  let browser;
  let stage = "browser_start";
  try {
    browser = await browserType.launch();
    const context = await browser.newContext({ serviceWorkers: "block" });
    const page = await context.newPage();
    let pageError = false;
    page.on("pageerror", () => { pageError = true; });
    await page.route(`${origin}/api/leads`, async route => {
      // Prevent a redirect from carrying the probe credential off this origin.
      const response = await route.fetch({ headers: { ...route.request().headers(), "X-Replay-Signup-Probe": secret }, maxRedirects: 0 });
      await route.fulfill({ response });
    });
    stage = "page_load";
    const response = await page.goto(`${origin}/value-my-data`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    if (!response?.ok()) throw new Error("Page unavailable");
    stage = "form_hydration";
    await page.locator('form[data-signup-ready="true"]').waitFor({ timeout: 30_000 });
    await page.getByRole("button", { name: "Reject optional", exact: true }).click();
    await page.getByLabel("Company name", { exact: true }).fill("Replay synthetic availability check");
    await page.getByLabel("Work email", { exact: true }).fill("signup-probe@example.com");
    await page.getByLabel("Years of Operation", { exact: true }).selectOption("3 to 5 years");
    await page.getByLabel("Number of people who work in the business", { exact: true }).selectOption("20 - 49");
    await page.getByLabel("Share of internal communications in english", { exact: true }).selectOption("100%");
    stage = "verification";
    // A manual-review fallback must not masquerade as a passing verification.
    await page.waitForFunction(() => {
      const token = document.querySelector('input[name="cf-turnstile-response"]');
      return token instanceof HTMLInputElement && token.value.length > 0;
    }, { }, { timeout: 45_000 });
    stage = "intake";
    const accepted = page.waitForResponse(response => response.url() === `${origin}/api/leads` && response.request().method() === "POST", { timeout: 30_000 });
    await page.locator('form button[type="submit"]').click();
    const result = await accepted;
    const body = await result.json();
    if (result.status() !== 202 || body.synthetic !== true || body.verification !== "verified") throw new Error("Probe was not verified");
    stage = "success_ui";
    await page.getByRole("status").filter({ hasText: "We’ll reach out if it’s a fit." }).waitFor({ timeout: 10_000 });
    if (pageError) throw new Error("Application JavaScript error");
    console.log("Signup browser probe passed.");
    return true;
  } catch {
    // The public health monitor also catches this runner failing to report at all.
    try {
      await fetcher(`${origin}/api/signup-probe`, { method: "POST", headers: { "X-Replay-Signup-Probe": secret }, redirect: "error", signal: AbortSignal.timeout(10_000) });
    } catch { /* Stale heartbeat will alert if the site is unreachable. */ }
    throw new Error(`Signup browser probe failed at ${stage}.`);
  } finally { await browser?.close(); }
}

