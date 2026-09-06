<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Personal Next.js conventions (mandatory)

Before creating, restructuring, or editing any Next.js/React code in this
project — components, pages, hooks, API routes, metadata, images — read
`nextjs-conventions/SKILL.md` and follow it. It defines this project's
required conventions for: folder/module structure, kebab-case file naming,
separating logic from JSX, component modularity, image optimization
(`next/image`, webp/avif), memoization (`useMemo`/`useCallback`), dynamic
imports/lazy loading, and App Router SEO (metadata, `sitemap.ts`, `robots.ts`,
caching/rendering strategy, Core Web Vitals).

For anything non-trivial (new feature, new component, restructuring, SEO
work), also read the specific file(s) under `nextjs-conventions/references/`
that `SKILL.md`'s table points to for that task — don't rely on memory of
these rules alone. Run the "Quick checklist" in `SKILL.md` against every file
you touch.
