import type { Metadata } from "next";
import { CareersPage } from "@/modules/careers/components/careers-page";
import { SITE_NAME } from "@/lib/site-config";
import { publishedTeams } from "@/modules/careers/lib/published-jobs";

const TITLE = "Replay | Careers";
const DESCRIPTION =
  "Join the small team building Replay's pipeline for licensing companies' operational data to frontier AI labs.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/careers" },
  openGraph: {
    type: "website",
    url: "/careers",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function Careers() {
  return <CareersPage teams={publishedTeams} />;
}
