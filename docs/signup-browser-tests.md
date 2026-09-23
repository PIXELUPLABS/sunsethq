# Signup browser regression gate

Run on Node 22.17+:

```sh
npm ci
npx playwright install --with-deps chromium
npm run ci:build
npm run test:browser
```

The `Signup browser journey` CI job runs on PRs and main without secrets. Production deployment requires it alongside the existing quality and export jobs. All Actions remain pinned. Playwright starts an exclusive loopback server; an existing server on port 3100 is an error, preventing accidental testing against another checkout. Tests run serially, with no automatic retries hiding failures. Failure traces are uploaded in CI for seven days and saved locally under ignored `test-results/` (`npx playwright show-trace <trace.zip>`).

Both desktop Chromium and mobile Pixel 7 emulation test the production static export:

- Native required-field and email validation prevents intake requests.
- Rejecting optional cookies permits signup and stores no campaign attribution.
- Blocked Turnstile script and unresolved challenge offer the existing manual-review fallback; the receipt/CRM are unverified and the simulated operator alert runs once.
- Interrupted requests before intake and lost responses after persistence preserve answers and the submission UUID across reload; retry confirms the same receipt.
- Lost CRM write responses reconcile to one entry, and replay after delivery creates no additional inquiry.
- Queue-send loss preserves a pending receipt; scheduled reconciliation and transient CRM retry eventually deliver it.
- Explicit verification rejection creates no receipt and permits a corrected retry.
- Qualified submissions (10+ people and at least 80% English, including businesses under two years old) load the installed Cal embed client with the submitted email and a simulated event. Nonqualifying and unverified submissions never load Cal. A blocked Cal script leaves a direct booking link and does not prevent CRM delivery.

## What CI verifies and simulates

The browser uses the shipped React form. `/api/leads` invokes the actual `handleIntake`, migrations and ledger SQL run against a temporary **file-backed SQLite database through the test D1 adapter**, and queue draining invokes the actual `handleDelivery` and `deliverToAttio`. Tests inspect pending/delivered receipts, retry delays, entry IDs, mapped CRM fields, alert count, and unique writes. Browser interception drops selected responses; it does not substitute a fake success endpoint.

Turnstile's script/siteverify response, Cal's remote event page, Attio HTTP responses, queue transport/timing, rate-limit counters, and email delivery are simulated. The Cal client script is served from the installed package. The harness advances local recovery time and controls CRM failures. This is **not a real Attio integration test**, a live Cal booking test, a Cloudflare runtime/D1 compatibility test, real device testing, or proof of live Turnstile behavior. Existing Worker unit tests remain responsible for rate-limit, origin, terminal-failure, and notification boundary cases.

All fake credentials, dependency injection, fault controls, and state endpoints are confined to `tests/browser/`. No production module, Worker config, shared credential, or Access policy changes. The harness loads no `.env` and makes no external CRM/verification calls. The ordinary build uses the existing public test key. Never deploy that test export as the production release.

To preview the exported form locally while the browser gate runs on port 3100, use `REPLAY_BROWSER_TEST_PORT=3200 npx tsx tests/browser/server.ts` and open `http://127.0.0.1:3200/value-my-data`. The preview uses the isolated local ledger and simulated CRM. Calendar booking is unconfigured by default.

## Separately labelled hosted sandbox smoke

This explicitly opted-in command reads only the named sandbox `.env` and pins the destination to the development intake and sandbox workspace/list:

```sh
npx tsx scripts/smoke-signup-sandbox.mts /path/to/original-checkout/.env
```

It creates one unique synthetic submission through the **deployed manual-review fallback**, sends the configured real operator notification, polls hosted D1 for delivery, replays the same UUID, and queries Attio for exactly one matching list entry with the saved answers. No credential changes, global fault injection, staging Access bypass, or production access. Never use `.env.production.local`. To resume, pass the printed UUID as the next argument.

Verified September 18, 2026:

- Receipt: `06be4b8e-236f-4ec9-afea-e6536cd0f9e7`.
- Attio entry: `f98a95a7-ab35-4087-9db8-12cbf3bf645f`.
- Hosted development intake → D1 → Queue → private consumer → sandbox Attio passed; repeated receipt resolved to exactly one entry, all checked answers/campaign fields matched, and D1 recorded the operator notification timestamp.
- This smoke uses HTTP, not a hosted browser session or a real Turnstile challenge. It does not claim to verify staging Access, mailbox receipt, Cloudflare scheduling under failure, or production delivery.

## Checks for this change

- `npm run lint`
- `npm run check` — 72 tests and TypeScript
- `npm run typecheck`
- `npm run ci:build` — production export, 19-page metadata/assets/secret scan
- `npm run test:browser` — 22 cases across desktop/mobile
- Hosted sandbox smoke command above

Live Turnstile and Cal booking coverage remain manual release checks; secret-free CI deliberately uses deterministic provider responses.
