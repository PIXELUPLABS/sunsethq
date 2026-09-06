---
name: nextjs-conventions
description: Personal Next.js code-quality, architecture, and SEO conventions to follow whenever writing, generating, editing, or reviewing Next.js/React code (components, pages, hooks, API routes, metadata) — including through an MCP server or Claude Code. Always consult this skill before creating new files, restructuring a Next.js project, naming components, adding images, writing component logic, or implementing/auditing SEO (metadata, generateMetadata, Open Graph/Twitter images, sitemap.xml, robots.txt, Core Web Vitals, AI crawler rules). Covers folder/module structure, kebab-case file naming, separating logic from JSX, modularity for code splitting, image optimization (webp/avif + next/image), memoization (useMemo/useCallback), dynamic imports/lazy loading, and App Router SEO. Trigger this any time the user is working inside a Next.js codebase, even if they don't explicitly mention "conventions," "style guide," or "SEO."
---

# Next.js Conventions

Personal architecture and code-quality standards, modeled on patterns used by
YC-backed startups and companies like Vercel and Linear. Apply these rules by
default to every Next.js file you create or edit — don't wait to be asked.

## Quick checklist (apply to every file you touch)

- [ ] Component lives in the right module folder, not dumped in a flat `components/` pile
- [ ] Filename is kebab-case (`navbar-structure.tsx`, not `NavbarStructure.tsx`)
- [ ] Logic (hooks, handlers, calculations) is in its own file, not mixed into the JSX file
- [ ] Component is broken down as small/modular as reasonably possible
- [ ] Any `<img>` use is replaced with `next/image`, source is webp/avif
- [ ] Expensive values/functions passed as props or used in effects are wrapped in `useMemo`/`useCallback`
- [ ] Heavy/below-the-fold/rarely-used components use `next/dynamic` with lazy loading
- [ ] No file/folder accidentally starts with `_` unless it's meant to be excluded from the build
- [ ] New/changed pages have correct metadata (`metadata` export or `generateMetadata`, not both) with `metadataBase`, title, description, canonical
- [ ] `robots.ts`/`sitemap.ts` exist at the app root and stay in sync with real routes (`/_next/` never disallowed, `lastModified` reflects real content changes)
- [ ] Indexable content is SSG/SSR/`"use cache"` — never CSR
- [ ] No raw `<img>`/CSR sneaking into a page that's meant to rank

If a task is non-trivial (new feature, new component, restructuring), read the
relevant reference file(s) below before writing code — don't rely on memory of
these rules alone once the project grows.

## Reference files

Read these as needed; each covers one area in depth. Naming follows
`area-description.md`, and the section is inferred from the filename prefix
(the part before the first `-`).

| File | Section | Read when... |
|---|---|---|
| `references/structure-project-layout.md` | structure | Creating a new feature, deciding where a file goes, setting up a new project |
| `references/naming-file-conventions.md` | naming | Naming any new file or folder |
| `references/logic-separation-of-concerns.md` | logic | Writing a component that has any state, handlers, or data transforms |
| `references/modularity-code-splitting.md` | modularity | A component/file is growing large or doing more than one job |
| `references/images-optimization.md` | images | Adding or rendering any image |
| `references/performance-memoization.md` | performance | Passing callbacks/objects as props, or doing non-trivial computation in render |
| `references/imports-dynamic-lazy-loading.md` | imports | Importing a heavy, below-the-fold, or conditionally-rendered component |
| `references/seo-metadata-and-files.md` | seo | Setting up/editing `metadata`, `generateMetadata`, `viewport`, `sitemap.ts`, `robots.ts`, `manifest.ts`, or OG/Twitter images |
| `references/seo-caching-rendering.md` | seo | Deciding how an SEO-relevant page/component should render or cache (`"use cache"`, SSG/SSR/CSR) |
| `references/seo-core-web-vitals.md` | seo | Working on LCP/INP/CLS, or explaining ranking factors beyond technical SEO |
| `references/seo-audit-checklist.md` | seo | Running an SEO audit, or before shipping any SEO-related change (checklist + common mistakes) |

Run a **quick SEO sanity check** on any page/route you touch that's meant to
be indexable: does it have `metadata`/`generateMetadata`, a canonical, and is
it SSG/SSR (not CSR)? If yes to something more involved (sitemap, OG images,
caching, an audit), read the matching `seo-*.md` file above first.

> Note: JSON-LD structured data and AI search/GEO (AI crawler rules like
> GPTBot/OAI-SearchBot) aren't covered yet — the source file referenced
> separate docs for those that weren't included. Add
> `references/seo-json-ld.md` and `references/seo-ai-search.md` if/when you
> want those filled in.

## Adding new rules later

When adding a new convention, create a new file under `references/` named
`area-description.md` (e.g. `data-fetching-patterns.md`, `state-global-store.md`).
Keep one area per file so the section stays inferable from the prefix, and add
a row to the table above. Files starting with `_` (e.g. `_scratch.md`) are
treated as excluded/inactive — use that prefix for drafts you don't want
applied yet.
