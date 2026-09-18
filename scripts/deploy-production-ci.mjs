import { spawnSync } from "node:child_process";
import { appendFile, readFile } from "node:fs/promises";
import { cloudflareClient } from "./cloudflare-client.mjs";
import { runProductionRelease, validateProductionRelease } from "./production-release.mjs";

const site = JSON.parse(await readFile("workers/site/wrangler.production.json", "utf8"));
const delivery = JSON.parse(await readFile("workers/lead-delivery/wrangler.json", "utf8"));
validateProductionRelease(site, delivery, process.env);
const versions = await runProductionRelease({
  site, delivery, context: process.env, cf: cloudflareClient(),
  run(script, args = []) {
    const result = spawnSync(process.execPath, [script, ...args], {
      env: { ...process.env, SITE_ENV: "production", NEXT_PUBLIC_SITE_URL: site.vars.SITE_ORIGIN,
        CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: "false", WRANGLER_SEND_METRICS: "false" },
      stdio: ["ignore", "inherit", "inherit"],
    });
    if (result.status !== 0) throw new Error(`Production step failed: ${script}`);
  },
});
const summary = `Deployed commit \`${process.env.GITHUB_SHA}\` to https://www.replay.ai.\n\n` +
  Object.entries(versions).map(([worker, version]) => `- ${worker}: \`${version}\``).join("\n") + "\n\nProduction health and routing verification passed.\n";
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
console.log(summary);
