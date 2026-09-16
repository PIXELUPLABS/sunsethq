import type { Metadata } from "next";
import { BlogsPage } from "@/modules/blogs/components/blogs-page";
import { SITE_NAME } from "@/lib/site-config";

const TITLE = "Notes on a new asset class — Blogs";
const DESCRIPTION =
  "How company data is valued, cleaned, protected, and placed. Written for the people who own it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blogs" },
  openGraph: {
    type: "website",
    url: "/blogs",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function Blogs() {
  return <BlogsPage />;
}
