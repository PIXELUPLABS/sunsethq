"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProcessMarkIcon } from "@/components/ui/process-mark-icon";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { useStepCycle } from "@/modules/landing/hooks/use-step-cycle";
import { useInView } from "@/modules/landing/hooks/use-in-view";
import {
  DATA_TRUST_DEIDENTIFICATION_ILLUSTRATION,
  DATA_TRUST_DETECTION_ILLUSTRATION,
  DATA_TRUST_GRAIN_STRIP,
  DATA_TRUST_GRAIN_STRIP_SIZE,
  DATA_TRUST_STANDARD_ILLUSTRATION,
  PAGE_GRAIN_TEXTURE,
  SOFT_LIGHT_TEXTURE,
  SOFT_LIGHT_TEXTURE_SIZE,
} from "../lib/assets";
import {
  DEIDENTIFICATION_BODY,
  DEIDENTIFICATION_STEPS,
  DEIDENTIFICATION_STEP_INTERVAL_MS,
  DETECTION_BODY,
  STANDARD_BODY,
} from "../lib/constants";

/** Top-to-bottom, the design's panel gradient runs bright blue into navy. */
const PANEL_GRADIENT = "linear-gradient(180deg, #147dba 25.84%, #133264 98.35%)";

/** Fills left-to-right over `DEIDENTIFICATION_STEP_INTERVAL_MS` while its
 *  row is active, then calls `onComplete` to advance to the next step -
 *  identical to `StepProgressBar` on the home page's "How it works"
 *  section: same loader asset, same clip-path reveal, same full-row
 *  width, just positioned at this row's own bottom edge instead of
 *  in-flow under an open accordion panel. */
function DeidentificationProgressStrip({
  active,
  onComplete,
}: {
  active: boolean;
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }

    let frameId: number;
    const start = performance.now();

    const tick = (now: number) => {
      const ratio = Math.min((now - start) / DEIDENTIFICATION_STEP_INTERVAL_MS, 1);
      setProgress(ratio);

      if (ratio < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        onCompleteRef.current();
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [active]);

  return (
    <div className="absolute -bottom-px left-0 h-1 w-full overflow-hidden">
      <Image
        src="/images/valuation/how-it-works/progress-loader.svg"
        alt=""
        fill
        className="object-cover"
        style={{ clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }}
      />
    </div>
  );
}

/** No #de-identification anchor here - that one belongs to the home page. */
export function DeidentificationPanel() {
  const { activeIndex, setActiveIndex, advance } = useStepCycle(DEIDENTIFICATION_STEPS.length);
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      className="relative flex justify-center overflow-hidden bg-black px-3 sm:px-18 lg:bg-[#fcfcfc]"
    >
      <Image
        src={PAGE_GRAIN_TEXTURE}
        alt=""
        fill
        className="pointer-events-none hidden object-cover lg:block"
      />

      <div className="relative mx-auto w-full max-w-[1560px] border-x border-dashed border-black/8">
        {/* Figma's mobile frame (node 6672:23319) opens straight into the
            bordered black box below with a plain 24px top/bottom margin -
            no grain band/rule divider - so that divider is desktop-only
            here, and the panel box below picks up the 24px margin plus its
            own `border-[#272727]` box outline for mobile instead. */}
        <div className="hidden pt-10 sm:pt-[65px] lg:block">
          {/* the grain band and rule the design opens the section with */}
          <div
            aria-hidden
            className="pointer-events-none h-[46px] opacity-48 mix-blend-multiply sm:mx-10"
            style={{
              backgroundImage: `url("${DATA_TRUST_GRAIN_STRIP}")`,
              backgroundSize: DATA_TRUST_GRAIN_STRIP_SIZE,
            }}
          />
          <div className="border-t border-dashed border-black/8" />
        </div>

        <div
          className="relative mt-6 mb-6 overflow-hidden border border-[#272727] lg:mt-0 lg:mb-0 lg:flex lg:h-[600px] lg:border-none"
          style={{ background: PANEL_GRADIENT }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{
              backgroundImage: `url("${SOFT_LIGHT_TEXTURE}")`,
              backgroundSize: SOFT_LIGHT_TEXTURE_SIZE,
            }}
          />

          {/* Left column: a 40px sliver of the panel's own gradient down
              the left edge, then a solid black box for the rest of the
              column - 495px at the design's own reference width, but
              `lg:w-[35%]` (not a flat 495px) so this black box actually
              shrinks with the panel between 1024-1440px instead of staying
              rigidly full-width and forcing the right column's fixed-size
              image to overflow/clip. `lg:min-w-[320px]` keeps the copy from
              getting uncomfortably narrow at the low end.
              `lg:justify-between` (not a fixed `gap-[225px]`) pins the step
              index to the bottom of this fixed 600px-tall column while the
              copy stays pinned to the top - a fixed gap was tuned against
              the copy's rendered height at one width only, so narrowing
              this column at 1024-1250px wrapped the copy onto extra lines
              and pushed the step list past the column's bottom edge,
              clipping tab 3 under `overflow-hidden`. `justify-between`
              adapts to however tall the copy actually renders at any
              width, so the list never overflows. */}
          <div className="relative flex flex-col bg-black pt-3 pb-3 lg:ml-10 lg:h-full lg:w-[35%] lg:min-w-[320px] lg:shrink-0 lg:justify-between lg:px-10 lg:py-10">
            <div className="flex flex-col gap-[18px] px-3 lg:gap-6 lg:px-0">
              <div className="flex flex-col gap-3.5 lg:gap-3">
                <SectionTag
                  label="The Process"
                  tone="dark"
                  borderClassName="border-[#a3a3a3]"
                  textClassName="text-[#ebebeb]"
                  icon={<ProcessMarkIcon tone="dark" className="size-[18px]" />}
                />
                <h2 className="font-serif text-[43px] leading-[40.42px] tracking-[-1.65px] text-white lg:text-[44px] lg:leading-none lg:tracking-[-1.76px]">
                  De-Identification
                </h2>
              </div>
              <p className="text-sm leading-[19.88px] tracking-[-0.32px] text-[#f2f2f2] lg:leading-[1.4] lg:tracking-[-0.42px]">
                {DEIDENTIFICATION_BODY}
              </p>
            </div>

            {/* Desktop-only vertical step list (Figma's own left-column
                layout for the wide `lg:` panel) - mobile swaps in the
                horizontal 3-up tab strip below instead, matching this
                page's mobile Figma frame (node 6672:23336) exactly rather
                than squeezing this tall list into a narrow phone width. */}
            <ol className="hidden lg:flex lg:flex-col lg:gap-3">
              {DEIDENTIFICATION_STEPS.map((step, index) => {
                const active = index === activeIndex;
                return (
                  <li
                    key={step}
                    className="relative flex h-[33px] items-center border-b border-[#353535]"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-current={active}
                      className="flex w-full cursor-pointer items-center py-1.5 text-left"
                    >
                      <span
                        className={`text-sm leading-[1.4] tracking-[-0.42px] uppercase transition-colors duration-300 ${
                          active ? "text-white" : "text-white/50"
                        }`}
                      >
                        {step}
                      </span>
                    </button>
                    <DeidentificationProgressStrip
                      key={`${index}-${active}`}
                      active={active && inView}
                      onComplete={advance}
                    />
                  </li>
                );
              })}
            </ol>

            {/* Mobile-only horizontal tab strip (Figma node 6672:23336): 3
                equal columns, each a `[0N]` index over an uppercase label,
                separated by `border-[#272727]` rules, with the active
                column lifted to `#080808` and a white underline beneath its
                label (Figma's own static export only draws this under tab
                1, but it's clearly the active-tab indicator, so it tracks
                `activeIndex` here) plus the same color progress-fill strip
                the desktop list uses, narrowed to one column's width and
                slid under whichever tab is active. */}
            <div className="pt-6 lg:hidden">
              <div className="relative h-[60px] overflow-hidden border-y border-[#272727]">
                <div className="grid h-full grid-cols-3">
                  {DEIDENTIFICATION_STEPS.map((step, index) => {
                    const active = index === activeIndex;
                    const match = step.match(/^(\[\d+\])\s*(.+)$/);
                    const [stepIndex, stepLabel] = match ? [match[1], match[2]] : [step, ""];
                    return (
                      <button
                        key={step}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-current={active}
                        className={`flex h-[58px] cursor-pointer flex-col items-start justify-center gap-[7px] self-start border-r border-[#272727] px-2.5 pt-2 pb-[9px] last:border-r-0 ${
                          active ? "bg-[#080808]" : "bg-black"
                        }`}
                      >
                        <span
                          className={`font-mono text-[9px] leading-[9px] whitespace-nowrap ${
                            active ? "text-white" : "text-white/56"
                          }`}
                        >
                          {stepIndex}
                        </span>
                        <span
                          className={`border-b pb-px text-[9px] leading-[9.36px] font-medium tracking-[-0.1px] whitespace-nowrap uppercase ${
                            active ? "border-white text-white" : "border-transparent text-white/56"
                          }`}
                        >
                          {stepLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 overflow-hidden">
                  <div
                    className="h-full w-1/3 transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(${activeIndex * 100}%)` }}
                  >
                    {/* `onComplete` is a no-op here, not `advance`: the
                        desktop `<ol>` above is only `hidden` via CSS, not
                        unmounted, so its own progress strip for this same
                        active index is already running and already calls
                        `advance()` on completion. Wiring this one to
                        `advance` too fired it twice per cycle, jumping the
                        index by 2 instead of 1 (the reported 1→3→2 order) -
                        this strip only needs to mirror the fill visually. */}
                    <DeidentificationProgressStrip
                      key={`mobile-${activeIndex}`}
                      active={inView}
                      onComplete={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column. The dashed line inset 40px (`right-10`) from
              its own right edge - matching this section's own dashed line
              color (`#a8a8a8`, full opacity) rather than sitting flush at
              the true edge like a plain divider. Only shown at
              `min-[1440px]:` - below that the right column has already
              shrunk enough (per the fluid `lg:max-w-[696px]` content sizing
              above) that this line sat awkwardly close to/over the image
              and copy instead of reading as a clean margin rule. */}
          <div className="relative min-h-[400px] overflow-hidden lg:h-full lg:min-h-0 lg:flex-1">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-10 hidden border-r border-dashed border-[#a8a8a8] min-[1440px]:block"
            />
            {/* Tab 1 ([01] De-Identification): headline + body side by
                side, then the card area below - matching Figma node
                6672:20338 exactly, rather than the single full-bleed image
                tab 3 still uses below. */}
            <div
              className={`absolute inset-0 flex flex-col gap-4 px-3 pt-6 pb-6 transition-opacity duration-700 ease-in-out lg:items-center lg:gap-0 lg:pt-8 lg:pr-10 lg:pl-10 lg:pb-0 ${
                activeIndex === 0 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="flex flex-col gap-6 lg:w-full lg:max-w-[696px] lg:gap-6 lg:pb-8 min-[1440px]:flex-row min-[1440px]:items-start">
                <p className="font-serif text-[28px] leading-[1.1] tracking-[-0.28px] text-white lg:flex-1 lg:text-[36px] lg:leading-none lg:tracking-[-1.44px]">
                  Your data.
                  <br />
                  De-identified.
                </p>
                <p className="text-sm leading-[20.02px] tracking-[-0.35px] text-white lg:w-full lg:leading-[1.4] lg:tracking-[-0.42px] min-[1440px]:w-[360px]">
                  {DEIDENTIFICATION_BODY}
                </p>
              </div>

              {/* The card area: the illustration, exported from Figma node
                  6672:20349 (the glass card, woven-texture surround, email
                  copy, and redaction bars are all one live composition in
                  Figma, not an exportable image) as a flattened screenshot
                  at 2x for retina sharpness. Caps out at its real 696x372
                  native export size (`lg:max-w-[696px]`, matching tabs 2
                  and 3 exactly) but stays fluid below that (`w-full`) so it
                  shrinks with the right column between 1024-1440px instead
                  of clipping past it.
                  `lg:flex lg:flex-col lg:justify-end` bottom-aligns the
                  image within this wrapper instead of top-margining it
                  down by a per-tab fixed amount (the old approach): since
                  this wrapper is `flex-1` inside a `pb-0` row, its own
                  bottom always lands exactly on the panel's bottom edge
                  regardless of how tall this tab's own header row is, so
                  bottom-aligning the image here both touches the panel's
                  bottom edge (no leftover gap below it) *and* keeps the
                  image at the same height across tabs 1-3 automatically -
                  no more per-tab offset math needed. */}
              <div className="relative min-h-[280px] flex-1 overflow-hidden lg:flex lg:w-full lg:max-w-[696px] lg:min-h-0 lg:flex-col lg:justify-end">
                <Image
                  src={DATA_TRUST_DEIDENTIFICATION_ILLUSTRATION}
                  alt="A customer email with names, contact details, and an API key struck out by redaction bars"
                  width={696}
                  height={372}
                  className="h-auto w-full lg:max-w-[696px]"
                />
              </div>
            </div>

            {/* Tab 2 ([02] Detection): same headline + body + card-area
                pattern as tab 1 above, matching Figma node 6672:22994
                exactly. */}
            <div
              className={`absolute inset-0 flex flex-col gap-4 px-3 pt-6 pb-6 transition-opacity duration-700 ease-in-out lg:items-center lg:gap-0 lg:pt-8 lg:pr-10 lg:pl-10 lg:pb-0 ${
                activeIndex === 1 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="flex flex-col gap-6 lg:w-full lg:max-w-[696px] lg:gap-6 lg:pb-8 min-[1440px]:flex-row min-[1440px]:items-start">
                <p className="font-serif text-[28px] leading-[1.1] tracking-[-0.28px] text-white lg:flex-1 lg:text-[36px] lg:leading-none lg:tracking-[-1.44px]">
                  How your data
                  <br />
                  gets cleaned
                </p>
                <p className="text-sm leading-[20.02px] tracking-[-0.35px] text-white lg:w-full lg:leading-[1.4] lg:tracking-[-0.42px] min-[1440px]:w-[360px]">
                  {DETECTION_BODY}
                </p>
              </div>

              {/* The card area: the illustration, exported from Figma node
                  6672:23005 (the grain backdrop, glass card, coverage-type
                  grid, and benchmark bars are all one live composition in
                  Figma, not an exportable image) as a flattened screenshot
                  at 3x - see `DATA_TRUST_DETECTION_ILLUSTRATION`'s own
                  comment for why this one needed a higher scale than tab
                  1's. Caps out at its real 696x372 native export size
                  (`lg:max-w-[696px]`, matching tabs 1 and 3 exactly) but
                  stays fluid (`w-full`) below that.
                  `lg:flex lg:flex-col lg:justify-end` bottom-aligns the
                  image within this wrapper - see tab 1's own image for the
                  full explanation of why that both closes the gap below
                  it and keeps it level with tabs 1 and 3 automatically,
                  in place of the old per-tab `mt-*` offset. */}
              <div className="relative min-h-[280px] flex-1 overflow-hidden lg:flex lg:w-full lg:max-w-[696px] lg:min-h-0 lg:flex-col lg:justify-end">
                <Image
                  src={DATA_TRUST_DETECTION_ILLUSTRATION}
                  alt="A benchmark card showing PII coverage across Slack, PDFs, tickets, commits, images, and email, with Replay finding 3x more identifiers than the leading frontier model"
                  width={696}
                  height={372}
                  className="h-auto w-full lg:max-w-[696px]"
                />
              </div>
            </div>

            {/* Tab 3 ([03] The Standard): same headline + body + card-area
                pattern as tabs 1 and 2 above, matching Figma node
                6672:23203 exactly. Adds one thing those two don't: a
                "Value my data" outline link under the headline, per the
                design - routes to the real page like every other "Value
                my data" CTA on the site. */}
            <div
              className={`absolute inset-0 flex flex-col gap-4 px-3 pt-6 pb-6 transition-opacity duration-700 ease-in-out lg:items-center lg:gap-0 lg:pt-8 lg:pr-10 lg:pl-10 lg:pb-0 ${
                activeIndex === 2 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="flex flex-col gap-6 lg:w-full lg:max-w-[696px] lg:gap-6 lg:pb-8 min-[1440px]:flex-row min-[1440px]:items-start">
                <div className="flex flex-row items-center justify-between gap-5 lg:flex-1">
                  <p className="font-serif text-[28px] leading-[1.1] tracking-[-0.28px] text-white lg:text-[36px] lg:leading-none lg:tracking-[-1.44px]">
                    We&rsquo;re setting
                    <br />
                    the standard
                  </p>
                  <Link
                    href="/value-my-data"
                    className="border border-white px-5 py-3 font-serif text-xs tracking-wide text-white uppercase transition-colors duration-150 ease-snap hover:bg-white hover:text-black"
                  >
                    Value my data
                  </Link>
                </div>
                <p className="text-sm leading-[20.02px] tracking-[-0.35px] text-white lg:w-full lg:leading-[1.4] lg:tracking-[-0.42px] min-[1440px]:w-[360px]">
                  {STANDARD_BODY}
                </p>
              </div>

              {/* The card area: the illustration, exported from Figma node
                  6672:23214 (the grain backdrop, glass card, hexagon lock
                  mark, spec table, and feature-check chips are all one
                  live composition in Figma, not an exportable image) as a
                  flattened screenshot at 3x - see
                  `DATA_TRUST_STANDARD_ILLUSTRATION`'s own comment for why.
                  Caps out at its real 696x372 native export size
                  (`lg:max-w-[696px]`, matching tabs 1 and 2 exactly) but
                  stays fluid (`w-full`) below that.
                  `lg:flex lg:flex-col lg:justify-end` bottom-aligns the
                  image within this wrapper - see tab 1's own image for the
                  full explanation of why that both closes the gap below
                  it and keeps it level with tabs 1 and 2 automatically. */}
              <div className="relative min-h-[280px] flex-1 overflow-hidden lg:flex lg:w-full lg:max-w-[696px] lg:min-h-0 lg:flex-col lg:justify-end">
                <Image
                  src={DATA_TRUST_STANDARD_ILLUSTRATION}
                  alt="The Replay Standard for Real-World Data De-identification: 60+ categories, per-class thresholds, a 4-stage process, and benchmark-held verification, with isolated tenants, raw data in, no shared storage, no cross-client access, and clean data out"
                  width={696}
                  height={372}
                  className="h-auto w-full lg:max-w-[696px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
