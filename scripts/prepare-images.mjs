import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const widths = [32, 64, 128, 256, 384, 640, 828, 1080, 1280, 1920, 2560];
const output = "public/generated-images";
await mkdir(output, { recursive: true });
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.filter((entry) => entry.name !== "generated-images").map((entry) => {
    const name = path.join(directory, entry.name);
    return entry.isDirectory() ? files(name) : [name];
  }))).flat();
}
const manifest = {};
for (const file of (await files("public")).filter((name) => /\.(png|jpe?g|webp|avif)$/i.test(name)).sort()) {
  const bytes = await readFile(file);
  const metadata = await sharp(bytes).metadata();
  if (!metadata.width || (metadata.pages ?? 1) > 1) continue;
  const key = createHash("sha256").update(bytes).update("webp-q80-v1").digest("hex").slice(0, 16);
  const sizes = [...new Set([...widths.filter((width) => width < metadata.width), Math.min(metadata.width, 2560)])];
  for (const width of sizes) {
    const target = `${output}/${key}-${width}.webp`;
    try { await readFile(target); } catch {
      await sharp(bytes).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(target);
    }
  }
  manifest[`/${file.slice("public/".length).split(path.sep).join("/")}`] = { key, widths: sizes };
}
await writeFile("lib/image-manifest.json", JSON.stringify(manifest) + "\n");
console.log(`Prepared responsive WebP variants for ${Object.keys(manifest).length} images.`);
