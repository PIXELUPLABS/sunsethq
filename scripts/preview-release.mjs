import assert from "node:assert/strict";
import { createHash } from "node:crypto";

export function previewAlias(branch) {
  assert.ok(branch && branch !== "main", "Previews require a non-production branch.");
  const slug = branch.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 24);
  return `b-${slug}-${createHash("sha256").update(branch).digest("hex").slice(0, 8)}`;
}

export function uploadedPreviewVersion(result, existingVersionIds) {
  const versionId = result.stdout?.match(/^Worker Version ID: ([a-f0-9-]{36})\s*$/m)?.[1];
  assert.ok(versionId && !existingVersionIds.includes(versionId), "Wrangler did not report a new uploaded version.");
  if (result.status !== 0) {
    // Wrangler 4.135 uploads successfully with a per-Worker token, then attempts
    // an account-wide lookup just to print the workers.dev URL. Recover only
    // that specific reporting failure; callers still verify this version via API.
    assert.equal(result.status, 1, "Preview upload failed.");
    assert.match(result.stderr ?? "", /\/workers\/subdomain\) failed/);
    assert.match(result.stderr ?? "", /Authentication error \[code: 10000\]/);
    console.log("Wrangler could not print the account subdomain; verifying the uploaded version directly.");
  }
  return versionId;
}

export function validatePreviewRelease(site, context) {
  assert.equal(context.GITHUB_ACTIONS, "true", "Use the preview GitHub Actions workflow.");
  assert.equal(context.GITHUB_REPOSITORY, "SunsetsHQ/replay-marketing");
  assert.ok(["push", "workflow_dispatch"].includes(context.GITHUB_EVENT_NAME));
  assert.equal(context.GITHUB_REF_TYPE, "branch");
  assert.equal(context.GITHUB_REF, `refs/heads/${context.GITHUB_REF_NAME}`);
  assert.match(context.GITHUB_SHA ?? "", /^[a-f0-9]{40}$/);
  assert.ok(context.CLOUDFLARE_API_TOKEN, "Missing preview environment deployment token.");
  assert.equal(site.account_id, "c4f47127b63c426c98541372fa9b8b67");
  assert.equal(site.name, "replay-marketing-staging");
  assert.equal(site.vars.APP_ENV, "development");
  assert.equal(site.vars.SITE_ORIGIN, "https://replay-marketing-staging.replay-marketing-dev.workers.dev");
  assert.equal(site.vars.ALLOWED_ORIGINS, site.vars.SITE_ORIGIN);
  assert.equal(site.preview_urls, true);
  assert.equal(site.workers_dev, true);
  assert.ok(!site.routes?.length && !site.route, "Previews cannot attach production routes.");
  assert.deepEqual(site.queues.producers, [{ binding: "LEADS", queue: "replay-leads-dev" }]);
  assert.equal(site.d1_databases.length, 1);
  assert.equal(site.d1_databases[0].binding, "LEAD_DB");
  assert.equal(site.d1_databases[0].database_id, "ac3c1faa-c94f-4269-9a0a-ff69b5ac5a41");
  assert.ok(!site.services?.length && !site.dispatch_namespaces?.length);
  return previewAlias(context.GITHUB_REF_NAME);
}
