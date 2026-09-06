"use client";

import { VALUATION_STEPS } from "../lib/constants";
import { useAccordion } from "../hooks/use-accordion";
import { ProcessBar } from "./process-bar";

export function ValuationAccordion() {
  const { openIndex, toggle } = useAccordion(0);

  return (
    <div className="flex w-full flex-col">
      {VALUATION_STEPS.map((step, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={step.label}
            className={`border-b border-[#383535] py-6 ${
              index === VALUATION_STEPS.length - 1 ? "border-b-0" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="flex w-full items-center gap-1.5"
            >
              <span
                className={`size-[5px] rounded-full ${
                  isOpen ? "bg-[#25fff9]" : "bg-[#cecece]/50"
                }`}
              />
              <span className="text-xs uppercase tracking-wide text-[#cecece]/70">
                {step.label}
              </span>
            </button>

            {isOpen && step.title ? (
              <div className="relative mt-4 flex flex-col gap-4 pb-1">
                <p className="font-serif text-2xl tracking-tight text-white">
                  {step.title}
                </p>
                <p className="text-base leading-relaxed tracking-tight text-[#727272]">
                  {step.description}
                </p>
                <ProcessBar className="mt-2 h-1 w-[132px]" />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
