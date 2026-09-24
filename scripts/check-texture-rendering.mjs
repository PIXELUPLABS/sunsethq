import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { serveExport } from './serve-performance.mjs';
const server = await serveExport('public', 4176);
const browser = await puppeteer.launch({ headless: true });
const results = [];
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1000, deviceScaleFactor: 2 });
  for (const [file, width, height] of [['grain-light-texture', 1440, 900], ['hero/btn-pattern', 300, 59], ['hover-card-grey-bg', 406, 430], ['careers/practical-stuff-cube-grid', 645, 270]]) {
    const shots = [];
    for (const suffix of ['', '-optimized']) {
      await page.setContent(`<img width="${width}" height="${height}" src="http://127.0.0.1:4176/images/${file}${suffix}.svg">`);
      await page.waitForFunction(() => document.images[0].complete && document.images[0].naturalWidth > 0);
      const img = await page.$('img');
      shots.push(await sharp(await img.screenshot()).raw().toBuffer());
    }
    let sum = 0, changed = 0;
    if (shots[0].length !== shots[1].length) throw new Error('Texture dimensions changed');
    for (let i = 0; i < shots[0].length; i++) {
      const difference = Math.abs(shots[0][i] - shots[1][i]);
      sum += difference;
      if (difference) changed++;
    }
    results.push({ file, meanChannelDifference: sum / shots[0].length, changedChannelFraction: changed / shots[0].length });
    if (sum !== 0) throw new Error(`Texture rendering changed: ${file}`);
  }
  await mkdir('artifacts/performance', { recursive: true });
  await writeFile('artifacts/performance/texture-comparison.json', JSON.stringify(results, null, 2));
  console.log('PASS: all four optimized SVGs render pixel-identically in Chromium at 2x.');
} finally { await browser.close(); server.close(); }
