import { spawnSync } from "node:child_process";
import { cp, readFile, rm } from "node:fs/promises";
import { loadEnvFile } from "node:process";

try { loadEnvFile(".env.production.local"); }
catch (error) { if (error.code !== "ENOENT") throw error; }
const config = JSON.parse(await readFile("workers/site/wrangler.production.json", "utf8"));
const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
if (!sitekey || /^[123]x0+/.test(sitekey)) throw new Error("Run production:setup to create a real production Turnstile widget.");
if (process.env.NEXT_PUBLIC_SITE_URL !== config.vars.SITE_ORIGIN) throw new Error("Production build origin does not match the Worker.");
const env = { ...process.env, SITE_ENV: "production", CLOUDFLARE_STATIC_EXPORT: "true" };
for (const [command, args] of [
  ["node_modules/tsx/dist/cli.mjs", ["scripts/sync-jobs.mts"]],
  ["scripts/prepare-images.mjs", []],
  ["node_modules/next/dist/bin/next", ["build"]],
]) {
  const result = spawnSync(process.execPath, [command, ...args], { env, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
await rm("out-production", { recursive: true, force: true });
await cp("out", "out-production", { recursive: true });
const check = spawnSync(process.execPath, ["scripts/check-staging.mjs"], { env, stdio: "inherit" });
process.exitCode = check.status ?? 1;
