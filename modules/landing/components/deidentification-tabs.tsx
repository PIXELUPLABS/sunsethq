"use client";

import Image from "next/image";
import { DEIDENTIFICATION_TABS } from "../lib/constants";

const GRAIN_TEXTURE = "/images/deidentification/grain-texture.webp";
const PATTERN_STRIP = "/images/deidentification/pattern-strip.png";

// The slider is on-screen movement, not an enter/exit - per the design-eng
// easing decision tree that calls for a strong custom ease-in-out rather
// than the built-in curves, which read as too weak at this distance.
const SLIDE_EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";
const SLIDE_DURATION_MS = 220;

export function DeidentificationTabs({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="relative flex w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 bg-black"
        style={{
          width: `${100 / DEIDENTIFICATION_TABS.length}%`,
          transform: `translate3d(${activeIndex * 100}%, 0, 0)`,
          willChange: "transform",
          backfaceVisibility: "hidden",
          transitionProperty: "transform",
          transitionDuration: `${SLIDE_DURATION_MS}ms`,
          transitionTimingFunction: SLIDE_EASE_IN_OUT,
        }}
      >
        <div className="pointer-events-none absolute inset-y-0 -left-px w-[5px] overflow-hidden lg:left-0 lg:w-2">
          <div className="absolute inset-0 bg-[#7E7E7E]" />
          <Image src={PATTERN_STRIP} alt="" fill className="relative object-cover object-left" />
        </div>
      </div>

      {DEIDENTIFICATION_TABS.map((tab, index) => {
        const isActive = activeIndex === index;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onSelect(index)}
            className={`group relative flex h-10 flex-1 cursor-pointer items-center justify-center gap-6 overflow-hidden border border-[#ccc] font-serif text-base tracking-[-0.64px] lg:h-[72px] lg:text-lg lg:tracking-normal ${
              index === 0 ? "border-l" : "border-l-0"
            } ${isActive ? "text-[#f2f2f2]" : "text-black"}`}
            style={{ transition: `color ${SLIDE_DURATION_MS}ms ease` }}
          >
            <Image
              src="/images/medium-grey-texture-btn-bg.svg"
              alt=""
              fill
              className={`pointer-events-none object-cover transition-opacity duration-200 ${
                isActive ? "opacity-0" : "opacity-0 group-hover:opacity-100"
              }`}
            />

            <div
              className={`pointer-events-none absolute inset-0 mix-blend-multiply transition-opacity duration-200 ${
                isActive ? "opacity-[0.11]" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${GRAIN_TEXTURE})`,
                backgroundSize: "432.6px 432.6px",
              }}
            />

            <span className="relative">{tab}</span>
          </button>
        );
      })}
    </div>
  );
}
