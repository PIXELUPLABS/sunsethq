import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site-config";
import { LegalPage } from "@/modules/legal/components/legal-page";
import { TermsOfService } from "@/modules/legal/components/terms-of-service";

const TITLE = "Terms of Service | Replay";
const DESCRIPTION = "Read the terms governing your access to and use of Replay's website and services.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "website", url: "/terms", siteName: SITE_NAME,
    title: TITLE, description: DESCRIPTION, locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function Terms() {
  return <LegalPage title="Terms of Service" path="/terms"><TermsOfService /></LegalPage>;
}
