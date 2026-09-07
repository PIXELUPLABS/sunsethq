"use client";

import Image from "next/image";
import { SectionTag } from "./section-tag";
import { ValuationAccordion } from "./valuation-accordion";
import { VALUATION_STEPS } from "../lib/constants";
import { useStepCycle } from "../hooks/use-step-cycle";

const STEP_INTERVAL_MS = 5000;

export function ValuationSection() {
  const { activeIndex, setActiveIndex } = useStepCycle(
    VALUATION_STEPS.length,
    STEP_INTERVAL_MS,
  );

  return (
    <section className="flex justify-center bg-[#0c0c0b] px-6 py-24 sm:px-18">
      <div className="grid w-full grid-cols-1 border border-[#444] lg:grid-cols-2">
        <div className="flex flex-col justify-between gap-14 border-b border-[#444] p-8 sm:p-12 lg:border-b-0 lg:border-r">
          <div className="flex flex-col items-start gap-6">
            <SectionTag label="How it works" tone="dark" />
            <h2 className="font-serif text-[32px] leading-none tracking-tight text-white sm:text-[44px]">
              Four steps. 120 minutes of your time.
            </h2>
          </div>

          <ValuationAccordion activeIndex={activeIndex} onSelect={setActiveIndex} />
        </div>

        <div className="relative min-h-[420px] overflow-hidden bg-[#0c0c0b]">
          {VALUATION_STEPS.map((step, index) => (
            <Image
              key={step.label}
              src={step.image}
              alt={step.alt}
              fill
              className={`object-cover transition-opacity duration-700 ease-in-out ${
                index === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
