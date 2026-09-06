# Imports: Dynamic Imports & Lazy Loading

Use `next/dynamic` to lazy-load components wherever it reduces the initial
bundle, instead of statically importing everything up front.

## Good candidates for dynamic import

- Below-the-fold sections/components not needed for first paint.
- Heavy third-party-library-backed components (charts, rich text editors,
  maps, code editors, video players).
- Components only rendered conditionally (modals, drawers, tooltips with
  heavy content, feature-flagged UI).
- Anything client-only that doesn't need SSR (`ssr: false`).

## Pattern

```tsx
import dynamic from "next/dynamic";

const RevenueChart = dynamic(
  () => import("../components/revenue-chart").then((m) => m.RevenueChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false, // only if the component truly can't/shouldn't render on the server
  }
);
```

## Rules

- Always provide a `loading` fallback for a noticeably-sized component so
  layout doesn't jump.
- Only set `ssr: false` when the component genuinely depends on
  browser-only APIs (e.g. `window`, canvas libs) — don't disable SSR by
  default, since it costs SEO/first-paint content for no reason otherwise.
- Route-level code splitting is automatic in the App Router (each `page.tsx`
  is its own chunk) — `next/dynamic` is for splitting *within* a page, for
  the heavy/conditional pieces described above.
- Pair this with the modularity rules (`modularity-code-splitting.md`): a
  component has to be cleanly separated into its own file/module before it
  can be usefully dynamically imported.
