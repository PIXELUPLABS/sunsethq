"use client";

import { BottomStripes } from "@/modules/landing/components/bottom-stripes";
import { useInView } from "@/modules/landing/hooks/use-in-view";

// Same grain source/tiling as the main page's pricing section
// (`pricing-section.tsx`'s `GRAIN_TEXTURE`), applied here so this section's
// dark gradient carries the same texture treatment.
const GRAIN_TEXTURE = "/images/pricing/grain-texture.webp";

/**
 * Benefits, "asymmetric split" layout: a left column (title / diagram /
 * intro, three individually dashed-bordered boxes stacked flush against
 * each other) against a right column of 4 benefit cards in a 2x2 grid.
 * Built to match the Figma reference (node 6639:2580 in file
 * AYzBKhVneW9mct6tUchEo7, "The Process - 3.2"):
 * - The left/right columns are an even 50/50 split.
 * - The whole split box fills the section's full content width - it sits
 *   directly in the same max-w-[1560px] dashed frame as
 *   `why-replay-section.tsx` above and `open-roles-section.tsx` below,
 *   with no secondary cap, so this section's container width matches
 *   both neighbors exactly.
 * - The diagram has alignment-guide tick lines radiating to the frame
 *   edges.
 *
 * The bottom stripe band reuses `<BottomStripes />` (`bottom-stripes.tsx`)
 * as-is - the same real, scroll-animated component the home page's own
 * "Who it's for" section (`pricing-section.tsx`) uses for its bottom
 * edge. It's absolutely positioned against the section, not the padded
 * content, so `sm:pb-48` below exists purely to keep the benefits grid
 * clear of it - `why-replay-section.tsx`/`open-roles-section.tsx` don't
 * need any equivalent padding since they don't carry a bottom stripe
 * band.
 *
 * The intro paragraph is the Figma mock's own layout-description text ("a
 * tiny system visual sits under the intro...") kept verbatim to match the
 * reference - it reads as a design note, not real copy, and MUST be
 * replaced before shipping. Benefit copy below is likewise placeholder
 * text, not factual company policy - do not ship either without
 * confirming real content.
 *
 * Entrance: the left column (title/diagram/intro) fades/slides in as one
 * unit - it's visually one continuous flush-bordered block, so animating
 * its three pieces independently would look like it's falling apart
 * rather than arriving - while the 4 benefit cards stagger in
 * individually after it, same `useInView` pattern as
 * `why-replay-section.tsx`/`values-section.tsx`.
 */
const PLACEHOLDER_BENEFITS = [
  { label: "Salary & equity", copy: "Strong cash compensation plus meaningful ownership." },
  { label: "Health", copy: "Full medical, dental, and vision from day one." },
  { label: "Time off", copy: "Unlimited PTO that's actually used." },
  { label: "Equipment", copy: "Any setup you need, replaced on request." },
];

export function BenefitsSection() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  const enter = (delayMs: number) => ({
    className: `transition-[opacity,transform] duration-500 ease-snap ${
      inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
    }`,
    style: { transitionDelay: `${delayMs}ms` },
  });
  const leftColumnEnter = enter(0);

  return (
    <section
      className="relative flex justify-center overflow-hidden px-3 sm:px-18"
      style={{ backgroundImage: "linear-gradient(180deg, #133264 0%, #147dba 160%)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: `url(${GRAIN_TEXTURE})`,
          backgroundSize: "296px 296px",
        }}
      />

      {/* Dashed grid frame matching the main page's own grid system
          (`buyers-section.tsx`, `stats-section.tsx`: a max-w-[1560px]
          column bracketed by `border-x border-dashed`), at the same width
          as `why-replay-section.tsx` directly above this one - colored for
          a dark section instead of the light-section `#d4d4d4`. Uses
          `border-white/30` (not a fainter opacity) to match every other
          dashed stroke inside this section - the title/diagram/intro
          boxes and the benefits grid all use that same weight. Closed with
          a `border-b` too (full `border`, not just `border-x border-t`) so
          the frame reads as a complete boundary down to the bottom of the
          section, not just three sides left open above the stripe band. */}
      <div className="relative mx-auto w-full max-w-[1560px] border border-dashed border-white/30">
        {/* Extra vertical guide lines just inside the frame's own left/right
            edges, echoing the diagram's internal alignment-guide lines so
            the empty side gutters don't read as bare next to that busy
            grid - purely decorative, same `border-white/30` as the rest. */}
        <div className="pointer-events-none absolute inset-y-0 left-3 hidden border-l border-dashed border-white/30 sm:left-10 sm:block" />
        <div className="pointer-events-none absolute inset-y-0 right-3 hidden border-r border-dashed border-white/30 sm:right-10 sm:block" />

        <div className="px-3 pt-[144px] pb-32 sm:px-10 sm:pt-[144px] sm:pb-48">
          <div ref={ref} className="relative flex w-full flex-col sm:flex-row">
            <div
              style={leftColumnEnter.style}
              className={`flex flex-col bg-black/[0.18] sm:flex-1 ${leftColumnEnter.className}`}
            >
              {/* No bottom border - the diagram image directly below already
                  draws its own top edge, so a border here would double it.
                  Declared as `border` + `border-b-0` (not 3 separate side
                  utilities) to match the same declaration pattern every
                  other bordered div in this section uses. */}
              <div className="flex min-h-[100px] items-center border border-b-0 border-dashed border-white/30 px-6 sm:min-h-[114px]">
                <h2 className="font-serif text-[32px] leading-[1.1] tracking-[-0.32px] text-white sm:text-[36px]">
                  The practical stuff.
                </h2>
              </div>

              {/* Full border, not just left/right: top/bottom added per
                  review feedback for explicit consistency with the
                  title/intro boxes' own strokes, rather than leaning on
                  the SVG's internal horizontal guide-lines to imply the
                  seam. */}
              <div className="relative w-full border border-dashed border-white/30">
                {/* Plain <img>, not next/image - every stroke in this SVG
                    is already one consistent style (#A8A8A8, 2 2 dash),
                    so it just needs to render as-is, and next/image's
                    optimizer refuses SVGs by default in this project (see
                    the same note in deidentification-section.tsx). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/careers/practical-stuff-cube-grid.svg"
                  alt=""
                  width={645}
                  height={270}
                  className="h-auto w-full"
                />
              </div>

              {/* Verbatim from the Figma mock - describes the layout, not
                  real copy. Replace before shipping.
                  No top border - the diagram image directly above already
                  draws its own bottom edge, so a border here would double
                  it. Declared as `border` + `border-t-0`, matching the
                  title box above and every other bordered div here. */}
              <div className="flex min-h-[100px] items-center border border-t-0 border-dashed border-white/30 px-6 sm:min-h-[114px]">
                <p className="text-sm leading-[1.4] tracking-[-0.42px] text-white/70">
                  More modular, but still restrained. A tiny system visual sits under the intro
                  while benefits occupy a structured 2×2 board.
                </p>
              </div>
            </div>

            <div className="border border-dashed border-white/30 sm:flex-1">
              <div className="grid grid-cols-1 sm:h-full sm:grid-cols-2 sm:grid-rows-2">
                {PLACEHOLDER_BENEFITS.map((benefit, i) => {
                  const isLeftCol = i % 2 === 0;
                  const isTopRow = i < 2;
                  const isLastMobile = i === PLACEHOLDER_BENEFITS.length - 1;
                  const cardEnter = enter(60 + i * 60);

                  return (
                    <div
                      key={benefit.label}
                      style={cardEnter.style}
                      // No hover state: plain content cards, not links or
                      // buttons - a hover response would train people to
                      // expect a click to do something, and nothing does
                      // (same reasoning as `values-section.tsx`'s cards).
                      className={`flex min-h-[180px] flex-col justify-between gap-10 border-dashed border-white/30 p-6 sm:h-full ${
                        isLastMobile ? "border-b-0" : "border-b"
                      } ${isTopRow ? "sm:border-b" : "sm:border-b-0"} ${isLeftCol ? "sm:border-r" : ""} ${cardEnter.className}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-serif text-xl text-white">{benefit.label}</p>
                        <span className="flex size-8 shrink-0 items-center justify-center bg-white/10 font-mono text-[10px] text-white/50">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-sm leading-[1.4] tracking-[-0.42px] text-white/70">
                        {benefit.copy}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomStripes />
    </section>
  );
}
