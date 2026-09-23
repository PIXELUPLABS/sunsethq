import { test, expect, chromium, type Browser, type BrowserContextOptions } from "@playwright/test";
import { probeSignup } from "../../scripts/signup-browser-probe.mjs";

const secret = "browser-probe-test-only-credential-32-characters";
const origin = "http://127.0.0.1:3100";
const widget = `window.turnstile = {
  render(element, options) {
    const input = document.createElement('input'); input.type = 'hidden';
    input.name = 'cf-turnstile-response'; input.value = 'browser-test-token'; element.append(input);
    setTimeout(() => options.callback(input.value), 0); return 'test-widget';
  }, reset() {}, remove() {}
};`;
const testBrowser = (blockApplication = false) => ({
  async launch() {
    const browser = await chromium.launch();
    return {
      async newContext(options: BrowserContextOptions) {
        const context = await browser.newContext(options);
        await context.route("https://challenges.cloudflare.com/**", route => route.fulfill({ contentType: "text/javascript", body: widget }));
        if (blockApplication) await context.route("**/_next/static/chunks/*.js", route => route.abort());
        return context;
      },
      close: () => browser.close(),
    } as unknown as Browser;
  },
});

test.beforeEach(async ({ request }) => {
  await request.post("/__test/control", { data: { reset: true } });
});

test("the native monitor reports bootstrap failure when all application JavaScript is blocked", async ({ page, request }) => {
  await page.route("**/_next/static/chunks/*.js", route => route.abort());
  await page.goto("/value-my-data");
  await expect.poll(async () => (await (await request.get("/__test/state")).json()).signals.some((s: { code: string }) => s.code === "bootstrap_timeout"), { timeout: 30_000 }).toBe(true);
  const state = await (await request.get("/__test/state")).json();
  expect(state.rows).toHaveLength(0);
  expect(state.signals.every((s: Record<string, unknown>) => Object.keys(s).sort().join(",") === "code,created_at,environment,signal_id")).toBe(true);
});

test("blocked verification reports a failure even when no form is submitted", async ({ page, request }) => {
  await page.route("https://challenges.cloudflare.com/**", route => route.abort());
  await page.goto("/value-my-data");
  await expect.poll(async () => (await (await request.get("/__test/state")).json()).signals.some((s: { code: string }) => s.code === "verification_unavailable"), { timeout: 20_000 }).toBe(true);
  expect((await (await request.get("/__test/state")).json()).rows).toHaveLength(0);
});

test("the production probe drives the browser and intake without making a lead or CRM entry", async ({ request }) => {
  await probeSignup({ origin, secret, browserType: testBrowser() as typeof chromium });
  const state = await (await request.get("/__test/state")).json();
  expect(state.rows).toHaveLength(0);
  expect(state.entries).toHaveLength(0);
  expect(state.alerts).toBe(0);
  expect(state.probe).toHaveLength(1);
  expect(state.probe[0].healthy).toBe(1);
});

test("a failed browser probe reports failure even when the application cannot run", async ({ request }) => {
  await expect(probeSignup({ origin, secret, browserType: testBrowser(true) as typeof chromium })).rejects.toThrow("form_hydration");
  const state = await (await request.get("/__test/state")).json();
  expect(state.rows).toHaveLength(0);
  expect(state.probe[0].healthy).toBe(0);
});
