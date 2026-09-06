# Performance: Memoization

Use `useMemo`/`useCallback` to avoid redundant recalculation and redundant
function re-creation, especially in hooks (see `logic-separation-of-concerns.md`)
where derived values and handlers naturally live.

## When to use `useMemo`

- The computation is non-trivial (filtering/sorting/transforming arrays,
  aggregations, formatting) and runs on every render otherwise.
- The result is passed as a prop to a memoized child (`React.memo`) or used
  as a dependency in another hook — an unmemoized object/array recreated
  every render will defeat memoization downstream and other hooks' deps.

```ts
const formattedStats = useMemo(
  () => formatDashboardData(rawStats, range),
  [rawStats, range]
);
```

## When to use `useCallback`

- A function is passed as a prop to a memoized child component.
- A function is a dependency of another hook (`useEffect`, `useMemo`, etc.)
  and you want to avoid re-running that hook every render.

```ts
const handleRangeChange = useCallback((next: "7d" | "30d") => {
  setRange(next);
  trackRangeChange(next);
}, []);
```

## Don't over-apply it

- Don't wrap every single value/function in `useMemo`/`useCallback`
  "by default" — for cheap computations or components that aren't
  memoized/don't re-render often, it adds complexity without benefit.
  Apply it where re-renders or expensive recalculation are actually a
  concern: expensive derived data, props to memoized children, and
  dependencies of other hooks.
- Don't duplicate a calculation in two places — if the same derived value or
  formatting logic is needed twice, compute it once (memoized if
  appropriate) in the hook/lib file and reuse it, rather than recomputing
  inline in multiple spots.
