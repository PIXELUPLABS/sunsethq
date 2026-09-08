import type { Metadata } from "next";
import { Geist, Geist_Mono, Hedvig_Letters_Serif } from "next/font/google";
import localFont from "next/font/local";
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
  title: "Replay — Fund growth by licensing the data you already have",
  description:
    "Replay values your company's operating data, strips every name and identifier, and pays you to license it to frontier AI labs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${stkBureauSerif.variable} ${hedvigLettersSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col max-w-[1800px] mx-auto">{children}</body>
    </html>
  );
}
