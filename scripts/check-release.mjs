import { spawnSync } from "node:child_process";
for (const args of [
  ["scripts/run-tests.mjs"],
  ["node_modules/next/dist/bin/next", "typegen"],
  ["node_modules/typescript/bin/tsc", "--noEmit", "--incremental", "false"],
]) {
  const result = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log("Release gate passed: all test files and TypeScript.");
