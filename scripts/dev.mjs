import { spawn, spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";

try { loadEnvFile(".env"); } catch (error) { if (error.code !== "ENOENT") throw error; }
const workersOnly = process.argv.includes("--workers-only");
const remote = process.argv.includes("--remote");
if (remote && (!process.env.LEADS_REMOTE_DEV_API_ORIGIN || !process.env.TURNSTILE_DEV_SITE_KEY)) throw new Error("Set up and deploy the Cloudflare dev pipeline first.");
const config = JSON.parse(await readFile("workers/lead-delivery/wrangler.json", "utf8"));
const sandbox = config.env.development.vars;
for (const key of ["ATTIO_WORKSPACE_ID", "ATTIO_LIST_ID"]) {
  if (process.env[key] && process.env[key] !== sandbox[key]) throw new Error(`${key} must match the pinned dev configuration.`);
  process.env[key] = sandbox[key];
}
const secret = (name) => `${name}=${JSON.stringify(process.env[name] ?? "")}\n`;
// Wrangler reads only the explicitly prepared secrets for each worker.
await writeFile("workers/lead-delivery/.dev.vars", ["ATTIO_API_KEY", "ATTIO_LIST_ID", "ATTIO_WORKSPACE_ID"].map(secret).join(""), { mode: 0o600 });
await writeFile("workers/lead-intake/.dev.vars", 'TURNSTILE_SECRET_KEY="1x0000000000000000000000000000000AA"\n', { mode: 0o600 });
const env = { ...process.env, CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: "false", WRANGLER_SEND_METRICS: "false" };
// Worker secrets are scoped through .dev.vars rather than process variables.
delete env.ATTIO_API_KEY;
const children = [];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill("SIGTERM");
  process.exitCode = code;
}
function run(bin, args, childEnv = env) {
  const child = spawn(process.execPath, [bin, ...args], { stdio: "inherit", env: childEnv });
  children.push(child);
  child.on("error", () => stop(1));
  child.on("exit", (code) => { if (!stopping) stop(code ?? 1); });
}
if (!remote) {
  const migration = spawnSync(process.execPath, ["node_modules/wrangler/bin/wrangler.js", "d1", "migrations", "apply", "replay-leads-local-ledger", "--local", "-c", "workers/lead-intake/wrangler.json"], { env, stdio: "inherit" });
  if (migration.status !== 0) throw new Error("Local ledger migration failed.");
  run("node_modules/wrangler/bin/wrangler.js", ["dev", "--local", "--ip", "127.0.0.1", "--port", "8787", "-c", "workers/lead-intake/wrangler.json", "-c", "workers/lead-delivery/wrangler.json"]);
}
if (!workersOnly) run("node_modules/next/dist/bin/next", ["dev"], {
  ...env,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: remote ? process.env.TURNSTILE_DEV_SITE_KEY : "1x00000000000000000000AA",
  LEADS_DEV_API_ORIGIN: remote ? process.env.LEADS_REMOTE_DEV_API_ORIGIN : "http://127.0.0.1:8787",
});
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
