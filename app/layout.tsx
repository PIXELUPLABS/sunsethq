import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import localFont from "next/font/local";
import { Agentation } from "agentation";
import { VisitAttribution } from "@/modules/attribution/components/visit-attribution";
import { CookieConsent } from "@/modules/consent/components/cookie-consent";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  IS_STAGING,
} from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400"],
});

const stkBureauSerif = localFont({
  src: "../public/fonts/stk-bureau-serif-book.woff2",
  variable: "--font-serif",
  weight: "400",
  style: "normal",
  display: "swap",
});

// The Regular cut, used for h3s. Its trial file carries only 71 glyphs, so
// `--font-serif-regular` in globals.css lists the Book cut behind it to cover
// punctuation it lacks (hyphen, colon, ampersand, apostrophe and the like).
const stkBureauSerifRegular = localFont({
  src: "../public/fonts/stk-bureau-serif-regular.woff2",
  variable: "--font-serif-regular-only",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  robots: IS_STAGING ? { index: false, follow: false, noarchive: true } : { index: true, follow: true },
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      {
        url: "/favicon-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${stkBureauSerif.variable} ${stkBureauSerifRegular.variable} h-full antialiased motion-safe:scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <VisitAttribution />
        {children}
        <CookieConsent />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
