"use client";
import { useEffect } from "react";
import { startCloudflareAnalytics } from "../lib/cloudflare-analytics";

export function useCloudflareAnalytics(token: string) {
  useEffect(() => startCloudflareAnalytics(token), [token]);
}
