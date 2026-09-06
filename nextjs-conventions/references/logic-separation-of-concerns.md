# Logic: Separation of Concerns

Never mix JSX/markup and business logic (state, handlers, data transforms,
fetching, calculations) in the same file. Split into a presentational file and
a logic file.

## Pattern

For a component `stats-card.tsx`, its logic lives in a matching hook file:

```
modules/dashboard/
├── components/
│   └── stats-card.tsx          # JSX + minimal wiring only
└── hooks/
    └── use-stats-card.ts       # all state, effects, handlers, calculations
```

`hooks/use-stats-card.ts`:
```ts
import { useMemo, useState } from "react";

export function useStatsCard(rawStats: RawStats) {
  const [range, setRange] = useState<"7d" | "30d">("7d");

  const formattedStats = useMemo(
    () => formatDashboardData(rawStats, range),
    [rawStats, range]
  );

  return { range, setRange, formattedStats };
}
```

`components/stats-card.tsx`:
```tsx
import { useStatsCard } from "../hooks/use-stats-card";

export function StatsCard({ rawStats }: { rawStats: RawStats }) {
  const { range, setRange, formattedStats } = useStatsCard(rawStats);

  return (
    <div>
      <RangeToggle value={range} onChange={setRange} />
      <StatsList stats={formattedStats} />
    </div>
  );
}
```

## Rules

- If a component needs `useState`, `useEffect`, `useReducer`, data
  transforms, or non-trivial event handlers, pull that into a `use-*.ts` hook
  file in the module's `hooks/` folder — even if it's only used by one
  component.
- Pure calculations/formatters that don't need React go in `lib/` as plain
  functions (e.g. `format-dashboard-data.ts`), not inline in the component or
  even in the hook.
- The component file's job is: call the hook, destructure what it needs,
  return JSX. Avoid `.map()`-with-inline-logic, inline `.filter()` chains, or
  multi-line ternaries inside JSX — extract them into the hook or lib file.
- API route handlers follow the same idea: the route file (`route.ts`) stays
  thin and delegates to a service/lib function rather than embedding the
  business logic inline.
