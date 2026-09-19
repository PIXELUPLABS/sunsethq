import { open, readFile, rename, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";

/** Read an optional env file before provisioning resources; preserve other I/O failures. */
export async function readOptionalEnvFile(path) {
  try { return await readFile(path, "utf8"); }
  catch (error) { if (error.code === "ENOENT") return ""; throw error; }
}

/** Replace env files atomically with a private file, including when the target already exists. */
export async function writeSecretFile(path, contents) {
  const temporary = `${path}.${randomUUID()}.tmp`;
  const file = await open(temporary, "wx", 0o600);
  try {
    try {
      await file.chmod(0o600);
      await file.writeFile(contents, "utf8");
    } finally { await file.close(); }
    await rename(temporary, path);
  } finally {
    await unlink(temporary).catch(error => { if (error.code !== "ENOENT") throw error; });
  }
}
