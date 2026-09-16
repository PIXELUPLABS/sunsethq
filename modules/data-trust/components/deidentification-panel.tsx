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
      className="relative flex justify-center overflow-hidden bg-[#fcfcfc] px-3 sm:px-18"
    >
      <Image
        src={PAGE_GRAIN_TEXTURE}
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative mx-auto w-full max-w-[1560px] border-x border-dashed border-black/8">
        <div className="pt-10 sm:pt-[65px]">
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
          className="relative overflow-hidden lg:flex lg:h-[600px]"
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
              495px column. `gap-[249px]` between the copy and the step
              index is large but deliberate: it's what pins the index to
              the bottom of this fixed 600px-tall column while the copy
              stays pinned to the top. */}
          <div className="relative flex flex-col gap-5 px-5 pt-8 pb-10 lg:ml-10 lg:h-full lg:w-[calc(495px-40px)] lg:shrink-0 lg:gap-[249px] lg:bg-black lg:px-10 lg:py-10">
            <div className="flex flex-col gap-5 lg:gap-6">
              <div className="flex flex-col gap-3">
                <SectionTag
                  label="The Process"
                  tone="dark"
                  borderClassName="border-[#a3a3a3]"
                  textClassName="text-[#ebebeb]"
                  icon={<ProcessMarkIcon tone="dark" className="size-[18px]" />}
                />
                <h2 className="font-serif text-[36px] leading-none tracking-[-1.44px] text-white lg:text-[44px] lg:tracking-[-1.76px]">
                  De-Identification
                </h2>
              </div>
              <p className="text-sm leading-[1.4] tracking-[-0.42px] text-[#f2f2f2]">
                {DEIDENTIFICATION_BODY}
              </p>
            </div>

            <ol className="flex flex-col">
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
          </div>

          {/* Right column. The dashed line inset 40px (`right-10`) from
              its own right edge - matching this section's own dashed line
              color (`#a8a8a8`, full opacity) rather than sitting flush at
              the true edge like a plain divider. */}
          <div className="relative min-h-[400px] overflow-hidden lg:h-full lg:min-h-0 lg:flex-1">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-10 hidden border-r border-dashed border-[#a8a8a8] lg:block"
            />
            {/* Tab 1 ([01] De-Identification): headline + body side by
                side, then the card area below - matching Figma node
                6672:20338 exactly, rather than the single full-bleed image
                tab 3 still uses below. */}
            <div
              className={`absolute inset-0 flex flex-col gap-8 px-5 pt-8 pb-10 transition-opacity duration-700 ease-in-out lg:items-center lg:gap-0 lg:py-8 lg:pr-10 lg:pl-0 ${
                activeIndex === 0 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="flex flex-col gap-6 lg:w-[696px] lg:flex-row lg:items-start lg:gap-6 lg:pb-8">
                <p className="font-serif text-[26px] leading-[1.1] tracking-[-0.26px] text-white lg:flex-1 lg:text-[36px] lg:leading-none lg:tracking-[-1.44px]">
                  Your data.
                  <br />
                  De-identified.
                </p>
                <p className="text-sm leading-[1.4] tracking-[-0.42px] text-white lg:w-[360px] lg:shrink-0">
                  {DEIDENTIFICATION_BODY}
                </p>
              </div>

              {/* The card area: the illustration, exported from Figma node
                  6672:20349 (the glass card, woven-texture surround, email
                  copy, and redaction bars are all one live composition in
                  Figma, not an exportable image) as a flattened screenshot
                  at 2x for retina sharpness. Rendered at its real 696x372
                  native export size at `lg:` (matching tabs 2 and 3
                  exactly, rather than each stretching/shrinking to fill
                  whatever width its own flex column happens to compute)
                  and scaled fluidly below that.
                  `lg:mt-[62px]` per review: this tab's own headline+body
                  row measures 136px tall at `lg:` (fixed - it's sized by
                  a fixed-width body column, not by viewport width), 62px
                  short of tab 3's 198px, since tab 3's row carries an
                  extra "Value my data" link tabs 1/2 don't - without this,
                  switching to/from tab 3 visibly jumps the card up/down
                  instead of holding it in place. */}
              <div className="relative min-h-[280px] flex-1 overflow-hidden lg:min-h-0">
                <Image
                  src={DATA_TRUST_DEIDENTIFICATION_ILLUSTRATION}
                  alt="A customer email with names, contact details, and an API key struck out by redaction bars"
                  width={696}
                  height={372}
                  className="h-auto w-full lg:mt-[62px] lg:h-[372px] lg:w-[696px]"
                />
              </div>
            </div>

            {/* Tab 2 ([02] Detection): same headline + body + card-area
                pattern as tab 1 above, matching Figma node 6672:22994
                exactly. */}
            <div
              className={`absolute inset-0 flex flex-col gap-8 px-5 pt-8 pb-10 transition-opacity duration-700 ease-in-out lg:items-center lg:gap-0 lg:py-8 lg:pr-10 lg:pl-0 ${
                activeIndex === 1 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="flex flex-col gap-6 lg:w-[696px] lg:flex-row lg:items-start lg:gap-6 lg:pb-8">
                <p className="font-serif text-[26px] leading-[1.1] tracking-[-0.26px] text-white lg:flex-1 lg:text-[36px] lg:leading-none lg:tracking-[-1.44px]">
                  How your data
                  <br />
                  gets cleaned
                </p>
                <p className="text-sm leading-[1.4] tracking-[-0.42px] text-white lg:w-[360px] lg:shrink-0">
                  {DETECTION_BODY}
                </p>
              </div>

              {/* The card area: the illustration, exported from Figma node
                  6672:23005 (the grain backdrop, glass card, coverage-type
                  grid, and benchmark bars are all one live composition in
                  Figma, not an exportable image) as a flattened screenshot
                  at 3x - see `DATA_TRUST_DETECTION_ILLUSTRATION`'s own
                  comment for why this one needed a higher scale than tab
                  1's. Rendered at its real 696x372 native export size at
                  `lg:` (matching tabs 1 and 3 exactly) and scaled fluidly
                  below that.
                  `lg:mt-[55.625px]` per review - see tab 1's own image for
                  the full explanation; this tab's headline+body row just
                  measures 142.375px tall at `lg:` rather than tab 1's
                  136px (its own body copy is a little longer, wrapping to
                  an extra line), so it needs 5.625px less than tab 1's
                  62px to land on tab 3's same 198px. */}
              <div className="relative min-h-[280px] flex-1 overflow-hidden lg:min-h-0">
                <Image
                  src={DATA_TRUST_DETECTION_ILLUSTRATION}
                  alt="A benchmark card showing PII coverage across Slack, PDFs, tickets, commits, images, and email, with Replay finding 3x more identifiers than the leading frontier model"
                  width={696}
                  height={372}
                  className="h-auto w-full lg:mt-[55.625px] lg:h-[372px] lg:w-[696px]"
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
              className={`absolute inset-0 flex flex-col gap-8 px-5 pt-8 pb-10 transition-opacity duration-700 ease-in-out lg:items-center lg:gap-0 lg:py-8 lg:pr-10 lg:pl-0 ${
                activeIndex === 2 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="flex flex-col gap-6 lg:w-[696px] lg:flex-row lg:items-start lg:gap-6 lg:pb-8">
                <div className="flex flex-col items-start gap-5 lg:flex-1">
                  <p className="font-serif text-[26px] leading-[1.1] tracking-[-0.26px] text-white lg:text-[36px] lg:leading-none lg:tracking-[-1.44px]">
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
                <p className="text-sm leading-[1.4] tracking-[-0.42px] text-white lg:w-[360px] lg:shrink-0">
                  {STANDARD_BODY}
                </p>
              </div>

              {/* The card area: the illustration, exported from Figma node
                  6672:23214 (the grain backdrop, glass card, hexagon lock
                  mark, spec table, and feature-check chips are all one
                  live composition in Figma, not an exportable image) as a
                  flattened screenshot at 3x - see
                  `DATA_TRUST_STANDARD_ILLUSTRATION`'s own comment for why.
                  Rendered at its real 696x372 native export size at `lg:`
                  (matching tabs 1 and 2 exactly, rather than shrinking to
                  fit whatever height this tab's own taller headline row -
                  it has the extra "Value my data" link the other two
                  don't - leaves for it) and scaled fluidly below that. */}
              <div className="relative min-h-[280px] flex-1 overflow-hidden lg:min-h-0">
                <Image
                  src={DATA_TRUST_STANDARD_ILLUSTRATION}
                  alt="The Replay Standard for Real-World Data De-identification: 60+ categories, per-class thresholds, a 4-stage process, and benchmark-held verification, with isolated tenants, raw data in, no shared storage, no cross-client access, and clean data out"
                  width={696}
                  height={372}
                  className="h-auto w-full lg:h-[372px] lg:w-[696px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
