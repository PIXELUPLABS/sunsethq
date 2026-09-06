# Naming: File Conventions

**Always use kebab-case for filenames**, regardless of what the exported
component/function is called.

## Correct

```
navbar-structure.tsx
use-dashboard-stats.ts
format-dashboard-data.ts
stats-card.tsx
api-client.ts
```

## Incorrect

```
NavbarStructure.tsx      ❌ PascalCase
useDashboardStats.ts     ❌ camelCase
StatsCard.tsx            ❌ PascalCase
apiClient.ts             ❌ camelCase
```

## Notes

- The **exported component/function name inside the file** can still be
  PascalCase for components (`export function NavbarStructure()`) or
  camelCase for hooks/functions (`export function useDashboardStats()`) —
  it's only the *filename on disk* that's kebab-case.
- Hooks still get the `use-` filename prefix to match the `use` prefix of the
  hook itself: `use-dashboard-stats.ts` exporting `useDashboardStats`.
- Type-only files: `types.ts` or `<feature>-types.ts` (e.g. `billing-types.ts`).
- Applies to every file type: components, hooks, lib/utils, API route
  handlers, config files — not just `.tsx`.
- Rule/reference files for this skill itself follow the same idea, just with
  a `area-description.md` shape (see the main SKILL.md).
