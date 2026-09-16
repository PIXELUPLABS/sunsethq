"use client";

import Image from "next/image";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { useInView } from "@/modules/landing/hooks/use-in-view";
import { WHY_REPLAY_STATEMENTS } from "../lib/constants";
import { WhyReplayRow } from "./why-replay-row";

/**
 * Bordered-frame/heading/grid skeleton adapted from `buyers-section.tsx`,
 * whose hover cards (unchanged here) were designed for this light shell.
 *
 * The 3 cards stagger in on scroll via the same `useInView` hook
 * `valuation-section.tsx`/`stats-grid.tsx` already use - this page
 * previously had zero scroll-entrance motion despite that pattern
 * existing elsewhere in the codebase.
 *
 * Frame border: full `border` (all sides) at `#d4d4d4`, matching the main
 * page's own dashed grid lines (buyers-section.tsx, stats-section.tsx,
 * etc.) - was `#a8a8a8` (matching careers-hero.tsx/benefits-section.tsx/
 * open-roles-section.tsx's own local deviation from that), but per review
 * this page's grid frame should use the same line color as the main page
 * throughout rather than its own value.
 */
export function WhyReplaySection() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section className="relative flex justify-center overflow-hidden bg-[#fcfcfc] px-3 sm:px-18">
      {/* Same grain texture as the hero above (`careers-hero.tsx`), both on
          the same flat `#fcfcfc` - without it the hero/section boundary
          reads as a visible seam between textured and flat fills. */}
      <Image
        src="/images/grain-light-texture.svg"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative mx-auto w-full max-w-[1560px] border border-dashed border-[#d4d4d4]">
        <div className="flex flex-col gap-10 px-3 py-16 sm:px-10 sm:py-20">
          <div className="flex max-w-[560px] flex-col items-start gap-6">
            <SectionTag label="Why Replay" />
            <h2 className="font-serif text-[36px] leading-none tracking-[-1.44px] text-black sm:text-[44px] sm:tracking-tight">
              A serious place to build.
            </h2>
            <p className="text-sm leading-[1.4] tracking-[-0.42px] text-[#727272]">
              Every dataset that moves through Replay has to survive
              contact with two audiences — a company trusting us with
              records they&apos;ve never shown anyone else, and a lab
              that will only buy data it can verify is clean.
            </p>
          </div>

          <div ref={ref} className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
            {WHY_REPLAY_STATEMENTS.map((statement, index) => (
              <div
                key={statement.title}
                className={`transition-[opacity,transform] duration-500 ease-snap ${
                  inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <WhyReplayRow statement={statement} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
