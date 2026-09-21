import { appendFile } from "node:fs/promises";
import { previewState } from "./preview-lifecycle.mjs";

const { mode, branch, sha } = await previewState();
await appendFile(process.env.GITHUB_OUTPUT, `mode=${mode}\nbranch=${branch}\nsha=${sha}\n`);
console.log(`Preview lifecycle: ${mode}`);
