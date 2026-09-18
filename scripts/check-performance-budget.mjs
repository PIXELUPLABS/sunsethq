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
    eagerVideos: [...html.matchAll(/<video[^>]*(?:preload="auto"|autoPlay="")/g)].length,
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
if (failed) process.exitCode = 1;
