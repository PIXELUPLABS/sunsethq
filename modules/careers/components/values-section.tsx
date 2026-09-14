"use client";

import Image from "next/image";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { useInView } from "@/modules/landing/hooks/use-in-view";
import { VALUES } from "../lib/constants";

/**
 * Placeholder values (see lib/constants.ts) - no About page/module exists
 * anywhere in this repo yet, so there's nothing real to reuse. Per review
 * feedback, this renders 6 illustrative values now rather than an empty
 * pointer note; replace wholesale once About defines the canonical list.
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
          <SectionTag label="Values" tone="dark" />
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
                // `background-color` rides in the same transition-property
                // list as the entrance's opacity/transform, not a separate
                // `transition-colors` class - Tailwind's transition
                // utilities each replace the whole `transition-property`
                // value rather than merge with it, so two `transition-*`
                // classes on one element would silently fight over which
                // property list wins (confirmed via this project's
                // compiled CSS) instead of combining.
                className={`flex min-h-[220px] flex-col justify-between border-dashed border-[#353535] bg-[#0c0c0b] p-6 transition-[opacity,transform,background-color] duration-500 ease-snap hover:bg-white/[0.04] sm:min-h-[240px] ${
                  isLastMobile ? "border-b-0" : "border-b"
                } ${isLastRowSm ? "sm:border-b-0" : "sm:border-b"} ${
                  needsRightBorderSm ? "sm:border-r" : "sm:border-r-0"
                } ${isLastRowLg ? "lg:border-b-0" : "lg:border-b"} ${
                  needsRightBorderLg ? "lg:border-r" : "lg:border-r-0"
                } ${inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between">
                  <Image src="/images/careers/coin.png" alt="" width={40} height={40} />
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
