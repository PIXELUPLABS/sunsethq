import { spawnSync } from "node:child_process";
import { readFile, writeFile, unlink } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import { cloudflareClient } from "./cloudflare-client.mjs";

loadEnvFile(".env.production.local");
const configPath = "workers/site/wrangler.production.json";
const config = JSON.parse(await readFile(configPath, "utf8"));
const delivery = JSON.parse(await readFile("workers/lead-delivery/wrangler.json", "utf8"));
if (!process.env.ATTIO_API_KEY || !process.env.TURNSTILE_SECRET_KEY || !delivery.env.production.vars.ATTIO_LIST_ID) {
  throw new Error("Configure the production Attio workspace/list and secrets before deployment.");
}
if (config.name !== "replay-marketing" || config.vars.SITE_ORIGIN !== "https://www.replay.ai" ||
    config.vars.APP_ENV !== "production" || config.workers_dev !== false || config.preview_urls !== false ||
    config.d1_databases[0]?.database_id === delivery.env.development.d1_databases[0].database_id) {
  throw new Error("Unexpected production configuration.");
}
function run(command, args = [], input) {
  const child = spawnSync(process.execPath, [command, ...args], {
    input, env: { ...process.env, SITE_ENV: "production", CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: "false", WRANGLER_SEND_METRICS: "false" },
    stdio: [input ? "pipe" : "ignore", "inherit", "inherit"],
  });
  if (child.status !== 0) throw new Error(`Production step failed: ${command}`);
}
run("scripts/check-release.mjs");
run("scripts/build-production.mjs");
run("node_modules/tsx/dist/cli.mjs", ["scripts/deploy-leads.mjs", "production"]);

// Verify the deployed consumer's dependencies before the site accepts leads.
const cf = cloudflareClient();
let healthy = false;
const startedAt = Date.now();
for (let attempt = 0; attempt < 24; attempt++) {
  const result = await cf(`accounts/${config.account_id}/d1/database/${config.d1_databases[0].database_id}/query`, "POST", {
    sql: "SELECT last_reconciled_at, dependency_ok, failed_queue_count FROM lead_monitor WHERE environment = 'production'",
  });
  const monitor = result[0].results[0];
  if (monitor?.last_reconciled_at >= startedAt && monitor.dependency_ok === 1 && monitor.failed_queue_count === 0) { healthy = true; break; }
  await new Promise(resolve => setTimeout(resolve, 10_000));
}
if (!healthy) throw new Error("Production recovery/CRM health did not become ready. Website has not been published.");

const scripts = await cf(`accounts/${config.account_id}/workers/scripts`);
if (!scripts.some(script => script.id === config.name)) {
  // First upload stays private until assets and the verification secret exist.
  const bootstrapPath = "workers/site/wrangler.bootstrap.json";
  try {
    await writeFile(bootstrapPath, JSON.stringify({ ...config, routes: [] }, null, 2));
    run("node_modules/wrangler/bin/wrangler.js", ["deploy", "-c", bootstrapPath]);
  } finally { await unlink(bootstrapPath).catch(() => {}); }
}
run("node_modules/wrangler/bin/wrangler.js", ["secret", "bulk", "-c", configPath], JSON.stringify({ TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY }));
run("node_modules/wrangler/bin/wrangler.js", ["deploy", "-c", configPath]);
run("scripts/verify-production.mjs");
console.log("Published https://www.replay.ai. Verify one real browser signup and the native production email monitors.");
