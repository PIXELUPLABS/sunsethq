import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Inlines page CSS into <style> tags instead of a render-blocking
    // <link>, cutting the request-waterfall before first paint. Tailwind's
    // atomic output stays small, so this doesn't bloat the HTML.
    inlineCss: true,
  },
  async redirects() {
    return [
      // The page launched at /data-and-trust; keep old links and any indexed
      // URLs working.
      { source: "/data-and-trust", destination: "/data-and-privacy", permanent: true },
    ];
  },
};

export default nextConfig;
