import Image from "next/image";
import { ProcessBar } from "@/modules/landing/components/process-bar";
import type { WhyReplayStatement } from "../types";

type WhyReplayRowProps = {
  statement: WhyReplayStatement;
  index: number;
};

/**
 * Hover-card pattern lifted directly from
 * `modules/landing/components/buyers-section.tsx` (the "You'll know
 * exactly who ends up with it" cards) - same grey-bg base, mesh overlay,
 * black-tint overlay, blue corner triangle, sliding bottom texture and
 * ProcessBar reveal, and the same real assets/component. Content (index /
 * title / body) is unchanged from before; only the card's own visual and
 * hover treatment was swapped to match.
 *
 * Hover accents stay gated with `[@media(hover:hover)]:` (not plain
 * `group-hover:`, unlike buyers-section) - without it, a tap on touch
 * devices would leave them stuck "on" until the user taps elsewhere.
 */
export function WhyReplayRow({ statement, index }: WhyReplayRowProps) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className="group relative flex min-h-[280px] flex-col overflow-hidden border border-black/15 p-5 text-black sm:min-h-[340px] sm:p-6">
      {/* Wrapped 1px past the card's own edges so object-cover rounding
          never leaves a hairline gap along any side. */}
      <div className="pointer-events-none absolute -inset-px">
        <Image
          src="/images/hover-card-grey-bg.svg"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-0 mix-blend-multiply transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-20"
        style={{
          backgroundImage: "url(/images/buyer-card-hover-mesh.png)",
          backgroundSize: "408px 306px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-[0.04]" />

      <div className="relative flex flex-col gap-3">
        <p className="font-mono text-xs tracking-wide text-black/50 uppercase">{num}</p>
        <p className="font-serif text-[22px] leading-[1.1] tracking-[-0.22px] sm:text-[26px]">
          {statement.title}
        </p>
        <p className="text-sm leading-[1.45] text-black/60">{statement.body}</p>
      </div>

      <div
        className="absolute -top-[2px] right-0 size-4 bg-black transition-colors duration-300 [@media(hover:hover)]:group-hover:bg-[#499DF8]"
        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
      />

      {/* Bottom-edge texture: half-height window showing just the image's
          top half by default, growing to full height on hover - the
          fixed, top-anchored image behind it appears to slide its bottom
          half into view as the window grows. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[22px] overflow-hidden transition-[height,bottom] duration-300 sm:block [@media(hover:hover)]:group-hover:h-[44px] [@media(hover:hover)]:group-hover:bottom-[12px]"
        aria-hidden
      >
        <div
          className="absolute inset-x-0 top-0 h-[44px] bg-top bg-no-repeat"
          style={{
            backgroundImage: "url(/images/hover-card-texture-lines.png)",
            backgroundSize: "100% 44px",
          }}
        />
      </div>

      <ProcessBar className="absolute inset-x-0 bottom-0 h-1.5 opacity-0 transition-[opacity,height] duration-300 [@media(hover:hover)]:group-hover:h-3 [@media(hover:hover)]:group-hover:opacity-100" />
    </div>
  );
}
