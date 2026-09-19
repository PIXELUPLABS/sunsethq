import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import { setTimeout } from "node:timers/promises";
import { attioClient } from "../modules/lead-capture/lib/attio-client";

loadEnvFile(".env");
const config = JSON.parse(await readFile("workers/lead-delivery/wrangler.json", "utf8"));
const sandbox = config.env.development.vars;
const attio = attioClient(process.env.ATTIO_API_KEY ?? "");
const identity = await attio<{ workspace_id: string }>("self");
assert.equal(identity.workspace_id, sandbox.ATTIO_WORKSPACE_ID, "Smoke tests require the pinned Attio sandbox.");
const submissionId = crypto.randomUUID();
const submission = {
  submissionId, companyName: `Replay smoke test ${submissionId.slice(0, 8)}`,
  workEmail: "replay-smoke-test@example.com", yearsOfOperation: "3 to 5 years",
  businessSize: "20 - 49", englishShare: "100%", campaign: { utm_source: "smoke-test" },
  turnstileToken: "XXXX.DUMMY.TOKEN.XXXX",
};
const find = () => attio<{ data: { id: { entry_id: string }; entry_values: Record<string, { value: string }[]> }[] }>(
  `lists/${sandbox.ATTIO_LIST_ID}/entries/query`, "POST", {
    filter: { replay_submission_id: { $eq: submissionId } }, limit: 10,
  },
);
async function submit() {
  // Deliberately fixed to local Workers. Never send a bypass token to a hosted API.
  const response = await fetch("http://127.0.0.1:8787/api/leads", {
    method: "POST", headers: { Origin: "http://localhost:3000", "Content-Type": "application/json" },
    body: JSON.stringify(submission), signal: AbortSignal.timeout(15_000),
  });
  assert.equal(response.status, 202, `Local intake failed (${response.status}). Start npm run dev or dev:leads first.`);
  assert.equal((await response.json()).accepted, true);
}
await submit();
let entry;
for (let attempt = 0; attempt < 20; attempt++) {
  const result = await find();
  if (result.data.length) { assert.equal(result.data.length, 1); entry = result.data[0]; break; }
  await setTimeout(1500);
}
assert.ok(entry, "The accepted inquiry did not reach Attio within 30 seconds. Check the delivery Worker logs.");
for (const [field, value] of Object.entries({
  replay_company_name: submission.companyName, replay_work_email: submission.workEmail,
  replay_years_of_operation: submission.yearsOfOperation, replay_business_size: submission.businessSize,
  replay_english_share: submission.englishShare, replay_environment: "local",
  replay_source_url: "http://localhost:3000/value-my-data", replay_campaign: JSON.stringify(submission.campaign),
})) assert.equal(entry.entry_values[field]?.[0]?.value, value, `${field} was not preserved.`);
await submit();
await setTimeout(4000);
const duplicate = await find();
assert.equal(duplicate.data.length, 1, "A duplicate submission created multiple inquiries.");
assert.equal(duplicate.data[0].id.entry_id, entry.id.entry_id);
console.log(`PASS: local intake → queue → Attio; fields preserved; repeated submission has one entry. Submission ${submissionId}; entry ${entry.id.entry_id}.`);
