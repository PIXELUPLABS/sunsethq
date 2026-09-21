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

Push a branch or manually run **Cloudflare preview** in GitHub Actions on a non-`main` branch. Find the URL in the PR's **Cloudflare preview ready** comment, under the `preview` deployment, or in the job summary. The same bot comment updates after successful deployments at the PR's current commit. Opening a PR also posts the comment if its current commit already has a successful preview. That comment-only workflow runs without checking out PR code or accessing Cloudflare credentials.

After each upload passes its commit and Access checks, the workflow automatically deletes older preview versions for that same branch, keeping only the newly verified version. This also removes the branch's old **Preview removed** response when a PR reopens. The first successful run cleans up any accumulated history. The stable branch link continues pointing to the latest build; old immutable commit links are disposable. Failed builds or access checks do not prune the previous preview. Pruning refuses to run if the verified version is missing, its commit differs, or a newer version of that branch has appeared. It protects other branches and all versions referenced by staging deployments, and reports the removal count in the workflow summary.

Sign in using the team's existing Access login. Signup tests create sandbox leads; the delivery Worker may send test notification emails for unverified submissions.

Merging or closing a PR automatically retires its branch link to an HTTP 410 **Preview removed** response and deletes the uploaded site versions, including older commits. The bot comment changes to **Cloudflare preview removed**, and the branch's GitHub deployments are marked inactive. If another open PR uses the same branch, the preview stays available until the last PR closes. Reopening a PR builds a fresh preview. Pushes to a branch whose PRs are all closed run cleanup instead of recreating the site.

Forks cannot deploy or clean up through this workflow. Deployment and cleanup for the same branch share one concurrency group. The upload script also checks live PR state before and after uploading so a PR closed during a build does not leave a preview behind. Cleanup selects only versions carrying the branch's exact alias and deployment annotations, and refuses to remove versions referenced by staging deployments.

Cloudflare does not allow deletion of the newest stored Worker version. Live testing also showed a deleted version's branch URL continuing to serve content. Cleanup therefore first points that branch alias to an inert version returning HTTP 410, preserving the staging secret binding. This version is never deployed to staging and serves no site content. Cleanup then deletes the branch's site versions and verifies that the active staging deployment is unchanged. It retains one small removed-preview response per closed branch; repeated cleanup is idempotent. The existing Access policy remains in place. Cloudflare can continue serving deleted immutable version URLs during its routing propagation; these remain protected by the team login.

References: [Worker preview URLs](https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/), [GitHub Actions deployments](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/).
