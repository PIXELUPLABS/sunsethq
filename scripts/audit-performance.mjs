import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';
import { mkdir, writeFile } from 'node:fs/promises';
import { serveExport } from './serve-performance.mjs';

const label = process.argv[2] || 'current';
const directory = `artifacts/performance/${label}`;
await mkdir(directory, { recursive: true });
const server = await serveExport();
const runs = [];
try {
  for (const route of ['/', '/value-my-data']) {
    for (let run = 1; run <= 3; run++) {
      const browser = await puppeteer.launch({ headless: true });
      try {
        const { lhr, report } = await lighthouse(`http://127.0.0.1:4173${route}`, {
          port: Number(new URL(browser.wsEndpoint()).port), output: 'json', onlyCategories: ['performance'], logLevel: 'error',
        });
        const name = `${route === '/' ? 'home' : 'value-my-data'}-${run}`;
        await writeFile(`${directory}/${name}.json`, report);
        const metrics = Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index', 'total-byte-weight'].map(id => [id, lhr.audits[id].numericValue]));
        const result = { route, run, score: lhr.categories.performance.score, ...metrics, warnings: lhr.runWarnings };
        runs.push(result); console.log(JSON.stringify(result));
      } finally { await browser.close(); }
    }
  }
  await writeFile(`${directory}/summary.json`, JSON.stringify({ label, generatedAt: new Date().toISOString(), runs }, null, 2));
} finally { server.close(); }
