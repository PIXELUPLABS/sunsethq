# Replay marketing website

Next.js marketing site with Cloudflare Workers/Queues lead capture into Attio.

See [the lead-capture runbook](docs/lead-capture.md) for setup, dev testing, security boundaries, and production rollout.

Use Node.js 22.17 or newer and npm. For a fresh checkout:

```bash
npm ci
cp .env.example .env
```

Add the sandbox `ATTIO_API_KEY` to ignored `.env`, then run `npm run dev` and open [the local website](http://localhost:3000). Local D1 migrations run automatically. Form submissions write to the real **Replay Sandbox** in Attio; use synthetic data. Local email delivery is simulated by Wrangler.

The sandbox workspace/list is already configured in the committed Worker configuration. `npm run attio:setup:dev` is only needed when provisioning or updating its schema and requires an Attio token with configuration-write permissions. Production credentials belong in `.env.production.local` and must not be used for local development.

`npm run dev` starts Next and local lead Workers. `npm run dev:remote` uses the deployed Cloudflare dev pipeline after the setup steps in the runbook. `npm run dev:web` runs the website alone without CRM credentials; form delivery requires a lead backend.

Run `node scripts/check-release.mjs` for all automated tests and TypeScript checks.

The full [Cloudflare staging site](https://replay-marketing-staging.replay-marketing-dev.workers.dev) is gated to `@sunsethq.com` and uses the Attio sandbox. See [staging deployment and monitoring](docs/staging.md).

Production is [www.replay.ai](https://www.replay.ai), with separate credentials in ignored `.env.production.local` and its own storage, queues, and Attio list. See [production deployment and recovery](docs/production.md). Deploy with `npm run production:deploy` and verify with `npm run production:verify`.
