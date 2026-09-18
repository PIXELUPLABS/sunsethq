import type { NextConfig } from "next";

const staticExport = process.env.CLOUDFLARE_STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(staticExport ? {
    output: "export",
    images: { loader: "custom", loaderFile: "./lib/static-image-loader.ts" },
  } : { async rewrites() {
    // Production routes /api/leads directly to the intake Worker in Cloudflare.
    return process.env.NODE_ENV === "development"
      ? [{ source: "/api/leads", destination: `${process.env.LEADS_DEV_API_ORIGIN || "http://127.0.0.1:8787"}/api/leads` }]
      : [];
  } }),
  experimental: {
    // Inlines page CSS into <style> tags instead of a render-blocking
    // <link>, cutting the request-waterfall before first paint. Tailwind's
    // atomic output stays small, so this doesn't bloat the HTML.
    inlineCss: true,
  },
};

export default nextConfig;
