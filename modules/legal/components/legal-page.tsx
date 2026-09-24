import type { ReactNode } from "react";
import Link from "next/link";
import { Footer } from "@/modules/landing/components/footer";
import { Navbar } from "@/modules/landing/components/navbar";
import { LEGAL_LINKS, LEGAL_UPDATED_AT, LEGAL_UPDATED_LABEL } from "../lib/constants";

type LegalPageProps = {
  title: string;
  path: "/privacy" | "/terms";
  children: ReactNode;
};

export function LegalPage({ title, path, children }: LegalPageProps) {
  return (
    <div className="flex flex-col">
      <Navbar linkBase="/" />
      <main className="bg-[#fcfcfc] px-6 pt-28 pb-20 text-[#141518] sm:px-12 lg:pt-40 lg:pb-28">
        <div className="mx-auto w-full max-w-[760px]">
          <header className="border-b border-dashed border-[#d4d4d4] pb-8 sm:pb-10">
            <Link href="/" className="inline-flex min-h-11 items-center gap-2 font-mono text-xs tracking-wide text-[#565656] uppercase hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4">
              <span aria-hidden="true">&larr;</span> Back to Replay
            </Link>
            <h1 className="mt-6 font-serif text-[42px] leading-[1.08] tracking-tight sm:text-[64px]">{title}</h1>
            <p className="mt-5 font-mono text-xs leading-relaxed tracking-wide text-[#565656] uppercase">
              Last updated: <time dateTime={LEGAL_UPDATED_AT}>{LEGAL_UPDATED_LABEL}</time>
            </p>
            <nav aria-label="Legal" className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
              {LEGAL_LINKS.map((link) => (
                <Link key={link.href} href={link.href} aria-current={path === link.href ? "page" : undefined}
                  className="inline-flex min-h-11 items-center text-sm text-[#565656] underline underline-offset-4 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 aria-[current=page]:text-black aria-[current=page]:decoration-2">
                  {link.label}
                </Link>
              ))}
            </nav>
          </header>
          <article aria-label={title} className="pt-8 text-base leading-[1.8] text-[#565656] sm:pt-10 [&_a]:text-[#141518] [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:decoration-2 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:scroll-mt-28 [&_h2]:font-serif [&_h2]:text-[28px] [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-[#141518] [&_h3]:mt-7 [&_h3]:mb-3 [&_h3]:font-medium [&_h3]:text-lg [&_h3]:leading-snug [&_h3]:text-[#141518] [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-2 [&_strong]:font-medium [&_strong]:text-[#141518] [&_address]:not-italic">
            {children}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
