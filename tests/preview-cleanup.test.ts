import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { listPreviewVersions, previewVersionsToRemove, removePreview } from "../scripts/preview-cleanup.mjs";
import { previewDisposition } from "../scripts/preview-lifecycle.mjs";
import { previewAlias, previewTarget, validatePreviewRelease } from "../scripts/preview-release.mjs";

const site = JSON.parse(readFileSync("workers/site/wrangler.json", "utf8"));
const repository = "SunsetsHQ/replay-marketing";
const branch = "codex/cleanup-test";
const sha = "a".repeat(40);
const id = (n: number) => `00000000-0000-4000-8000-${n.toString().padStart(12, "0")}`;
const version = (n: number, ref = branch) => ({
  id: id(n), number: n, annotations: {
    "workers/alias": previewAlias(ref), "workers/message": `Preview ${ref}`, "workers/tag": sha,
  },
});
const pull = (state: string, repo = repository, ref = branch) => ({ state, head: { repo: { full_name: repo }, ref } });

test("closed and merged branches clean up, while open, shared, and reopened PRs retain previews", () => {
  assert.equal(previewDisposition([], branch, repository, undefined), "deploy");
  assert.equal(previewDisposition([pull("closed")], branch, repository, "closed"), "cleanup");
  assert.equal(previewDisposition([pull("closed")], branch, repository, undefined), "cleanup");
  assert.equal(previewDisposition([pull("open")], branch, repository, "reopened"), "deploy");
  assert.equal(previewDisposition([pull("closed"), pull("open")], branch, repository, "closed"), "keep");
  assert.equal(previewDisposition([pull("closed", "someone/fork"), pull("closed", repository, "other")], branch, repository, undefined), "deploy");
});

test("PR cleanup uses the head branch and commit even when GitHub's ref points to main", () => {
  const context = { GITHUB_ACTIONS: "true", GITHUB_REPOSITORY: repository, GITHUB_EVENT_NAME: "pull_request", GITHUB_REF: "refs/heads/main", CLOUDFLARE_API_TOKEN: "test" };
  const event = { action: "closed", pull_request: { head: { ref: branch, sha, repo: { full_name: repository } } } };
  assert.deepEqual(previewTarget(context, event), { branch, sha });
  assert.throws(() => validatePreviewRelease(site, context, event));
  assert.equal(validatePreviewRelease(site, context, { ...event, action: "reopened" }), previewAlias(branch));
  assert.throws(() => previewTarget(context, { ...event, pull_request: { head: { ...event.pull_request.head, ref: "main" } } }));
  assert.throws(() => previewTarget(context, { ...event, pull_request: { head: { ...event.pull_request.head, repo: { full_name: "someone/fork" } } } }));
});

test("cleanup selects every version for exactly one managed branch and rejects deployed or unowned versions", () => {
  const versions = [version(3), version(2, "codex/other"), version(1)];
  assert.deepEqual(previewVersionsToRemove(versions, [], branch).map((v: { id: string }) => v.id), [id(3), id(1)]);
  assert.throws(() => previewVersionsToRemove(versions, [{ versions: [{ version_id: id(1) }] }], branch));
  const unexpected = structuredClone(version(1));
  unexpected.annotations["workers/message"] = "Unrelated deployment";
  assert.throws(() => previewVersionsToRemove([unexpected], [], branch));
  assert.throws(() => previewVersionsToRemove(versions, [], "main"));
});

test("cleanup advances the newest-version pointer, removes branch history, preserves other branches, and is idempotent", async () => {
  let versions: Array<{ id: string; number: number; annotations: Record<string, string> }> = [version(3), version(2, "codex/other"), version(1)];
  const deployments = [{ versions: [{ version_id: id(99) }] }];
  const mutations: string[] = [];
  const cf = async (path: string, method = "GET", body?: FormData) => {
    if (path.endsWith("/deployments")) return { deployments };
    if (method === "POST") {
      assert.ok(body instanceof FormData);
      const metadata = JSON.parse(body.get("metadata") as string);
      assert.equal(metadata.annotations["workers/alias"], undefined);
      assert.ok(metadata.keep_bindings.includes("secret_text"));
      const code = await (body.get("closed.js") as Blob).text();
      assert.ok(code.includes("status:410"));
      mutations.push("guard");
      versions.unshift({ id: id(4), number: 4, annotations: metadata.annotations });
      return { id: id(4) };
    }
    if (method === "DELETE") {
      const deleting = path.split("/").at(-1)!;
      assert.notEqual(deleting, versions[0].id, "Cloudflare cannot delete its newest version");
      assert.ok(path.includes("/workers/workers/replay-marketing-staging/versions/"));
      mutations.push(deleting);
      versions = versions.filter(item => item.id !== deleting);
      return undefined;
    }
    return versions;
  };
  await removePreview(cf, site, branch);
  assert.deepEqual(mutations, ["guard", id(3), id(1)]);
  assert.ok(versions.some(item => item.id === id(2)));
  await removePreview(cf, site, branch);
  assert.equal(mutations.length, 3);
  const production = JSON.parse(readFileSync("workers/site/wrangler.production.json", "utf8"));
  await assert.rejects(removePreview(cf, production, branch));
});

test("cleanup reads all version pages and detects ignored pagination", async () => {
  const first = Array.from({ length: 100 }, (_, n) => version(n + 1));
  const paths: string[] = [];
  const cf = async (path: string) => { paths.push(path); return paths.length === 1 ? first : [version(101)]; };
  assert.equal((await listPreviewVersions(cf, site)).length, 101);
  assert.match(paths[1], /page=2$/);
  await assert.rejects(listPreviewVersions(async () => first, site), /repeated a version-list page/);
});
