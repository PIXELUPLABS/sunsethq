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
      className="flex scroll-mt-16 justify-center bg-[#0c0c0b] px-6 py-24 sm:px-18"
    >
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 border border-[#444] lg:grid-cols-2">
        <div className="flex flex-col justify-between gap-14 border-b border-[#444] p-8 sm:p-12 lg:border-b-0 lg:border-r">
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
            <h2 className="font-serif text-[32px] leading-none tracking-tight text-white sm:text-[44px]">
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
