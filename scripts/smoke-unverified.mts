import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import { cloudflareClient } from "./cloudflare-client.mjs";
import { attioClient } from "../modules/lead-capture/lib/attio-client";

// Creates one clearly marked synthetic inquiry and sends one real alert to the
// configured operator. Retries reuse its ID; no customer address receives mail.
const target = process.argv[2] ?? "development";
assert.ok(["development", "production"].includes(target), "Choose development or production");
loadEnvFile(target === "production" ? ".env.production.local" : ".env");
const delivery = JSON.parse(await readFile("workers/lead-delivery/wrangler.json", "utf8"));
const selected = delivery.env[target];
const site = JSON.parse(await readFile(target === "production" ? "workers/site/wrangler.production.json" : "workers/lead-intake/wrangler.json", "utf8"));
const intake = target === "production" ? site : site.env.development;
const origin = intake.vars.SITE_ORIGIN;
const endpoint = target === "production" ? origin : process.env.LEADS_REMOTE_DEV_API_ORIGIN;
assert.ok(endpoint && selected.vars.LEAD_ALERT_TO, "Deployed intake and email destination required");
const attio = attioClient(process.env.ATTIO_API_KEY ?? "");
const identity = await attio<{ workspace_id: string }>("self");
assert.equal(identity.workspace_id, selected.vars.ATTIO_WORKSPACE_ID);
const submissionId = process.argv[3] ?? crypto.randomUUID();
assert.match(submissionId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
console.log(`Synthetic receipt: ${submissionId}. Pass it as the third argument to resume without another inquiry.`);
const body = {
  submissionId, companyName: `Synthetic Unverified Release Check ${target}`,
  workEmail: `replay-unverified-${submissionId.slice(0, 8)}@example.com`,
  yearsOfOperation: "3 to 5 years", businessSize: "20 - 49", englishShare: "100%",
  turnstileToken: "", verificationFallback: "script_unavailable", landingPath: "/data-and-trust",
  campaign: { utm_source: "release-check", utm_campaign: "unverified" },
};
const submit = () => fetch(`${endpoint}/api/leads`, {
  method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(20_000),
});
for (let attempt = 0; attempt < 2; attempt++) {
  const response = await submit();
  assert.equal(response.status, 202, `Synthetic request failed: ${response.status}`);
  const receipt = await response.json() as { accepted: boolean; verification: string; submissionId: string };
  assert.deepEqual(receipt, { accepted: true, verification: "unverified", submissionId });
}
// Cloudflare counters are eventually consistent. Reuse this receipt while
// checking enforcement; do not assume an exact synchronous third-request cap.
let throttled: Response | undefined;
for (let attempt = 0; attempt < 8; attempt++) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  throttled = await submit();
  if (throttled.status === 429) break;
  assert.equal(throttled.status, 202);
}
assert.equal(throttled?.status, 429, "Rate limiting was not observed during the bounded retry test");
assert.ok(throttled);
assert.equal(throttled.headers.get("Retry-After"), "60");
console.log(`Accepted and deduplicated synthetic ${target} inquiry ${submissionId}; tighter rate limit verified.`);
const cf = cloudflareClient();
const path = `accounts/${delivery.account_id}/d1/database/${selected.d1_databases[0].database_id}/query`;
let delivered = false;
for (let attempt = 0; attempt < 20; attempt++) {
  const result = await cf(path, "POST", { sql: "SELECT status, attio_entry_id, unverified_notified_at FROM lead_submissions WHERE submission_id = ?", params: [submissionId] });
  const row = result[0].results[0];
  if (row?.status === "delivered" && row.unverified_notified_at && row.attio_entry_id) { delivered = true; console.log(`Delivered to Attio entry ${row.attio_entry_id}; alert accepted by email service.`); break; }
  await new Promise(resolve => setTimeout(resolve, 1500));
}
assert.ok(delivered, `Still pending: inspect receipt ${submissionId}; do not create another inquiry to retry it.`);
const entries = await attio<{ data: { entry_values: Record<string, { value: string }[]> }[] }>(`lists/${selected.vars.ATTIO_LIST_ID}/entries/query`, "POST", {
  filter: { replay_submission_id: { $eq: submissionId } }, limit: 10,
});
assert.equal(entries.data.length, 1);
const values = entries.data[0].entry_values;
assert.equal(values.replay_verification_status?.[0]?.value, "Unverified");
assert.equal(values.replay_verification_reason?.[0]?.value, "script_unavailable");
assert.deepEqual(JSON.parse(values.replay_campaign[0].value), { ...body.campaign, landing_page: `${origin}/data-and-trust` });
console.log("PASS: unverified label, original attribution, one CRM inquiry, durable alert receipt, and rate limiting. Check the operator mailbox for final email delivery.");
