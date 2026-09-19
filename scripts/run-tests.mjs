import { spawnSync } from "node:child_process";
import { readdir } from "node:fs/promises";

const tests = (await readdir("tests", { recursive: true }))
  .filter(name => name.endsWith(".test.ts")).sort().map(name => `tests/${name}`);
if (!tests.length) throw new Error("No test files found.");
const result = spawnSync(process.execPath, [
  "node_modules/tsx/dist/cli.mjs", "--test", ...process.argv.slice(2), ...tests,
], { stdio: "inherit" });
process.exitCode = result.status ?? 1;
