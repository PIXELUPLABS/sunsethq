"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { SectionTag } from "./section-tag";
import { ValuationAccordion } from "./valuation-accordion";
import { ValuationMedia } from "./valuation-media";
import { VALUATION_STEPS } from "../lib/constants";
import { useStepCycle } from "../hooks/use-step-cycle";

export function ValuationSection() {
  const { activeIndex, setActiveIndex, advance } = useStepCycle(VALUATION_STEPS.length);

  return (
    <section
      id="how-it-works"
      className="flex scroll-mt-16 justify-center bg-[#0c0c0b] px-6 pt-16 pb-14 sm:px-18 sm:py-24"
    >
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 lg:grid-cols-2 lg:border lg:border-[#444]">
        <div className="contents lg:flex lg:flex-col lg:justify-between lg:gap-14 lg:border-r lg:border-[#444] lg:p-12">
          <div className="mb-16 flex flex-col items-start gap-6 lg:mb-0">
            <SectionTag
              label="How it works"
              textClassName="text-[#b2b2b2]"
              icon={
                <Image
                  src="/images/how-it-works-icon.svg"
                  alt=""
                  width={18}
                  height={18}
                />
              }
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
          />
        </div>

        {/* --media-order drops the illustration straight after the open row on
            mobile, matching the design, without a second copy of the videos.
            Rows are 2,4,6,8 so an odd order lands between two of them. */}
        <div
          className="relative order-[var(--media-order)] mt-3 min-h-[374px] w-full overflow-hidden bg-[#0c0c0b] lg:order-none lg:mt-0 lg:min-h-[420px]"
          style={{ "--media-order": activeIndex * 2 + 3 } as CSSProperties}
        >
          <ValuationMedia activeIndex={activeIndex} />
        </div>
      </div>
    </section>
  );
}
