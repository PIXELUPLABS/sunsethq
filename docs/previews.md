# Cloudflare branch previews

The `Cloudflare preview` GitHub Actions workflow uploads each non-`main` branch to the staging Worker's version previews. Each branch has a stable URL; an automatically updated PR comment, the GitHub deployment, and the workflow summary link to it. A new push updates that branch's alias. The alias includes a short hash to avoid collisions between similar branch names.

Previews require the existing `@sunsethq.com` Cloudflare Access login, send noindex headers, and use the development D1 ledger, queue, and Attio workspace. Builds use the committed jobs snapshot and staging canonical URLs. Production continues through its existing `main` release workflow. Uploading a preview does not replace the active staging deployment or run database migrations.

## Initial setup

Configured September 21, 2026. The GitHub `preview` environment uses the dedicated `replay-marketing-github-previews` token, scoped to the staging Worker and expiring September 21, 2027. Rotate it before expiry. The following steps document how to recreate the setup.

1. Authenticate Wrangler to Cloudflare account `c4f47127b63c426c98541372fa9b8b67`.
2. Verify the staging Worker's existing Access application (`8ca9c967-5515-4cf2-91c2-0e7e514e522d`) covers the Worker, including all preview URLs, with the existing `@sunsethq.com` policy. Enable staging preview URLs only after verifying this coverage.
3. Add `replay-marketing-dev.workers.dev` to the **Replay Marketing Staging** Turnstile widget's allowed domains, retaining its existing domain. Turnstile's subdomain matching allows branch and version preview hosts; server verification still checks the exact request origin and action.
4. Create a GitHub environment named `preview`. Set its `CLOUDFLARE_API_TOKEN` secret to a dedicated deployment API token scoped to **Individual Workers Editor** for `replay-marketing-staging`, and its `TURNSTILE_STAGING_SITE_KEY` variable to the staging widget's public site key. Existing resource bindings require no separate database or queue permissions. No production environment secrets are copied.
5. Push the workflow branch, verify its **Deploy branch preview** job succeeds, and open the environment URL. Merge the workflow changes to make them available to subsequent branches. Existing branches must incorporate the workflow before their pushes trigger it.

The upload script verifies the anonymous Access redirects on pages, assets, robots, and APIs before upload, then checks both the branch alias and version URL afterward. It also verifies that the active staging deployment is unchanged. If a post-upload Access check fails, it disables preview routing for the staging Worker and fails the job. Restore the Access policy before re-enabling previews.

Wrangler 4.135 can upload with a per-Worker token but fails when reading the account subdomain to print the resulting URL. The script recognizes only that specific post-upload error, requires a newly uploaded version ID, and verifies its branch alias and commit through the Worker API. All other upload failures stop the workflow.

## Usage

Push a branch or manually run **Cloudflare preview** in GitHub Actions on a non-`main` branch. Find the URL in the PR's **Cloudflare preview ready** comment, under the `preview` deployment, or in the job summary. The same bot comment updates after successful deployments at the PR's current commit. Opening or reopening a PR also posts the comment if its current commit already has a successful preview. That comment-only workflow runs without checking out PR code or accessing Cloudflare credentials.

Sign in using the team's existing Access login. Signup tests create sandbox leads; the delivery Worker may send test notification emails for unverified submissions.

Forks cannot deploy through this workflow. Runs for the same branch are serialized and are allowed to finish their Access checks. Different branches upload independent versions and aliases. There is no automatic pruning or cleanup on PR merge/closure. The branch link stays on its most recent build, and old version URLs remain available while retained by Cloudflare and remain protected by Access.

Keeping these versions does not incur an idle hosting charge. Worker usage is billed for requests and CPU execution, and static asset storage has no additional charge. The account plan and shared development resources have their own billing. See [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) and [static asset billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/).

References: [Worker preview URLs](https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/), [GitHub Actions deployments](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/).
