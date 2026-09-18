import assert from "node:assert/strict";
import { loadEnvFile } from "node:process";
import type { D1Database } from "@cloudflare/workers-types";
import { persistLead } from "../modules/lead-capture/lib/lead-ledger";
import { attioClient } from "../modules/lead-capture/lib/attio-client";
import { cloudflareClient } from "./cloudflare-client.mjs";

// This fault rehearsal is deliberately pinned to the sandbox, with no prod option.
loadEnvFile(".env");
const request = cloudflareClient();
const endpoint = "accounts/c4f47127b63c426c98541372fa9b8b67/d1/database/ac3c1faa-c94f-4269-9a0a-ff69b5ac5a41/query";
const query = async (sql: string, params: unknown[] = []) => (await request(endpoint, "POST", { sql, params }))[0];
const db = { prepare(sql: string) {
  let params: unknown[] = [];
  const statement = {
    bind(...values: unknown[]) { params = values; return statement; },
    run: () => query(sql, params),
    first: async () => (await query(sql, params)).results[0] ?? null,
  };
  return statement;
} } as unknown as D1Database;
const attio = attioClient(process.env.ATTIO_API_KEY ?? "");
assert.equal((await attio<{ workspace_id: string }>("self")).workspace_id, "cdf46a48-e03e-4b32-84f1-f90d4791539b");
const id = crypto.randomUUID();
const now = Date.now();
await persistLead({ LEAD_DB: db, APP_ENV: "development" }, {
  version: 1, environment: "development", submissionId: id, submittedAt: new Date(now).toISOString(),
  sourceUrl: "https://replay-marketing-staging.replay-marketing-dev.workers.dev/value-my-data",
  lead: { companyName: "Replay Outbox Recovery Rehearsal", workEmail: `outbox-${id}@example.com`, yearsOfOperation: "3 to 5 years", businessSize: "20 - 49", englishShare: "100%" },
  campaign: { utm_source: "outbox-rehearsal" },
}, now - 360_000);
// Simulate an already-stalled record with a lost queue send. Its existing lease
// expires shortly; the deployed schedule, not this script, must dispatch it.
await query("UPDATE lead_submissions SET next_dispatch_at = ? WHERE submission_id = ?", [now + 150_000, id]);
console.log(`Saved synthetic stalled submission ${id}; waiting for native alert and automatic recovery.`);
const health = await fetch("https://replay-leads-intake-dev.replay-marketing-dev.workers.dev/health");
assert.equal(health.status, 503);
let delivered = false;
for (let attempt = 0; attempt < 32; attempt++) {
  await new Promise(resolve => setTimeout(resolve, 15_000));
  const row = (await query("SELECT status, attio_entry_id FROM lead_submissions WHERE submission_id = ?", [id])).results[0];
  if (row.status !== "delivered") continue;
  const entries = await attio<{ data: { id: { entry_id: string }; parent_record_id: string }[] }>("lists/9527649b-a76d-415f-a89f-1fa9b1f6c4ae/entries/query", "POST", { filter: { replay_submission_id: { $eq: id } }, limit: 10 });
  assert.equal(entries.data.length, 1);
  assert.equal(entries.data[0].id.entry_id, row.attio_entry_id);
  console.log(JSON.stringify({ verified: true, submissionId: id, entryId: row.attio_entry_id, personId: entries.data[0].parent_record_id, recoveredWithoutQueueMessage: true }));
  delivered = true;
  break;
}
assert.ok(delivered, "Recovery deadline exceeded; the synthetic pending record remains durable for diagnosis.");
