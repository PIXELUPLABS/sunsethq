import Image from "next/image";
import Link from "next/link";
import { FOOTER_COLUMNS } from "../lib/constants";
import { ReplayWordmark } from "./replay-wordmark";

export function Footer() {
  return (
    <footer
      className="relative isolate overflow-hidden bg-[#080808] px-6 pt-16 pb-6 sm:px-18 sm:py-14 lg:px-[72px] lg:pt-[54px] lg:pb-0"
    >
      {/* No bottom padding at `lg:` - the design (node 6684:31964) lets the
          wordmark's own artwork run past where that padding would sit and
          bleed slightly off the footer's bottom edge (see the wordmark
          block's own `lg:-mb-[10px]` below), so reserving space for it here
          would just show up as dead air beneath the letters. The height
          itself is intrinsic now (no more fixed `lg:h-[627px]` /
          `min-[1500px]:h-[740px]!`) - `lg:gap-[176px]` below reproduces the
          design's own nav-to-wordmark spacing directly instead of relying on
          `justify-between` to guess it from a hand-measured container
          height, so the layout tracks the design at 1440/1560/1800px+
          without needing a new magic number at each width. */}
      <div className="relative mx-auto flex w-full max-w-[1560px] flex-col gap-16 sm:gap-20 lg:gap-[176px]">
        {/* Hovering one link recedes the rest of the list rather than
            highlighting the one under the cursor. */}
        <nav
          aria-label="Footer"
          className="relative grid w-full grid-cols-2 gap-x-5 gap-y-10 lg:flex lg:justify-between [&:has(a:hover)_a:not(:hover)]:opacity-40 [&:has(a:hover)_a:not(:hover)]:delay-0"
        >
          {/* One continuous rule across both columns, matching the design
              (node 6684:32825) - sits between the headings and the links
              without taking part in layout, so the column gap stays exactly
              32px. `lg:` only: the mobile 2-col grid below runs its own
              per-column rule instead (its columns can stack to different
              heights, which one shared rule can't span cleanly). */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-9 hidden border-t border-dashed border-white/16 lg:block"
          />

          {FOOTER_COLUMNS.map((column, index) => (
            <div
              key={column.title}
              className="relative flex flex-col gap-6 lg:min-w-[200px] lg:gap-8"
            >
              {/* The design runs one rule across each row of the mobile
                  2-col grid, so a left-hand column carries its half plus
                  the 20px gutter. `lg:` swaps this for the single rule
                  spanning the whole row above. */}
              <div
                aria-hidden
                className={`pointer-events-none absolute top-[30px] left-0 border-t border-dashed border-white/16 lg:hidden ${
                  index % 2 === 0 ? "-right-5" : "right-0"
                }`}
              />
              <p className="font-serif-accent text-[16px] leading-[1.1] tracking-[-0.16px] text-white lg:text-[18px] lg:tracking-[-0.18px]">
                {column.title}
              </p>
              {/* Links stack vertically below `lg:` (narrow mobile/tablet
                  widths can't fit "How it works" and friends side by
                  side), matching the design's own horizontal row
                  (`gap-[40px]`) only once there's room for it. */}
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
          {/* `lg:-mb-[10px]`: in the design the wordmark artwork itself runs
              about 10px past this block's own bottom edge before the
              footer's `overflow-hidden` crops it - reproduced here as a
              negative margin so it bleeds into (and slightly past) where
              the footer's now-removed bottom padding used to sit, instead
              of stopping flush at this block's edge. The copyright row's
              `lg:bottom-[34px]` below accounts for the extra 10px so it
              keeps the design's own ~24px clearance from the footer's true
              bottom edge, not this now-longer block's edge. */}

          {/* The decorative code/data-snippet texture behind the wordmark
              (node 6684:32370) - full-bleed past this block's own `lg:`
              padding via matching negative insets (`-72px`, the same value
              as the footer's `lg:px-[72px]`), and overhanging top/bottom the
              same way it does in the design. Sits before the wordmark box
              below so it paints underneath it; not present below `lg:`
              since the source design is a desktop-only (1440px) frame. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden lg:top-[-24px] lg:right-[-72px] lg:bottom-[-64px] lg:left-[-72px] lg:block"
          >
            <Image
              src="/images/footer/pattern.png"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          {/* The wordmark's own dedicated aspect box - kept separate from
              the copyright/social row below now, so that row's absolute
              positioning at `sm:` and up still anchors to this same box
              (via the outer `relative` wrapper collapsing to this box's
              own height once the row is taken out of flow there). */}
          <div className="relative aspect-[1297/337] w-full">
            <ReplayWordmark className="absolute inset-0 h-full w-full" />
          </div>

          {/* Stacked in normal flow below the wordmark below `lg:` instead of
              overlaid on it: this row's `bottom-6` inset is a fixed pixel
              offset from the wordmark box's own bottom edge, and that box's
              height scales with viewport width (`aspect-[1297/337]`) - at
              desktop's much taller box that offset clears the glyphs'
              ink comfortably, but anywhere short of that (mobile through
              1024-1439px) it sat inside the lower half of the letterforms,
              overlapping them. `lg:` and up restores the exact original
              overlay (absolute, anchored to the outer `relative` wrapper
              above, which is equivalent to anchoring to the wordmark box
              itself once this row is out of flow there). */}
          <div className="mt-4 flex items-end justify-between gap-6 lg:absolute lg:inset-x-0 lg:bottom-[34px] lg:mt-0">
            <p className="font-mono text-[10px] leading-[1.4] text-[#666] uppercase lg:text-white/60">
              © 2026 Replay. All rights reserved
              <br />
              Sunset HQ Corp.
            </p>
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
                href="#"
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
