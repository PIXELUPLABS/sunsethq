import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { appendFile, readFile } from "node:fs/promises";
import { cloudflareClient } from "./cloudflare-client.mjs";
import { uploadedPreviewVersion, validatePreviewRelease } from "./preview-release.mjs";
import { checkStagingGate } from "./staging-gate.mjs";
import { removePreview } from "./preview-cleanup.mjs";
import { previewRemoved, previewState } from "./preview-lifecycle.mjs";

const configPath = "workers/site/wrangler.json";
const site = JSON.parse(await readFile(configPath, "utf8"));
const cf = cloudflareClient();
const state = await previewState();
if (state.mode === "cleanup") {
  await removePreview(cf, site, state.branch);
  await previewRemoved();
  process.exit(0);
}
assert.equal(state.mode, "deploy");
const alias = validatePreviewRelease(site, process.env, state.event);
const origin = `https://${alias}-${site.name}.replay-marketing-dev.workers.dev`;
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
const previousVersions = await cf(`${worker}/versions`);
const result = spawnSync(process.execPath, [
  "node_modules/wrangler/bin/wrangler.js", "versions", "upload", "-c", configPath,
  "--preview-alias", alias, "--tag", state.sha,
  "--message", `Preview ${state.branch}`,
], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024,
  env: { ...process.env, CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: "false", WRANGLER_SEND_METRICS: "false", NO_COLOR: "1" } });
process.stdout.write(result.stdout ?? "");
process.stderr.write(result.stderr ?? "");
if (result.error) throw result.error;
const versionId = uploadedPreviewVersion(result, previousVersions.items.map(item => item.id));
const version = await cf(`${worker}/versions/${versionId}`);
assert.equal(version.annotations?.["workers/alias"], alias);
assert.equal(version.annotations?.["workers/tag"], state.sha);
const after = await cf(`${worker}/deployments`);
assert.deepEqual(after.deployments, before.deployments, "Uploading a preview must not change the active staging deployment.");
try {
  await checkStagingGate(origin);
  await checkStagingGate(`https://${versionId.slice(0, 8)}-${site.name}.replay-marketing-dev.workers.dev`);
} catch (error) {
  await cf(`${worker}/subdomain`, "POST", { enabled: routing.enabled, previews_enabled: false });
  throw error;
}
// A PR may close while the build/upload is running. Remove that upload rather
// than allowing a queued run to bring a closed preview back to life.
if ((await previewState()).mode === "cleanup") {
  await removePreview(cf, site, state.branch);
  await previewRemoved();
  process.exit(0);
}
if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `url=${origin}\n`);
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY,
  `Preview: [Open site](${origin})\n\nCommit: \`${state.sha}\`\n\nSign in with your @sunsethq.com email. Forms use the development CRM.\n`);
console.log(`Preview ready: ${origin}`);
