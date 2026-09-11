"use client";

import Image from "next/image";
import { useElementParallax } from "../hooks/use-element-parallax";

const PANEL_PARALLAX_SHIFT_X = 16;
const PANEL_PARALLAX_SHIFT_Y = 8;
const LEFT_PATTERN_PARALLAX_SHIFT_X = 14;
const LEFT_PATTERN_PARALLAX_SHIFT_Y = 7;
const ABOVE_PATTERN_PARALLAX_SHIFT_X = 12;
const ABOVE_PATTERN_PARALLAX_SHIFT_Y = 6;

export function CtaSection() {
  const { containerRef, offset } = useElementParallax<HTMLElement>();

  return (
    <section
      ref={containerRef}
      id="value-my-data"
      className="relative w-full scroll-mt-16 overflow-hidden bg-[#080808] py-20 sm:py-24 lg:aspect-[1440/716] lg:py-0"
    >
      <Image
        src="/images/cta/background.webp"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div
        className="pointer-events-none absolute top-[42.95%] left-[42.12%] hidden h-[42.18%] w-[45.07%] lg:block"
        style={{
          transform: `translate3d(${offset.x * PANEL_PARALLAX_SHIFT_X}px, ${offset.y * PANEL_PARALLAX_SHIFT_Y}px, 0)`,
        }}
      >
        <Image
          src="/images/cta/blue-panel.webp"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div
        className="pointer-events-none absolute top-[58.52%] left-[12.71%] hidden h-[26.89%] w-[25.59%] lg:block"
        style={{
          transform: `translate3d(${offset.x * LEFT_PATTERN_PARALLAX_SHIFT_X}px, ${offset.y * LEFT_PATTERN_PARALLAX_SHIFT_Y}px, 0)`,
        }}
      >
        <Image
          src="/images/cta/left-pattern.webp"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div
        className="pointer-events-none absolute top-[14.66%] left-[62.5%] hidden h-[25.49%] w-[25%] lg:block"
        style={{
          transform: `translate3d(${offset.x * ABOVE_PATTERN_PARALLAX_SHIFT_X}px, ${offset.y * ABOVE_PATTERN_PARALLAX_SHIFT_Y}px, 0)`,
        }}
      >
        <Image
          src="/images/cta/above-pattern.webp"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div
        className="relative mx-auto flex w-full max-w-[859px] flex-col items-center justify-center gap-8 overflow-hidden bg-[#fcfcfc] px-6 py-10 text-center sm:gap-14 sm:px-10 sm:py-14 lg:absolute lg:top-[23.6%] lg:left-[20.14%] lg:h-[52.79%] lg:w-[59.65%] lg:max-w-none lg:px-10 lg:py-0"
      >
        <Image
          src="/images/grain-light-texture.svg"
          alt=""
          fill
          className="pointer-events-none object-cover"
        />

        <p className="relative max-w-[90%] font-serif text-[32px] leading-none tracking-[-1.28px] text-black sm:text-[38px] sm:tracking-tight">
          Find out what your data is worth before you decide anything.
        </p>
        <a
          href="#value-my-data"
          className="group relative flex items-center overflow-hidden bg-[#141518] px-5 py-3 font-serif text-xs uppercase tracking-wide text-white"
        >
          <div className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Image src="/images/color-strip-left.svg" alt="" fill className="object-cover" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Image src="/images/color-strip-right.svg" alt="" fill className="object-cover" />
          </div>
          <span className="relative">Value my data</span>
        </a>

        <div className="relative flex w-full flex-col items-center gap-2 border-t border-dashed border-black/8 pt-6 text-center sm:absolute sm:inset-x-0 sm:bottom-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:border-t sm:px-4.5 sm:py-3 sm:text-left">
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-4">
            <p className="font-mono text-[8px] whitespace-nowrap text-[#898989] uppercase tracking-wide">
              process
            </p>
            <p className="font-mono text-[8px] whitespace-nowrap text-[#898989] uppercase tracking-wide">
              identified → structured → verified → licensed
            </p>
          </div>
          <div className="border border-dashed border-[#d9d9d9] px-2 py-1.5">
            <p className="font-mono text-[8px] whitespace-nowrap text-[#898989] uppercase tracking-wide">
              RL-2026-001 // Version 1.0
            </p>
          </div>
          <p className="font-mono text-[8px] leading-tight text-[#898989] uppercase tracking-wide">
            classification
            <br />
            proprietary data / licensing
          </p>
        </div>
      </div>
    </section>
  );
}
