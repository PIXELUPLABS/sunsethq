# SEO: Audit Checklist & Common Mistakes

## Quick SEO Audit

Run this checklist for any Next.js project:

1. **Check robots.txt**: `curl https://your-site.com/robots.txt`
2. **Check sitemap**: `curl https://your-site.com/sitemap.xml`
3. **Check metadata**: View page source, search for `<title>` and
   `<meta name="description">`
4. **Check JSON-LD**: View page source, search for `application/ld+json`
5. **Check Core Web Vitals**: Use PageSpeed Insights (pagespeed.web.dev) and
   the Search Console CWV report for field data — Lighthouse is lab-only and
   can't measure INP
6. **Verify what bots actually see**: Don't trust the browser view — confirm
   production HTML with a bot User-Agent, e.g.
   `curl -A "Googlebot" https://your-site.com | grep -E '<title>|canonical'`
7. **Load the route directly and interact with it.** A page can pass every
   SEO check (title, canonical, description, full body content) while its
   client components never actually hydrate in production — a passing audit
   is not proof the page works.

## Common Mistakes to Avoid

1. **Mixing next-seo with Metadata API** — use only the Metadata API in the
   App Router.
2. **Missing canonical URLs** — set a self-referencing `alternates.canonical`
   when duplicate/parameterized URLs are a risk; it's a hint, not a
   requirement — Google may pick its own canonical.
3. **Using CSR for SEO pages** — use SSG/SSR for indexable content.
4. **Blocking `/_next/` in robots.txt** — crawlers need render-critical
   CSS/JS; never disallow `/_next/`.
5. **Missing `metadataBase`** — required for relative URLs in metadata to
   resolve.
6. **Viewport inside the `metadata` object** — must be a separate `viewport`
   export.
7. **Mixing the `metadata` object and `generateMetadata`** — use one or the
   other in the same route segment.
8. **Duplicating icons in metadata + file conventions** — prefer
   `favicon.ico`/`icon.*`/`opengraph-image.*` file conventions; they
   auto-emit tags and override the metadata object.
9. **Blanket-blocking AI crawlers** — `GPTBot disallow: /` blocks training
   but leaves you in AI search; don't accidentally block citation bots
   (OAI-SearchBot, PerplexityBot) too.
10. **Adding the `keywords` meta tag for Google** — Google ignores it
    entirely (no indexing or ranking effect); it's noise, not a signal.
11. **Assuming named robots.txt groups inherit `*` rules** — per RFC 9309, a
    crawler obeys only its most specific matching group. A
    `{ userAgent: 'OAI-SearchBot', allow: '/' }` group drops the wildcard's
    `/api/`/`/admin/` disallows — repeat them in every named group.
12. **Trusting the browser view for bot metadata** — observed on Next.js
    16.2.x: PPR + streaming metadata can serve bots a page with no
    `<title>`/canonical (vercel/next.js #93401, #95406). Check whether it
    still reproduces on your version, but keep the verification habit
    either way (see the `curl -A "Googlebot"` check above).
13. **Assuming a route that indexes well also *works*** — observed on
    Next.js 16.2.10; re-check on your version. A PPR route (`◐` in the build
    output) can serve perfect SEO HTML while none of its `<Suspense>`
    boundaries ever hydrate in the production build — maps, forms, and
    other client components inside them stay dead. This reproduced only on
    a direct URL load (client-side navigation to the same route worked
    fine), and correlated with reading `searchParams`, which is what makes
    a route PPR in the first place. **Always load the route directly in a
    browser and interact with it — a passing SEO audit doesn't mean the
    page is usable.**
