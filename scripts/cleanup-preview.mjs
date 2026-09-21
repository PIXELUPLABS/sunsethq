import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { cloudflareClient } from "./cloudflare-client.mjs";
import { removePreview } from "./preview-cleanup.mjs";
import { previewRemoved, previewState } from "./preview-lifecycle.mjs";

const state = await previewState();
if (state.mode !== "cleanup") {
  console.log("An open pull request still uses this branch; keeping its preview.");
} else {
  assert.ok(process.env.CLOUDFLARE_API_TOKEN, "Missing preview environment deployment token.");
  const site = JSON.parse(await readFile("workers/site/wrangler.json", "utf8"));
  await removePreview(cloudflareClient(), site, state.branch);
  await previewRemoved();
}
