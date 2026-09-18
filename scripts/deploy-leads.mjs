import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import { checkLeadFallback } from "./check-lead-fallback.mjs";

const target = process.argv[2];
if (!["development", "production"].includes(target)) throw new Error("Choose development or production.");
loadEnvFile(target === "production" ? ".env.production.local" : ".env");
const intakePath = target === "production" ? "workers/site/wrangler.production.json" : "workers/lead-intake/wrangler.json";
const deliveryPath = "workers/lead-delivery/wrangler.json";
const intake = JSON.parse(await readFile(intakePath, "utf8"));
const delivery = JSON.parse(await readFile(deliveryPath, "utf8"));
const intakeEnv = target === "production" ? intake : intake.env[target];
const deliveryEnv = delivery.env[target];
checkLeadFallback(intakeEnv, deliveryEnv);
const key = process.env.ATTIO_API_KEY;
const turnstile = target === "production" ? process.env.TURNSTILE_SECRET_KEY : process.env.TURNSTILE_DEV_SECRET_KEY;
if (!key || !turnstile || /^[123]x0+/.test(turnstile)) throw new Error("A CRM token and real Turnstile secret are required before deployment.");
if (!intakeEnv.vars.SITE_ORIGIN || !intakeEnv.vars.ALLOWED_ORIGINS || !deliveryEnv.vars.ATTIO_WORKSPACE_ID || !deliveryEnv.vars.ATTIO_LIST_ID) throw new Error("Complete the selected environment's Wrangler variables before deployment.");
const ledger = deliveryEnv.d1_databases?.find(binding => binding.binding === "LEAD_DB");
if (!ledger?.database_id || intakeEnv.d1_databases?.find(binding => binding.binding === "LEAD_DB")?.database_id !== ledger.database_id ||
    !deliveryEnv.triggers?.crons?.length || !deliveryEnv.queues.producers?.some(binding => binding.binding === "LEADS") ||
    !deliveryEnv.queues.producers?.some(binding => binding.binding === "FAILED_LEADS")) throw new Error("Configure the durable ledger, recovery schedule, and monitoring queue bindings first.");
if (target === "production") {
  if (deliveryEnv.vars.ATTIO_WORKSPACE_ID === delivery.env.development.vars.ATTIO_WORKSPACE_ID) throw new Error("Production cannot use the sandbox workspace.");
  if (ledger.database_id === delivery.env.development.d1_databases[0].database_id) throw new Error("Production cannot use the sandbox ledger.");
  const origins = intakeEnv.vars.ALLOWED_ORIGINS.split(",");
  if (origins.some((origin) => !origin.startsWith("https://") || /localhost|127\.0\.0\.1/.test(origin))) throw new Error("Production requires HTTPS origins.");
  if (intakeEnv.vars.APP_ENV !== "production" || intakeEnv.vars.SITE_ORIGIN !== "https://www.replay.ai" ||
      intakeEnv.workers_dev !== false || intakeEnv.preview_urls !== false ||
      intakeEnv.routes?.length !== 2 || intakeEnv.routes[0].pattern !== "www.replay.ai" || !intakeEnv.routes[0].custom_domain ||
      intakeEnv.routes[1].pattern !== "replay.ai/*" || intakeEnv.routes[1].zone_id !== "6ac82822b4ca9081b0cbb74acd5901d4" ||
      intakeEnv.queues.producers[0]?.queue !== "replay-leads-prod" ||
      deliveryEnv.queues.consumers[0]?.queue !== "replay-leads-prod" ||
      deliveryEnv.queues.consumers[0]?.dead_letter_queue !== "replay-leads-prod-failed") throw new Error("Production site/queue isolation is incomplete.");
}
async function attio(path) {
  const response = await fetch(`https://api.attio.com/v2/${path}`, { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Attio preflight failed (${response.status}).`);
  return response.json();
}
const identity = await attio("self");
if (identity.workspace_id !== deliveryEnv.vars.ATTIO_WORKSPACE_ID) throw new Error("Token does not match the selected Attio workspace.");
const list = (await attio(`lists/${deliveryEnv.vars.ATTIO_LIST_ID}`)).data;
if (!list.parent_object.includes("people")) throw new Error("This integration requires a People list.");
const attributes = (await attio(`lists/${deliveryEnv.vars.ATTIO_LIST_ID}/attributes`)).data;
const schema = await import("../modules/lead-capture/lib/attio-schema.ts");
for (const field of schema.ATTIO_FIELDS) {
  const attribute = attributes.find((item) => item.api_slug === field.slug);
  if (!attribute || attribute.type !== field.type || (field.unique && !attribute.is_unique)) throw new Error(`Attio field missing/incompatible: ${field.slug}`);
}
console.log(`Preflight passed: ${target} → ${identity.workspace_name} / ${list.name}`);
function wrangler(args, input) {
  const child = spawnSync(process.execPath, ["node_modules/wrangler/bin/wrangler.js", ...args], {
    input, encoding: "utf8", env: { ...process.env, CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: "false", WRANGLER_SEND_METRICS: "false" },
    stdio: [input ? "pipe" : "ignore", "pipe", "pipe"],
  });
  if (child.status !== 0) { process.stderr.write(child.stderr || child.stdout); throw new Error("Wrangler command failed."); }
  process.stdout.write(child.stdout);
  return child.stdout;
}
// Upload code first. Both workers fail closed until their scoped secrets exist.
wrangler(["d1", "migrations", "apply", ledger.database_name, "--remote", "-c", deliveryPath, "--env", target]);
wrangler(["deploy", "-c", deliveryPath, "--env", target]);
wrangler(["secret", "bulk", "-c", deliveryPath, "--env", target], JSON.stringify({ ATTIO_API_KEY: key }));
if (target === "development") {
  const output = wrangler(["deploy", "-c", intakePath, "--env", target]);
  wrangler(["secret", "bulk", "-c", intakePath, "--env", target], JSON.stringify({ TURNSTILE_SECRET_KEY: turnstile }));
  const url = output.match(/https:\/\/replay-leads-intake-dev\.[a-z0-9-]+\.workers\.dev/)?.[0];
  if (url) {
    let env = await readFile(".env", "utf8");
    const line = `LEADS_REMOTE_DEV_API_ORIGIN=${url}`;
    env = /^LEADS_REMOTE_DEV_API_ORIGIN=.*$/m.test(env) ? env.replace(/^LEADS_REMOTE_DEV_API_ORIGIN=.*$/m, line) : env.trimEnd() + "\n" + line + "\n";
    await writeFile(".env", env, { mode: 0o600 });
  }
}
if (target === "production") console.log("Private production delivery Worker deployed. Publish the website with production:deploy.");
