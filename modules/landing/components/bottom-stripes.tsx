"use client";

import { createIllustrationScaler } from "../lib/illustration-scale";
import { useInView } from "../hooks/use-in-view";

const SOURCE = { width: 2882, height: 274 };
const STRIPE_COLOR = "#0C0C0B";

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
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 bottom-0 aspect-[2882/274] w-full overflow-hidden"
      style={{ containerType: "size" }}
    >
      {STRIPES.map((stripe, i) => {
        const delayIndex = STRIPES.length - 1 - i;

        return (
          <div
            key={i}
            className="absolute left-0 w-full transition-[transform,opacity] ease-out"
            style={{
              top: s.y(STRIPE_TOPS[i]),
              height: s.y(stripe.height),
              background: STRIPE_COLOR,
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
