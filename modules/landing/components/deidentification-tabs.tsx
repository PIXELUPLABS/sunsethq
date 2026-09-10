"use client";

import Image from "next/image";
import { DEIDENTIFICATION_TABS } from "../lib/constants";

const GRAIN_TEXTURE = "/images/deidentification/grain-texture.webp";
const PATTERN_STRIP = "/images/deidentification/pattern-strip.png";

export function DeidentificationTabs({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex w-full">
      {DEIDENTIFICATION_TABS.map((tab, index) => {
        const isActive = activeIndex === index;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onSelect(index)}
            className={`group relative flex h-[72px] flex-1 cursor-pointer items-center justify-center gap-6 overflow-hidden border border-[#ccc] font-serif text-lg transition-colors duration-300 ${
              isActive ? "bg-black text-[#f2f2f2]" : "bg-transparent text-black"
            }`}
          >
            <Image
              src="/images/medium-grey-texture-btn-bg.svg"
              alt=""
              fill
              className={`pointer-events-none object-cover transition-opacity duration-300 ${
                isActive ? "opacity-0" : "opacity-0 group-hover:opacity-100"
              }`}
            />

            <div
              className={`pointer-events-none absolute inset-0 mix-blend-multiply transition-opacity duration-300 ${
                isActive ? "opacity-[0.11]" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${GRAIN_TEXTURE})`,
                backgroundSize: "432.6px 432.6px",
              }}
            />

            {isActive ? (
              <div className="pointer-events-none absolute inset-y-0 left-0 w-2 overflow-hidden">
                <div className="absolute inset-0 bg-[#7E7E7E]" />
                <Image
                  src={PATTERN_STRIP}
                  alt=""
                  fill
                  className="relative object-cover object-left"
                />
              </div>
            ) : null}

            <span className="relative">{tab}</span>
          </button>
        );
      })}
    </div>
  );
}
