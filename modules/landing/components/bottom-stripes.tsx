"use client";

import { createIllustrationScaler } from "../lib/illustration-scale";
import { useScrollProgress } from "../hooks/use-scroll-progress";

const SOURCE = { width: 2882, height: 274 };
const DEFAULT_STRIPE_COLOR = "#0C0C0B";

const DESIGN_WIDTH = 1440;
const MAX_HEIGHT_PX = Math.round((DESIGN_WIDTH * SOURCE.height) / SOURCE.width);

const s = createIllustrationScaler(SOURCE.width, SOURCE.height);

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

export function BottomStripes({
  color = DEFAULT_STRIPE_COLOR,
  grainTexture = false,
  overlay = true,
}: {
  color?: string;
  grainTexture?: boolean;
  overlay?: boolean;
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`pointer-events-none aspect-[2882/274] w-full overflow-hidden ${
        overlay ? "absolute inset-x-0 bottom-0" : "relative"
      }`}
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
              background: color,
              transform: `translateY(${(1 - stripeProgress) * 14}px)`,
              opacity: stripeProgress,
            }}
          >
            {grainTexture ? (
              <div
                className="absolute inset-0 bg-[url('/images/grain-light-texture.svg')] bg-top bg-repeat mix-blend-multiply"
                style={{ backgroundSize: "1440px auto" }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
