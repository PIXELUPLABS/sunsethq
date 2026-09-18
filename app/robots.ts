import type { MetadataRoute } from "next";
import { IS_STAGING, SITE_URL } from "@/lib/site-config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: IS_STAGING ? [{ userAgent: "*", disallow: "/" }] : [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    ...(IS_STAGING ? {} : { sitemap: `${SITE_URL}/sitemap.xml` }),
  };
}
