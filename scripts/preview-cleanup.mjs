import assert from "node:assert/strict";
import { previewAlias, validatePreviewSite } from "./preview-release.mjs";

const guardTag = "preview-cleanup-guard";
const guardMessage = "Inactive version allowing completed previews to be removed";

export async function listPreviewVersions(cf, site) {
  const result = [];
  const seen = new Set();
  for (let page = 1; ; page++) {
    const batch = await cf(`accounts/${site.account_id}/workers/workers/${site.name}/versions?per_page=100&page=${page}`);
    assert.ok(Array.isArray(batch), "Unexpected Cloudflare version list.");
    for (const version of batch) {
      assert.ok(!seen.has(version.id), "Cloudflare repeated a version-list page.");
      seen.add(version.id);
      result.push(version);
    }
    if (batch.length < 100) return result;
  }
}

export function previewVersionsToRemove(versions, deployments, branch) {
  const alias = previewAlias(branch);
  const protectedIds = new Set(deployments.flatMap(deployment => deployment.versions.map(version => version.version_id)));
  const matching = versions.filter(version => version.annotations?.["workers/alias"] === alias);
  for (const version of matching) {
    assert.match(version.id, /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/);
    assert.equal(version.annotations["workers/message"], `Preview ${branch}`, "Refusing to delete an unmanaged preview version.");
    assert.match(version.annotations["workers/tag"] ?? "", /^[a-f0-9]{40}$/);
    assert.ok(!protectedIds.has(version.id), "Refusing to delete a version referenced by staging deployments.");
  }
  return matching;
}

export async function removePreview(cf, site, branch) {
  validatePreviewSite(site);
  const worker = `accounts/${site.account_id}/workers/scripts/${site.name}`;
  const versionPath = `accounts/${site.account_id}/workers/workers/${site.name}/versions`;
  const before = (await cf(`${worker}/deployments`)).deployments;
  const versions = await listPreviewVersions(cf, site);
  const matching = previewVersionsToRemove(versions, before, branch);
  const latest = versions.reduce((a, b) => !a || b.number > a.number ? b : a, undefined);
  // Cloudflare refuses to delete the newest stored version, even if it is not
  // deployed. Advance that pointer to an inert, unaliased 410 response first.
  if (matching.some(version => version.id === latest?.id)) {
    const body = new FormData();
    body.set("metadata", JSON.stringify({
      main_module: "closed.js", compatibility_date: site.compatibility_date,
      bindings: [], keep_bindings: ["secret_text", "secret_key"],
      annotations: { "workers/tag": guardTag, "workers/message": guardMessage },
    }));
    body.set("closed.js", new Blob([
      'export default {fetch(){return new Response("Preview removed",{status:410,headers:{"Content-Type":"text/plain","Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}})}}',
    ], { type: "application/javascript+module" }), "closed.js");
    await cf(`${worker}/versions`, "POST", body);
  }
  for (const version of matching) {
    await cf(`${versionPath}/${version.id}`, "DELETE");
    console.log(`Removed preview version ${version.id}`);
  }
  const remaining = await listPreviewVersions(cf, site);
  assert.equal(previewVersionsToRemove(remaining, before, branch).length, 0, "Preview versions remain after cleanup.");
  assert.deepEqual((await cf(`${worker}/deployments`)).deployments, before, "Cleanup changed staging deployments.");
  console.log(`Preview removed for ${branch}; active staging deployment unchanged.`);
}
