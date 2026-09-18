# Production deployment

Canonical site: **https://www.replay.ai**. Requests to `replay.ai` and HTTP requests permanently redirect to HTTPS on `www`, preserving the path and query string. The root-domain Worker route uses the existing proxied DNS records; mail DNS is untouched. The `www` custom domain and certificate are managed by Cloudflare. Workers Paid is enabled on the account.

## Resources

| Resource | Production |
| --- | --- |
| Website and same-origin intake | `replay-marketing` |
| Private CRM delivery and recovery | `replay-leads-delivery` |
| D1 ledger | `replay-leads-prod-ledger` / `98211ded-10c5-4e4c-944d-b51d5fdf0763` |
| Queue | `replay-leads-prod` / `88765635079e4531ab1c963a678884b9` |
| Failed queue | `replay-leads-prod-failed` / `43bf0b91cc264da9ab5157c13f95aa90` |
| Attio workspace | `Sunset` / `8f055b0e-1a94-4844-bba0-94600f169f3c` |
| Attio People list | `Replay Website Leads` / `349bc21b-299c-46ec-a436-b5c1239ee5ee` |

Production and staging share the Cloudflare account but have separate Workers, queues, D1 databases, Turnstile widgets, and Attio workspaces. The production Worker has no `workers.dev` or preview URL. Staging remains gated and noindex; production is public and indexable. There is no AWS dependency.

## Credentials

Use ignored, owner-readable `.env.production.local` at the repository root:

```dotenv
ATTIO_API_KEY=<production Attio token>
NEXT_PUBLIC_SITE_URL=https://www.replay.ai
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<public key from production:setup>
TURNSTILE_SECRET_KEY=<private key from production:setup>
```

The deployment uploads `ATTIO_API_KEY` only as an encrypted secret on `replay-leads-delivery`; the website receives only the Turnstile verification secret. Never put the Attio token in `NEXT_PUBLIC_*`, a Wrangler `vars` field, Git, or a chat message. Do not replace the sandbox token in `.env` with a production token.

`attio:setup:prod` needs permission to configure the list's custom attributes. Runtime delivery needs workspace/list identity reads, People record upserts, and list-entry reads/writes; unrelated administrative permissions are unnecessary for a dedicated runtime token. After rotating a token, update `.env.production.local` and redeploy the private consumer with `npm run leads:deploy:prod`.

## Repeatable deployment

```sh
npm ci
npm run production:setup
npm run attio:setup:prod
npm run production:deploy
```

`production:setup` idempotently prepares isolated resources and a Turnstile widget restricted to `www.replay.ai`. It does not publish a hostname. The production Attio workspace and list are pinned in `workers/lead-delivery/wrangler.json`; setup refuses the sandbox or a mismatched token.

`production:deploy` runs the integration tests, refreshes and sanitizes jobs, generates responsive images, builds 19 HTML pages, checks production canonicals/robots/assets and scans for secret values. Production assets are copied to `out-production`. It then applies D1 migrations, deploys the private consumer and token, and waits for a fresh successful recovery/dependency heartbeat. On first publication the site is uploaded without public routes, receives its scoped secret, and only then gets its hostname and root redirect. Subsequent deployments retain the existing Worker and bindings.

Run `npm run production:verify` for public pages, canonicals, indexing, permanent redirects with campaign parameters, the public health endpoint, hidden diagnostics, and the real 404 response. Initial DNS/certificate propagation can delay this check after a successful deployment; inspect the deployed custom domain before repeating deployment. A verification failure does not automatically remove a live production site.

## Signup durability and monitoring

The success response means the signup is stored in D1. A failed queue send is recovered by the scheduled scan. Attio outages are retried with backoff and deduplicated by a unique submission ID. The receipt in D1 is committed before queue acknowledgement. Pending payloads do not auto-expire; delivered payloads are cleared after 30 days. Both production queues retain messages for 14 days. The D1 ledger remains the recovery source after queue expiry.

[D1 Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/) retains recovery history for 30 days on Workers Paid. A database restore rewinds data: preserve the current bookmark and reconcile any submissions accepted after the restore point. Do not casually restore or purge a production ledger.

The public `/api/health` endpoint exposes only `{ "healthy": true/false }`. Detailed `/api/lead-health` is unavailable in production. Health becomes unhealthy for a missing/stale recovery heartbeat, unreadable database, failed Attio identity/list checks, any failed-queue backlog, or a signup pending at least five minutes.

Cloudflare Health Checks use the existing `sunsethq.com` Business entitlement to probe production from Eastern North America and Western Europe every minute. Delivery health checks `/api/health`; page availability checks `/value-my-data` for HTTP 200 and the application's opening HTML. Cloudflare inspects only the first 10 KB, while inline styles place the form later in the response. The build check verifies all five form fields in the complete HTML and the Turnstile site key in the exported JavaScript. Production alerts go to `jono@sunsethq.com`. The monitors do not execute browser JavaScript or Turnstile, so validate one real browser submission after changes to the form or verification configuration.

Follow the [recovery procedure](staging.md#recovery), using the production resource IDs above. Keep lead bodies and secrets out of logs and support tickets. Do outage rehearsals in staging; do not intentionally break production credentials.

## Rollback

Use the production website Worker's Deployments tab to restore a known-good version, preserving bindings and secrets. Roll back the private delivery Worker independently if necessary. A Worker rollback does not undo D1 migrations, CRM schema additions, or DNS/routes. Keep the recovery schedule active while diagnosing delivery problems. Never delete a queue or database as a rollback step.
