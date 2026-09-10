"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HOW_IT_WORKS_STEP_INTERVAL_MS, VALUATION_STEPS } from "../lib/constants";

type ValuationAccordionProps = {
  activeIndex: number;
  onSelect: (index: number) => void;
  onComplete: () => void;
};

function StepProgressBar({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let frameId: number;
    const start = performance.now();

    const tick = (now: number) => {
      const ratio = Math.min((now - start) / HOW_IT_WORKS_STEP_INTERVAL_MS, 1);
      setProgress(ratio);

      if (ratio < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        onCompleteRef.current();
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="relative mt-2 h-1 w-full overflow-hidden">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#383535]" />
      <Image
        src="/images/progress-loader.svg"
        alt=""
        fill
        className="object-cover"
        style={{ clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }}
      />
    </div>
  );
}

export function ValuationAccordion({
  activeIndex,
  onSelect,
  onComplete,
}: ValuationAccordionProps) {
  return (
    <div className="flex w-full flex-col">
      {VALUATION_STEPS.map((step, index) => {
        const isOpen = activeIndex === index;
        return (
          <div
            key={step.label}
            className={`border-b border-[#383535] ${
              isOpen || index === VALUATION_STEPS.length - 1 ? "border-b-0" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(index)}
              className={`group flex w-full cursor-pointer items-center gap-1.5 pt-6 ${
                isOpen ? "" : "pb-6"
              }`}
            >
              <span
                className={`size-[5px] rounded-full ${
                  isOpen ? "bg-[#25fff9]" : "bg-[#cecece]/50"
                }`}
              />
              <span className="text-xs uppercase tracking-wide text-[#cecece]/70 transition-colors group-hover:text-white">
                {step.label}
              </span>
            </button>

            {isOpen && step.title ? (
              <div className="relative mt-2 flex flex-col gap-4 pb-6">
                <p className="font-serif text-[32px] tracking-tight text-white">
                  {step.title}
                </p>
                <p className="text-base leading-relaxed tracking-tight text-[#727272]">
                  {step.description}
                </p>
                <StepProgressBar key={index} onComplete={onComplete} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
