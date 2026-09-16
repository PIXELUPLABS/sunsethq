import Image from "next/image";
import { FOOTER_COLUMNS } from "../lib/constants";
import { ReplayWordmark } from "./replay-wordmark";

export function Footer() {
  return (
    <footer
      className="relative isolate overflow-hidden bg-[#080808] px-6 pt-16 pb-6 sm:px-18 sm:py-14 lg:h-[627px] lg:px-[72px] lg:py-[54px] min-[1500px]:h-[740px]!"
    >
      {/* `min-[1500px]:h-[740px]!`: the wordmark block's `aspect-[1297/337]`
          height grows with its own width (measured, not just derived from
          the `max-w-[1560px]` cap - the nav row's own height turned out not
          to be quite as width-independent as that math assumed), and nav +
          the `sm:gap-20` (80px) + that wordmark height + this padding
          (108px) start exceeding the base 627px right around a 1500px
          viewport, then keep growing until the wordmark's width hits its
          1560px cap past ~1704px, where the total plateaus at ~737.5px.
          Since this whole block relies on `h-full` + `justify-between` to
          spread nav and the wordmark block across the footer's own exact
          height (with the wordmark's bottom always flush against the
          footer's own bottom edge), that requires an explicit, definite
          height on the footer itself - `min-height` alone breaks `h-full`
          against an auto-sized parent, which silently stopped that spread
          and left the bottom of the wordmark block (including the social
          icons and copyright line) clipped by this section's own
          `overflow-hidden`, past the end of the page. 740px covers the
          worst case with a couple of px to spare; the breakpoint starts a
          little before 1500px so the switch itself never dips negative. */}
      <div className="relative mx-auto flex h-full w-full max-w-[1560px] flex-col justify-between gap-16 sm:gap-20">
        {/* Hovering one link recedes the rest of the list rather than
            highlighting the one under the cursor. */}
        <nav
          aria-label="Footer"
          className="relative grid w-full grid-cols-2 gap-x-5 gap-y-10 sm:flex sm:justify-between [&:has(a:hover)_a:not(:hover)]:opacity-40 [&:has(a:hover)_a:not(:hover)]:delay-0"
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
                    className="relative w-fit font-mono text-[12px] leading-[1.3] tracking-[0.72px] text-white/60 uppercase transition-opacity delay-150 duration-300 ease-out sm:tracking-[0.84px] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white after:transition-[width] after:duration-300 after:ease-out hover:after:w-full"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="relative w-full">
          {/* The wordmark's own dedicated aspect box - kept separate from
              the copyright/social row below now, so that row's absolute
              positioning at `sm:` and up still anchors to this same box
              (via the outer `relative` wrapper collapsing to this box's
              own height once the row is taken out of flow there). */}
          <div className="relative aspect-[1297/337] w-full">
            <ReplayWordmark className="absolute inset-0 h-full w-full" />
          </div>

          {/* Stacked in normal flow below the wordmark on mobile instead of
              overlaid on it: this row's `bottom-6` inset is a fixed pixel
              offset from the wordmark box's own bottom edge, and that box's
              height scales with viewport width (`aspect-[1297/337]`) - at
              desktop's much taller box that offset clears the glyphs'
              ink comfortably, but at mobile's short box it sat inside the
              lower half of the letterforms, overlapping them. `sm:` and up
              restores the exact original overlay (absolute, anchored to
              the outer `relative` wrapper above, which is equivalent to
              anchoring to the wordmark box itself once this row is out of
              flow there). */}
          <div className="mt-4 flex items-end justify-between gap-6 sm:absolute sm:inset-x-0 sm:bottom-6 sm:mt-0">
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
