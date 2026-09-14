import type { CSSProperties } from "react";
import Image from "next/image";
import {
  HERO_CONVERGE_STACK_CENTER_Y,
  HERO_CONVERGE_STACK_STEP_Y,
  HERO_CONVERGE_X_PX_OFFSET,
  HERO_CONVERGE_X_VW,
  HERO_LEFT_COLLAGE_IMAGES,
} from "../lib/hero-assets";

// Nudges just the converging collage stack (not the funnel/line patterns or
// cards 2-4) slightly left of its default convergence point.
const STACK_X_NUDGE = 32;

// Must match the box's own `min-[1800px]:scale-y-[...]` class below - each
// piece's translateY renders inside that scaled box, so its own Y offset
// (including --hero-lift) gets visually multiplied by this factor too.
// Dividing --hero-lift by it here cancels that out, so the piece's actual
// on-screen shift matches --hero-lift exactly, same as cards 2-4 (which sit
// outside the scaled box and get it unscaled).
const LARGE_SCREEN_STACK_SCALE_Y = 1.35;

export function HeroSidePatternLeft({ progress = 0 }: { progress?: number }) {
  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute top-12 left-0 h-[666px] w-[270px] min-[1800px]:origin-top min-[1800px]:scale-y-[1.35]">
        {HERO_LEFT_COLLAGE_IMAGES.map((image, index) => {
          const centerX = image.x + image.w / 2;
          const centerY = image.y + image.h / 2;
          const stackY = HERO_CONVERGE_STACK_CENTER_Y + index * HERO_CONVERGE_STACK_STEP_Y;
          // Matches HERO_CONVERGE_X_CSS (progress-scaled): a vw term plus a
          // fixed px offset, so the convergence anchor stays centered in the
          // section at any viewport width rather than drifting off-center.
          const translateX = `calc(${(progress * HERO_CONVERGE_X_VW).toFixed(3)}vw - ${(progress * (HERO_CONVERGE_X_PX_OFFSET + STACK_X_NUDGE + centerX + 37)).toFixed(2)}px)`;
          // The 1800px+ vertical-centering lift (see HeroSection) is scaled
          // by progress too, so it's fully off at rest (matching this
          // piece's untouched starting position) and fully applied only
          // once converged (matching cards 2-4, which get the full lift).
          const translateY = `calc(${(progress * (stackY - centerY)).toFixed(2)}px + ${(progress / LARGE_SCREEN_STACK_SCALE_Y).toFixed(4)} * (var(--hero-lift, 0px) + var(--hero-stack-extra-lift, 0px)))`;
          const scale = (1 - progress * 0.08).toFixed(3);

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
      <div className="pointer-events-none absolute top-0 left-[270px] h-full border-r border-dashed border-black/8" />
    </div>
  );
}
