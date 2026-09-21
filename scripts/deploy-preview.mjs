import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { appendFile, readFile } from "node:fs/promises";
import { cloudflareClient } from "./cloudflare-client.mjs";
import { validatePreviewRelease } from "./preview-release.mjs";
import { checkStagingGate } from "./staging-gate.mjs";

const configPath = "workers/site/wrangler.json";
const site = JSON.parse(await readFile(configPath, "utf8"));
const alias = validatePreviewRelease(site, process.env);
const origin = `https://${alias}-${site.name}.replay-marketing-dev.workers.dev`;
const cf = cloudflareClient();
const worker = `accounts/${site.account_id}/workers/scripts/${site.name}`;
const routing = await cf(`${worker}/subdomain`);
assert.equal(routing.previews_enabled, true, "Enable gated staging preview URLs before running this workflow.");
await checkStagingGate(site.vars.SITE_ORIGIN);
// The Worker-level Access policy must also intercept unknown preview names.
await checkStagingGate("https://access-check-replay-marketing-staging.replay-marketing-dev.workers.dev");
const settings = await cf(`${worker}/settings`);
assert.ok(settings.bindings.some(binding => binding.name === "TURNSTILE_SECRET_KEY" && binding.type === "secret_text"),
  "The staging verification secret must already exist.");
const before = await cf(`${worker}/deployments`);
const result = spawnSync(process.execPath, [
  "node_modules/wrangler/bin/wrangler.js", "versions", "upload", "-c", configPath,
  "--preview-alias", alias, "--tag", process.env.GITHUB_SHA,
  "--message", `Preview ${process.env.GITHUB_REF_NAME}`,
], { stdio: "inherit", env: { ...process.env, CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: "false", WRANGLER_SEND_METRICS: "false" } });
if (result.status !== 0) throw new Error("Preview upload failed.");
const after = await cf(`${worker}/deployments`);
assert.deepEqual(after.deployments, before.deployments, "Uploading a preview must not change the active staging deployment.");
try {
  await checkStagingGate(origin);
  const versions = await cf(`${worker}/versions`);
  const version = versions.items.find(item => item.annotations?.["workers/alias"] === alias &&
    item.annotations?.["workers/tag"] === process.env.GITHUB_SHA);
  assert.ok(version, "Could not verify the uploaded preview version.");
  await checkStagingGate(`https://${version.id.slice(0, 8)}-${site.name}.replay-marketing-dev.workers.dev`);
} catch (error) {
  await cf(`${worker}/subdomain`, "POST", { enabled: routing.enabled, previews_enabled: false });
  throw error;
}
if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `url=${origin}\n`);
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY,
  `Preview: [Open site](${origin})\n\nCommit: \`${process.env.GITHUB_SHA}\`\n\nSign in with your @sunsethq.com email. Forms use the development CRM.\n`);
console.log(`Preview ready: ${origin}`);
