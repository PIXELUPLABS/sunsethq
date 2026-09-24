import Image from "next/image";
import type { WhyReplayStatement } from "../types";

type WhyReplayRowProps = {
  statement: WhyReplayStatement;
  index: number;
};

export function WhyReplayRow({ statement, index }: WhyReplayRowProps) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className="relative flex min-h-[280px] flex-col overflow-hidden border border-black/15 p-5 text-black sm:min-h-[340px] sm:p-6">
      <div className="pointer-events-none absolute -inset-px">
        <Image
          src="/images/hover-card-grey-bg-optimized.svg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative flex flex-col gap-3">
        <p className="font-mono text-xs tracking-wide text-black/50 uppercase">{num}</p>
        <p className="font-serif text-[22px] leading-[1.1] tracking-[-0.22px] sm:text-[26px]">
          {statement.title}
        </p>
        <p className="text-sm leading-[1.45] text-black/60">{statement.body}</p>
      </div>

      <div
        className="absolute -top-[2px] right-0 size-4 bg-black"
        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[22px] overflow-hidden sm:block"
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
    </div>
  );
}
