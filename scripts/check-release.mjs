import { spawnSync } from "node:child_process";
import { readdir } from "node:fs/promises";

const tests = (await readdir("tests")).filter(name => name.endsWith(".test.ts")).sort().map(name => `tests/${name}`);
for (const args of [
  ["node_modules/tsx/dist/cli.mjs", "--test", "--test-reporter=dot", ...tests],
  ["node_modules/next/dist/bin/next", "typegen"],
  ["node_modules/typescript/bin/tsc", "--noEmit", "--incremental", "false"],
]) {
  const result = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log(`Release gate passed: ${tests.length} test files and TypeScript.`);
