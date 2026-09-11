import Image from "next/image";
import { HeroSheetIllustration } from "./hero-sheet-illustration";

/**
 * The blueprint rules that frame the hero. The design draws four: the page
 * gutter at 72px, and the 898px text column at (100% - 898px) / 2, which stops
 * partway down the illustration.
 */
function HeroBlueprintRules() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      <div className="absolute top-16 bottom-0 left-[72px] border-l border-dashed border-black/8" />
      <div className="absolute top-[113px] bottom-0 right-[72px] border-r border-dashed border-black/8" />
      <div className="absolute top-0 left-[calc((100%-898px)/2)] h-[801px] border-l border-dashed border-black/8" />
      <div className="absolute top-0 right-[calc((100%-898px)/2)] h-[801px] border-r border-dashed border-black/8" />
    </div>
  );
}

export function DataTrustHero() {
  return (
    <section className="relative overflow-hidden border-b border-dashed border-black/8 bg-[#fcfcfc]">
      <Image
        src="/images/grain-light-texture.svg"
        alt=""
        fill
        priority
        className="pointer-events-none object-cover"
      />

      <HeroBlueprintRules />

      {/* pt clears the 64px fixed header plus the design's own offset. */}
      <div className="relative flex flex-col items-center px-6 pt-[108px] pb-10 text-center lg:px-0 lg:pt-[198px] lg:pb-[55px]">
        <div className="flex flex-col items-center gap-3 lg:gap-6">
          <h1 className="font-serif text-[42px] leading-[1.035] tracking-[-1.75px] text-black sm:text-[56px] sm:leading-none sm:tracking-tight lg:text-[72px] lg:tracking-[-2.88px]">
            Securely license your data.{" "}
            <br className="hidden lg:inline" />
            Stay in compliance.
          </h1>
          <p className="max-w-[811px] text-[14.5px] leading-[1.45] tracking-[-0.37px] text-[#727272] sm:text-base sm:leading-[1.4] sm:tracking-[-0.48px]">
            Replay removes PII, confirms your right to license, and identifies
            any risk. All before your data moves.
          </p>
        </div>
      </div>

      <HeroSheetIllustration />
    </section>
  );
}
