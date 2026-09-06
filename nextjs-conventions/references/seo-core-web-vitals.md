# SEO: Core Web Vitals & Ranking Signals

## Core Web Vitals Targets

| Metric | Target | Impact |
|--------|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s | Loading speed |
| INP (Interaction to Next Paint) | < 200ms | Interactivity |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability |

- **Measured on field data, not lab.** Google ranks on the 75th percentile
  of real users (Chrome UX Report, 28-day rolling window, mobile/desktop
  separate). A URL group passes only when ≥75% of visits hit "Good" on all
  three. Use PageSpeed Insights (pagespeed.web.dev) and the Search Console
  CWV report for the real signal — **Lighthouse is lab-only and cannot
  measure INP**.
- **INP replaced FID** as a Core Web Vital on 2024-03-12; FID is deprecated.
  INP is the most commonly failed metric — prioritize it. (This pairs
  directly with the memoization and lazy-loading conventions elsewhere in
  this skill — unmemoized re-renders and oversized bundles are common INP
  killers.)
- **Page experience is a tiebreaker, not a standalone ranking system**
  (Google de-emphasized it). Good CWV won't rescue thin content; content
  relevance and quality come first. Treat CWV as baseline UX hygiene.
- **Myths to ignore:** 2026 SEO blogs falsely claim "LCP was lowered to
  2.0s" and invent an "Engagement Reliability" metric. Neither exists in any
  Google/web.dev source — the thresholds above are current and unchanged
  since 2021.

## Ranking Signals Beyond Technical SEO

Metadata + CWV alone don't drive rankings. Keep these in mind:

- **Helpful content** is part of core ranking (since 2024-03), evaluated
  continuously — not an episodic penalty.
- **E-E-A-T** (Experience, Expertise, Authoritativeness, Trust): cite real
  authors/credentials and first-hand experience, especially on YMYL pages.
- **Mobile-first indexing is complete** (since 2024-07): Google indexes the
  mobile rendering only. Ensure the mobile view has the same content,
  metadata, and structured data as desktop; never block mobile resources.
  (Mostly automatic with Next.js responsive design.)
