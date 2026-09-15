"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ProcessMarkIcon } from "@/components/ui/process-mark-icon";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { useStepCycle } from "@/modules/landing/hooks/use-step-cycle";
import { useInView } from "@/modules/landing/hooks/use-in-view";
import {
  DATA_TRUST_DEIDENTIFICATION_ILLUSTRATION,
  DATA_TRUST_DEIDENTIFICATION_PANEL_IMAGES,
  DATA_TRUST_GRAIN_STRIP,
  DATA_TRUST_GRAIN_STRIP_SIZE,
  PAGE_GRAIN_TEXTURE,
  SOFT_LIGHT_TEXTURE,
  SOFT_LIGHT_TEXTURE_SIZE,
} from "../lib/assets";
import { DEIDENTIFICATION_BODY, DEIDENTIFICATION_STEPS, DEIDENTIFICATION_STEP_INTERVAL_MS } from "../lib/constants";

/** Top-to-bottom, the design's panel gradient runs bright blue into navy. */
const PANEL_GRADIENT = "linear-gradient(180deg, #147dba 25.84%, #133264 98.35%)";

const PANEL_IMAGE_ALTS = [
  "Your data. De-identified. Names, emails, API keys, access tokens, customer records, shown in a redacted customer email with sensitive spans struck out.",
  "How your data gets cleaned. Coverage across Slack, PDFs, tickets, commits, images, and email, with Replay finding 3x more identifiers than the leading frontier model.",
  "We're setting the standard. The Replay Standard for real-world data de-identification: categories, thresholds, process stages, and verification, with isolated tenants, raw data in, no shared storage, no cross-client access, and clean data out.",
];

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

          {/* Right column: `border-r` closes the panel's own right edge,
              40px shy of the column's true edge - drawn as specified even
              though it reads as a subtle inner seam rather than a divider
              between the two columns. */}
          <div className="relative min-h-[400px] overflow-hidden lg:h-full lg:min-h-0 lg:flex-1 lg:border-r lg:border-dashed lg:border-[#a8a8a8]">
            {/* Tab 1 ([01] De-Identification): headline + body side by
                side, then the card area below - matching Figma node
                6672:20338 exactly, rather than the single full-bleed image
                tabs 2 and 3 still use below. */}
            <div
              className={`absolute inset-0 flex flex-col gap-8 px-5 pt-8 pb-10 transition-opacity duration-700 ease-in-out lg:gap-0 lg:p-8 ${
                activeIndex === 0 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6 lg:pb-8">
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
                  at 2x for retina sharpness. */}
              <div className="relative min-h-[280px] flex-1 overflow-hidden lg:min-h-0">
                <Image
                  src={DATA_TRUST_DEIDENTIFICATION_ILLUSTRATION}
                  alt="A customer email with names, contact details, and an API key struck out by redaction bars"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Tabs 2 & 3: unchanged - a single full-bleed image each. */}
            {DATA_TRUST_DEIDENTIFICATION_PANEL_IMAGES.map((src, index) =>
              index === 0 ? null : (
                <Image
                  key={src}
                  src={src}
                  alt={PANEL_IMAGE_ALTS[index]}
                  fill
                  className={`object-cover transition-opacity duration-700 ease-in-out ${
                    index === activeIndex ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transform: "scale(0.97)" }}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
