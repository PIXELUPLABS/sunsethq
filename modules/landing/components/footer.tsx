import Image from "next/image";
import { FOOTER_COLUMNS } from "../lib/constants";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#080808] px-6 pt-16 pb-6 sm:px-18 sm:py-14 lg:h-[627px] lg:px-[72px] lg:py-[54px]">
      <Image
        src="/images/footer/backdrop.webp"
        alt=""
        aria-hidden
        width={766}
        height={414}
        // The design starts the texture below the links, so it never reaches up
        // behind them and can stay at full strength. On mobile it runs the full
        // width of the footer — the 343px it used to be is the arc group inside
        // the export, not the export itself, which left it visibly undersized.
        className="pointer-events-none absolute bottom-0 left-0 -z-10 w-full max-w-none sm:w-[766px]"
      />

      <div className="relative mx-auto flex h-full w-full max-w-[1560px] flex-col justify-between gap-[120px] sm:gap-20 lg:items-end lg:gap-0">
        {/* Hovering one link recedes the rest of the list rather than
            highlighting the one under the cursor. */}
        <nav
          aria-label="Footer"
          className="relative grid w-full grid-cols-2 gap-x-5 gap-y-10 sm:flex sm:justify-between [&:has(a:hover)_a:not(:hover)]:opacity-40"
        >
          {/* One continuous rule across all four columns, matching the design.
              It sits between the headings and the links without taking part in
              layout, so the column gap stays exactly 32px. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-9 hidden border-t border-dashed border-white/16 sm:block"
          />

          {FOOTER_COLUMNS.map((column, index) => (
            <div
              key={column.title}
              className="relative flex flex-col gap-6 sm:w-[135px] sm:gap-8"
            >
              {/* The design runs one rule across each row of the 2x2 grid, so
                  a left-hand column carries its half plus the 20px gutter. */}
              <div
                aria-hidden
                className={`pointer-events-none absolute top-[30px] left-0 border-t border-dashed border-white/16 sm:hidden ${
                  index % 2 === 0 ? "-right-5" : "right-0"
                }`}
              />
              <p className="font-serif-accent text-[16px] leading-[1.1] tracking-[-0.16px] text-white sm:text-[18px] sm:tracking-[-0.18px]">
                {column.index} {column.title}
              </p>
              <div className="flex flex-col gap-2 sm:gap-2.5">
                {column.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="relative w-fit font-mono text-[12px] leading-[1.3] tracking-[0.72px] text-white/60 uppercase transition-opacity duration-300 ease-out sm:text-[14px] sm:tracking-[0.84px] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white after:transition-[width] after:duration-300 after:ease-out hover:after:w-full"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex w-full flex-col gap-3 sm:gap-4 lg:w-[403px]">
          <Image
            src="/images/footer/wordmark.webp"
            alt="Replay"
            width={403}
            height={133}
            className="h-auto w-[244px] max-w-full sm:w-[330px] lg:w-[403px]"
          />
          <div className="flex items-end justify-between gap-6">
            <p className="font-mono text-[10px] leading-[1.4] text-[#666] uppercase sm:text-white/60">
              © 2026 Replay. All rights reserved
              <br />
              Sunset HQ Corp.
            </p>
            <div className="flex shrink-0 items-center gap-2 opacity-[0.68] sm:gap-2.5">
              <a
                href="#"
                aria-label="X (Twitter)"
                className="flex size-[30px] items-center justify-center transition-opacity duration-300 hover:opacity-70 sm:size-[24px]"
              >
                <Image
                  src="/images/social-x.svg"
                  alt=""
                  width={17}
                  height={15}
                  className="h-auto w-[21px] sm:w-[17px]"
                />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex size-[30px] items-center justify-center transition-opacity duration-300 hover:opacity-70 sm:size-[24px]"
              >
                <Image
                  src="/images/social-linkedin.svg"
                  alt=""
                  width={17}
                  height={18}
                  className="h-auto w-[21px] sm:w-[17px]"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
