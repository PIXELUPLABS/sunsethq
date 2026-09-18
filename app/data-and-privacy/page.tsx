import type { Metadata } from "next";
import { DataTrustPage } from "@/modules/data-trust/components/data-trust-page";
import { SITE_NAME } from "@/lib/site-config";

const TITLE = "Data & Trust — Securely license your data";
const DESCRIPTION =
  "Replay removes PII, confirms your right to license, and identifies any risk. All before your data moves.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/data-and-privacy" },
  openGraph: {
    type: "website",
    url: "/data-and-privacy",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function DataAndTrust() {
  return <DataTrustPage />;
}
