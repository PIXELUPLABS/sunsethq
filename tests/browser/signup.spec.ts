import { test, expect, type Page, type APIRequestContext } from "@playwright/test";

const pendingKey = "replay.pending-valuation.v1";
const control = async (request: APIRequestContext, options: Record<string, unknown>) => {
  expect((await request.post("/__test/control", { data: options })).ok()).toBe(true);
};
const state = async (request: APIRequestContext) => (await request.get("/__test/state")).json();
const submitButton = (page: Page) => page.locator('form button[type="submit"]');
async function open(page: Page, widget: "verified" | "blocked" | "unresolved" = "verified") {
  await page.route("https://challenges.cloudflare.com/**", route => widget === "blocked" ? route.abort() : route.fulfill({
    contentType: "text/javascript",
    body: `window.turnstile = {
      render(element, options) { this.options = options; ${widget === "verified" ? 'setTimeout(() => options.callback("browser-test-token"), 0);' : ""} return "test-widget"; },
      reset() { setTimeout(() => this.options.callback("browser-test-token"), 0); }, remove() {}
    };`,
  }));
  await page.goto("/value-my-data?utm_source=must-not-be-stored");
  await page.getByRole("button", { name: "Reject optional", exact: true }).click();
  await expect(submitButton(page)).toBeEnabled({ timeout: 20_000 });
}
async function fill(page: Page) {
  await page.getByLabel("Company name", { exact: true }).fill("Synthetic Browser Test");
  await page.getByLabel("Work email", { exact: true }).fill("browser-test@example.com");
  await page.getByLabel("Years of Operation", { exact: true }).selectOption("3 to 5 years");
  await page.getByLabel("Number of people who work in the business", { exact: true }).selectOption("20 - 49");
  await page.getByLabel("Share of internal communications in english", { exact: true }).selectOption("100%");
}
async function success(page: Page) {
  await expect(page.getByRole("status").filter({ hasText: "We’ll reach out if it’s a fit." })).toBeVisible();
  expect(await page.evaluate(key => sessionStorage.getItem(key), pendingKey)).toBeNull();
}

async function calendar(page: Page, blocked = false) {
  let requests = 0;
  await page.route("https://app.cal.com/embed/embed.js", route => {
    requests++;
    // Exercise the installed Cal embed client; only the remote event is simulated.
    return blocked ? route.abort() : route.fulfill({ contentType: "text/javascript", path: "node_modules/@calcom/embed-core/dist/embed/embed.js" });
  });
  await page.route("https://replaydata.cal.com/**", route => route.fulfill({
    contentType: "text/html",
    body: `<html><body><h1>Available test times</h1><script>
      for (const type of ["__iframeReady", "linkReady"]) parent.postMessage({ fullType: "CAL:data-valuation:" + type, data: {} }, "http://127.0.0.1:3100");
    </script></body></html>`,
  }));
  return () => requests;
}

test.beforeEach(async ({ request }) => control(request, { reset: true }));

test("required fields and malformed email block requests; rejecting cookies permits durable signup", async ({ page, request }) => {
  await open(page);
  let calls = 0;
  page.on("request", req => { if (req.url().endsWith("/api/leads")) calls++; });
  await submitButton(page).click();
  await expect(page.getByLabel("Company name", { exact: true })).toBeFocused();
  expect(calls).toBe(0);
  await page.getByLabel("Company name", { exact: true }).fill("Synthetic Browser Test");
  await page.getByLabel("Work email", { exact: true }).fill("browser-test@example.com");
  for (const [label, value] of [
    ["Years of Operation", "3 to 5 years"],
    ["Number of people who work in the business", "20 - 49"],
    ["Share of internal communications in english", "100%"],
  ]) {
    await submitButton(page).click();
    await expect(page.getByLabel(label, { exact: true })).toBeFocused();
    expect(calls).toBe(0);
    await page.getByLabel(label, { exact: true }).selectOption(value);
  }
  await page.getByLabel("Work email", { exact: true }).fill("invalid");
  await submitButton(page).click();
  await expect(page.getByLabel("Work email", { exact: true })).toBeFocused();
  expect(calls).toBe(0);
  await page.getByLabel("Work email", { exact: true }).fill("browser-test@example.com");
  await submitButton(page).click();
  await success(page);
  const saved = await state(request);
  expect(saved.rows).toHaveLength(1);
  expect(saved.rows[0].status).toBe("pending");
  expect(saved.entries).toHaveLength(0); // Success is a receipt, not a CRM promise.
  expect(JSON.parse(saved.rows[0].payload)).toMatchObject({ campaign: {}, verification: { status: "verified" } });
  await control(request, { drain: true });
  const delivered = await state(request);
  expect(delivered.rows[0].status).toBe("delivered");
  expect(delivered.rows[0].attio_entry_id).toBe(delivered.entries[0].id.entry_id);
  expect(delivered.entries[0].entry_values).toMatchObject({ replay_company_name: "Synthetic Browser Test", replay_campaign: "{}", replay_verification_status: "Verified" });
});

for (const widget of ["blocked", "unresolved"] as const) {
  test(`unavailable Turnstile (${widget}) offers reviewed fallback and sends one operator alert`, async ({ page, request }) => {
    await control(request, { calendar: true });
    const calRequests = await calendar(page);
    await open(page, widget);
    await expect(submitButton(page)).toHaveText("Send for review");
    await fill(page);
    await submitButton(page).click();
    await success(page);
    expect(calRequests()).toBe(0);
    await control(request, { drain: true });
    const saved = await state(request);
    expect(saved.rows[0].status).toBe("delivered");
    expect(saved.alerts).toBe(1);
    expect(saved.entries[0].entry_values).toMatchObject({ replay_verification_status: "Unverified", replay_verification_reason: widget === "blocked" ? "script_unavailable" : "verification_timeout" });
  });
}

for (const committed of [false, true]) {
  test(`${committed ? "ambiguous response after durable commit" : "interrupted request before intake"} survives reload and retries the same ID`, async ({ page, request }) => {
    await open(page);
    await fill(page);
    let submission: Record<string, unknown>;
    await page.route("**/api/leads", async route => {
      submission = route.request().postDataJSON();
      if (committed) expect((await route.fetch()).status()).toBe(202);
      await route.abort("failed");
    }, { times: 1 });
    await submitButton(page).click();
    await expect(page.locator("form").getByRole("alert")).toContainText("couldn’t confirm receipt");
    const pending = await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)!), pendingKey);
    expect(pending.id).toBe(submission!.submissionId);
    expect((await state(request)).rows).toHaveLength(committed ? 1 : 0);
    await page.reload();
    await expect(page.getByLabel("Company name", { exact: true })).toHaveValue("Synthetic Browser Test");
    await expect(page.getByLabel("Work email", { exact: true })).toHaveValue("browser-test@example.com");
    await expect(page.getByLabel("Years of Operation", { exact: true })).toHaveValue("3 to 5 years");
    await expect(page.getByLabel("Number of people who work in the business", { exact: true })).toHaveValue("20 - 49");
    await expect(page.getByLabel("Share of internal communications in english", { exact: true })).toHaveValue("100%");
    const retry = page.waitForRequest("**/api/leads");
    await submitButton(page).click();
    expect((await retry).postDataJSON().submissionId).toBe(pending.id);
    await success(page);
    await control(request, { mode: "crm-ambiguous", drain: true });
    // Replay after delivery too: real intake must return the original receipt.
    const replay = await request.post("/api/leads", { headers: { Origin: "http://127.0.0.1:3100" }, data: submission! });
    expect(replay.status()).toBe(202);
    await control(request, { drain: true });
    const delivered = await state(request);
    expect(delivered.rows).toHaveLength(1);
    expect(delivered.rows[0].status).toBe("delivered");
    expect(delivered.entries).toHaveLength(1);
    expect(delivered.writes).toBe(1);
  });
}

test("queue loss and CRM outage retain the accepted receipt and recover without a second inquiry", async ({ page, request }) => {
  await open(page);
  await fill(page);
  await control(request, { mode: "queue-loss" });
  await submitButton(page).click();
  await success(page);
  expect((await state(request)).rows[0].status).toBe("pending");
  await control(request, { mode: "crm-outage", recover: true, drain: true });
  const failed = await state(request);
  expect(failed.rows[0]).toMatchObject({ status: "pending", attempts: 1, last_failure_code: "attio_503" });
  expect(failed.retryDelays).toEqual([60]);
  await control(request, { drain: true });
  const recovered = await state(request);
  expect(recovered.rows[0]).toMatchObject({ status: "delivered", attempts: 2 });
  expect(recovered.entries).toHaveLength(1);
});

test("explicit verification rejection preserves answers and never creates a receipt", async ({ page, request }) => {
  await open(page);
  await fill(page);
  await control(request, { mode: "verify-reject" });
  await submitButton(page).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("complete the verification");
  expect((await state(request)).rows).toHaveLength(0);
  await expect(page.getByLabel("Company name", { exact: true })).toHaveValue("Synthetic Browser Test");
  await control(request, {});
  await submitButton(page).click();
  await success(page);
});

for (const answers of [
  { businessSize: "1 to 9 people", englishShare: "100%", books: false },
  { businessSize: "200 or more", englishShare: "Less than 80%", books: false },
  { businessSize: "10 - 19", englishShare: "80% - 90%", books: true },
]) {
  test(`calendar qualification: ${answers.businessSize}, ${answers.englishShare}`, async ({ page, request }) => {
    await control(request, { calendar: true });
    const calRequests = await calendar(page);
    await open(page);
    await fill(page);
    await page.getByLabel("Years of Operation", { exact: true }).selectOption("Under 2 Years");
    await page.getByLabel("Number of people who work in the business", { exact: true }).selectOption(answers.businessSize);
    await page.getByLabel("Share of internal communications in english", { exact: true }).selectOption(answers.englishShare);
    expect(calRequests()).toBe(0);
    await submitButton(page).click();
    if (answers.books) {
      await expect(page.getByRole("heading", { name: "Let’s talk about your data." })).toBeVisible();
      await expect(page.frameLocator("iframe.cal-embed").getByRole("heading", { name: "Available test times" })).toBeVisible();
      const iframeUrl = new URL((await page.locator("iframe.cal-embed").getAttribute("src"))!);
      expect(iframeUrl.origin).toBe("https://replaydata.cal.com");
      expect(iframeUrl.pathname).toBe("/sales/browser-test/embed");
      expect(iframeUrl.searchParams.get("email")).toBe("browser-test@example.com");
      await expect(page.getByRole("link", { name: "Open calendar in a new tab" })).toHaveAttribute("href", "https://replaydata.cal.com/sales/browser-test?email=browser-test%40example.com");
      expect(await page.evaluate(key => sessionStorage.getItem(key), pendingKey)).toBeNull();
    } else {
      await success(page);
      expect(calRequests()).toBe(0);
      await expect(page.locator("iframe.cal-embed")).toHaveCount(0);
    }
    await control(request, { drain: true });
    const saved = await state(request);
    expect(saved.entries).toHaveLength(1);
    expect(saved.entries[0].entry_values).toMatchObject({
      replay_company_name: "Synthetic Browser Test", replay_work_email: "browser-test@example.com",
      replay_years_of_operation: "Under 2 Years", replay_business_size: answers.businessSize, replay_english_share: answers.englishShare,
    });
  });
}

test("a blocked calendar preserves the accepted lead and offers a direct booking link", async ({ page, request }) => {
  await control(request, { calendar: true });
  await calendar(page, true);
  await open(page);
  await fill(page);
  await submitButton(page).click();
  await expect(page.getByRole("heading", { name: "Let’s talk about your data." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open calendar in a new tab" })).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: "Calendar taking a while?" })).toBeVisible({ timeout: 20_000 });
  await control(request, { drain: true });
  const saved = await state(request);
  expect(saved.rows[0].status).toBe("delivered");
  expect(saved.entries).toHaveLength(1);
});
