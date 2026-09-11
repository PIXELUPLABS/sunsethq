"use client";

import { createIllustrationScaler } from "../lib/illustration-scale";
import { useScrollProgress } from "../hooks/use-scroll-progress";

const SOURCE = { width: 2882, height: 274 };
const STRIPE_COLOR = "#0C0C0B";

// The band is sized by the section's width, but the section itself is a fixed
// 990px tall, so past the 1440px the artwork was drawn for it would keep
// growing into the copy above it. Freeze it at the height it has there and let
// the stripes stay full-bleed horizontally.
const DESIGN_WIDTH = 1440;
const MAX_HEIGHT_PX = Math.round((DESIGN_WIDTH * SOURCE.height) / SOURCE.width);

const s = createIllustrationScaler(SOURCE.width, SOURCE.height);

// Exact stripe geometry read directly off /public/images/pricing/bottom-stripes.png
// (alpha-channel transitions sampled pixel-by-pixel, confirmed uniform across
// the full width). Listed in final render order — top (thinnest) to bottom
// (thickest) — i.e. already reversed from the source file's own top-to-bottom
// order, since the original asset is rendered with a vertical flip.
const STRIPES = [
  { height: 3, gapAfter: 15 },
  { height: 5, gapAfter: 12 },
  { height: 8, gapAfter: 13 },
  { height: 11, gapAfter: 10 },
  { height: 13, gapAfter: 9 },
  { height: 17, gapAfter: 7 },
  { height: 22, gapAfter: 6 },
  { height: 24, gapAfter: 3 },
  { height: 96, gapAfter: 0 },
];

const STRIPE_TOPS = STRIPES.reduce<number[]>((tops, stripe, i) => {
  tops.push(i === 0 ? 0 : tops[i - 1] + STRIPES[i - 1].height + STRIPES[i - 1].gapAfter);
  return tops;
}, []);

export function BottomStripes() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 bottom-0 aspect-[2882/274] w-full overflow-hidden"
      style={{ containerType: "size", maxHeight: MAX_HEIGHT_PX }}
    >
      {STRIPES.map((stripe, i) => {
        const delayIndex = STRIPES.length - 1 - i;
        const stripeStart = delayIndex / STRIPES.length;
        const stripeEnd = (delayIndex + 1) / STRIPES.length;
        const stripeProgress = Math.min(
          1,
          Math.max(0, (progress - stripeStart) / (stripeEnd - stripeStart))
        );

        return (
          <div
            key={i}
            className="absolute left-0 w-full"
            style={{
              top: s.y(STRIPE_TOPS[i]),
              height: s.y(stripe.height),
              background: STRIPE_COLOR,
              transform: `translateY(${(1 - stripeProgress) * 14}px)`,
              opacity: stripeProgress,
            }}
          />
        );
      })}
    </div>
  );
}
