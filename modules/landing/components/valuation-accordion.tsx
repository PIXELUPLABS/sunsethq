"use client";

import type { CSSProperties } from "react";
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
    <div className="contents lg:flex lg:w-full lg:flex-col">
      {VALUATION_STEPS.map((step, index) => {
        const isOpen = activeIndex === index;
        return (
          <div
            key={step.label}
            style={{ "--row-order": (index + 1) * 2 } as CSSProperties}
            // An open row hides its divider (the progress bar stands in for
            // it) rather than dropping it, so the row count never changes the
            // stack's height by a pixel.
            className={`order-[var(--row-order)] pb-6 lg:order-none ${
              index === VALUATION_STEPS.length - 1
                ? ""
                : `border-b ${isOpen ? "border-transparent" : "border-[#383535]"}`
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-expanded={isOpen}
              // The row's bottom padding sits outside the button so the open
              // transition has nothing to jump over, so a closed row extends
              // its hit area over that gap instead of leaving it dead.
              className={`group relative flex w-full cursor-pointer items-center gap-1.5 pt-6 ${
                isOpen
                  ? ""
                  : "after:absolute after:inset-x-0 after:top-full after:h-6 after:content-['']"
              }`}
            >
              <span
                className={`size-[5px] shrink-0 rounded-full transition-colors duration-300 ${
                  isOpen ? "bg-[#25fff9]" : "bg-[#cecece]/50"
                }`}
              />
              <span className="text-xs uppercase tracking-wide text-[#cecece]/70 transition-colors group-hover:text-white">
                {step.label}
              </span>
              {/* The mobile design gives every row an expand affordance. */}
              <Image
                src="/images/arrow-up-s-line.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden
                className={`ml-auto size-6 transition-transform duration-300 lg:hidden ${
                  isOpen ? "" : "rotate-180"
                }`}
              />
            </button>

            {/* The panel stays mounted so its height can animate: a grid row
                interpolates 0fr→1fr where `height: auto` cannot. Only the
                progress bar mounts on open, so one timer runs at a time. */}
            {step.title ? (
              <div
                inert={!isOpen}
                className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`relative mt-2 flex flex-col gap-4 transition-opacity duration-300 ${
                      isOpen ? "opacity-100 delay-200" : "opacity-0"
                    }`}
                  >
                    <p className="font-serif text-2xl leading-[1.1] tracking-[-0.24px] text-white lg:text-[32px] lg:tracking-tight">
                      {step.title}
                    </p>
                    {/* All four descriptions share one grid cell so every
                        panel is as tall as the longest one at the current
                        width - otherwise the section grows or shrinks by a
                        line of copy each time the open step changes. */}
                    <div className="grid">
                      {VALUATION_STEPS.map((other, otherIndex) => (
                        <p
                          key={other.label}
                          className={`[grid-area:1/1] text-base leading-relaxed tracking-tight text-[#727272] ${
                            otherIndex === index ? "" : "invisible"
                          }`}
                        >
                          {other.description}
                        </p>
                      ))}
                    </div>
                    {isOpen ? (
                      <StepProgressBar key={index} onComplete={onComplete} />
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
