import Image from "next/image";
import Link from "next/link";
import { CookieSettingsButton } from "@/modules/consent/components/cookie-settings-button";
import { LEGAL_LINKS } from "@/modules/legal/lib/constants";
import { FOOTER_COLUMNS } from "../lib/constants";
import { ReplayWordmark } from "./replay-wordmark";

const FOOTER_BOTTOM_STRIP = "/images/footer/bottom-strip.png";

export function Footer() {
  return (
    <footer
      className="relative isolate overflow-hidden bg-[#080808] px-6 pt-16 pb-6 sm:px-18 sm:py-14 lg:px-[72px] lg:pt-[54px] lg:pb-0"
    >
      <div className="relative mx-auto flex w-full max-w-[1560px] flex-col gap-16 sm:gap-20 lg:gap-[176px]">
        <nav
          aria-label="Footer"
          className="relative grid w-full grid-cols-2 gap-x-5 gap-y-10 lg:flex lg:justify-between [&:has(a:hover)_a:not(:hover)]:opacity-40 [&:has(a:hover)_a:not(:hover)]:delay-0"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-9 hidden border-t border-dashed border-white/16 lg:block"
          />

          {FOOTER_COLUMNS.map((column, index) => (
            <div
              key={column.title}
              className="relative flex flex-col gap-6 lg:min-w-[200px] lg:gap-8"
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute top-[30px] left-0 border-t border-dashed border-white/16 lg:hidden ${
                  index % 2 === 0 ? "-right-5" : "right-0"
                }`}
              />
              <p className="font-serif text-[16px] leading-[1.1] tracking-[-0.16px] text-white lg:text-[18px] lg:tracking-[-0.18px]">
                {column.title}
              </p>
              <div className="flex flex-col gap-2 lg:flex-row lg:gap-10">
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="relative w-fit font-mono text-[12px] leading-[1.3] tracking-[0.72px] text-white/60 uppercase transition-opacity delay-150 duration-300 ease-out lg:text-sm lg:tracking-[0.84px] lg:whitespace-nowrap after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white after:transition-[width] after:duration-300 after:ease-out hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="relative w-full lg:-mb-[10px]">
          {/* Text-strip artwork behind the wordmark: a 1737 x 350 export sized
              against the 1296 x 337 wordmark of the 1440 design and centered,
              so it bleeds evenly past the content column and scales with it. */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-1/2 aspect-[1737/350] w-[134.0278%] -translate-x-1/2 opacity-40"
          >
            <Image
              src={FOOTER_BOTTOM_STRIP}
              alt=""
              fill
              sizes="(min-width: 1704px) 2091px, 134vw"
              className="pointer-events-none object-cover"
            />
          </div>

          <div className="relative aspect-[1297/337] w-full">
            <ReplayWordmark className="pointer-events-none absolute inset-0 h-full w-full" />
          </div>

          <div className="relative z-20 mt-4 flex items-end justify-between gap-6 lg:absolute lg:inset-x-0 lg:bottom-[34px] lg:mt-0">
            <div className="flex flex-col items-start">
              <p className="font-mono text-[10px] leading-[1.4] text-[#666] uppercase lg:text-white/60">
                © 2026 Replay. All rights reserved
                <br />
                Sunsets HQ Corp.
              </p>
              <nav aria-label="Legal and privacy" className="flex flex-wrap items-center gap-x-4">
                {LEGAL_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="inline-flex min-h-11 items-center font-mono text-xs text-white/80 underline underline-offset-4 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4">
                    {link.label}
                  </Link>
                ))}
                <CookieSettingsButton />
              </nav>
            </div>
            <div className="flex shrink-0 items-center gap-2 opacity-[0.68] lg:gap-2.5">
              <a
                href="#"
                aria-label="X (Twitter)"
                className="flex size-[30px] items-center justify-center transition-opacity duration-300 hover:opacity-70 lg:size-[24px]"
              >
                <Image
                  src="/images/social-x.svg"
                  alt=""
                  width={17}
                  height={15}
                  className="h-auto w-[21px] lg:w-[17px]"
                />
              </a>
              <a
                href="https://www.linkedin.com/company/replay-data"
                aria-label="LinkedIn"
                className="flex size-[30px] items-center justify-center transition-opacity duration-300 hover:opacity-70 lg:size-[24px]"
              >
                <Image
                  src="/images/social-linkedin.svg"
                  alt=""
                  width={17}
                  height={18}
                  className="h-auto w-[21px] lg:w-[17px]"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
