import Image from "next/image";
import { ProcessBar } from "@/modules/landing/components/process-bar";
import type { WhyReplayStatement } from "../types";

type WhyReplayRowProps = {
  statement: WhyReplayStatement;
  index: number;
};

/**
 * The hover-card pattern (grey/blue background swap, corner triangle
 * accent, ProcessBar underline) is lifted from
 * `modules/landing/components/buyers-section.tsx` - the codebase's actual
 * "hover cards" component - reusing its real assets
 * (hover-card-grey-bg.svg / hover-card-blue-bg.svg) and `ProcessBar`
 * as-is. Laid out as an equal-width column, matching the 3-up bordered
 * framing of `deidentification-tabs.tsx`, per review feedback asking for
 * "3 vertical columns" styled like those two sections.
 *
 * Body copy stays visible unconditionally - an earlier pass hid it behind
 * `:hover`, which meant touch devices (no hover state) never saw it at
 * all. Hover now only drives the decorative bg/corner/ProcessBar accents,
 * gated with `[@media(hover:hover)]:` since Tailwind v4's `group-hover`
 * isn't auto-gated the way plain `hover:` is (verified against this
 * project's compiled CSS) - without it, a tap would leave those accents
 * stuck "on" until the user taps elsewhere.
 */
export function WhyReplayRow({ statement, index }: WhyReplayRowProps) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className="group relative flex min-h-[280px] flex-col overflow-hidden border border-black/15 p-5 text-black sm:min-h-[340px] sm:p-6">
      <Image
        src="/images/hover-card-grey-bg.svg"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />
      <Image
        src="/images/hover-card-blue-bg.svg"
        alt=""
        fill
        className="pointer-events-none object-cover opacity-0 transition-opacity duration-300 ease-snap [@media(hover:hover)]:group-hover:opacity-100"
      />

      <div className="relative flex flex-col gap-3">
        <p className="font-mono text-xs tracking-wide text-black/50 uppercase transition-colors duration-300 [@media(hover:hover)]:group-hover:text-white/70">
          {num}
        </p>
        <p className="font-serif text-[22px] leading-[1.1] tracking-[-0.22px] transition-colors duration-300 [@media(hover:hover)]:group-hover:text-[#f4f4f4] sm:text-[26px]">
          {statement.title}
        </p>
        <p className="text-sm leading-[1.45] text-black/60 transition-colors duration-300 [@media(hover:hover)]:group-hover:text-white/80">
          {statement.body}
        </p>
      </div>

      <div
        className="absolute -top-[2px] right-[0.5px] size-4 bg-black transition-colors duration-300 [@media(hover:hover)]:group-hover:bg-[#499DF8]"
        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
      />

      <ProcessBar className="absolute inset-x-0 bottom-0 h-1.5 opacity-0 transition-opacity duration-300 ease-snap [@media(hover:hover)]:group-hover:opacity-100" />
    </div>
  );
}
