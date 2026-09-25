import assert from "node:assert/strict";
import { checkLeadFallback } from "./check-lead-fallback.mjs";

export function validateProductionRelease(site, delivery, context) {
  assert.equal(context.GITHUB_ACTIONS, "true", "This entry point requires GitHub Actions.");
  assert.equal(context.GITHUB_REF, "refs/heads/main", "Only main can deploy production.");
  assert.ok(["push", "workflow_dispatch"].includes(context.GITHUB_EVENT_NAME), "Unsupported deployment event.");
  assert.equal(context.GITHUB_REPOSITORY, "SunsetsHQ/replay-marketing");
  assert.match(context.GITHUB_SHA ?? "", /^[a-f0-9]{40}$/, "Missing release commit.");
  assert.ok(context.CLOUDFLARE_API_TOKEN, "Missing Cloudflare deployment token.");
  assert.equal(site.account_id, "c4f47127b63c426c98541372fa9b8b67");
  assert.equal(delivery.account_id, site.account_id);
  assert.equal(site.name, "replay-marketing");
  assert.equal(site.vars.APP_ENV, "production");
  assert.equal(site.vars.SITE_ORIGIN, "https://www.replay.ai");
  assert.equal(site.vars.ALLOWED_ORIGINS, site.vars.SITE_ORIGIN);
  assert.equal(site.workers_dev, false);
  assert.equal(site.preview_urls, false);
  assert.deepEqual(site.routes, [
    { pattern: "www.replay.ai", custom_domain: true },
    { pattern: "replay.ai/*", zone_id: "6ac82822b4ca9081b0cbb74acd5901d4" },
  ]);
  const consumer = delivery.env.production;
  assert.equal(consumer.name, "replay-leads-delivery");
  assert.equal(consumer.vars.APP_ENV, "production");
  assert.equal(consumer.vars.ATTIO_WORKSPACE_ID, "8f055b0e-1a94-4844-bba0-94600f169f3c");
  assert.equal(consumer.vars.ATTIO_LIST_ID, "349bc21b-299c-46ec-a436-b5c1239ee5ee");
  const ledger = consumer.d1_databases.find(binding => binding.binding === "LEAD_DB");
  assert.equal(ledger.database_id, "98211ded-10c5-4e4c-944d-b51d5fdf0763");
  assert.equal(site.d1_databases.find(binding => binding.binding === "LEAD_DB").database_id, ledger.database_id);
  assert.ok(consumer.triggers.crons.includes("* * * * *"));
  assert.equal(site.queues.producers.find(binding => binding.binding === "LEADS").queue, "replay-leads-prod");
  assert.equal(consumer.queues.consumers[0].queue, "replay-leads-prod");
  assert.equal(consumer.queues.consumers[0].dead_letter_queue, "replay-leads-prod-failed");
  assert.equal(consumer.queues.producers.find(binding => binding.binding === "LEADS").queue, "replay-leads-prod");
  assert.equal(consumer.queues.producers.find(binding => binding.binding === "FAILED_LEADS").queue, "replay-leads-prod-failed");
  checkLeadFallback(site, consumer);
  if (consumer.vars.ATTIO_DATA_DEALS_ENABLED === "true") {
    assert.equal(site.vars.CAL_EVENT_TYPE_ID, "7202505");
    assert.ok(context.CAL_COM_API_KEY, "Missing Cal webhook activation credential.");
  }
  return { consumer, ledger };
}

export async function runProductionRelease({ site, delivery, context, cf, run, now = Date.now,
  sleep = ms => new Promise(resolve => setTimeout(resolve, ms)) }) {
  const { consumer, ledger } = validateProductionRelease(site, delivery, context);
  const account = `accounts/${site.account_id}`;
  // Read names only. Existing encrypted runtime secrets stay in Cloudflare.
  const requiredSecrets = [[site.name, "TURNSTILE_SECRET_KEY"], [consumer.name, "ATTIO_API_KEY"]];
  if (consumer.vars.ATTIO_DATA_DEALS_ENABLED === "true") requiredSecrets.push([site.name, "CAL_WEBHOOK_SECRET"]);
  for (const [worker, secret] of requiredSecrets) {
    const secrets = await cf(`${account}/workers/scripts/${worker}/secrets`);
    assert.ok(secrets.some(binding => binding.type === "secret_text" && binding.name === secret), `${worker}: required runtime secret ${secret} is missing.`);
  }

  await run("scripts/build-production.mjs");
  const wrangler = "node_modules/wrangler/bin/wrangler.js";
  const deliveryConfig = "workers/lead-delivery/wrangler.json";
  await run(wrangler, ["d1", "migrations", "apply", ledger.database_name, "--remote", "-c", deliveryConfig, "--env", "production"]);
  const revision = ["--tag", context.GITHUB_SHA, "--message", `GitHub Actions ${context.GITHUB_SHA}`];
  await run(wrangler, ["deploy", "-c", deliveryConfig, "--env", "production", ...revision]);

  // The scheduled check uses the deployed consumer's Attio secret and pinned
  // workspace/list, so GitHub does not need an additional copy of that secret.
  const startedAt = now();
  let ready = false;
  for (let attempt = 0; attempt < 24; attempt++) {
    const result = await cf(`${account}/d1/database/${ledger.database_id}/query`, "POST", {
      sql: "SELECT last_reconciled_at, dependency_ok, failed_queue_count FROM lead_monitor WHERE environment = 'production'",
    });
    const monitor = result[0]?.results[0];
    if (monitor?.last_reconciled_at >= startedAt && monitor.dependency_ok === 1 && monitor.failed_queue_count === 0) {
      ready = true;
      break;
    }
    await sleep(10_000);
  }
  assert.ok(ready, "Consumer recovery/CRM health did not become ready; website was not published.");
  await run(wrangler, ["deploy", "-c", "workers/site/wrangler.production.json", ...revision]);
  await run("scripts/verify-production.mjs");

  const versions = {};
  for (const worker of [site.name, consumer.name]) {
    const deployments = await cf(`${account}/workers/scripts/${worker}/deployments`);
    const active = deployments.deployments[0]?.versions;
    assert.equal(active?.length, 1, `${worker}: unexpected split deployment.`);
    assert.equal(active[0].percentage, 100);
    const version = await cf(`${account}/workers/scripts/${worker}/versions/${active[0].version_id}`);
    assert.equal(version.annotations?.["workers/tag"], context.GITHUB_SHA, `${worker}: a different commit is active.`);
    versions[worker] = active[0].version_id;
  }
  if (consumer.vars.ATTIO_DATA_DEALS_ENABLED === "true") await run("scripts/activate-cal-webhook.mjs");
  return versions;
}
