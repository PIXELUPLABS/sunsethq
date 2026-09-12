import type { CSSProperties } from "react";
import Image from "next/image";
import {
  HERO_CONVERGE_STACK_CENTER_Y,
  HERO_CONVERGE_STACK_STEP_Y,
  HERO_CONVERGE_X_VW,
  HERO_LEFT_COLLAGE_IMAGES,
} from "../lib/hero-assets";

export function HeroSidePatternLeft({ progress = 0 }: { progress?: number }) {
  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute top-12 left-0 h-[666px] w-[270px] min-[1800px]:origin-top min-[1800px]:scale-y-[1.15]">
        {HERO_LEFT_COLLAGE_IMAGES.map((image, index) => {
          const centerX = image.x + image.w / 2;
          const centerY = image.y + image.h / 2;
          const stackY = HERO_CONVERGE_STACK_CENTER_Y + index * HERO_CONVERGE_STACK_STEP_Y;
          // min() with the 1800px-viewport-equivalent px value freezes the
          // convergence anchor's horizontal position past that width, so
          // the (fixed-px-wide) converged cluster stays centered instead of
          // drifting as the viewport keeps growing.
          const translateX = `calc(min(${(progress * HERO_CONVERGE_X_VW).toFixed(3)}vw, ${(progress * HERO_CONVERGE_X_VW * 18).toFixed(2)}px) - ${(progress * (centerX + 37)).toFixed(2)}px)`;
          const translateY = `${(progress * (stackY - centerY)).toFixed(2)}px`;
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
