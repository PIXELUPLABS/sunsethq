import Image from "next/image";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ProcessBar } from "@/modules/landing/components/process-bar";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { HERO_PROCESS_DASH } from "@/modules/landing/lib/hero-assets";
import { CAREERS_EYEBROW, CAREERS_INTRO } from "../lib/constants";

export function CareersHero() {
  return (
    <section className="relative flex h-screen flex-col overflow-hidden bg-[#fcfcfc]">
      <Image
        src="/images/grain-light-texture.svg"
        alt=""
        fill
        priority
        className="pointer-events-none object-cover"
      />

      {/* Same max-w-[1560px] bordered-frame system every section below
          this one uses (why-replay-section.tsx, benefits-section.tsx,
          open-roles-section.tsx) - the hero previously used its own
          one-off full-bleed `border-b`, leaving it visually disconnected
          from that frame chain instead of starting it.
          `#d4d4d4`, matching the main page's own dashed grid lines
          (buyers-section.tsx, deidentification-section.tsx,
          stats-section.tsx, etc.) - per review, this page's whole grid
          frame should use the same line color as the main page rather
          than its own `#a8a8a8` deviation, even though an earlier pass
          found `#d4d4d4` harder to see against this section's
          grain-textured `#fcfcfc`. */}
      <div className="relative mx-auto flex w-full max-w-[1560px] flex-1 flex-col border border-dashed border-[#d4d4d4]">
        {/* pt clears the 64px fixed header; shorter than data-trust's hero
            since this section has no illustration pushing content down. */}
        <div className="relative flex flex-1 flex-col items-center justify-center px-6 pt-[108px] pb-16 text-center lg:px-0 lg:pt-[160px] lg:pb-24">
          <div className="flex flex-col items-center gap-6">
            <SectionTag
              label={CAREERS_EYEBROW}
              icon={
                <Image
                  src="/images/careers/careers-section-tag.webp"
                  alt=""
                  width={18}
                  height={18}
                />
              }
            />

            {/* Two short lines, like the site's other hero headlines
                (e.g. data-trust-hero's "Securely license your data. /
                Stay in compliance."). No max-width here, matching that
                hero - a width constraint forces each line to wrap a
                second time instead of holding one line each. */}
            <h1 className="font-serif text-[42px] leading-[1.035] tracking-[-1.75px] text-black sm:text-[56px] sm:leading-none sm:tracking-tight lg:text-[72px] lg:tracking-[-2.88px]">
              Every company runs on data.
              <br />
              We turn it into revenue.
            </h1>

            <p className="max-w-[560px] text-[14.5px] leading-[1.45] tracking-[-0.37px] text-[#727272] sm:text-base sm:leading-[1.4] sm:tracking-[-0.48px]">
              {CAREERS_INTRO}
            </p>
          </div>
        </div>

        {/* The real homepage hero's own bottom info-row
            (hero-section.tsx), fetched alongside the ProcessBar below it
            rather than just the bar alone - same 3 cells (process chain /
            revision chip / classification), same copy, same dashed
            dividers and mono styling. Only the first cell's width
            differs: the real hero fixes it to
            `calc((100%-898px)/2)` to align with that page's centered
            898px column, which this simpler single-column hero has no
            equivalent of, so it just takes the remaining flex space. */}
        <div className="grid w-full grid-cols-[1fr_auto] items-center gap-2 border-t border-dashed border-black/8 px-6 pt-3.5 pb-[17px] lg:flex lg:items-stretch lg:gap-0 lg:px-0 lg:py-0">
          <div className="lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:border-r lg:border-dashed lg:border-black/8 lg:px-4.5 lg:py-4">
            <div className="flex items-center gap-1">
              <p className="font-mono text-[8px] tracking-wide text-[#898989] uppercase">
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
            <p className="flex flex-wrap items-center gap-1 font-mono text-[8px] tracking-wide text-[#898989] uppercase">
              <span className="lg:hidden">process: </span>
              <span>identified</span>
              <ArrowRightIcon className="size-2.5 shrink-0" />
              <span>structured</span>
              <ArrowRightIcon className="size-2.5 shrink-0" />
              <span>verified</span>
              <ArrowRightIcon className="size-2.5 shrink-0" />
              <span>licensed</span>
            </p>
          </div>
          <div className="flex items-center lg:w-[181px] lg:shrink-0 lg:border-r lg:border-dashed lg:border-black/8 lg:px-4.5 lg:py-4">
            <div className="border border-dashed border-[#d9d9d9] px-1.5 py-1.5 lg:px-2">
              <p className="font-mono text-[6.8px] tracking-wide text-[#8d8d8d] uppercase lg:text-[8px] lg:text-[#898989]">
                RL-2026-001
                <br className="lg:hidden" />
                <span className="hidden lg:inline">{" // "}</span>
                Version 1.0
              </p>
            </div>
          </div>
          <div className="col-span-2 flex items-center lg:w-[258px] lg:shrink-0 lg:px-4.5 lg:py-4">
            <p className="font-mono text-[7px] tracking-wide text-[#aaa] uppercase lg:text-[8px] lg:leading-tight lg:text-[#898989]">
              classification<span className="lg:hidden">: </span>
              <br className="hidden lg:block" />
              proprietary data / licensing
            </p>
          </div>
        </div>

        {/* Same real, content-free `ProcessBar` component
            (modules/landing/components/process-bar.tsx) the real
            homepage's own hero closes with, and already reused
            cross-module in why-replay-row.tsx - not a recreation. */}
        <ProcessBar className="h-2 lg:h-5" />
      </div>
    </section>
  );
}
