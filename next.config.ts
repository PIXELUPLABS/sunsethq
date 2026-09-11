import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Inlines page CSS into <style> tags instead of a render-blocking
    // <link>, cutting the request-waterfall before first paint. Tailwind's
    // atomic output stays small, so this doesn't bloat the HTML.
    inlineCss: true,
  },
};

export default nextConfig;
