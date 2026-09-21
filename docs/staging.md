# Cloudflare staging

URL: https://replay-marketing-staging.replay-marketing-dev.workers.dev

Cloudflare Access permits verified `@sunsethq.com` addresses, using emailed login codes and a 24-hour session. The Worker-specific policy covers every URL, asset, API route, and [branch preview](previews.md). Application ID: `8ca9c967-5515-4cf2-91c2-0e7e514e522d`. Preview URLs are enabled behind the same Access policy. The separately deployed [production site and CRM configuration](production.md) use isolated resources.

## Deploy

Use Node 22.17+ and npm. Wrangler must be authenticated to the pinned Cloudflare account. Secrets live in ignored `.env` and are scoped to Workers; the browser only receives the public Turnstile site key.

```sh
npm ci
npm run staging:setup
npm run test:leads
npm run test:staging
npm run leads:deploy:dev
npm run staging:deploy
```

`staging:setup` configures the staging-only Turnstile widget. `leads:deploy:dev` checks Attio identity/schema, applies D1 migrations, and deploys the private consumer and local-development intake. `staging:deploy` verifies the Access gate and shared dev-ledger binding, refreshes jobs, generates responsive WebP images, exports Next pages, checks metadata/assets for correctness and secrets, uploads the verification secret, and deploys the site.

The deployment script requires an existing live Access gate. Initial provisioning was done with `workers_dev: false`, followed by configuring Worker Access in the dashboard, and only then enabling the hostname. There is intentionally no automatic gate-bypass option. After deployment, a failed gate check disables the staging hostname and previews. If a network issue causes that shutdown, verify the Worker Access policy in the dashboard before re-enabling the hostname.

Rollback: use the staging Worker's Deployments tab to restore a previous known-good version. Preserve the Access application and scoped secrets. Treat D1 migrations separately: reverting Worker code does not revert the database.

## Website behavior

- Five main pages and 14 current job pages are built as HTML, plus metadata and a real 404 page.
- Job descriptions are sanitized at build time. Jobs refresh on deployment; an Ashby outage fails the new build while the previous deployment stays online.
- Responsive images are generated locally; no runtime image optimizer or Next server is needed.
- Staging sends `X-Robots-Tag: noindex, nofollow, noarchive`, noindex metadata, and disallow-all robots rules. Access is the actual privacy boundary.
- Security headers restrict framing and external resource origins. Next's inline bootstrap currently requires `unsafe-inline`; this is not a nonce-based CSP.
- The existing blog listing is a content prototype; individual articles have not been authored or published by this deployment.

## Lead reliability

The staging Worker handles same-origin `/api/leads`, validates Turnstile and allowed origins, then writes a durable D1 receipt **before** returning success. D1 database: `replay-leads-dev-ledger` (`ac3c1faa-c94f-4269-9a0a-ff69b5ac5a41`). A queue send failure does not lose the saved submission. A scheduled recovery job scans pending records every minute and retries dispatch after a five-minute lease. The same submission UUID identifies every retry.

The private consumer checks the pinned Attio workspace, reconciles duplicate or ambiguous CRM writes, records the Attio entry ID in D1, then acknowledges the queue message. Pending payloads never expire automatically. Delivered payloads are cleared after 30 days; IDs, hashes, timestamps, and delivery receipts remain. D1 Time Travel is available for database recovery (30 days on the current Workers Paid plan).

Transient delivery failures use exponential queue backoff, capped at one hour. The recovery lease extends past the next scheduled queue retry so a prolonged Attio outage does not produce another copy every five minutes. If the queued retry disappears, the ledger still recovers it after that lease expires. Other Attio 4xx responses become terminal `failed` receipts requiring operator recovery; see [the recovery procedure](lead-capture.md#recovery). Terminal receipts remain visible to health monitoring even after queue retention expires.

The browser saves attempted submissions and their IDs in tab-scoped session storage, for up to 24 hours, to survive a reload after a failed or uncertain request. It removes the saved draft once receipt is confirmed. Browser storage restrictions do not block submission. Closing the tab or clearing browser storage can remove an unconfirmed draft.

## Native Cloudflare monitoring

[Health Checks](https://dash.cloudflare.com/c4f47127b63c426c98541372fa9b8b67/sunsethq.com/traffic/health-checks) uses the existing Business-plan entitlement; no website DNS or mail routing changes are needed.

- Check: `replay-staging-signup-delivery`.
- ID: `0173130d7fdc18fc3aeac5cc0e40c63a`.
- HTTPS endpoint: `https://replay-leads-intake-dev.replay-marketing-dev.workers.dev/health`.
- Every 60 seconds from Eastern North America and Western Europe; 5-second timeout, two retries; requires HTTP 200 and `"healthy":true`.
- Alert: **Replay staging signup delivery**, email **jono@sunsethq.com**, both healthy and unhealthy transitions.

A second check, `replay-staging-site-access` (`830e1c01c74f1a6f6b786a26aa0cd568`), checks the staging site's `/api/leads` URL with GET. It expects the anonymous Access redirect (HTTP 302, without following redirects), using the same intervals and regions. The same email notification includes both checks. This catches a disabled/unreachable staging hostname or a missing Access gate; the deployment guard separately verifies the redirect's exact Access application.

The public health endpoint exposes only a boolean. The authenticated staging `/api/lead-health` endpoint shows aggregate diagnostics, with no lead names, emails, or payloads. Health fails when D1 cannot be read, recovery heartbeat is missing or at least three minutes old, Attio identity/list access fails, a pending lead is at least five minutes old, or the failed-delivery queue contains a message. Logs in Cloudflare contain event names and receipt IDs, never lead bodies or tokens.

Cloudflare's native checks continue running independently if the recovery Worker stops. They do not simulate a browser completing Turnstile and submitting the form. Run a synthetic browser signup after changes to the form, Access, Turnstile, or deployment configuration. No platform can promise zero failures; production readiness includes paid Workers/D1 capacity (free quotas can reject requests), a recovery owner, verified alerts, and a separately configured production workspace/database/queues.

## Recovery

1. Check the email alert and authenticated `/api/lead-health`.
2. Inspect the delivery Worker's logs and D1 rows by submission ID. Keep payloads out of tickets and logs.
3. Repair the Attio token/list/schema or Cloudflare failure. Pending D1 rows remain eligible for automatic delivery.
4. For a dead letter, first confirm its submission exists in D1 and whether Attio delivery has completed. Do not purge the failed queue blindly. If D1 says `failed`, explicitly reopen the receipt using [lead recovery](lead-capture.md#recovery) after fixing the cause. Replay unchanged IDs only when needed, then acknowledge the failed copy after verifying delivery.
5. Confirm D1 says `delivered`, Attio has the matching entry, and the health check recovers.

## Verified staging exercises — September 18, 2026

- Hosted browser submission with real Turnstile while the sandbox Attio credential was temporarily invalid: the form confirmed durable receipt; four CRM attempts failed; after restoring the credential, attempt five delivered all answers and campaign fields to exactly one Attio entry. Receipt `cdde365b-7a1c-427e-9c20-37c3470b80a2`, entry `3c5738ce-19ff-43b7-88de-761be9079049`.
- A synthetic stalled D1 submission was created without sending a queue message. The deployed schedule recovered it and delivered exactly one Attio entry: receipt `c816db2b-104b-4a1c-ab36-9f84e78c7fc6`, entry `14524db4-5e73-4407-85f2-38bc3f9f868c`.
- Cloudflare sent a real unhealthy email at 15:24:09 UTC and a recovery email at 15:27:06 UTC to `jono@sunsethq.com`; both were verified in the recipient mailbox. The notification's test email was also verified.
- Automated verification: 15 lead/draft tests, two staging-routing tests, TypeScript, and scoped ESLint passed. The export checker verified 19 pages, metadata, static assets, the 404 page, and absence of configured secrets in the output.

Repeat the queue-loss rehearsal with `npm run leads:rehearse:dev`. It is pinned to the sandbox, intentionally creates a synthetic lead, and triggers monitoring alerts while the record is stalled. It does not modify production or change credentials.
