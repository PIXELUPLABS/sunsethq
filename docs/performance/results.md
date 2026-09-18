# Launch measurement results — 2026-09-18

## Controlled follow-up

The primary comparison is **first PR revision `10e81c6` → final second-pass implementation**,
not original main. The measured implementation is `6f0d13f`; a subsequent consent-expiry guard and portable lab entrypoint fix do not change the asset strategy. Three fresh-browser navigations per route and revision ran
sequentially, without overlapping workstream builds, audits, or browser checks.
The host was not a dedicated performance runner. Production-mode Next.js 16.3.4
static export; Lighthouse 13.5.0; Chrome 153; Node 22.22.0; Apple M4 Pro / Darwin
24.5.0; local gzip HTTP/2 TLS server; 412×823 mobile emulation, DPR 1.75.
Lighthouse **applied DevTools throttling** used request latency 562.5ms, download
1,474.56 Kbps, upload 675 Kbps, CPU 4× (Lighthouse's adjustment of its mobile
150ms RTT / 1,638.4 Kbps profile). No optional consent was granted. Builds use
the public test Turnstile widget, no live backend, and no analytics token.

| Route | Metric | Before median (range) | After median (range) |
| --- | --- | --- | --- |
| `/` | Performance score | 63 (63–63) | 89 (89–89) |
| `/` | FCP (s) | 2.401 (2.399–2.413) | 2.174 (2.168–2.178) |
| `/` | LCP (s) | 8.043 (8.027–8.047) | 2.674 (2.665–2.675) |
| `/` | TBT (ms) | 26.31 (25.37–31.71) | 11.56 (10.95–12.62) |
| `/` | CLS | 0.024 (0.024–0.024) | 0.000 (0.000–0.000) |
| `/` | Transferred MB | 5.709 (5.709–5.709) | 1.421 (1.421–1.421) |
| `/value-my-data` | Performance score | 65 (65–65) | 82 (82–82) |
| `/value-my-data` | FCP (s) | 2.195 (2.163–2.204) | 2.019 (2.016–2.035) |
| `/value-my-data` | LCP (s) | 10.647 (10.638–10.657) | 3.924 (3.921–3.935) |
| `/value-my-data` | TBT (ms) | 5.36 (5.36–5.37) | 12.74 (12.48–14.07) |
| `/value-my-data` | CLS | 0.000 (0.000–0.000) | 0.000 (0.000–0.000) |
| `/value-my-data` | Transferred MB | 2.006 (2.005–2.009) | 1.148 (1.147–1.151) |

Home median LCP improved **66.8%**, with **75.1%** less transfer. Valuation median
LCP improved **63.1%**, with **42.8%** less transfer. Both still exceed the 2.5s
lab target. CLS is zero in all final runs. TBT is a blocking diagnostic,
**not INP**; physical-device and real-user INP remain unmeasured.

The production origin negotiated HTTP/2 in a header check. This harness uses
HTTP/2 too, but Node stream prioritization is not Cloudflare edge scheduling,
gzip is not necessarily production compression, and loopback excludes real
connection/edge latency. Absolute results change substantially between HTTP/1.1
and HTTP/2 in this local harness. Do not combine these applied-throttling results
with the earlier HTTP/1.1 simulated results or claim a field-performance pass.

## Exact LCP diagnosis

These are **run 3 observed phases in milliseconds**, not medians of independently
selected phases. Applied throttling makes the phase sum comparable to that run's
LCP. Full candidates, phases, settings, and network requests for every run are in
[controlled-evidence.json](controlled-evidence.json).

| Route / revision | Candidate | TTFB | Load delay | Resource load | Render delay | LCP |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Home before | Mobile hero illustration | 5.3 | 610.5 | 7,416.8 | 14.5 | 8,047.1 |
| Home final | Same illustration | 6.1 | 594.4 | 2,051.5 | 21.7 | 2,673.6 |
| Valuation before | Footer SVG pattern image | 3.9 | 611.1 | 10,029.4 | 2.2 | 10,646.6 |
| Valuation final | Cookie notice paragraph | 5.0 | — | — | 3,919.2 | 3,924.2 |

Chromium reported the footer's `<image>` inside SVG `<defs>` as valuation's old
LCP candidate, despite a zero bounding rectangle; the trace also records it.
Deferring its image href until the footer approaches the viewport removes that
startup request while retaining the SVG paths and wordmark in SSR.

The final hero requests the **1080px AVIF**, appropriate for 558 CSS pixels at
DPR 1.75, with eager/high fetch priority. Its 32,474 bytes replace 90,748 bytes
of WebP. The same full responsive width set, including native 1584px, remains.
Against the resized source, composited on the page background, AVIF q60 has
44.20dB RGB PSNR versus WebP q80's 42.49dB; the mobile screenshot was also
inspected. See [hero-encoding.json](hero-encoding.json). Its remaining measured
cost is network load under contention, not a long post-download paint delay.

Valuation's final candidate is the consent notice paragraph (`body > section.fixed
> p.mt-2`), shown when stored consent is checked after hydration. In run 3 the
71,409-byte framework request runs from 604.6ms to 3,775.2ms, then the paragraph
paints at 3,924.2ms. Low TBT does not mean hydration can happen before scripts
arrive. Further material improvement calls for reducing initial framework/route
transfer or designing earlier consent-aware notice rendering for a static export.
That requires preserving saved-consent behavior and avoiding a notice flash for
returning users. Hiding or delaying the notice to change the LCP candidate is not
an appropriate fix. Remaining grain resources are also large; lossy replacements
would require separate visual review. Those decisions remain outside this
low-risk pass; SSR content, consent behavior, and signup handlers are retained.

## Deterministic reductions from original main

Original main is `0c81e3b9a28741e0c9e91cf9ca59293e0d5888b4`.
The older timing comparison is retained in [first-pass-results.md](first-pass-results.md)
and [launch-evidence.json](launch-evidence.json), with its overlap and protocol
limitations. It is historical evidence, not the controlled comparison above.

| Page | HTML before → final (bytes) | Gzip HTML before → final (bytes) | Final initial JS gzip |
| --- | ---: | ---: | ---: |
| Home | 506,575 → 243,457 | 83,284 → 31,311 | 215,346 |
| Valuation | 323,351 → 74,063 | 62,359 → 14,064 | 207,831 |
| Privacy | 398,412 → 148,867 | 71,372 → 22,666 | 210,909 |
| Careers | 518,869 → 269,350 | 97,016 → 48,857 | 211,259 |

HTML compression excludes external CSS. Inline stylesheet bytes are zero;
external CSS is 86,249 bytes on home / 80,963 elsewhere. Font preloads fell
from 108,736 to 76,588 bytes. Removing Agentation from production client references
saved about 95 KB gzip of initial JavaScript. The initial-JS ceiling is now
245 KB gzip, with explicit zero-development-tool and zero-eager-footer-grain
checks plus a 40 KB ceiling for the 1080px AVIF hero. Dynamic and prefetched
requests remain separately covered by browser inspection.

## Validation and release status

- Production export passed: 19 pages, metadata, sitemap, static assets,
  server-rendered job content, and secret scanning.
- TypeScript, all 66 tests, lint, and four-route budgets passed.
- Browser checks passed: deferred desktop scene, breakpoint cleanup, no startup
  video downloads, scroll-triggered playback, signup hydration, no page errors,
  deferred footer/menu textures, no closed-menu careers prefetch, and correctly
  sized AVIF selection. Separate signup tests remain owned by their workstream.
- Four optimized SVG textures rendered pixel-identically in Chromium at intrinsic
  size / DPR 2, including the cropped button. This is not an all-browser guarantee.
- Real Cloudflare script testing intercepted every RUM submission locally: none
  before consent, a measurement after acceptance, and none after withdrawal,
  including existing pagehide/visibility listeners and all guarded transports.
  Tests also cover legacy consent, GPC, expiry, production origin, and duplicates.
- No production deployment or live RUM collection was performed. The existing
  Cloudflare property is configured for manual snippet installation and the public
  token is in the production GitHub environment variable. Normal deployment and
  field validation remain required; no private Attio secrets were read.

Full raw reports, trace logs, and screenshots remain in ignored
`artifacts/performance/`. Reproduction and post-release RUM instructions are in
[README.md](README.md).
