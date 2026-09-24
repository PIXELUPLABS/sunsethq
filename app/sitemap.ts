import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { jobsUpdatedAt, publishedRoles } from "@/modules/careers/lib/published-jobs";
import { LEGAL_LINKS, LEGAL_UPDATED_AT } from "@/modules/legal/lib/constants";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...LEGAL_LINKS.map((link) => ({ url: `${SITE_URL}${link.href}`, lastModified: LEGAL_UPDATED_AT })),
    ...publishedRoles.map((role) => ({ url: `${SITE_URL}/careers/roles/${role.id}`, lastModified: jobsUpdatedAt || undefined })),
    {
      url: `${SITE_URL}/`,
      lastModified: new Date("2026-09-11"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/data-privacy`,
      lastModified: new Date("2026-09-11"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/careers`,
      lastModified: new Date("2026-09-14"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/value-my-data`,
      lastModified: new Date("2026-09-16"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: new Date("2026-09-16"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
