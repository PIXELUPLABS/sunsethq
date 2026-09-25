import type { Metadata } from "next";
import { AboutPage } from "@/modules/about/components/about-page";
import { SITE_NAME } from "@/lib/site-config";

const TITLE = "About — Replay";
const DESCRIPTION =
  "Replay's pipeline turns companies' operating data into revenue — safely licensed to frontier AI labs.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "/about",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function About() {
  return <AboutPage />;
}
