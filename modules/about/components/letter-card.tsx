import Image from "next/image";
import type { LetterCard as LetterCardType } from "../types";

type LetterCardProps = {
  card: LetterCardType;
};

export function LetterCard({ card }: LetterCardProps) {
  return (
    <div className="relative flex h-[400px] flex-1 flex-col gap-5 overflow-hidden border border-black/15 p-5">
      <div className="pointer-events-none absolute -inset-px">
        <Image
          src="/images/medium-grey-texture-bg.svg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative flex flex-col gap-5">
        <p className="font-mono text-xs tracking-wide text-black/60 uppercase">
          {card.number} / {card.label}
        </p>
        <p className="font-serif text-[32px] leading-none tracking-[-1.28px] text-black">
          {card.title}
        </p>
        <div className="flex flex-col gap-4 text-base leading-[1.4] tracking-[-0.48px] text-[#565656]">
          {card.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {card.closingLine ? (
          <p className="font-serif text-2xl leading-none tracking-[-0.96px] text-black">
            {card.closingLine}
          </p>
        ) : null}
      </div>

      <div
        className="absolute -top-px right-0 size-4 bg-black"
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
