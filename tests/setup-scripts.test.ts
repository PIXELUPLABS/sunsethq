import assert from "node:assert/strict";
import { test } from "node:test";
import { chmod, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { cloudflareToken } from "../scripts/cloudflare-client.mjs";
import { readOptionalEnvFile, writeSecretFile } from "../scripts/secret-files.mjs";

test("Cloudflare setup rejects key/email credentials before creating a Bearer undefined request", () => {
  for (const credentials of [null, {}, { token: "" }, { token: " " }, { type: "api_key", key: "private-key", email: "test@example.com" }]) {
    assert.throws(() => cloudflareToken(credentials), error => error instanceof Error && error.message.includes("CLOUDFLARE_API_TOKEN") && !error.message.includes("private-key"));
  }
  assert.equal(cloudflareToken({ type: "oauth", token: "test-token" }), "test-token");
});

test("first-run env files are optional and both new and existing secret files become owner-only", async t => {
  const directory = await mkdtemp(join(tmpdir(), "replay-secret-test-"));
  t.after(() => rm(directory, { recursive: true }));
  const path = join(directory, ".env.production.local");
  assert.equal(await readOptionalEnvFile(path), "");
  await writeSecretFile(path, "FIRST=test\n");
  assert.equal((await stat(path)).mode & 0o777, 0o600);
  await chmod(path, 0o644);
  await writeSecretFile(path, "SECOND=test\n");
  assert.equal((await stat(path)).mode & 0o777, 0o600);
  assert.equal(await readOptionalEnvFile(path), "SECOND=test\n");
  await assert.rejects(writeSecretFile(path, null));
  assert.equal(await readOptionalEnvFile(path), "SECOND=test\n", "failed writes leave the previous credentials intact");
  assert.deepEqual(await readdir(directory), [".env.production.local"]);
  const notDirectory = join(directory, "not-directory");
  await writeFile(notDirectory, "file");
  await assert.rejects(readOptionalEnvFile(join(notDirectory, ".env")), { code: "ENOTDIR" });
  assert.equal(await readFile(path, "utf8"), "SECOND=test\n");
});
