"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { HeroFooterBar } from "./hero-footer-bar";
import { HeroSidePatternLeft } from "./hero-side-pattern-left";
import { HeroSidePatternRight } from "./hero-side-pattern-right";
import { SectionTag } from "./section-tag";
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
  const textFadeProgress = Math.min(1, convergeProgress / 0.15);

  return (
    <div ref={pinRef} className="relative min-[1350px]:h-[475vh]">
      <section
        className="relative overflow-hidden border-b border-dashed border-[#d4d4d4] bg-[#fcfcfc] min-[1350px]:sticky min-[1350px]:top-0 min-[1350px]:flex min-[1350px]:min-h-[100vh] min-[1350px]:flex-col"
      >
        <Image
          src="/images/grain-light-texture.svg"
          alt=""
          fill
          priority
          className="pointer-events-none object-cover"
        />

        {/* Clipped so the side collages and stacked cards stop at the footer
            bar instead of painting over its labels and lines. */}
        <div className="relative flex items-stretch overflow-hidden min-[1350px]:flex-1 min-[1800px]:[--hero-lift:calc(50vh_-_410px)] min-[1800px]:[--hero-stack-extra-lift:-30px]">
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

        <div className="flex w-full flex-col items-center gap-7 border-dashed border-[#d4d4d4] px-6 pt-[108px] pb-6 min-[1350px]:w-[898px] min-[1350px]:shrink-0 min-[1350px]:justify-center min-[1350px]:gap-10 min-[1350px]:px-0 min-[1350px]:pt-[220px] min-[1350px]:pb-[160px]">
          <div
            className="flex flex-col items-center gap-7 min-[1350px]:gap-10 min-[1350px]:opacity-[calc(1-var(--converge))] min-[1350px]:transform-[translateY(calc(var(--converge)*-40px))]"
            style={{ "--converge": textFadeProgress } as CSSProperties}
          >
            <div className="flex max-w-[840px] flex-col items-center gap-3 text-center min-[1350px]:gap-6">
              <SectionTag
                label="Data & privacy"
                textClassName="text-black/60"
                borderClassName="border-dashed border-black/25"
                paddingClassName="px-2 py-1"
                heightClassName="h-auto"
              />
              <h1 className="font-serif text-[42px] leading-[1.035] tracking-[-1.75px] text-black sm:text-[56px] sm:leading-none sm:tracking-tight lg:text-[72px] lg:tracking-[-2.88px]">
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
