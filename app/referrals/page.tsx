import type { Metadata } from "next";
import { ReferralsPage } from "@/modules/referrals/components/referrals-page";
import { SITE_NAME } from "@/lib/site-config";

const TITLE = "Referrals — Earn 10% referring companies to Replay";
const DESCRIPTION =
  "Refer a company sitting on years of operating data. If Replay licenses it, they get paid and so do you: $10,000 or 10% of their upfront fee, whichever is greater.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/referrals" },
  openGraph: {
    type: "website",
    url: "/referrals",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function Referrals() {
  return <ReferralsPage />;
}
