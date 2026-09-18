import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';
import { mkdir, writeFile } from 'node:fs/promises';
import { serveExport } from './serve-performance.mjs';

const label = process.argv[2] || 'current';
const directory = `artifacts/performance/${label}`;
await mkdir(directory, { recursive: true });
const http2 = process.env.PERF_HTTP2 !== 'false';
const protocol = http2 ? 'https' : 'http';
const server = await serveExport(process.env.PERF_DIRECTORY || 'out', 4173, { http2 });
const runs = [];
try {
  for (const route of ['/', '/value-my-data']) {
    for (let run = 1; run <= Number(process.env.PERF_RUNS || 3); run++) {
      const browser = await puppeteer.launch({ headless: true, args: http2 ? ['--ignore-certificate-errors'] : [] });
      try {
        const { lhr, report, artifacts } = await lighthouse(`${protocol}://127.0.0.1:4173${route}`, {
          throttlingMethod: process.env.PERF_THROTTLING || 'simulate',
          port: Number(new URL(browser.wsEndpoint()).port), output: 'json', onlyCategories: ['performance'], logLevel: 'error',
        });
        const name = `${route === '/' ? 'home' : 'value-my-data'}-${run}`;
        await writeFile(`${directory}/${name}.json`, report);
        await writeFile(`${directory}/${name}-trace.json`, JSON.stringify(artifacts.Trace));
        await writeFile(`${directory}/${name}-devtoolslog.json`, JSON.stringify(artifacts.DevtoolsLog));
        const metrics = Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index', 'total-byte-weight'].map(id => [id, lhr.audits[id].numericValue]));
        const result = { route, run, score: lhr.categories.performance.score, ...metrics, warnings: lhr.runWarnings };
        runs.push(result); console.log(JSON.stringify(result));
      } finally { await browser.close(); }
    }
  }
  await writeFile(`${directory}/summary.json`, JSON.stringify({ label, protocol: http2 ? "h2" : "http/1.1", generatedAt: new Date().toISOString(), runs }, null, 2));
} finally { server.close(); }
