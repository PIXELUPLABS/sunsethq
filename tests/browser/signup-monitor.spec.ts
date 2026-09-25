import { test, expect } from "@playwright/test";

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
