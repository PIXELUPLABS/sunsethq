import type { Metadata } from "next";
import { ValueMyDataPage } from "@/modules/value-my-data/components/value-my-data-page";
import { SITE_NAME } from "@/lib/site-config";

const TITLE = "Value My Data — See what your data could be worth";
const DESCRIPTION =
  "Tell us about your company and the data it generates. Replay gives you an initial view of its licensing potential, without ever touching raw customer or employee data.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/value-my-data" },
  openGraph: {
    type: "website",
    url: "/value-my-data",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function ValueMyData() {
  return <ValueMyDataPage />;
}
