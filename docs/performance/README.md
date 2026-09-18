# Mobile performance and real-user measurement

## Reproduce the lab measurements

Use Node 22.19+ (recorded runs used 22.22.0), `npm ci`, then
`npx puppeteer browsers install chrome`. Browser downloads are intentionally
opt-in so normal installs and CI do not pay for lab tooling.

```
npm run ci:build
npm run perf:budget
npm run perf:audit -- my-run
npm run perf:inspect -- my-run
npm run perf:browser
npm run perf:consent
node scripts/check-texture-rendering.mjs
```

`ci:build` builds the **production-mode static export**, with the committed jobs
snapshot and public test Turnstile widget. It does not contact Attio, provision,
deploy, or read private production secrets. `perf:audit` starts a gzip-enabled
local server over that export and runs three fresh-browser mobile Lighthouse
navigations per route. JSON reports go to ignored `artifacts/performance/`.
`perf:inspect` inventories four key pages and takes mobile screenshots.
`perf:browser` checks viewport-only video loading, desktop scene activation and
cleanup across resize, signup form hydration, and JavaScript errors.
`perf:consent` uses the real public Cloudflare script and a fake local token;
**all RUM submissions are intercepted locally**, never sent to Cloudflare.

Baseline source: `0c81e3b9a28741e0c9e91cf9ca59293e0d5888b4`. To reproduce the
before run, export that revision in a separate temporary checkout and copy the
lab scripts/package dev-tool versions from this PR. Do not use `next dev` or
`next start` (this site uses static export). The baseline and final compact
Lighthouse evidence is committed alongside this document; full raw reports and
screenshots were retained locally in `artifacts/performance/`.

## What changed

- External cacheable CSS replaces experimental `inlineCss`, which duplicated
  the stylesheet in SSR HTML and the RSC bootstrap. Content remains statically
  rendered; no page sections were converted to client-only rendering.
- Lossless WebP encodes the existing texture pixels. SVG geometry, blend modes,
  and patterns remain SVG. The button's bitmap is cropped to its visible source
  rows with a filtering margin and its transform compensated; unused pixels
  no longer travel over the network. `scripts/optimize-textures.mjs` reproduces
  these assets from retained originals. PNG background references use lossless
  WebP. Responsive `next/image` variants still use the existing quality-80
  pipeline. No layouts, typography, content, or signup handlers were redesigned.
- The permanently transparent buyer mesh layer was removed. It downloaded a
  1.59 MB PNG despite never becoming visible (no hover rule or state).
- Videos use `preload="none"`; the existing IntersectionObserver starts playback
  when visible. Their dimensions remain reserved by the existing containers.
- The desktop hero engine imports and mounts only at the matching 1024px
  breakpoint; crossing back to mobile tears it down. Mobile no longer constructs
  roughly 660 invisible scene nodes. Desktop animations retain their behavior.
- The mobile LCP illustration has eager/high fetch priority; decorative hero
  textures use low priority instead of preloads. Mono and secondary serif fonts
  load when used instead of being globally preloaded. The primary text fonts
  remain preloaded and self-hosted.

## Budgets

The existing Production export CI job runs `perf:budget` after the export.
No signup-browser job is replaced or edited. Budgets are deterministic build
sizes, not noisy Lighthouse scores. `scripts/performance-budgets.json` guards:

- Raw and gzip HTML on home, valuation, privacy, and careers, with roughly
  15–20% headroom over the final build.
- At most 1 KB of inline stylesheet content: prevents whole-stylesheet inlining
  from silently returning (inline style attributes are not counted).
- Initial script-tag JavaScript <=350 KB gzip per route, CSS <=100 KB raw,
  and font preloads <=85 KB. These reflect the current framework/illustration
  footprint; they are regression ceilings, not claims of ideal payload size.
- No autoplay/automatic-preload videos in initial HTML, plus explicit ceilings
  for the measured heavyweight textures (button 500 KB, grain SVG 740 KB,
  white texture 1.1 MB).

Dynamic imports, route prefetches, CSS image downloads, and image selections
vary by viewport; script-tag budgets alone cannot bound them. Repeat the mobile
resource inventory and lab suite for asset/animation changes. A new exception
should include an updated measurement and rationale in review. Do not raise a
ceiling merely to silence CI. There is no automated field-performance gate yet.

## Cloudflare Web Analytics setup and consent

The parent launch task verified the existing `replay.ai` property, site tag
`45c02be8d7cd4ec2ab599c5fc61234e0`, and switched it to **Enable with JS Snippet
installation**. Do not enable automatic injection: it bypasses site consent.
The existing Wrangler OAuth login cannot list RUM properties (405 unsupported
authentication scheme); dashboard verification was used instead. No new property
was created. Dashboard: https://dash.cloudflare.com/c4f47127b63c426c98541372fa9b8b67/web-analytics/edit/45c02be8d7cd4ec2ab599c5fc61234e0

The parent task set the public site token in the GitHub **production environment
variable** `NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN`. The production deploy step
passes it into the build; ordinary local/PR builds leave it unset. It is a public
beacon identifier, not an API credential. No private Attio secret is involved.
The integration checks `https://www.replay.ai` at runtime and excludes staging.
An unset/invalid token or any other origin loads no beacon. CSP permits only the
required Cloudflare script and connect origins in production; staging retains
its existing policy. Turnstile policy remains intact.

Cookie settings has a separate **Website performance** category, off by default.
Old campaign-only consent records do not authorize it. Accept optional opts into
both categories, Reject optional disables both, and Customize permits either
independently. GPC overrides both. Stored permission expires with the existing
180-day lifetime; cross-tab updates are observed.

The beacon is inserted once, as a module, only after performance consent.
Removing an executed script cannot revoke its listeners, so narrow guards on
`sendBeacon`, `fetch`, and `XMLHttpRequest.send` check current consent for only the
two documented `/cdn-cgi/rum` destinations. Other network requests are delegated
unchanged. Guards remain installed for the document lifetime. Withdrawal latches
measurement off until a fresh document: accepting again resumes on the next full
page load, never by flushing queued measurements from the revoked session.
Already transmitted/in-flight measurements cannot be recalled. Expiry and GPC
also block later sends. These browser transport guards need re-verification if
Cloudflare changes beacon transport/endpoints. No live field collection has been
verified and **this PR was not deployed**.

After merging through the ordinary release process:

1. Confirm manual snippet installation is still selected and there is no edge
   auto-injected beacon. In a clean browser, verify no script/RUM requests before
   consent; test rejection, GPC, acceptance, withdrawal, and cross-tab rejection.
2. With consent, interact with the page and background the tab; confirm a beacon
   reaches the existing property. Check CSP errors, duplicate pageviews, and SPA
   navigation. Verify token propagation in the production build.
3. Review mobile/desktop separately and filter home and `/value-my-data`. Track
   p75 LCP, INP, and CLS plus volume, browser/device mix, and page-load trends.
   Investigate LCP >2.5s, INP >200ms, CLS >0.1; use a representative observation
   window rather than treating a few launches as a pass/fail result.
4. Consent and blocking create selection bias; consent-time loading may miss
   early events. Do not equate this sample with all users or Chrome UX Report.
   Keep a physical-device check in the launch review.

Official references (checked 2026-09-18):
[installation](https://developers.cloudflare.com/web-analytics/get-started/),
[collection and reporting](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/),
[CSP](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/content-security-policies/),
[SPA handling](https://developers.cloudflare.com/web-analytics/get-started/web-analytics-spa/),
[beacon metrics including INP](https://developers.cloudflare.com/speed/observatory/rum-beacon/).
