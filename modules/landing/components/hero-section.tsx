"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { HeroFooterBar } from "./hero-footer-bar";
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
    <div ref={pinRef} className="relative min-[1350px]:h-[475vh]">
      <section
        className="relative overflow-hidden border-b border-dashed border-black/8 bg-[#fcfcfc] min-[1350px]:sticky min-[1350px]:top-0 min-[1350px]:flex min-[1350px]:min-h-[100vh] min-[1350px]:flex-col"
      >
        <Image
          src="/images/grain-light-texture.svg"
          alt=""
          fill
          priority
          className="pointer-events-none object-cover"
        />

        {/* --hero-lift also vertically centers the combined stack + cards +
            patterns group in the row at 1800px+: HERO_PATTERN_BOX (the
            group's own bounding box) sits at top=136, height=518, so its
            center is 395px down from the row's top - `50vh - 395px` would
            put that same center at the row's own vertical middle; the extra
            -15px nudges it a little higher than dead-center.
            --hero-stack-extra-lift is added on top of that, but only inside
            the converging collage stack (see HeroSidePatternLeft/Right) -
            not cards 2-4 or the funnel/line patterns - shifting just the
            stack images further up still. */}
        <div className="relative flex items-stretch min-[1350px]:flex-1 min-[1800px]:[--hero-lift:calc(50vh_-_410px)] min-[1800px]:[--hero-stack-extra-lift:-30px]">
          {/* Funnel pattern behind the converged stack and cards 2-4 - sized
              to their combined bounding box, fades/scales in only once
              card-4 has fully arrived. z-0 keeps it under the z-10 stack
              columns and the z-18/19/20 cards below. */}
          <div
            className="pointer-events-none absolute z-0 hidden min-[1350px]:block"
            style={{
              left: HERO_PATTERN_BOX.left,
              top: HERO_PATTERN_BOX.top,
              width: HERO_PATTERN_BOX.width,
              height: HERO_PATTERN_BOX.height,
              opacity: patternProgress,
              transform: `translateY(var(--hero-lift, 0px)) scale(${(0.94 + patternProgress * 0.06).toFixed(3)})`,
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
            className="pointer-events-none absolute z-30 hidden min-[1350px]:block"
            style={{
              left: HERO_LINE_PATTERN_BOX.left,
              top: HERO_LINE_PATTERN_BOX.top,
              width: HERO_LINE_PATTERN_BOX.width,
              height: HERO_LINE_PATTERN_BOX.height,
              opacity: linePatternProgress,
              transform: `translateY(var(--hero-lift, 0px)) scale(${(0.94 + linePatternProgress * 0.06).toFixed(3)})`,
              clipPath: `inset(0 ${((1 - linePatternProgress) * 100).toFixed(2)}% 0 0)`,
            }}
          >
            <Image src={HERO_LINE_PATTERN} alt="" fill className="object-contain" />
          </div>

          <div className="relative z-10 hidden flex-1 min-[1350px]:flex">
            <HeroSidePatternLeft progress={convergeProgress} />
          </div>

        {/* pt on mobile clears the 64px fixed header plus the design's own 44px. */}
        <div className="flex w-full flex-col items-center gap-7 border-dashed border-black/8 px-6 pt-[108px] pb-6 min-[1350px]:w-[898px] min-[1350px]:shrink-0 min-[1350px]:justify-center min-[1350px]:gap-10 min-[1350px]:px-0 min-[1350px]:pt-[220px] min-[1350px]:pb-[160px]">
          <div
            className="flex flex-col items-center gap-7 min-[1350px]:gap-10 min-[1350px]:opacity-[calc(1-var(--converge))] min-[1350px]:transform-[translateY(calc(var(--converge)*-40px))]"
            style={{ "--converge": textFadeProgress } as CSSProperties}
          >
            <div className="flex max-w-[840px] flex-col items-center gap-3 text-center min-[1350px]:gap-6">
              <h1 className="font-serif text-[42px] leading-[1.035] tracking-[-1.75px] text-[#181a1b] sm:text-[56px] sm:leading-none sm:tracking-tight min-[1350px]:text-[72px] min-[1350px]:tracking-[-2.88px]">
                Securely license your data.
                <br />
                Stay in compliance.
              </h1>
              <p className="max-w-[669px] text-[14.5px] leading-[1.45] tracking-[-0.37px] text-[#727272] sm:text-base sm:leading-relaxed sm:tracking-tight">
                Replay removes PII, confirms your right to license, and
                identifies any risk.
                <br />
                All before your data moves.
              </p>
            </div>
          </div>

          <Image
            src="/images/hero/hero-img-mobile.webp"
            alt=""
            width={1050}
            height={891}
            priority
            sizes="420px"
            className="w-full max-w-[420px] min-[1350px]:hidden"
          />
        </div>

        <div className="relative z-10 hidden flex-1 min-[1350px]:flex">
          <HeroSidePatternRight progress={convergeProgress} />
        </div>

        {/* Arrives just to the bottom-right of the converged stack, once
            that convergence beat has finished. */}
        <div
          className="pointer-events-none absolute z-18 hidden min-[1350px]:block"
          style={{
            left: `calc(${HERO_CONVERGE_X_CSS} + 5px)`,
            top: HERO_PATTERN_TOP_OFFSET + HERO_CONVERGE_STACK_CENTER_Y - 12,
            width: 316,
            height: 316,
            opacity: card2Progress,
            transform: `translateY(calc(${((1 - card2Progress) * 24).toFixed(2)}px + var(--hero-lift, 0px)))`,
          }}
        >
          <div className="absolute inset-0 bg-white" />
          <Image src={HERO_CARD_2} alt="" fill className="relative object-contain" />
        </div>

        {/* Peeks out from the bottom-right of card-2, arriving in its own
            beat only once card-2 has finished. */}
        <div
          className="pointer-events-none absolute z-19 hidden min-[1350px]:block"
          style={{
            left: `calc(${HERO_CONVERGE_X_CSS} + 40px + 210px - 5px)`,
            top: HERO_PATTERN_TOP_OFFSET + HERO_CONVERGE_STACK_CENTER_Y + 55,
            width: 316,
            height: 316,
            opacity: card3Progress,
            transform: `translateY(calc(${((1 - card3Progress) * 24).toFixed(2)}px + var(--hero-lift, 0px)))`,
          }}
        >
          <Image src={HERO_CARD_3} alt="" fill className="object-contain" />
        </div>

        {/* Peeks out from the bottom-right of card-3, arriving in its own
            beat only once card-3 has finished. */}
        <div
          className="pointer-events-none absolute z-20 hidden min-[1350px]:block"
          style={{
            left: `calc(${HERO_CONVERGE_X_CSS} + 470px)`,
            top: HERO_PATTERN_TOP_OFFSET + HERO_CONVERGE_STACK_CENTER_Y + 119,
            width: 316,
            height: 316,
            opacity: card4Progress,
            transform: `translateY(calc(${((1 - card4Progress) * 24).toFixed(2)}px + var(--hero-lift, 0px)))`,
          }}
        >
          <Image src={HERO_CARD_4} alt="" fill className="object-contain" />
        </div>
      </div>

      <HeroFooterBar />
    </section>
    </div>
  );
}
