# Structure: Project Layout

Follow the "modules" pattern used by companies like Linear and Vercel instead
of one giant flat `components/` folder. Group everything that belongs to a
feature/domain together, and keep truly shared, generic UI separate.

## Target layout

```
src/
├── app/                     # Next.js App Router: routes only, kept thin
│   ├── (marketing)/
│   ├── dashboard/
│   │   └── page.tsx         # imports from modules/dashboard, stays tiny
│   └── layout.tsx
├── modules/                 # Feature/domain-scoped code
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── navbar-structure.tsx
│   │   │   └── stats-card.tsx
│   │   ├── hooks/
│   │   │   └── use-dashboard-stats.ts
│   │   ├── lib/
│   │   │   └── format-dashboard-data.ts
│   │   └── types.ts
│   └── billing/
│       ├── components/
│       ├── hooks/
│       └── lib/
├── components/               # Truly shared/generic UI only (buttons, inputs, modals)
│   └── ui/
│       ├── button.tsx
│       └── modal.tsx
├── hooks/                    # Shared, cross-module hooks
├── lib/                      # Shared utilities, API clients, constants
└── styles/
```

## Rules

- **Route files (`app/**/page.tsx`, `layout.tsx`) stay thin.** They should
  mostly import and compose from `modules/<feature>/`, not contain the actual
  feature logic or markup.
- **A module owns its own components, hooks, and logic.** If a piece of UI or
  a hook is only used by one feature, it lives inside that feature's module,
  not in the shared `components/` or `hooks/` folders.
- **Promote to shared only when reused.** The first time a component/hook is
  needed by a second, unrelated module, move it up to `components/ui/` or
  `hooks/`, don't start there speculatively.
- **Special underscore prefix:** Any file or folder prefixed with `_`
  (e.g. `_internal-helpers/`, `_draft-component.tsx`) is treated as excluded
  from routing/build — use it for private helpers colocated inside `app/`
  route segments, or for work-in-progress files that shouldn't ship yet.
- Keep folder names lowercase, kebab-case, and singular-vs-plural consistent
  (prefer plural for collections: `components/`, `hooks/`, `modules/`).
