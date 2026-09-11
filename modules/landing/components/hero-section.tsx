import Image from "next/image";
import { ProcessBar } from "./process-bar";
import { HeroSidePatternLeft } from "./hero-side-pattern-left";
import { HeroSidePatternRight } from "./hero-side-pattern-right";
import { HERO_PROCESS_DASH } from "../lib/hero-assets";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-dashed border-black/8 bg-[#fcfcfc]">
      <Image
        src="/images/grain-light-texture.svg"
        alt=""
        fill
        priority
        className="pointer-events-none object-cover"
      />

      <div className="relative flex items-stretch">
        <div className="hidden flex-1 lg:flex">
          <HeroSidePatternLeft />
        </div>

        {/* pt on mobile clears the 64px fixed header plus the design's own 44px. */}
        <div className="flex w-full flex-col items-center gap-7 border-dashed border-black/8 px-6 pt-[108px] pb-6 lg:w-[898px] lg:shrink-0 lg:gap-10 lg:px-0 lg:pt-[220px] lg:pb-[160px]">
          <div className="flex max-w-[840px] flex-col items-center gap-3 text-center lg:gap-6">
            <h1 className="font-serif text-[42px] leading-[1.035] tracking-[-1.75px] text-[#181a1b] sm:text-[56px] sm:leading-none sm:tracking-tight lg:text-[72px] lg:tracking-[-2.88px]">
              Fund growth by licensing the data you already have.
            </h1>
            <p className="max-w-[669px] text-[14.5px] leading-[1.45] tracking-[-0.37px] text-[#727272] sm:text-base sm:leading-relaxed sm:tracking-tight">
              Frontier AI labs need training data on how real companies run.
              You&apos;re sitting on years of it. We value your data, strip out
              every name and identifier, and get you paid.
            </p>
          </div>

          <a
            href="#value-my-data"
            className="group relative flex h-13 w-[300px] max-w-full items-center justify-center overflow-hidden bg-[#141518] font-serif text-xs tracking-[0.1px] text-white uppercase lg:h-auto lg:py-6 lg:text-base lg:tracking-wide"
          >
            <Image
              src="/images/hero/btn-pattern.svg"
              alt=""
              fill
              className="pointer-events-none object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Image
                src="/images/color-strip-left.svg"
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Image
                src="/images/color-strip-right.svg"
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <span className="relative">Value my data</span>
          </a>

          <Image
            src="/images/hero-img-mobile.webp"
            alt=""
            width={1050}
            height={891}
            className="w-full max-w-[420px] lg:hidden"
          />
        </div>

        <div className="hidden flex-1 lg:flex">
          <HeroSidePatternRight />
        </div>
      </div>

      <div className="relative flex flex-col">
        {/* Mobile stacks this into a 2x2 grid (the version box used to be pushed
            off-screen by the fixed-width desktop columns); lg restores the row. */}
        {/* lg stretches the cells so each divider runs the full height of the
            row - centred, they'd only be as tall as their own text. */}
        <div className="grid w-full grid-cols-[1fr_auto] items-center gap-2 border-t border-dashed border-black/8 px-6 pt-3.5 pb-[17px] lg:flex lg:items-stretch lg:gap-0 lg:px-0 lg:py-0">
          <div className="lg:flex lg:w-[calc((100%-898px)/2)] lg:flex-none lg:shrink-0 lg:flex-col lg:justify-center lg:border-r lg:border-dashed lg:border-black/8 lg:px-4.5 lg:py-4">
            <div className="flex items-center gap-1">
              <p className="font-mono text-[8px] uppercase tracking-wide text-[#898989]">
                process
              </p>
              <Image
                src={HERO_PROCESS_DASH}
                alt=""
                width={193}
                height={1}
                className="hidden h-px w-[193px] max-w-none lg:block"
              />
            </div>
            <p className="font-mono text-[8px] uppercase tracking-wide text-[#898989]">
              <span className="lg:hidden">process: </span>
              identified → structured → verified → licensed
            </p>
          </div>
          <div className="flex items-center lg:w-[181px] lg:shrink-0 lg:border-r lg:border-dashed lg:border-black/8 lg:px-4.5 lg:py-4">
            <div className="border border-dashed border-[#d9d9d9] px-1.5 py-1.5 lg:px-2">
              <p className="font-mono text-[6.8px] uppercase tracking-wide text-[#8d8d8d] lg:text-[8px] lg:text-[#898989]">
                RL-2026-001
                <br className="lg:hidden" />
                <span className="hidden lg:inline">{" // "}</span>
                Version 1.0
              </p>
            </div>
          </div>
          <div className="col-span-2 flex items-center lg:w-[258px] lg:shrink-0 lg:border-r lg:border-dashed lg:border-black/8 lg:px-4.5 lg:py-4">
            <p className="font-mono text-[7px] uppercase tracking-wide text-[#aaa] lg:text-[8px] lg:leading-tight lg:text-[#898989]">
              classification<span className="lg:hidden">: </span>
              <br className="hidden lg:block" />
              proprietary data / licensing
            </p>
          </div>
        </div>
        <ProcessBar className="h-2 lg:h-5" />
      </div>

    </section>
  );
}
