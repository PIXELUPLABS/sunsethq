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

const STACK_X_NUDGE = 32;

// On wide screens the hero is taller, so the stack spreads out vertically.
// The spread scales each piece's position, never the piece itself, so the
// images keep their proportions. `--stack-spread` is 1 below 1800px.
const STACK_SPREAD_CLASS = "[--stack-spread:1] min-[1800px]:[--stack-spread:1.35]";

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
      <div className={`pointer-events-none absolute top-12 right-0 w-[272px] ${STACK_SPREAD_CLASS}`}
        style={{ height: "calc(666px * var(--stack-spread))" }}
      >
        {HERO_RIGHT_COLLAGE_IMAGES.map((image, index) => {
          const centerX = image.x + image.w / 2;
          const stackY = HERO_CONVERGE_STACK_CENTER_Y - 7 + index * HERO_CONVERGE_STACK_STEP_Y;
          const { delay, power } = RIGHT_STAGGER[index] ?? { delay: 0, power: 1 };
          const t = Math.min(1, Math.max(0, (progress - delay) / (1 - delay)));
          const pieceProgress = Math.pow(t, power);
          const translateX = `calc(${(pieceProgress * (HERO_CONVERGE_X_VW - 100)).toFixed(3)}vw - ${(pieceProgress * (HERO_CONVERGE_X_PX_OFFSET + STACK_X_NUDGE)).toFixed(2)}px + ${(pieceProgress * (BOX_WIDTH - centerX - 37)).toFixed(2)}px)`;
          // Rendered centre = image.y * spread + h/2; the piece converges on
          // stackY * spread plus the wide-screen lift.
          const translateY = `calc(${(pieceProgress * (stackY - image.y)).toFixed(2)}px * var(--stack-spread) - ${(pieceProgress * (image.h / 2)).toFixed(2)}px + ${pieceProgress.toFixed(4)} * (var(--hero-lift, 0px) + var(--hero-stack-extra-lift, 0px)))`;
          const scale = (1 - pieceProgress * 0.08).toFixed(3);

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
      <div className="pointer-events-none absolute top-0 right-[272px] h-full border-l border-dashed border-black/8" />
    </div>
  );
}
