import Image from "next/image";
import { FOOTER_COLUMNS } from "../lib/constants";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#080808] px-6 py-14 sm:px-18 lg:h-[627px] lg:px-[72px] lg:py-[54px]">
      <Image
        src="/images/footer/backdrop.webp"
        alt=""
        aria-hidden
        width={766}
        height={414}
        // Scaled back on small screens: at its full 766px the texture reaches
        // up behind the link columns and costs them contrast.
        className="pointer-events-none absolute bottom-0 left-0 -z-10 w-[460px] max-w-none opacity-50 sm:w-[766px] sm:opacity-100"
      />

      <div className="relative flex h-full flex-col justify-between gap-20 lg:items-end lg:gap-0">
        <nav
          aria-label="Footer"
          className="relative grid w-full grid-cols-2 gap-x-8 gap-y-12 sm:flex sm:justify-between"
        >
          {/* One continuous rule across all four columns, matching the design.
              It sits between the headings and the links without taking part in
              layout, so the column gap stays exactly 32px. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-9 hidden border-t border-dashed border-white/16 sm:block"
          />

          {FOOTER_COLUMNS.map((column) => (
            <div
              key={column.title}
              className="relative flex flex-col gap-8 sm:w-[135px]"
            >
              {/* Stacked columns each need their own rule. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-9 border-t border-dashed border-white/16 sm:hidden"
              />
              <p className="font-serif-accent text-[18px] leading-[1.1] tracking-[-0.18px] text-white">
                {column.index} {column.title}
              </p>
              <div className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="relative w-fit font-mono text-[14px] leading-[1.3] tracking-[0.84px] text-white/60 uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white after:transition-[width] after:duration-300 after:ease-out hover:text-white hover:after:w-full"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex w-full flex-col gap-4 lg:w-[403px]">
          <Image
            src="/images/footer/wordmark.webp"
            alt="Replay"
            width={403}
            height={133}
            className="h-auto w-[260px] max-w-full sm:w-[330px] lg:w-[403px]"
          />
          <div className="flex items-end justify-between gap-6">
            <p className="font-mono text-[10px] leading-[1.4] text-white/60 uppercase">
              © 2026 Replay. All rights reserved
              <br />
              Sunset HQ Corp.
            </p>
            <div className="flex shrink-0 items-center gap-2.5 opacity-[0.68]">
              <a
                href="#"
                aria-label="X (Twitter)"
                className="flex size-[24px] items-center justify-center transition-opacity duration-300 hover:opacity-70"
              >
                <Image src="/images/social-x.svg" alt="" width={17} height={15} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex size-[24px] items-center justify-center transition-opacity duration-300 hover:opacity-70"
              >
                <Image
                  src="/images/social-linkedin.svg"
                  alt=""
                  width={17}
                  height={18}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
