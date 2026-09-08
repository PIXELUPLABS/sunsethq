import Image from "next/image";
import { FOOTER_COLUMNS } from "../lib/constants";

export function Footer() {
  return (
    <footer className="bg-[#080808] px-6 py-16 sm:px-18">
      <div className="mx-auto flex max-w-[1296px] flex-col gap-20">
        <div className="flex flex-col justify-between gap-14 lg:flex-row">
          <div className="flex max-w-[309px] flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Image src="/images/footer-logo.svg" alt="" width={43} height={43} />
                <span className="font-serif text-4xl leading-none text-white">
                  Replay
                </span>
              </div>
              <p className="text-lg leading-relaxed tracking-tight text-white/75">
                Yield on what you&apos;ve already built.
                <br />
                A new asset class needs a standard.
              </p>
            </div>
            <div className="flex items-center gap-2 opacity-70">
              <a href="#" aria-label="X (Twitter)" className="flex size-[30px] items-center justify-center">
                <Image src="/images/social-x.svg" alt="" width={21} height={19} />
              </a>
              <a href="#" aria-label="LinkedIn" className="flex size-[30px] items-center justify-center">
                <Image src="/images/social-linkedin.svg" alt="" width={21} height={22} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title} className="flex flex-col gap-4">
                <p className="font-serif-accent text-base tracking-tight text-white">
                  {column.index} {column.title}
                </p>
                <div className="flex flex-col gap-2 text-sm tracking-tight text-white/75">
                  {column.links.map((link) => (
                    <a key={link} href="#" className="transition-opacity hover:opacity-100">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <p className="font-mono text-xs uppercase tracking-wide text-white">
            © 2026 Replay. All rights reserved · Sunset HQ Corp.
          </p>
        </div>
      </div>
    </footer>
  );
}
