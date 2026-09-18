import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import { cloudflareClient } from "./cloudflare-client.mjs";
import { checkStagingGate } from "./staging-gate.mjs";
import { checkLeadFallback } from "./check-lead-fallback.mjs";

loadEnvFile(".env");
const configPath = "workers/site/wrangler.json";
const config = JSON.parse(await readFile(configPath, "utf8"));
const delivery = JSON.parse(await readFile("workers/lead-delivery/wrangler.json", "utf8")).env.development;
checkLeadFallback(config, delivery);
const secret = process.env.TURNSTILE_STAGING_SECRET_KEY;
if (!secret || /^[123]x0+/.test(secret)) throw new Error("A real staging Turnstile secret is required.");
if (config.name !== "replay-marketing-staging" || config.vars.APP_ENV !== "development" || config.preview_urls !== false ||
    config.queues.producers[0]?.queue !== "replay-leads-dev") throw new Error("Staging configuration must stay isolated from production.");

// Refuse routine deployment if someone has removed/replaced the live gate.
// Initial provisioning is documented separately; there is no bypass flag.
await checkStagingGate(config.vars.SITE_ORIGIN);
const cf = cloudflareClient();
const settings = await cf(`accounts/${config.account_id}/workers/scripts/${delivery.name}/settings`);
for (const key of ["APP_ENV", "ATTIO_WORKSPACE_ID", "ATTIO_LIST_ID"]) {
  if (!settings.bindings.some(binding => binding.name === key && binding.text === delivery.vars[key])) {
    throw new Error(`Deployed consumer does not match the dev configuration: ${key}`);
  }
}
if (!settings.bindings.some(binding => binding.name === "ATTIO_API_KEY" && binding.type === "secret_text")) throw new Error("Deployed consumer has no Attio secret.");
if (!settings.bindings.some(binding => binding.name === "LEAD_DB" && binding.id === config.d1_databases[0].database_id)) throw new Error("Deployed consumer does not use the staging ledger.");
if (config.vars.UNVERIFIED_LEADS_ENABLED === "true" && !settings.bindings.some(binding => binding.name === "LEAD_ALERT_EMAIL" && binding.type === "send_email")) {
  throw new Error("Deploy the consumer with unverified email alerts before publishing the form fallback.");
}

function run(script, args = [], input) {
  const child = spawnSync(process.execPath, [script, ...args], {
    input, env: { ...process.env, CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: "false", WRANGLER_SEND_METRICS: "false" },
    stdio: [input ? "pipe" : "ignore", "inherit", "inherit"],
  });
  if (child.status !== 0) throw new Error(`Deployment step failed: ${script}`);
}
run("scripts/check-release.mjs");
run("scripts/build-staging.mjs");
run("node_modules/wrangler/bin/wrangler.js", ["secret", "bulk", "-c", configPath], JSON.stringify({ TURNSTILE_SECRET_KEY: secret }));
run("node_modules/wrangler/bin/wrangler.js", ["deploy", "-c", configPath]);
try {
  await checkStagingGate(config.vars.SITE_ORIGIN);
} catch (error) {
  // If the gate fails, stop serving this staging Worker, including previews.
  await cf(`accounts/${config.account_id}/workers/scripts/${config.name}/subdomain`, "POST", { enabled: false, previews_enabled: false });
  throw error;
}
console.log(`Staging deployed: ${config.vars.SITE_ORIGIN}`);
