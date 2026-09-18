# Initial production validation

Historical launch verification on September 18, 2026, at approximately 16:31 UTC. This records the initial production deployment; later releases must repeat relevant checks.

- Site: https://www.replay.ai
- Website version: `393588c0-1bc2-4c5b-bdaa-98f675e1fcc9`.
- `npm run production:verify` passed using normal DNS resolution: public pages, canonical origin, indexing, permanent redirects, public health, hidden diagnostics, and real 404s.
- HTTP and HTTPS requests to `replay.ai` permanently redirect to HTTPS on `www.replay.ai`, preserving path and query parameters. HTTP on `www` also redirects to HTTPS.
- A real browser completed Turnstile automatically and submitted the production form. The page displayed “Request received — we’ll be in touch.”
- The synthetic submission `a250e204-a0e0-4e84-934c-0b0567638098` was saved at `2026-09-18T16:30:41.660Z`, then marked delivered after one attempt at `2026-09-18T16:30:47.867Z`.
- An independent Attio query found exactly one matching entry, `9db5f9e8-9c75-4cd1-a337-e930d85f03b9`, in **Replay Website Leads**, with all five form answers, production environment, source URL, and the expected campaign parameters (`production-smoke` / `launch-verification`). The test is labeled **Replay Production Launch Verification** and remains for auditability.
- Both enabled production Health Checks were observed **Healthy**: `replay-production-signup-delivery` (`e75afe5e5803447c5b51f2557d3c717b`) and `replay-production-signup-page` (`a39ceca6931b11d33068c167c0037f35`).
- **Replay production signup delivery** is an enabled Cloudflare notification covering both production checks and both Healthy/Unhealthy transitions. Its test email arrived at `jono@sunsethq.com` at `2026-09-18T16:30:53Z`.

The page monitor initially failed while its body matcher was being calibrated, because the form falls outside Cloudflare's first 10 KB inspection window. The corrected matcher checks the application's opening HTML; the complete form is checked during the build. Historical failures remain visible in the dashboard. Native health checks do not execute the form's JavaScript or Turnstile.

See the [production runbook](production.md) for resources, secrets, deployment, recovery, and rollback. Verification fallback and consent work was still in progress in another task at this baseline; this record does not claim to validate that later release.

## Consent and verification release

At approximately 16:36 UTC on September 18, 2026, the live site was independently rechecked after the next deployment:

- Cloudflare reported website version `a280f940-72ae-4e93-b7c2-985f88092d52` serving 100% of traffic. The deploying task reported consumer version `9fe72347-e4a8-4cc9-a8c6-07477c68c757`.
- `npm run production:verify` passed again with normal DNS.
- A browser loaded the live signup page with campaign parameters, selected **Reject optional**, and submitted a new synthetic signup after automatic Turnstile verification. The page displayed the success confirmation.
- Submission `9dbf5003-0b8f-4f97-a774-4a168a05fd1d` was durably accepted at `2026-09-18T16:35:42.017Z` and delivered after one attempt at `2026-09-18T16:35:50.244Z`.
- D1 recorded verification status `verified` and an empty campaign object. An independent Attio query found exactly one entry, `21165e5d-cfb9-43d8-85b9-cf9fd289ee1c`, labeled **Replay Production Consent Release Verification**, with all five answers, **Verified** status, and no optional campaign attribution. This confirms rejecting optional tracking does not block signup and does suppress campaign capture in this flow.
- Verification-unavailable and notification delivery tests are owned by the deploying task; this browser check specifically covers the verified flow with optional tracking rejected.
