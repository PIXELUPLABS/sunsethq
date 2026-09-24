"use client";
import { useCloudflareAnalytics } from "../hooks/use-cloudflare-analytics";

export function CloudflareAnalytics({ token }: { token: string }) {
  useCloudflareAnalytics(token);
  return null;
}
