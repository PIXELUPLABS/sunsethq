"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ProcessBar } from "./process-bar";
import { HeroSidePatternLeft } from "./hero-side-pattern-left";
import { HeroSidePatternRight } from "./hero-side-pattern-right";
import {
  HERO_CARD_2,
  HERO_CARD_3,
  HERO_CARD_4,
  HERO_CONVERGE_STACK_CENTER_Y,
  HERO_CONVERGE_X_CSS,
  HERO_LINE_PATTERN,
  HERO_LINE_PATTERN_BOX,
  HERO_PATTERN,
  HERO_PATTERN_BOX,
  HERO_PATTERN_TOP_OFFSET,
  HERO_PROCESS_DASH,
} from "../lib/hero-assets";
import { useScrollProgress } from "../hooks/use-scroll-progress";

function remap(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

export function HeroSection() {
  // The wrapper is 4.75x viewport-tall (desktop only) so the section can sit
  // `sticky` inside it for back-to-back scroll-driven beats - the side
  // collages converging, then card-2, then card-3 next to card-2, then
  // card-4 next to card-3, then the funnel pattern fading in behind the
  // converged stack and all three cards - plus a trailing hold (the last
  // 1/15th of the extra scroll) where everything just sits fully revealed
  // for a beat before the page releases to the next section. The
  // connector-line pattern runs alongside cards 2-4, spanning their whole
  // combined beat rather than getting a beat of its own.
  const { ref: pinRef, progress: masterProgress } = useScrollProgress<HTMLDivElement>({
    startAt: 0,
    endAt: -3.75,
  });
  const convergeProgress = remap(masterProgress, 0, 4 / 15);
  const card2Progress = remap(masterProgress, 4 / 15, 6 / 15);
  const card3Progress = remap(masterProgress, 6 / 15, 8 / 15);
  const card4Progress = remap(masterProgress, 8 / 15, 10 / 15);
  const patternProgress = remap(masterProgress, 10 / 15, 12 / 15);
  const linePatternProgress = remap(masterProgress, 4 / 15, 10 / 15);
  // The heading/button should be gone almost as soon as scrolling starts,
  // not fade gradually across the whole convergence beat - so it races to 1
  // over just the first slice of that scroll range.
  const textFadeProgress = Math.min(1, convergeProgress / 0.15);

  return (
    <div ref={pinRef} className="relative lg:h-[475vh]">
      <section className="relative overflow-hidden border-b border-dashed border-black/8 bg-[#fcfcfc] lg:sticky lg:top-0 lg:flex lg:min-h-[80vh] lg:flex-col">
        <Image
          src="/images/grain-light-texture.svg"
          alt=""
          fill
          priority
          className="pointer-events-none object-cover"
        />

        <div className="relative flex items-stretch lg:flex-1">
          {/* Funnel pattern behind the converged stack and cards 2-4 - sized
              to their combined bounding box, fades/scales in only once
              card-4 has fully arrived. z-0 keeps it under the z-10 stack
              columns and the z-18/19/20 cards below. */}
          <div
            className="pointer-events-none absolute z-0 hidden lg:block"
            style={{
              left: HERO_PATTERN_BOX.left,
              top: HERO_PATTERN_BOX.top,
              width: HERO_PATTERN_BOX.width,
              height: HERO_PATTERN_BOX.height,
              opacity: patternProgress,
              transform: `scale(${(0.94 + patternProgress * 0.06).toFixed(3)})`,
            }}
          >
            <Image src={HERO_PATTERN} alt="" fill className="object-cover" />
          </div>

          {/* Connector-line pattern aligned with the converged stack, fading
              in and wiping left-to-right (via clip-path) across the same
              scroll span as cards 2-4 (starts with card-2, finishes with
              card-4). z-30 puts it above everything else in the hero - the
              stack (z-10) and cards 2-4 (z-18/19/20) included. */}
          <div
            className="pointer-events-none absolute z-30 hidden lg:block"
            style={{
              left: HERO_LINE_PATTERN_BOX.left,
              top: HERO_LINE_PATTERN_BOX.top,
              width: HERO_LINE_PATTERN_BOX.width,
              height: HERO_LINE_PATTERN_BOX.height,
              opacity: linePatternProgress,
              transform: `scale(${(0.94 + linePatternProgress * 0.06).toFixed(3)})`,
              clipPath: `inset(0 ${((1 - linePatternProgress) * 100).toFixed(2)}% 0 0)`,
            }}
          >
            <Image src={HERO_LINE_PATTERN} alt="" fill className="object-contain" />
          </div>

          <div className="relative z-10 hidden flex-1 lg:flex">
            <HeroSidePatternLeft progress={convergeProgress} />
          </div>

        {/* pt on mobile clears the 64px fixed header plus the design's own 44px. */}
        <div className="flex w-full flex-col items-center gap-7 border-dashed border-black/8 px-6 pt-[108px] pb-6 lg:w-[898px] lg:shrink-0 lg:justify-center lg:gap-10 lg:px-0 lg:pt-[220px] lg:pb-[160px]">
          <div
            className="flex flex-col items-center gap-7 lg:gap-10 lg:opacity-[calc(1-var(--converge))] lg:transform-[translateY(calc(var(--converge)*-40px))]"
            style={{ "--converge": textFadeProgress } as CSSProperties}
          >
            <div className="flex max-w-[840px] flex-col items-center gap-3 text-center lg:gap-6">
              <h1 className="font-serif text-[42px] leading-[1.035] tracking-[-1.75px] text-[#181a1b] sm:text-[56px] sm:leading-none sm:tracking-tight lg:text-[72px] lg:tracking-[-2.88px]">
                Fund growth by licensing the data you already have.
              </h1>
              <p className="max-w-[669px] text-[14.5px] leading-[1.45] tracking-[-0.37px] text-[#727272] sm:text-base sm:leading-relaxed sm:tracking-tight">
                Frontier AI labs need training data on how real companies run.
                You&apos;re sitting on years of it. We value your data, strip out
                every name and identifier, and get you paid.
              </p>
            </div>

            <a
              href="#value-my-data"
              className="group relative flex h-13 w-[300px] max-w-full items-center justify-center overflow-hidden bg-[#141518] font-serif text-xs tracking-[0.1px] text-white uppercase lg:h-auto lg:py-6 lg:text-base lg:tracking-wide"
            >
              <Image
                src="/images/hero/btn-pattern.svg"
                alt=""
                fill
                className="pointer-events-none object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Image
                  src="/images/color-strip-left.svg"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Image
                  src="/images/color-strip-right.svg"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <span className="relative">Value my data</span>
            </a>
          </div>

          <Image
            src="/images/hero-img-mobile.webp"
            alt=""
            width={1050}
            height={891}
            priority
            sizes="420px"
            className="w-full max-w-[420px] lg:hidden"
          />
        </div>

        <div className="relative z-10 hidden flex-1 lg:flex">
          <HeroSidePatternRight progress={convergeProgress} />
        </div>

        {/* Arrives just to the bottom-right of the converged stack, once
            that convergence beat has finished. */}
        <div
          className="pointer-events-none absolute z-18 hidden lg:block"
          style={{
            left: `calc(${HERO_CONVERGE_X_CSS} + 40px)`,
            top: HERO_PATTERN_TOP_OFFSET + HERO_CONVERGE_STACK_CENTER_Y + 8,
            width: 316,
            height: 316,
            opacity: card2Progress,
            transform: `translateY(${((1 - card2Progress) * 24).toFixed(2)}px)`,
          }}
        >
          <Image src={HERO_CARD_2} alt="" fill className="object-contain" />
        </div>

        {/* Peeks out from the bottom-right of card-2, arriving in its own
            beat only once card-2 has finished. */}
        <div
          className="pointer-events-none absolute z-19 hidden lg:block"
          style={{
            left: `calc(${HERO_CONVERGE_X_CSS} + 40px + 210px)`,
            top: HERO_PATTERN_TOP_OFFSET + HERO_CONVERGE_STACK_CENTER_Y + 10 + 55,
            width: 316,
            height: 316,
            opacity: card3Progress,
            transform: `translateY(${((1 - card3Progress) * 24).toFixed(2)}px)`,
          }}
        >
          <Image src={HERO_CARD_3} alt="" fill className="object-contain" />
        </div>

        {/* Peeks out from the bottom-right of card-3, arriving in its own
            beat only once card-3 has finished. */}
        <div
          className="pointer-events-none absolute z-20 hidden lg:block"
          style={{
            left: `calc(${HERO_CONVERGE_X_CSS} + 40px + 210px + 189px)`,
            top: HERO_PATTERN_TOP_OFFSET + HERO_CONVERGE_STACK_CENTER_Y + 10 + 50 + 58,
            width: 316,
            height: 316,
            opacity: card4Progress,
            transform: `translateY(${((1 - card4Progress) * 24).toFixed(2)}px)`,
          }}
        >
          <Image src={HERO_CARD_4} alt="" fill className="object-contain" />
        </div>
      </div>

      <div className="relative flex flex-col">
        {/* Mobile stacks this into a 2x2 grid (the version box used to be pushed
            off-screen by the fixed-width desktop columns); lg restores the row. */}
        {/* lg stretches the cells so each divider runs the full height of the
            row - centred, they'd only be as tall as their own text. */}
        <div className="grid w-full grid-cols-[1fr_auto] items-center gap-2 border-t border-dashed border-black/8 px-6 pt-3.5 pb-[17px] lg:flex lg:items-stretch lg:gap-0 lg:px-0 lg:py-0">
          <div className="lg:flex lg:w-[calc((100%-898px)/2)] lg:flex-none lg:shrink-0 lg:flex-col lg:justify-center lg:border-r lg:border-dashed lg:border-black/8 lg:px-4.5 lg:py-4">
            <div className="flex items-center gap-1">
              <p className="font-mono text-[8px] uppercase tracking-wide text-[#898989]">
                process
              </p>
              <Image
                src={HERO_PROCESS_DASH}
                alt=""
                width={193}
                height={1}
                className="hidden h-px w-[193px] max-w-none lg:block"
              />
            </div>
            <p className="flex flex-wrap items-center gap-1 font-mono text-[8px] uppercase tracking-wide text-[#898989]">
              <span className="lg:hidden">process: </span>
              <span>identified</span>
              <ArrowRightIcon className="size-2.5 shrink-0" />
              <span>structured</span>
              <ArrowRightIcon className="size-2.5 shrink-0" />
              <span>verified</span>
              <ArrowRightIcon className="size-2.5 shrink-0" />
              <span>licensed</span>
            </p>
          </div>
          <div className="flex items-center lg:w-[181px] lg:shrink-0 lg:border-r lg:border-dashed lg:border-black/8 lg:px-4.5 lg:py-4">
            <div className="border border-dashed border-[#d9d9d9] px-1.5 py-1.5 lg:px-2">
              <p className="font-mono text-[6.8px] uppercase tracking-wide text-[#8d8d8d] lg:text-[8px] lg:text-[#898989]">
                RL-2026-001
                <br className="lg:hidden" />
                <span className="hidden lg:inline">{" // "}</span>
                Version 1.0
              </p>
            </div>
          </div>
          <div className="col-span-2 flex items-center lg:w-[258px] lg:shrink-0 lg:border-r lg:border-dashed lg:border-black/8 lg:px-4.5 lg:py-4">
            <p className="font-mono text-[7px] uppercase tracking-wide text-[#aaa] lg:text-[8px] lg:leading-tight lg:text-[#898989]">
              classification<span className="lg:hidden">: </span>
              <br className="hidden lg:block" />
              proprietary data / licensing
            </p>
          </div>
        </div>
          <ProcessBar className="h-2 lg:h-5" />
        </div>
      </section>
    </div>
  );
}
