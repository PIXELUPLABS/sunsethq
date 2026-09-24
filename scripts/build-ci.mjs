import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const config = JSON.parse(await readFile("workers/site/wrangler.production.json", "utf8"));
// CI uses the committed jobs snapshot and public test widget. It never runs
// provisioning, deployment, CRM delivery, or a live signup rehearsal.
const env = {
  ...process.env,
  CI: "true",
  NODE_ENV: "production",
  NEXT_TELEMETRY_DISABLED: "1",
  SITE_ENV: "production",
  CLOUDFLARE_STATIC_EXPORT: "true",
  STATIC_EXPORT_DIRECTORY: "out",
  NEXT_PUBLIC_SITE_URL: config.vars.SITE_ORIGIN,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
  // Harmless markers exercise the existing exported-asset secret scan.
  ATTIO_API_KEY: "ci-attio-secret-must-not-be-exported",
  TURNSTILE_SECRET_KEY: "ci-turnstile-secret-must-not-be-exported",
  TURNSTILE_DEV_SECRET_KEY: "ci-dev-secret-must-not-be-exported",
  TURNSTILE_STAGING_SECRET_KEY: "ci-staging-secret-must-not-be-exported",
};
for (const args of [
  ["scripts/prepare-images.mjs"],
  ["node_modules/next/dist/bin/next", "build"],
  ["scripts/check-staging.mjs"],
]) {
  const result = spawnSync(process.execPath, args, { env, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
