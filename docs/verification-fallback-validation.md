# Attribution and verification fallback validation

Historical release evidence from September 18, 2026, approximately 16:29–16:36 UTC. The website release was `a280f940-72ae-4e93-b7c2-985f88092d52`; the production consumer release was `9fe72347-e4a8-4cc9-a8c6-07477c68c757`. Later releases must repeat the relevant checks.

## Real submissions

| Flow | Submission receipt | Attio entry | Observed result |
| --- | --- | --- | --- |
| Development unverified API smoke | `e6d72b90-00b2-4c3e-ae3d-dd43deabcfbd` | `2893c13c-75f8-4bed-a10b-e98e149b0d7c` | Accepted, delivered, marked Unverified with `script_unavailable`; retries retained one inquiry; rate limiter eventually returned 429. |
| Staging browser, consent accepted | `28952eb3-2777-493f-9ab4-c59b6a292637` | `2690c331-6e89-40d0-a5ad-3de4d47c36ba` | A tagged homepage visit navigated to the form without query parameters. Real Turnstile passed automatically. Original `browser-qa` / `attribution-release` tags and homepage landing URL reached Attio. |
| Production unverified API smoke | `a14c4efb-ff30-4cff-9c9d-2e75a35eab13` | `03573e1b-84f2-4ff3-8a18-386e064558e3` | Accepted, delivered, marked Unverified with `script_unavailable`; original attribution persisted, retries retained one inquiry, and the tighter limiter returned 429. |
| Browser with Turnstile script blocked | `9e7f009c-e7c7-4135-85ab-656ffc798453` | `b4f5512f-3f20-4c08-ac6d-ae1da8cc5cc1` | A local copy of the exported site used CSP to block Turnstile and submitted to the development backend. After rejecting optional consent, the browser showed **Send for review**, then **Request received**. D1/Attio recorded Unverified, `script_unavailable`, and no campaign attribution. |

All inquiries above use clearly synthetic data and remain available for inspection. The blocked-script browser test used the development backend, while the production unverified test exercised the live API and real production delivery resources.

## Email delivery

Cloudflare Email Sending accepted all three unverified notifications, and mailbox queries confirmed actual arrival at `jono@sunsethq.com` from `leads@notifications.replay.ai`:

- Development smoke: 16:29:39 UTC. The first message landed in Spam; it was moved to Inbox and marked important.
- Production smoke: 16:35:04 UTC, observed in Inbox.
- Blocked-script browser test: 16:35:23 UTC, observed in Inbox.

D1 recorded each successful notification timestamp. Subsequent delivery attempts skipped completed sends. This does not establish exactly-once email delivery across a crash between provider acceptance and the ledger update; the runbook describes that at-least-once boundary.

## Release checks and companion verification

Both deployment paths ran all `tests/*.test.ts` plus TypeScript before publishing. Scoped ESLint, export validation, and production routing/indexing/404 checks passed. Automated coverage includes invalid-token rejection, unverified acceptance and throttling, email retries/deduplication, first-touch attribution, consent changes, and legacy receipt compatibility.

Independent production browser verification confirmed normal verified signup still works after rejecting optional cookies, preserves all five form answers, creates one Attio entry, and omits optional attribution. See [production validation](production-validation.md). Production cookie settings were also checked for persistence, rejection, focus restoration, and absence of browser errors.

The tests observed a brief rate-limit propagation delay. The configured 10/minute general and 2/minute unverified limits are per IP per Cloudflare location and approximate; they do not provide a global hard cap.
