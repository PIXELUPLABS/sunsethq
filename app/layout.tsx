import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Hedvig_Letters_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${hedvigLettersSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
