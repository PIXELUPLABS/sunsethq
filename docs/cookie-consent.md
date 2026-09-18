# Replay cookie controls

The first-party consent controls offer equally prominent accept/reject actions and a preferences dialog. A persistent Cookie settings button reopens the dialog. No legal pages or policy links are published: these are deferred until review, as requested.

Only optional campaign measurement is currently offered. No third-party analytics or advertising scripts are installed by this feature. Necessary form security and pending-request recovery remain available after rejection.

- Consent: `replay.cookie-consent.v1` in localStorage, versioned, expires after 180 days. Storage failures fall back to an in-memory choice for the current page.
- Campaign attribution: `replay.visit-attribution.v1` in sessionStorage, maximum 24 hours, collected only after explicit acceptance. Global Privacy Control overrides acceptance.
- Revocation: erases attribution from sessionStorage and in-memory tracking and strips campaign/landing-page fields from pending form recovery. The submit handler checks current consent again before sending a retry.
- Other tabs, history restores, and window focus refresh the choice. Expiration is also checked periodically and on every attribution capture/submission.

Run `npx tsx --test tests/cookie-consent.test.ts tests/attribution.test.ts tests/pending-submission.test.ts`, typecheck, and lint. Browser checks should cover initial visit, reject, customize, opt-in, reload, withdrawal, keyboard focus, and mobile layout.

Future analytics/advertising integrations must check consent before loading scripts or collecting events. Update the category descriptions and reviewed policies when processing changes. Sunset's Cookiebot account ID is not reused: this implementation does not depend on a domain registration or an external consent script.
