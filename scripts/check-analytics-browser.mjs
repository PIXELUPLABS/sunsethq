// Browser verification using a local fixture token. No requests reach RUM.
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
import { build } from 'esbuild';
const { outputFiles } = await build({ entryPoints: ['modules/performance/lib/cloudflare-analytics.ts'], bundle: true, write: false, format: 'iife', globalName: 'rumTest', tsconfig: 'tsconfig.json' });
const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  let scripts = 0, sends = 0;
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.pathname === '/cdn-cgi/rum') { sends++; return request.respond({ status: 204 }); }
    if (url.hostname === 'static.cloudflareinsights.com') { scripts++; return request.continue(); }
    if (request.isNavigationRequest()) return request.respond({ status: 200, contentType: 'text/html', body: '<!doctype html><html><head><title>Consent fixture</title></head><body>Local consent test</body></html>' });
    return request.abort();
  });
  await page.goto('https://www.replay.ai/');
  await page.addScriptTag({ content: outputFiles[0].text });
  await page.evaluate(() => rumTest.startCloudflareAnalytics('a'.repeat(32)));
  assert.equal(scripts, 0);
  const consent = async performance => page.evaluate(performance => {
    localStorage.setItem('replay.cookie-consent.v1', JSON.stringify({ version: 1, marketing: false, performance, savedAt: Date.now() }));
    window.dispatchEvent(new Event('replay:consent-changed'));
  }, performance);
  await consent(true);
  await page.waitForNetworkIdle();
  assert.equal(scripts, 1);
  assert.ok(sends > 0, 'real beacon sent an intercepted initial measurement after consent');
  await consent(false);
  const before = sends;
  await page.evaluate(async () => {
    navigator.sendBeacon('/cdn-cgi/rum', '{}');
    await fetch('https://cloudflareinsights.com/cdn-cgi/rum', { method: 'POST', body: '{}' });
    const xhr = new XMLHttpRequest(); xhr.open('POST', '/cdn-cgi/rum'); xhr.send('{}');
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new Event('pagehide'));
  });
  await page.waitForNetworkIdle();
  assert.equal(sends, before, 'no transport or existing beacon listener sent after withdrawal');
  console.log('PASS: production-origin fixture, real Cloudflare script, opt-in, withdrawal; all RUM requests intercepted locally.');
} finally { await browser.close(); }
