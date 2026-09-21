import assert from "node:assert/strict";
import { previewAlias, validatePreviewSite } from "./preview-release.mjs";

const removedTag = "preview-removed";

function isRemovedVersion(version, branch) {
  return version.annotations?.["workers/alias"] === previewAlias(branch) &&
    version.annotations["workers/tag"] === removedTag &&
    version.annotations["workers/message"] === `Closed preview ${branch}`;
}

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
  const matching = versions.filter(version => version.annotations?.["workers/alias"] === alias && !isRemovedVersion(version, branch));
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
  const branchVersions = versions.filter(version => version.annotations?.["workers/alias"] === previewAlias(branch));
  const latest = branchVersions.reduce((a, b) => !a || b.number > a.number ? b : a, undefined);
  let removedId = latest?.id;
  // Cloudflare refuses to delete the newest stored version, even if it is not
  // deployed, and deletion alone can leave the old alias serving at the edge.
  // Replace this branch's alias with an inert 410 before deleting its builds.
  if (!latest || !isRemovedVersion(latest, branch)) {
    const body = new FormData();
    body.set("metadata", JSON.stringify({
      main_module: "closed.js", compatibility_date: site.compatibility_date,
      bindings: [], keep_bindings: ["secret_text", "secret_key"],
      annotations: { "workers/alias": previewAlias(branch), "workers/tag": removedTag, "workers/message": `Closed preview ${branch}` },
    }));
    body.set("closed.js", new Blob([
      'export default {fetch(){return new Response("Preview removed",{status:410,headers:{"Content-Type":"text/plain","Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}})}}',
    ], { type: "application/javascript+module" }), "closed.js");
    const uploaded = await cf(`${worker}/versions`, "POST", body);
    assert.ok(uploaded.id, "Cloudflare did not create the removed-preview response.");
    const removed = await cf(`${versionPath}/${uploaded.id}`);
    assert.ok(isRemovedVersion(removed, branch), "Cloudflare did not retire the branch alias.");
    removedId = uploaded.id;
  }
  const oldRemoved = branchVersions.filter(version => isRemovedVersion(version, branch) && version.id !== removedId);
  const protectedIds = new Set(before.flatMap(deployment => deployment.versions.map(version => version.version_id)));
  for (const version of [...matching, ...oldRemoved]) {
    assert.match(version.id, /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/);
    assert.ok(!protectedIds.has(version.id), "Refusing to delete a deployed removed-preview response.");
    await cf(`${versionPath}/${version.id}`, "DELETE");
    console.log(`Removed preview version ${version.id}`);
  }
  const remaining = await listPreviewVersions(cf, site);
  assert.equal(previewVersionsToRemove(remaining, before, branch).length, 0, "Preview versions remain after cleanup.");
  assert.ok(remaining.some(version => isRemovedVersion(version, branch)), "Missing removed-preview response.");
  assert.deepEqual((await cf(`${worker}/deployments`)).deployments, before, "Cleanup changed staging deployments.");
  console.log(`Preview removed for ${branch}; active staging deployment unchanged.`);
}
