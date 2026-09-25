> Historical first-pass results. The later controlled pass and final sizes are in [results.md](results.md).

# Launch measurement results — 2026-09-18

Production-mode Next.js 16.3.4 static exports, baseline
`0c81e3b9a28741e0c9e91cf9ca59293e0d5888b4`, compared with this PR.
Lighthouse 13.5.0, bundled Chrome 153, Node 22.22.0 on Apple M4 Pro / Darwin
24.5.0. Three fresh-browser navigations per route, local gzip HTTP server,
412×823 mobile emulation at DPR 1.75; simulated 150ms RTT, 1,638.4 Kbps
throughput, 4× CPU slowdown. No optional consent was granted. The normal CI
build uses the test Turnstile widget, no live backend, and no analytics token.

**These are mobile lab simulations, not physical-device tests or field data.**
TBT is a main-thread blocking diagnostic; it is **not INP**. Real-user INP and
production CDN/network behavior remain unmeasured. The first baseline home run
had much higher CPU blocking; all samples are retained and medians are reported,
not a best-of selection. The host was not dedicated/quiescent; some inspection
and validation work overlapped samples. Timing differences should be confirmed
on a controlled runner and in the field. Payload/HTML reductions are deterministic.

| Route | Metric | Before median (range) | After median (range) |
| --- | --- | --- | --- |
| `/` | Performance score | 73.000 (47.000–73.000) | 75.000 (75.000–75.000) |
| `/` | FCP (s) | 1.094 (1.094–1.096) | 1.358 (1.358–1.360) |
| `/` | LCP (s) | 19.805 (19.656–41.256) | 8.706 (8.630–8.707) |
| `/` | TBT (ms) | 155.000 (146.000–1864.000) | 7.000 (3.000–8.000) |
| `/` | CLS | 0.000 (0.000–0.000) | 0.000 (0.000–0.000) |
| `/` | Transferred MB (decimal) | 12.878 (12.878–12.878) | 5.718 (5.718–5.718) |
| `/value-my-data` | Performance score | 75.000 (75.000–75.000) | 77.000 (77.000–77.000) |
| `/value-my-data` | FCP (s) | 0.934 (0.930–0.936) | 1.057 (0.905–1.060) |
| `/value-my-data` | LCP (s) | 13.064 (13.055–13.206) | 7.055 (7.055–7.057) |
| `/value-my-data` | TBT (ms) | 24.000 (24.000–31.000) | 9.000 (7.000–11.000) |
| `/value-my-data` | CLS | 0.000 (0.000–0.000) | 0.000 (0.000–0.000) |
| `/value-my-data` | Transferred MB (decimal) | 2.877 (2.876–2.880) | 2.017 (2.013–2.018) |

Home transfer decreased **55.6%**; home LCP median decreased **56.0%**.
Valuation transfer decreased **29.9%**; its LCP median decreased **46.0%**.
Both routes still miss the 2.5s LCP goal. Cold FCP increased by approximately
264ms on home and 123ms on valuation with external CSS; the tradeoff is less
HTML duplication and a stylesheet that can be reused across pages/visits.
Warm-cache/CDN benefits were not measured. Do not read the score as a launch
certification. Large grain assets, ~300 KB gzip initial script tags, framework
hydration, and responsive/prefetched assets remain worthwhile profiling targets.

| Page | HTML before → after (bytes) | Gzip HTML before → after (bytes) |
| --- | ---: | ---: |
| Home | 506,575 → 246,705 | 83,284 → 31,324 |
| Valuation | 323,351 → 74,535 | 62,359 → 14,081 |
| Privacy | 398,412 → 150,073 | 71,372 → 22,730 |
| Careers | 518,869 → 270,724 | 97,016 → 48,989 |

HTML compression numbers exclude external stylesheet requests. Inline stylesheets
fell from 86,051 bytes on home / 80,765 on other pages to zero; current external
CSS is 85,922 / 80,636 bytes raw. Font preloads fell from 108,736 to 76,588 bytes.
Current initial script-tag gzip totals are home 309,451; valuation 300,838;
privacy 305,283; careers 305,630. These do not include later dynamic/prefetch scripts.

A separate 390×844, DPR 2, unthrottled Chromium resource inventory found home DOM
nodes fell from 1,644 to 972, including the deferred desktop scene; these counts
also reflect removed invisible layers and bootstrap changes. This inventory is
not directly interchangeable with Lighthouse's differently sized viewport.

## Validation and limitations

- `npm run ci:build` passed production export checks: 19 pages, metadata,
  sitemap, static assets, server-rendered job content, and secret scanning.
- `npm run check`: 66 tests and TypeScript passed; `npm run lint` passed.
- All four page budgets passed. Injecting >1 KB inline CSS caused the expected
  failure; the fixture was restored afterward.
- Browser checks passed: no video downloads at initial mobile home, no hidden
  desktop scene nodes, scene activation/cleanup on breakpoint resize, playback
  after scroll, signup form hydration, no page errors. This is not a replacement
  for the separate signup end-to-end workstream or a test of real CRM delivery.
- Four optimized SVGs rendered **pixel-identically** to the original SVGs in
  Chromium at their intrinsic dimensions and DPR 2, including the cropped button
  bitmap. Run `node scripts/check-texture-rendering.mjs`. This is a specific
  rendering check, not a guarantee across every browser/DPR.
- Home and valuation screenshots were visually inspected. The only intended UI
  change is the performance consent category and explanatory copy.
- Consent tests cover legacy records, production-origin gating, GPC, expiry,
  withdrawal, unchanged non-analytics transport, and duplicate prevention.
  An actual Cloudflare script browser test sent an intercepted measurement only
  after opt-in; its existing visibility/pagehide listeners and all three guarded
  transports sent nothing after withdrawal. No live RUM data was submitted.
- Local server timing excludes Cloudflare edge behavior, production CSP delivery,
  and physical hardware/network variability. Check those after the normal release.

Raw selected metrics, settings, and network inventories are in
[launch-evidence.json](launch-evidence.json). Full Lighthouse reports and screenshots
remain in the ignored local `artifacts/performance` directory. Reproduction and
field activation instructions are in [README.md](README.md).
