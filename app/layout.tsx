import type { Metadata } from "next";
import { Geist, Geist_Mono, Hedvig_Letters_Serif } from "next/font/google";
import localFont from "next/font/local";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
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

const stkBureauSerif = localFont({
  src: "../public/fonts/stk-bureau-serif-book.woff2",
  variable: "--font-serif",
  weight: "400",
  style: "normal",
  display: "swap",
});

const hedvigLettersSerif = Hedvig_Letters_Serif({
  variable: "--font-serif-accent",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  // The dark mark reads on a light browser UI and vice versa. app/favicon.ico
  // stays as the fallback for browsers that don't take SVG icons.
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
  // The og:image/twitter:image tags come from app/opengraph-image.jpg via the
  // file convention, with its alt text from app/opengraph-image.alt.txt.
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
      // motion-safe keeps the anchor scroll animated for everyone except
      // readers who've asked for reduced motion, who get an instant jump.
      className={`${geistSans.variable} ${geistMono.variable} ${stkBureauSerif.variable} ${hedvigLettersSerif.variable} h-full antialiased motion-safe:scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
