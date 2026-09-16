"use client";

import Image from "next/image";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { useInView } from "@/modules/landing/hooks/use-in-view";
import { VALUES } from "../lib/constants";

/**
 * Values copy (see lib/constants.ts) sourced from Figma - node 6712:63.
 * Dark palette per review feedback, matching `valuation-section.tsx`'s
 * existing dark-section precedent (`bg-[#0c0c0b]`). Grid dividers are
 * `border-dashed border-[#353535]`, not the earlier solid `border-[#444]`,
 * to match the dashed-line convention used everywhere else on this page
 * (`why-replay-section.tsx`, `benefits-section.tsx`) at the exact stroke
 * color specified in review feedback.
 *
 * The 6 cards stagger in on scroll, same `useInView` pattern as
 * `why-replay-section.tsx`.
 */
export function ValuesSection() {
  // Higher than why-replay-section.tsx's 0.2: at that threshold the grid
  // started animating while barely peeking into view, so most of the
  // stagger played out before the user had actually scrolled to it. 0.4
  // waits until the grid is meaningfully on-screen first.
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });

  return (
    <section className="flex justify-center bg-[#0c0c0b] px-6 py-16 sm:px-18 sm:py-24 lg:py-[120px]">
      <div className="mx-auto flex w-full max-w-[1560px] flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <SectionTag
            label="Values"
            tone="dark"
            icon={
              <Image
                src="/images/careers/values-icons/values_pillars.webp"
                alt=""
                width={18}
                height={18}
              />
            }
          />
          <h2 className="font-serif text-[36px] leading-none tracking-[-1.44px] text-white sm:text-[44px] sm:tracking-tight">
            What we believe.
          </h2>
        </div>

        <div
          ref={ref}
          className="grid w-full grid-cols-1 border border-dashed border-[#353535] sm:grid-cols-2 lg:grid-cols-3"
        >
          {VALUES.map((value, i) => {
            const isLastMobile = i === VALUES.length - 1;
            const isLastRowSm = i >= VALUES.length - 2;
            const needsRightBorderSm = i % 2 === 0;
            const isLastRowLg = i >= 3;
            const needsRightBorderLg = i % 3 !== 2;

            return (
              <div
                key={value.title}
                // No hover state: these cards are plain content, not links
                // or buttons - a hover response would train people to
                // expect a click to do something, and nothing does. Only
                // `opacity`/`transform` need to transition now (the
                // scroll-in stagger), so they're the only properties listed
                // rather than also carrying a now-unused `background-color`.
                className={`flex min-h-[220px] flex-col justify-between border-dashed border-[#353535] bg-[#0c0c0b] p-6 transition-[opacity,transform] duration-700 ease-snap sm:min-h-[240px] ${
                  isLastMobile ? "border-b-0" : "border-b"
                } ${isLastRowSm ? "sm:border-b-0" : "sm:border-b"} ${
                  needsRightBorderSm ? "sm:border-r" : "sm:border-r-0"
                } ${isLastRowLg ? "lg:border-b-0" : "lg:border-b"} ${
                  needsRightBorderLg ? "lg:border-r" : "lg:border-r-0"
                } ${inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
                // 700ms + 80ms/card: this fires once per visit (`useInView`
                // disconnects after triggering, see the hook), not a
                // frequent interactive response, so it can afford to be
                // slower/more deliberate than the ~150-250ms this project
                // uses for repeatable hover/press feedback elsewhere.
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center justify-between">
                  <Image src={value.icon} alt="" width={40} height={40} />
                  <p className="font-mono text-xs text-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-serif text-xl tracking-[-0.4px] text-white">
                    {value.title}
                  </p>
                  <p className="text-sm leading-[1.45] text-white/60">{value.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
