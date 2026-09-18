"use client";

import { useEffect, type CSSProperties } from "react";
import { SectionTag } from "./section-tag";
import { ValuationAccordion } from "./valuation-accordion";
import { ValuationMedia } from "./valuation-media";
import { ValuationPanel } from "./valuation-panel";
import {
  SCROLL_PLAY_THRESHOLD,
  VALUATION_MEDIA_SWAP_MS,
  VALUATION_STEPS,
} from "../lib/constants";
import { useStepCycle } from "../hooks/use-step-cycle";
import { useInView } from "../hooks/use-in-view";
import { useDeferredSwap } from "../hooks/use-deferred-swap";

export function ValuationSection() {
  const { activeIndex, setActiveIndex, advance, reset } = useStepCycle(VALUATION_STEPS.length);
  const { ref, inView } = useInView<HTMLElement>({ threshold: SCROLL_PLAY_THRESHOLD, once: false });

  // On phones the media sits under whichever step is open, which it reaches by
  // changing its order in the column. That move is instant and can't be eased,
  // so it happens while the panel is faded out.
  const { settled: mediaIndex, swapping } = useDeferredSwap(
    activeIndex,
    VALUATION_MEDIA_SWAP_MS
  );

  // Every scroll-in starts the walkthrough over from the first step. Out of
  // view, the accordion stops its timer and the videos unmount, so nothing
  // runs on while the section is off screen.
  useEffect(() => {
    if (inView) reset();
  }, [inView, reset]);

  return (
    <section
      ref={ref}
      id="how-it-works"
      className="flex scroll-mt-16 justify-center bg-[#0c0c0b] px-6 pt-16 pb-14 sm:px-18 sm:py-24"
    >
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 lg:grid-cols-2 lg:border lg:border-[#444]">
        <div className="contents lg:flex lg:flex-col lg:justify-between lg:gap-14 lg:border-r lg:border-[#444] lg:p-12">
          <div className="mb-16 flex flex-col items-start gap-6 lg:mb-0">
            <SectionTag
              label="How it works"
              textClassName="text-white/60"
              borderClassName="border-dashed border-white/25"
              paddingClassName="px-2 py-1"
              heightClassName="h-auto"
            />
            <h2 className="font-serif text-[36px] leading-none tracking-[-1.44px] text-white sm:text-[44px] sm:tracking-tight">
              Four steps.
              <br />
              120 minutes of your time.
            </h2>
          </div>

          <ValuationAccordion
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            onComplete={advance}
            hasEnteredViewport={inView}
          />
        </div>

        <ValuationPanel
          className={`order-[var(--media-order)] mt-3 aspect-[342/374] max-h-[374px] w-full transition-opacity ease-out md:max-h-[650px] lg:order-none lg:mt-0 lg:aspect-auto lg:max-h-none lg:min-h-[420px] ${
            swapping ? "max-lg:opacity-0" : "opacity-100"
          }`}
          style={
            {
              "--media-order": mediaIndex * 2 + 3,
              transitionDuration: `${VALUATION_MEDIA_SWAP_MS}ms`,
            } as CSSProperties
          }
        >
          <ValuationMedia activeIndex={activeIndex} hasEnteredViewport={inView} />
        </ValuationPanel>
      </div>
    </section>
  );
}
