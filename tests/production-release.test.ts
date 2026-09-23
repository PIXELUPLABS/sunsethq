import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runProductionRelease, validateProductionRelease } from "../scripts/production-release.mjs";

const site = JSON.parse(readFileSync("workers/site/wrangler.production.json", "utf8"));
const delivery = JSON.parse(readFileSync("workers/lead-delivery/wrangler.json", "utf8"));
const context = { GITHUB_ACTIONS: "true", GITHUB_REF: "refs/heads/main", GITHUB_EVENT_NAME: "push",
  GITHUB_REPOSITORY: "SunsetsHQ/replay-marketing", GITHUB_SHA: "a".repeat(40), CLOUDFLARE_API_TOKEN: "test-token", CAL_COM_API_KEY: "test-cal-key" };

function setup() {
  const commands: { script: string; args: string[] }[] = [];
  const state = { missingSecret: false, dependencyOk: 1, heartbeat: 1000, backlog: 0,
    failMigration: false, failBuild: false, versionTag: context.GITHUB_SHA, waits: 0 };
  const cf = async (path: string) => {
    if (path.endsWith("/secrets")) return state.missingSecret ? [] : [
      { type: "secret_text", name: path.includes("replay-marketing") ? "TURNSTILE_SECRET_KEY" : "ATTIO_API_KEY" },
      { type: "secret_text", name: "CAL_WEBHOOK_SECRET" },
    ];
    if (path.endsWith("/query")) return [{ results: [{ last_reconciled_at: state.heartbeat, dependency_ok: state.dependencyOk, failed_queue_count: state.backlog }] }];
    if (path.endsWith("/deployments")) return { deployments: [{ versions: [{ version_id: "test-version", percentage: 100 }] }] };
    if (path.endsWith("/versions/test-version")) return { annotations: { "workers/tag": state.versionTag } };
    throw new Error(`Unexpected Cloudflare endpoint: ${path}`);
  };
  const run = async (script: string, args: string[] = []) => {
    commands.push({ script, args });
    if (state.failMigration && args[0] === "d1") throw new Error("migration failed");
    if (state.failBuild && script === "scripts/build-production.mjs") throw new Error("build failed");
  };
  return { state, commands, release: () => runProductionRelease({ site, delivery, context, cf, run,
    now: () => 1000, sleep: async () => { state.waits++; } }) };
}

test("production deploy refuses PRs, non-main refs, foreign repositories, missing credentials, and sandbox resources", () => {
  for (const change of [{ GITHUB_ACTIONS: "false" }, { GITHUB_REF: "refs/pull/1/merge" },
    { GITHUB_REF: "refs/heads/staging" }, { GITHUB_EVENT_NAME: "pull_request_target" },
    { GITHUB_REPOSITORY: "other/repository" }, { CLOUDFLARE_API_TOKEN: "" }, { CAL_COM_API_KEY: "" }, { GITHUB_SHA: "main" }]) {
    assert.throws(() => validateProductionRelease(site, delivery, { ...context, ...change }));
  }
  const wrongSite = structuredClone(site);
  wrongSite.d1_databases[0].database_id = delivery.env.development.d1_databases[0].database_id;
  assert.throws(() => validateProductionRelease(wrongSite, delivery, context));
  const wrongDelivery = structuredClone(delivery);
  wrongDelivery.env.production.vars.ATTIO_WORKSPACE_ID = delivery.env.development.vars.ATTIO_WORKSPACE_ID;
  assert.throws(() => validateProductionRelease(site, wrongDelivery, context));
});

test("deployment builds before migrations, then deploys consumer before the website, preserves secrets, and verifies the commit", async () => {
  const s = setup();
  const versions = await s.release();
  assert.deepEqual(s.commands.map(c => [c.script, c.args[0]]), [
    ["scripts/build-production.mjs", undefined],
    ["node_modules/wrangler/bin/wrangler.js", "d1"],
    ["node_modules/wrangler/bin/wrangler.js", "deploy"],
    ["node_modules/wrangler/bin/wrangler.js", "deploy"],
    ["scripts/verify-production.mjs", undefined],
    ["scripts/activate-cal-webhook.mjs", undefined],
  ]);
  assert.ok(s.commands[2].args.includes("workers/lead-delivery/wrangler.json"));
  assert.ok(s.commands[3].args.includes("workers/site/wrangler.production.json"));
  for (const command of s.commands.filter(c => c.args[0] === "deploy")) {
    assert.equal(command.args[command.args.indexOf("--tag") + 1], context.GITHUB_SHA);
  }
  assert.ok(!s.commands.some(c => c.args.includes("secret")));
  assert.deepEqual(versions, { "replay-marketing": "test-version", "replay-leads-delivery": "test-version" });
});

test("missing deployed secrets and failed builds stop before any database or Worker mutation", async () => {
  const missing = setup(); missing.state.missingSecret = true;
  await assert.rejects(missing.release(), /runtime secret/);
  assert.equal(missing.commands.length, 0);
  const build = setup(); build.state.failBuild = true;
  await assert.rejects(build.release(), /build failed/);
  assert.equal(build.commands.length, 1);
});

test("migration failure never deploys either Worker", async () => {
  const s = setup(); s.state.failMigration = true;
  await assert.rejects(s.release(), /migration failed/);
  assert.equal(s.commands.some(c => c.args[0] === "deploy"), false);
});

test("stale recovery, Attio failure, or dead letters prevent website publication", async () => {
  for (const failure of [{ heartbeat: 999 }, { dependencyOk: 0 }, { backlog: 1 }]) {
    const s = setup(); Object.assign(s.state, failure);
    await assert.rejects(s.release(), /website was not published/);
    assert.equal(s.state.waits, 24);
    assert.equal(s.commands.some(c => c.args.includes("workers/site/wrangler.production.json")), false);
  }
});

test("a different active release cannot be reported as a successful deployment of this commit", async () => {
  const s = setup(); s.state.versionTag = "b".repeat(40);
  await assert.rejects(s.release(), /different commit is active/);
});
