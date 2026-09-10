"use client";

import { createIllustrationScaler } from "../lib/illustration-scale";
import { useInView } from "../hooks/use-in-view";

const SRC = "/images/pricing/bottom-stripes.png";
const SOURCE = { width: 2882, height: 274 };
const BAND_COUNT = 10;
const BAND_HEIGHT = SOURCE.height / BAND_COUNT;

const s = createIllustrationScaler(SOURCE.width, SOURCE.height);

/**
 * Slices the single bottom-stripes.png asset into equal horizontal bands so
 * each can slide/fade in independently. Bands are placed directly in their
 * final (already flipped) position, showing the matching pre-flip slice of
 * the source image via background-position — this reproduces the original
 * `-scale-y-100` image exactly, without needing a runtime CSS flip that
 * would otherwise invert each band's own reveal-animation direction.
 */
export function BottomStripes() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 bottom-0 aspect-[2882/274] w-full overflow-hidden"
      style={{ containerType: "size" }}
    >
      {Array.from({ length: BAND_COUNT }).map((_, i) => {
        const finalTop = (BAND_COUNT - 1 - i) * BAND_HEIGHT;

        return (
          <div
            key={i}
            className="absolute left-0 w-full transition-[transform,opacity] ease-out"
            style={{
              top: s.y(finalTop),
              height: s.y(BAND_HEIGHT),
              backgroundImage: `url(${SRC})`,
              backgroundSize: `${s.x(SOURCE.width)} ${s.y(SOURCE.height)}`,
              backgroundPositionX: "0px",
              backgroundPositionY: `-${s.y(i * BAND_HEIGHT)}`,
              backgroundRepeat: "no-repeat",
              transitionDuration: "700ms",
              transitionDelay: `${i * 70}ms`,
              transform: inView ? "translateY(0)" : "translateY(14px)",
              opacity: inView ? 1 : 0,
            }}
          />
        );
      })}
    </div>
  );
}
