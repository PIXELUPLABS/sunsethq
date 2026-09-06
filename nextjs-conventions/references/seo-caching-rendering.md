# SEO: Caching & Rendering Strategy

## Cache Components & SEO

With `cacheComponents: true` in `next.config.ts` (the v16 top-level flag that
unifies the old `experimental.dynamicIO`/`ppr`/`useCache`), use the
`"use cache"` directive for SEO-critical server components:

```typescript
// app/(home)/sections/hero-section.tsx
import { cacheLife, cacheTag } from "next/cache";

export async function HeroSection() {
  "use cache";
  cacheLife("hours");   // SEO content that changes a few times/day; see profiles below
  cacheTag("hero");     // Invalidate via updateTag("hero") in a Server Action

  const data = await fetchData();
  return <div>{/* SEO-visible content */}</div>;
}
```

**Built-in `cacheLife` profiles** (`stale` / `revalidate` / `expire`):
`seconds` (30s/1s/1m), `minutes` (5m/1m/1h), `hours` (5m/1h/1d), `days`
(5m/1d/1w), `weeks` (5m/1w/30d), `max` (5m/30d/1y), and the implicit
`default` (5m/15m/never). For SEO pages pick by how often content changes —
`days` for blog/docs, `max` for legal/marketing. (`minutes` revalidates
every 1 min — too aggressive for most SEO content.)

**Key rules:**
- `"use cache"` must be the first statement in the function body (or at the
  top of the file for file-level caching).
- No `cookies()`/`headers()`/`searchParams` inside a plain `"use cache"`
  scope — good for SEO, since indexable content should be request-agnostic.
  (`"use cache: private"` *does* allow them, but is never prerendered, so it
  never lands in the static SEO shell.)
- Invalidate with `updateTag("hero")` inside a Server Action
  (read-your-writes), or `revalidateTag("hero")` from a Route Handler /
  webhook — prefer these over `export const revalidate`.
- Short-lived caches are excluded from the prerender and become dynamic
  holes that need a `<Suspense>` boundary. The trigger is **`revalidate: 0`
  or `expire` under 5 minutes** — *not* a short `revalidate`. This matters:
  `minutes` (revalidate 1 min, expire 1 h) and a custom
  `{ revalidate: 60, expire: 300 }` both still prerender. Keep SEO-critical
  content on a profile whose **`expire`** is ≥ 5 min so it stays in the
  static shell.
- Sitemaps and metadata are static by default — only add `"use cache"`
  (+ `cacheTag`) if they fetch CMS/dynamic data you want to invalidate on
  publish.

## Rendering Strategy for SEO

| Strategy | Use When | SEO Impact |
|----------|----------|------------|
| "use cache" | Server components with periodic data | Best - cached HTML, fast TTFB |
| SSG (Static) | Content rarely changes | Best - pre-rendered HTML |
| SSR | Dynamic content per request | Great - server-rendered |
| CSR | Dashboards, authenticated areas | Poor - avoid for SEO pages |

Never rely on client-side rendering for indexable content — favor
SSG/SSR/`"use cache"` for anything that needs to rank.
