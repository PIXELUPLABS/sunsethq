import Image from "next/image";
import { ProcessBar } from "./process-bar";
import { HeroSidePatternLeft } from "./hero-side-pattern-left";
import { HeroSidePatternRight } from "./hero-side-pattern-right";
import { HERO_BUTTON_PATTERN, HERO_PROCESS_DASH } from "../lib/hero-assets";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-dashed border-black/8 bg-[#fcfcfc]">
      <Image
        src="/images/texture-grain-white.png"
        alt=""
        fill
        priority
        className="pointer-events-none object-cover"
      />

      <div className="relative flex items-stretch">
        <div className="hidden flex-1 lg:flex">
          <HeroSidePatternLeft />
        </div>

        <div className="flex w-full flex-col items-center gap-10 border-dashed border-black/8 px-6 pt-[120px] pb-[90px] lg:w-[898px] lg:shrink-0 lg:border-x lg:px-0 lg:pt-[240px] lg:pb-[180px]">
          <div className="flex max-w-[840px] flex-col items-center gap-6 text-center">
            <h1 className="font-serif text-[40px] leading-none tracking-tight text-black sm:text-[56px] lg:text-[72px] lg:tracking-[-2.88px]">
              Fund growth by licensing the data you already have.
            </h1>
            <p className="max-w-[669px] text-base leading-relaxed tracking-tight text-[#727272]">
              Frontier AI labs need training data on how real companies run.
              You&apos;re sitting on years of it. We value your data, strip out
              every name and identifier, and get you paid.
            </p>
          </div>

          <a
            href="#value-my-data"
            className="relative flex w-[300px] items-center justify-center overflow-hidden bg-ink py-6 font-serif text-base uppercase tracking-wide text-white"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-luminosity"
              style={{
                backgroundImage: `url(${HERO_BUTTON_PATTERN})`,
                backgroundSize: "300px 14px",
                backgroundRepeat: "repeat",
              }}
            />
            <span className="relative">Value my data</span>
          </a>
        </div>

        <div className="hidden flex-1 lg:flex">
          <HeroSidePatternRight />
        </div>
      </div>

      <div className="relative flex flex-col">
        <div className="flex w-full border-t border-dashed border-black/8">
          <div className="flex-1 shrink-0 border-r border-dashed border-black/8 px-4.5 py-4 lg:w-[calc((100%-898px)/2)] lg:flex-none">
            <div className="flex items-center gap-1">
              <p className="font-mono text-[8px] uppercase tracking-wide text-[#898989]">
                process
              </p>
              <Image
                src={HERO_PROCESS_DASH}
                alt=""
                width={193}
                height={1}
                className="h-px w-[193px] max-w-none"
              />
            </div>
            <p className="font-mono text-[8px] uppercase tracking-wide text-[#898989]">
              identified → structured → verified → licensed
            </p>
          </div>
          <div className="flex w-[181px] shrink-0 items-center border-r border-dashed border-black/8 px-4.5 py-4">
            <div className="border border-dashed border-[#d9d9d9] px-2 py-1.5">
              <p className="font-mono text-[8px] uppercase tracking-wide text-[#898989]">
                RL-2026-001 // Version 1.0
              </p>
            </div>
          </div>
          <div className="hidden w-[258px] shrink-0 items-center border-r border-dashed border-black/8 px-4.5 py-4 sm:flex">
            <p className="font-mono text-[8px] uppercase leading-tight tracking-wide text-[#898989]">
              CLASSIFICATION
              <br />
              PROPRIETARY DATA / LICENSING
            </p>
          </div>
        </div>
        <ProcessBar className="h-5" />
      </div>
    </section>
  );
}
