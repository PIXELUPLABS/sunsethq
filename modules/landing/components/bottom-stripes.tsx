"use client";

import { createIllustrationScaler } from "../lib/illustration-scale";
import { useInView } from "../hooks/use-in-view";

const SRC = "/images/pricing/bottom-stripes.png";
const SOURCE = { width: 2882, height: 274 };
const BAND_COUNT = 10;

const s = createIllustrationScaler(SOURCE.width, SOURCE.height);

// Band thickness ramps from 1 unit (top) to BAND_COUNT units (bottom), so
// the strips visibly thin out toward the top and thicken going down.
const WEIGHT_TOTAL = (BAND_COUNT * (BAND_COUNT + 1)) / 2;
const UNIT_HEIGHT = SOURCE.height / WEIGHT_TOTAL;
const BAND_HEIGHTS = Array.from({ length: BAND_COUNT }, (_, j) => (j + 1) * UNIT_HEIGHT);

const BAND_TOPS = BAND_HEIGHTS.reduce<number[]>((tops, height, j) => {
  tops.push(j === 0 ? 0 : tops[j - 1] + BAND_HEIGHTS[j - 1]);
  return tops;
}, []);

/**
 * Slices the single bottom-stripes.png asset into horizontal bands — thin at
 * the top, thickening toward the bottom — so each can slide/fade in
 * independently. Bands are placed directly in their final (already flipped)
 * position, showing the matching pre-flip slice of the source image via
 * background-position — this reproduces the original `-scale-y-100` image
 * exactly, without needing a runtime CSS flip that would otherwise invert
 * each band's own reveal-animation direction.
 */
export function BottomStripes() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 bottom-0 aspect-[2882/274] w-full overflow-hidden"
      style={{ containerType: "size" }}
    >
      {BAND_HEIGHTS.map((height, j) => {
        const finalTop = BAND_TOPS[j];
        const sourceStart = SOURCE.height - finalTop - height;
        const delayIndex = BAND_COUNT - 1 - j;

        return (
          <div
            key={j}
            className="absolute left-0 w-full transition-[transform,opacity] ease-out"
            style={{
              top: s.y(finalTop),
              height: s.y(height),
              backgroundImage: `url(${SRC})`,
              backgroundSize: `${s.x(SOURCE.width)} ${s.y(SOURCE.height)}`,
              backgroundPositionX: "0px",
              backgroundPositionY: `-${s.y(sourceStart)}`,
              backgroundRepeat: "no-repeat",
              transitionDuration: "700ms",
              transitionDelay: `${delayIndex * 70}ms`,
              transform: inView ? "translateY(0)" : "translateY(14px)",
              opacity: inView ? 1 : 0,
            }}
          />
        );
      })}
    </div>
  );
}
