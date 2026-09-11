/**
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment. Without it, metadata
 * resolves against localhost and the canonical/social URLs ship wrong.
 * See .env.example.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "Replay";

export const SITE_TITLE =
  "Replay — Fund growth by licensing the data you already have";

export const SITE_DESCRIPTION =
  "Replay values your company's operating data, strips every name and identifier, and pays you to license it to frontier AI labs.";
