import puppeteer from 'puppeteer';
import { writeFile, mkdir } from 'node:fs/promises';
import { serveExport } from './serve-performance.mjs';
const label = process.argv[2] || 'current';
const server = await serveExport('out', 4174);
const browser = await puppeteer.launch({ headless: true });
try {
  for (const route of ['/', '/value-my-data', '/data-privacy', '/careers']) {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto(`http://127.0.0.1:4174${route}`, { waitUntil: 'networkidle0' });
    const result = await page.evaluate(() => ({
      nodes: document.querySelectorAll('*').length,
      images: [...document.images].map(i => ({ src: i.currentSrc, width: i.clientWidth, height: i.clientHeight })),
      resources: performance.getEntriesByType('resource').map(r => ({ url: r.name, type: r.initiatorType, bytes: r.transferSize, decoded: r.decodedBodySize })),
      videos: [...document.querySelectorAll('video')].map(v => ({ src: v.currentSrc, state: v.readyState, preload: v.preload })),
    }));
    const name = route === '/' ? 'home' : route.slice(1);
    await mkdir(`artifacts/performance/${label}`, { recursive: true });
    await writeFile(`artifacts/performance/${label}/${name}-resources.json`, JSON.stringify(result, null, 2));
    await page.screenshot({ path: `artifacts/performance/${label}/${name}.png` });
    console.log(name, result.nodes, 'nodes', result.resources.reduce((n,r)=>n+r.bytes,0), 'resource bytes');
    await page.close();
  }
} finally { await browser.close(); server.close(); }
