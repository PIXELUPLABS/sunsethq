"use client";

import Image from "next/image";
import { SectionTag } from "./section-tag";
import { ValuationAccordion } from "./valuation-accordion";
import { StepVideo } from "./step-video";
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
        <div className="flex flex-col justify-between gap-16 lg:gap-14 lg:border-r lg:border-[#444] lg:p-12">
          <div className="flex flex-col items-start gap-6">
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

        <div className="relative w-full min-h-[420px] overflow-hidden bg-[#0c0c0b]">
          {VALUATION_STEPS.map((step, index) => {
            const isActive = index === activeIndex;
            const fadeClassName = `absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`;

            if (index === 0) {
              return (
                <div key={step.label} className={fadeClassName}>
                  <StepVideo src="/images/htw-1.webm" active={isActive} />
                </div>
              );
            }

            if (index === 1) {
              return (
                <div key={step.label} className={fadeClassName}>
                  <StepVideo src="/images/htw-2.webm" active={isActive} />
                </div>
              );
            }

            if (index === 2) {
              return (
                <div key={step.label} className={fadeClassName}>
                  <StepVideo src="/images/htw-3.webm" active={isActive} />
                </div>
              );
            }

            if (index === 3) {
              return (
                <div key={step.label} className={fadeClassName}>
                  <StepVideo src="/images/htw-4.webm" active={isActive} />
                </div>
              );
            }

            return (
              <Image
                key={step.label}
                src={step.image}
                alt={step.alt}
                fill
                className={`object-cover ${fadeClassName}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
