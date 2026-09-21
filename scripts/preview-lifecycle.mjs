import assert from "node:assert/strict";
import { appendFile, readFile } from "node:fs/promises";
import { previewTarget } from "./preview-release.mjs";

export function previewDisposition(pulls, branch, repository, action) {
  const matching = pulls.filter(pr => pr.head?.repo?.full_name === repository && pr.head.ref === branch);
  if (matching.some(pr => pr.state === "open")) return action === "closed" ? "keep" : "deploy";
  if (matching.some(pr => pr.state === "closed")) return "cleanup";
  return action === "closed" ? "keep" : "deploy";
}

export async function previewState(context = process.env, request = fetch) {
  const event = JSON.parse(await readFile(context.GITHUB_EVENT_PATH, "utf8"));
  const { branch, sha } = previewTarget(context, event);
  assert.ok(context.GH_TOKEN, "Missing GitHub token for preview lifecycle checks.");
  const [owner] = context.GITHUB_REPOSITORY.split("/");
  const pulls = [];
  for (let page = 1; ; page++) {
    const query = new URLSearchParams({ state: "all", head: `${owner}:${branch}`, per_page: "100", page: String(page) });
    const response = await request(`https://api.github.com/repos/${context.GITHUB_REPOSITORY}/pulls?${query}`, {
      headers: { Authorization: `Bearer ${context.GH_TOKEN}`, Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(30_000),
    });
    assert.ok(response.ok, `Unable to read preview pull requests (${response.status}).`);
    const batch = await response.json();
    assert.ok(Array.isArray(batch));
    pulls.push(...batch);
    if (batch.length < 100) break;
  }
  return { branch, sha, event, mode: previewDisposition(pulls, branch, context.GITHUB_REPOSITORY, event.action) };
}

export async function previewRemoved() {
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, "removed=true\n");
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, "Preview removed because its pull request is closed or merged.\n");
}
