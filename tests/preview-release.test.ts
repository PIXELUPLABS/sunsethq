import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { previewAlias, uploadedPreviewVersion, validatePreviewRelease } from "../scripts/preview-release.mjs";

const site = JSON.parse(readFileSync("workers/site/wrangler.json", "utf8"));
const context = {
  GITHUB_ACTIONS: "true", GITHUB_REPOSITORY: "SunsetsHQ/replay-marketing",
  GITHUB_EVENT_NAME: "push", GITHUB_REF_TYPE: "branch", GITHUB_REF_NAME: "feature/test",
  GITHUB_REF: "refs/heads/feature/test", GITHUB_SHA: "a".repeat(40), CLOUDFLARE_API_TOKEN: "test-token",
};

test("only a new upload followed by Wrangler's subdomain reporting error is recoverable", () => {
  const id = "fad8510b-a79b-4ed0-9b1f-13657e1666ff";
  const result = { status: 1, stdout: `Uploaded replay-marketing-staging\nWorker Version ID: ${id}\n`,
    stderr: "A request to the Cloudflare API (/accounts/account/workers/subdomain) failed.\nAuthentication error [code: 10000]" };
  assert.equal(uploadedPreviewVersion(result, []), id);
  assert.equal(uploadedPreviewVersion({ ...result, status: 0, stderr: "" }, []), id);
  assert.throws(() => uploadedPreviewVersion(result, [id]));
  assert.throws(() => uploadedPreviewVersion({ ...result, stdout: "" }, []));
  assert.throws(() => uploadedPreviewVersion({ ...result, status: null }, []));
  assert.throws(() => uploadedPreviewVersion({ ...result, stderr: "Upload failed: asset authorization error" }, []));
  assert.throws(() => uploadedPreviewVersion({ ...result, stderr: result.stderr.replace("subdomain", "scripts") }, []));
});

test("preview aliases are stable, DNS-safe, bounded, and distinguish similar branch names", () => {
  for (const branch of ["Feature/new home", "feature/" + "a".repeat(150), "123", "feature/日本語"]) {
    const alias = previewAlias(branch);
    assert.equal(alias, previewAlias(branch));
    assert.match(alias, /^[a-z][a-z0-9-]*$/);
    assert.ok(`${alias}-${site.name}`.length <= 63);
  }
  assert.notEqual(previewAlias("feature/a"), previewAlias("feature-a"));
  assert.notEqual(previewAlias("feature/A"), previewAlias("feature/a"));
  assert.throws(() => previewAlias("main"));
  assert.throws(() => previewAlias(""));
});

test("preview release rejects main, PR-target events, forks, missing credentials, and production resources", () => {
  assert.equal(validatePreviewRelease(site, context), previewAlias(context.GITHUB_REF_NAME));
  for (const change of [
    { GITHUB_REF_NAME: "main", GITHUB_REF: "refs/heads/main" },
    { GITHUB_EVENT_NAME: "pull_request_target" }, { GITHUB_REF_TYPE: "tag" },
    { GITHUB_REPOSITORY: "someone/fork" }, { GITHUB_ACTIONS: "false" },
    { CLOUDFLARE_API_TOKEN: "" }, { GITHUB_SHA: "branch-name" },
  ]) assert.throws(() => validatePreviewRelease(site, { ...context, ...change }));
  const production = JSON.parse(readFileSync("workers/site/wrangler.production.json", "utf8"));
  assert.throws(() => validatePreviewRelease(production, context));
  for (const change of [
    { d1_databases: production.d1_databases }, { queues: production.queues },
    { routes: production.routes }, { vars: production.vars }, { preview_urls: false },
  ]) assert.throws(() => validatePreviewRelease({ ...site, ...change }, context));
});
