# Modularity: Code Splitting

Break everything down to the smallest sensible, single-responsibility unit.
Smaller modules are easier to lazy-load, test, and reuse — and keep bundles
lean.

## Rules

- **One responsibility per file.** If a component renders more than one
  clearly separable "thing" (e.g. a header + a list + a footer), split each
  into its own component file, then compose them in a parent.
- **Prefer many small components over one large one.** A 300-line component
  file is a signal to extract sub-components (`stats-card-header.tsx`,
  `stats-card-list.tsx`, etc.) into the same module's `components/` folder.
- **Extract repeated JSX or logic immediately**, don't wait for a third
  occurrence. Two near-identical blocks of markup or a repeated calculation
  should become a shared component or a shared function in `lib/`.
- **Keep components composable**, not deeply coupled to one parent's exact
  shape — accept props rather than reaching into global/shared state when a
  prop would do, so the piece can be reused or code-split independently.
- **Barrel files (`index.ts`) are fine for a module's public surface**, but
  don't let them become dumping grounds that force-bundle everything in a
  module together — export only what other modules actually need.
- Smaller, well-bounded components are what make `next/dynamic` lazy-loading
  (see `imports-dynamic-lazy-loading.md`) actually effective — you can't
  usefully code-split a monolith.
