import type { CSSProperties } from "react";
import Image from "next/image";
import {
  HERO_CONVERGE_STACK_CENTER_Y,
  HERO_CONVERGE_STACK_STEP_Y,
  HERO_CONVERGE_X_PX_OFFSET,
  HERO_CONVERGE_X_VW,
  HERO_LEFT_COLLAGE_IMAGES,
} from "../lib/hero-assets";

const STACK_X_NUDGE = 32;

// On wide screens the hero is taller, so the stack spreads out vertically.
// The spread scales each piece's position, never the piece itself, so the
// images keep their proportions. `--stack-spread` is 1 below 1800px.
const STACK_SPREAD_CLASS = "[--stack-spread:1] min-[1800px]:[--stack-spread:1.35]";

export function HeroSidePatternLeft({ progress = 0 }: { progress?: number }) {
  return (
    <div className="relative h-full w-full">
      <div className={`pointer-events-none absolute top-12 left-0 w-[270px] ${STACK_SPREAD_CLASS}`}
        style={{ height: "calc(666px * var(--stack-spread))" }}
      >
        {HERO_LEFT_COLLAGE_IMAGES.map((image, index) => {
          const centerX = image.x + image.w / 2;
          const stackY = HERO_CONVERGE_STACK_CENTER_Y + index * HERO_CONVERGE_STACK_STEP_Y;
          const translateX = `calc(${(progress * HERO_CONVERGE_X_VW).toFixed(3)}vw - ${(progress * (HERO_CONVERGE_X_PX_OFFSET + STACK_X_NUDGE + centerX + 37)).toFixed(2)}px)`;
          // Rendered centre = image.y * spread + h/2; the piece converges on
          // stackY * spread plus the wide-screen lift.
          const translateY = `calc(${(progress * (stackY - image.y)).toFixed(2)}px * var(--stack-spread) - ${(progress * (image.h / 2)).toFixed(2)}px + ${progress.toFixed(4)} * (var(--hero-lift, 0px) + var(--hero-stack-extra-lift, 0px)))`;
          const scale = (1 - progress * 0.08).toFixed(3);

          return (
            <div
              key={`${image.src}-${index}`}
              className="absolute"
              style={
                {
                  left: image.x,
                  top: `calc(${image.y}px * var(--stack-spread))`,
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
