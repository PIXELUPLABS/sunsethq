import type { CSSProperties } from "react";
import Image from "next/image";
import {
  HERO_CONVERGE_STACK_CENTER_Y,
  HERO_CONVERGE_STACK_STEP_Y,
  HERO_CONVERGE_X_PX_OFFSET,
  HERO_CONVERGE_X_VW,
  HERO_RIGHT_COLLAGE_IMAGES,
} from "../lib/hero-assets";

const BOX_WIDTH = 272;

// Mirrors STACK_X_NUDGE in HeroSidePatternLeft - nudges just the converging
// collage stack slightly left of its default convergence point.
const STACK_X_NUDGE = 32;

// Mirrors LARGE_SCREEN_STACK_SCALE_Y in HeroSidePatternLeft - must match the
// box's own `min-[1800px]:scale-y-[...]` class below, compensating so each
// piece's --hero-lift contribution isn't doubly amplified by that scale.
const LARGE_SCREEN_STACK_SCALE_Y = 1.35;

/**
 * Per-image stagger so the pieces don't converge in perfect lockstep - each
 * has its own start delay (as a fraction of the shared progress) and easing
 * power. `delay` pushes an image's own start later without changing where
 * it ends up (it still reaches the converged position exactly at
 * progress=1); `power` bends its speed curve (below 1 = rushes ahead then
 * eases in, above 1 = holds back then snaps in). The bottom three pieces
 * (indices 4-6, the lowest y in HERO_RIGHT_COLLAGE_IMAGES) get the most
 * exaggerated values for a visibly distorted, less mechanical feel; the top
 * ones stay close to uniform.
 */
const RIGHT_STAGGER = [
  { delay: 0, power: 1 },
  { delay: 0.02, power: 1.05 },
  { delay: 0, power: 0.95 },
  { delay: 0.06, power: 1.25 },
  { delay: 0.14, power: 0.65 },
  { delay: 0.05, power: 1.45 },
  { delay: 0.18, power: 0.75 },
] as const;

export function HeroSidePatternRight({ progress = 0 }: { progress?: number }) {
  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute top-12 right-0 h-[666px] w-[272px] min-[1800px]:origin-top min-[1800px]:scale-y-[1.35]">
        {HERO_RIGHT_COLLAGE_IMAGES.map((image, index) => {
          const centerX = image.x + image.w / 2;
          const centerY = image.y + image.h / 2;
          const stackY = HERO_CONVERGE_STACK_CENTER_Y - 7 + index * HERO_CONVERGE_STACK_STEP_Y;
          const { delay, power } = RIGHT_STAGGER[index] ?? { delay: 0, power: 1 };
          const t = Math.min(1, Math.max(0, (progress - delay) / (1 - delay)));
          const pieceProgress = Math.pow(t, power);
          // Mirrors the left side's HERO_CONVERGE_X_CSS math: this vw term
          // is negative (the right stack travels left to converge), plus
          // the same fixed px offset subtracted again, so the convergence
          // anchor stays centered in the section at any viewport width.
          const translateX = `calc(${(pieceProgress * (HERO_CONVERGE_X_VW - 100)).toFixed(3)}vw - ${(pieceProgress * (HERO_CONVERGE_X_PX_OFFSET + STACK_X_NUDGE)).toFixed(2)}px + ${(pieceProgress * (BOX_WIDTH - centerX - 37)).toFixed(2)}px)`;
          // The 1800px+ vertical-centering lift (see HeroSection) is scaled
          // by pieceProgress too, so it's fully off at rest (matching this
          // piece's untouched starting position) and fully applied only
          // once converged (matching cards 2-4, which get the full lift).
          const translateY = `calc(${(pieceProgress * (stackY - centerY)).toFixed(2)}px + ${(pieceProgress / LARGE_SCREEN_STACK_SCALE_Y).toFixed(4)} * (var(--hero-lift, 0px) + var(--hero-stack-extra-lift, 0px)))`;
          const scale = (1 - pieceProgress * 0.08).toFixed(3);

          return (
            <div
              key={`${image.src}-${index}`}
              className="absolute"
              style={
                {
                  left: image.x,
                  top: image.y,
                  width: image.w,
                  height: image.h,
                  transform: `translate(${translateX}, ${translateY}) scale(${scale})`,
                  animationName: "reveal-fade-blur",
                  animationDuration: "900ms",
                  animationDelay: `${index * 90}ms`,
                  animationTimingFunction: "ease-out",
                  animationFillMode: "both",
                  "--reveal-blur": "6px",
                } as CSSProperties
              }
            >
              <Image src={image.src} alt="" fill className="object-contain" />
            </div>
          );
        })}
      </div>
      <div className="pointer-events-none absolute top-0 right-[272px] h-full border-l border-dashed border-black/8" />
    </div>
  );
}
