/**
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment. Without it, metadata
 * resolves against localhost and the canonical/social URLs ship wrong.
 * See .env.example.
 */
export const IS_STAGING = process.env.SITE_ENV === "staging";
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (process.env.CLOUDFLARE_STATIC_EXPORT === "true" &&
    (!configuredUrl || !configuredUrl.startsWith("https://") || /localhost|127\.0\.0\.1/.test(configuredUrl))) {
  throw new Error("Cloudflare builds require an explicit HTTPS NEXT_PUBLIC_SITE_URL.");
}
export const SITE_URL = configuredUrl ?? "http://localhost:3000";

export const SITE_NAME = "Replay";

export const SITE_TITLE = "Replay | Data as Growth Capital";

export const SITE_DESCRIPTION =
  "Replay values your company's operating data, strips every name and identifier, and pays you to license it to frontier AI labs.";
