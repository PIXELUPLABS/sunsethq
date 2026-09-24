import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const production = process.env.SITE_ENV === 'production';
const directory = process.env.STATIC_EXPORT_DIRECTORY || (production ? 'out-production' : 'out');
const config = JSON.parse(await readFile(production ? 'workers/site/wrangler.production.json' : 'workers/site/wrangler.json', 'utf8'));
const snapshot = JSON.parse(await readFile('modules/careers/data/jobs.json', 'utf8'));
const origin = config.vars.SITE_ORIGIN;
const routes = ['/', '/blogs', '/careers', '/data-privacy', '/value-my-data', '/privacy', '/terms', ...snapshot.teams.flatMap(team => team.roles.map(role => `/careers/roles/${role.id}`))];
for (const route of routes) {
  const html = await readFile(route === '/' ? `${directory}/index.html` : `${directory}${route}.html`, 'utf8');
  assert.match(html, /<title>[^<]+<\/title>/, `${route}: missing title`);
  assert.ok(html.includes(`href="${origin}${route === '/' ? '' : route}"`) || html.includes(`href="${origin}${route}"`), `${route}: incorrect canonical`);
  if (production) {
    assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/, `${route}: production must be indexable`);
    assert.ok(!html.includes('replay-marketing-staging.replay-marketing-dev.workers.dev'), `${route}: staging origin in production`);
  } else assert.match(html, /name="robots" content="[^"]*noindex/, `${route}: missing noindex`);
  assert.ok(!html.includes('/_next/image?'), `${route}: runtime image optimizer in static export`);
  for (const [, source] of html.matchAll(/\s(?:src|href)="([^"#]+)"/g)) {
    if (!source.startsWith('/') || source.startsWith('//')) continue;
    const clean = decodeURIComponent(source.split('?')[0]);
    if (clean === '/' || routes.includes(clean) || clean.startsWith('/api/')) continue;
    try { await readFile(path.join(directory, clean)); } catch { throw new Error(`${route}: missing local asset ${clean}`); }
  }
}
const careers = await readFile(`${directory}/careers.html`, 'utf8');
const signup = await readFile(`${directory}/value-my-data.html`, 'utf8');
for (const field of ['companyName', 'workEmail', 'yearsOfOperation', 'businessSize', 'englishShare']) {
  assert.ok(signup.includes(`name="${field}"`), `Signup form field missing: ${field}`);
}
for (const team of snapshot.teams) for (const role of team.roles) assert.ok(careers.includes(role.id), `Missing job in initial HTML: ${role.id}`);
const robots = await readFile(`${directory}/robots.txt`, 'utf8');
if (production) {
  assert.match(robots, /^Allow: \/$/m);
  assert.doesNotMatch(robots, /^Disallow: \/$/m);
  assert.ok(robots.includes(`${origin}/sitemap.xml`));
} else assert.match(robots, /Disallow: \//);
await readFile(`${directory}/404.html`);
const sitemap = await readFile(`${directory}/sitemap.xml`, 'utf8');
for (const route of routes) assert.ok(sitemap.includes(`${origin}${route}`), `Missing sitemap route: ${route}`);
async function files(directory) {
  return (await Promise.all((await readdir(directory, { withFileTypes: true })).map(entry => entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)]))).flat();
}
let verificationKeyPresent = false;
for (const file of await files(directory)) {
  const bytes = await readFile(file);
  if (file.endsWith('.js') && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && bytes.includes(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)) verificationKeyPresent = true;
  for (const key of ['CLOUDFLARE_API_TOKEN', 'ATTIO_API_KEY', 'TURNSTILE_SECRET_KEY', 'TURNSTILE_DEV_SECRET_KEY', 'TURNSTILE_STAGING_SECRET_KEY']) {
    if (process.env[key]) assert.ok(!bytes.includes(process.env[key]), `Secret ${key} found in ${file}`);
  }
}
assert.ok(verificationKeyPresent, 'Signup verification key missing from exported JavaScript');
console.log(`PASS: ${production ? 'production' : 'staging'} — ${routes.length} exported pages, canonical/robots metadata, sitemap, static assets, initial job HTML, and secret scan.`);
