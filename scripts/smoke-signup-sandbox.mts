import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { resolve, basename } from "node:path";
import { attioClient } from "../modules/lead-capture/lib/attio-client";
import { cloudflareClient } from "./cloudflare-client.mjs";

// Explicit opt-in, never run in ordinary CI. Read only the sandbox .env file.
// This uses the deployed, reviewed fallback and sends one real operator alert.
const filename = resolve(process.argv[2] ?? ".env");
assert.equal(basename(filename), ".env", "Only the sandbox .env file is permitted");
const secrets = parseEnv(readFileSync(filename, "utf8"));
const config = JSON.parse(readFileSync("workers/lead-delivery/wrangler.json", "utf8"));
const sandbox = config.env.development;
const intake = JSON.parse(readFileSync("workers/lead-intake/wrangler.json", "utf8")).env.development;
const endpoint = "https://replay-leads-intake-dev.replay-marketing-dev.workers.dev/api/leads";
assert.ok(secrets.ATTIO_API_KEY, "Sandbox ATTIO_API_KEY is required");
const attio = attioClient(secrets.ATTIO_API_KEY);
assert.equal((await attio<{ workspace_id: string }>("self")).workspace_id, sandbox.vars.ATTIO_WORKSPACE_ID);
const cf = cloudflareClient();
const submissionId = process.argv[3] ?? crypto.randomUUID();
assert.match(submissionId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
console.log(`Hosted sandbox smoke receipt: ${submissionId}`);
const payload = {
  submissionId, companyName: `Synthetic Signup CI Smoke ${submissionId.slice(0, 8)}`,
  workEmail: `signup-ci-${submissionId.slice(0, 8)}@example.com`, yearsOfOperation: "3 to 5 years",
  businessSize: "20 - 49", englishShare: "100%", campaign: { utm_source: "signup-browser-ci-smoke" },
  turnstileToken: "", verificationFallback: "script_unavailable",
};
async function submit() {
  const response = await fetch(endpoint, { method: "POST", headers: { Origin: intake.vars.SITE_ORIGIN, "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(20_000) });
  assert.equal(response.status, 202, `Hosted intake returned ${response.status}; resume using the printed receipt ID`);
  assert.deepEqual(await response.json(), { accepted: true, submissionId, verification: "unverified" });
}
await submit();
const queryPath = `accounts/${config.account_id}/d1/database/${sandbox.d1_databases[0].database_id}/query`;
let entryId: string | undefined;
for (let attempt = 0; attempt < 30; attempt++) {
  const result = await cf(queryPath, "POST", { sql: "SELECT status, attio_entry_id, unverified_notified_at FROM lead_submissions WHERE submission_id = ? AND environment = 'development'", params: [submissionId] });
  const row = result[0]?.results[0];
  if (row?.status === "delivered" && row.unverified_notified_at) { entryId = row.attio_entry_id; break; }
  await new Promise(resolve => setTimeout(resolve, 2000));
}
assert.ok(entryId, "Hosted receipt has not delivered; resume with the same ID");
await submit();
await new Promise(resolve => setTimeout(resolve, 4000));
const entries = await attio<{ data: { id: { entry_id: string }; entry_values: Record<string, { value: string }[]> }[] }>(`lists/${sandbox.vars.ATTIO_LIST_ID}/entries/query`, "POST", { filter: { replay_submission_id: { $eq: submissionId } }, limit: 10 });
assert.equal(entries.data.length, 1, "Submission ID must resolve to exactly one sandbox list entry");
assert.equal(entries.data[0].id.entry_id, entryId);
for (const [key, value] of Object.entries({ replay_company_name: payload.companyName, replay_work_email: payload.workEmail, replay_years_of_operation: payload.yearsOfOperation, replay_business_size: payload.businessSize, replay_english_share: payload.englishShare, replay_campaign: JSON.stringify(payload.campaign), replay_environment: "development" })) {
  assert.equal(entries.data[0].entry_values[key]?.[0]?.value, value, `${key} must survive delivery`);
}
console.log(`PASS hosted Cloudflare intake → D1 → Queue → sandbox Attio; duplicate replay resolves to exactly one entry ${entryId}. Real fallback/operator notification; no browser or real Turnstile challenge in this smoke.`);
