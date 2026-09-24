import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site-config";
import { LegalPage } from "@/modules/legal/components/legal-page";
import { PrivacyPolicy } from "@/modules/legal/components/privacy-policy";

const TITLE = "Privacy Policy | Replay";
const DESCRIPTION = "How Replay collects, uses, and protects your information, and how to manage your privacy rights and cookie preferences.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website", url: "/privacy", siteName: SITE_NAME,
    title: TITLE, description: DESCRIPTION, locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function Privacy() {
  return <LegalPage title="Privacy Policy" path="/privacy"><PrivacyPolicy /></LegalPage>;
}
