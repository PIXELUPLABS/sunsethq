import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";

try { loadEnvFile(".env"); }
catch (error) { if (error.code !== "ENOENT") throw error; }
const config = JSON.parse(await readFile("workers/site/wrangler.json", "utf8"));
const sitekey = process.env.TURNSTILE_STAGING_SITE_KEY;
if (!sitekey || /^[123]x0+/.test(sitekey)) throw new Error("Run staging:setup first to create the real staging widget.");
const env = {
  ...process.env, SITE_ENV: "staging", CLOUDFLARE_STATIC_EXPORT: "true",
  NEXT_PUBLIC_SITE_URL: config.vars.SITE_ORIGIN, NEXT_PUBLIC_TURNSTILE_SITE_KEY: sitekey,
};
for (const [command, args] of [
  // Branch previews use the reviewed jobs snapshot and need no CRM credentials.
  ...(process.env.CI === "true" ? [] : [["node_modules/tsx/dist/cli.mjs", ["scripts/sync-jobs.mts"]]]),
  ["scripts/prepare-images.mjs", []],
  ["node_modules/next/dist/bin/next", ["build"]],
  ["scripts/check-staging.mjs", []],
]) {
  const result = spawnSync(process.execPath, [command, ...args], { env, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
