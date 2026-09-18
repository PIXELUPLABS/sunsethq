import { readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { resolve } from 'node:path';

const root = resolve(process.env.STATIC_EXPORT_DIRECTORY || 'out');
const budgets = JSON.parse(await readFile('scripts/performance-budgets.json', 'utf8'));
let failed = false;
for (const [route, limits] of Object.entries(budgets.routes)) {
  const html = await readFile(resolve(root, route === '/' ? 'index.html' : `${route.slice(1)}.html`), 'utf8');
  const scriptPaths = [...new Set([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => m[1]))];
  const stylePaths = [...new Set([...html.matchAll(/<link[^>]+href="([^"]+\.css)"/g)].map(m => m[1]))];
  const fontPaths = [...new Set([...html.matchAll(/<link[^>]+href="([^"]+\.woff2)"[^>]+as="font"/g)].map(m => m[1]))];
  const assetBytes = async (paths, gzip = false) => (await Promise.all(paths.map(async p => {
    if (!p.startsWith('/_next/')) throw new Error(`Unexpected external build resource: ${p}`);
    const bytes = await readFile(resolve(root, `.${p}`));
    return gzip ? gzipSync(bytes).length : bytes.length;
  }))).reduce((sum, n) => sum + n, 0);
  const values = {
    htmlBytes: Buffer.byteLength(html), htmlGzipBytes: gzipSync(html).length,
    inlineCssBytes: [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].reduce((n, m) => n + Buffer.byteLength(m[1]), 0),
    initialJsGzipBytes: await assetBytes(scriptPaths, true), cssBytes: await assetBytes(stylePaths),
    fontPreloadBytes: await assetBytes(fontPaths),
    developmentToolChunks: (await Promise.all(scriptPaths.map(async p => (await readFile(resolve(root, `.${p}`), 'utf8')).includes('agentation')))).filter(Boolean).length,
    eagerFooterGrain: [...html.matchAll(/<image[^>]+href="\/images\/footer\/grain\.webp"/g)].length,
    eagerVideos: [...html.matchAll(/<video[^>]*(?:preload="auto"|autoPlay="")/gi)].length,
  };
  console.log(JSON.stringify({ route, ...values }));
  for (const [metric, maximum] of Object.entries(limits)) {
    if (!(metric in values)) throw new Error(`Unknown budget ${metric}`);
    if (values[metric] > maximum) { console.error(`FAIL ${route} ${metric}: ${values[metric]} > ${maximum}`); failed = true; }
  }
}
for (const [file, maximum] of Object.entries(budgets.assets)) {
  const bytes = (await stat(resolve(root, `.${file}`))).size;
  if (bytes > maximum) { console.error(`FAIL ${file}: ${bytes} > ${maximum}`); failed = true; }
}
const manifest = JSON.parse(await readFile('lib/image-manifest.json', 'utf8'));
for (const [source, limit] of Object.entries(budgets.responsiveImages ?? {})) {
  const image = manifest[source];
  if (!image) throw new Error(`Missing responsive image: ${source}`);
  const width = image.widths.find(w => w >= limit.width) ?? image.widths.at(-1);
  const format = image.format ?? 'webp';
  const bytes = (await stat(resolve(root, `generated-images/${image.key}-${width}.${format}`))).size;
  console.log(JSON.stringify({ source, width, format, bytes }));
  if (bytes > limit.maxBytes || format !== limit.format) {
    console.error(`FAIL ${source}: ${bytes} bytes (${format}); budget ${limit.maxBytes} bytes (${limit.format})`);
    failed = true;
  }
}
if (failed) process.exitCode = 1;
