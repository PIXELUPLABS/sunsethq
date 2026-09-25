"use client";

import Image from "next/image";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { GrainCard } from "@/components/ui/grain-card";
import { useCardStackScroll } from "../hooks/use-card-stack-scroll";
import { GROWTH_BODY, GROWTH_CARDS, GROWTH_EYEBROW, GROWTH_HEADING } from "../lib/constants";

export function ANewWayToGrowSection({ matchHeight }: { matchHeight?: number }) {
  const { pinRef, getCardStyle, enabled } = useCardStackScroll(GROWTH_CARDS.length);
  const panelHeight = enabled && matchHeight ? matchHeight : undefined;

  return (
    <div ref={pinRef} className="relative lg:h-[320vh] motion-reduce:h-auto!">
      <section className="relative flex justify-center overflow-hidden bg-[#fcfcfc] px-3 motion-reduce:static! sm:px-18 lg:sticky lg:top-0">
        <Image
          src="/images/grain-light-texture.svg"
          alt=""
          fill
          className="pointer-events-none object-cover"
        />

        <div
          className="relative mx-auto w-full max-w-[1560px] overflow-hidden border border-dashed border-[#d4d4d4]"
          style={{ height: panelHeight }}
        >
          <div className="flex flex-col items-start justify-between gap-10 px-5 py-10 sm:px-10 sm:py-20 lg:flex-row lg:gap-16">
            <div className="flex max-w-[597px] flex-col items-start gap-6">
              <SectionTag
                label={GROWTH_EYEBROW}
                textClassName="text-black/60"
                borderClassName="border-dashed border-black/25"
                paddingClassName="px-2 py-1"
                heightClassName="h-auto"
              />
              <div className="flex flex-col items-start gap-4.5">
                <p className="max-w-[525px] font-serif text-[36px] leading-none tracking-[-1.44px] text-black sm:text-[44px] sm:tracking-[-1.76px]">
                  {GROWTH_HEADING}
                </p>
                <p className="max-w-[496px] text-base leading-[1.4] tracking-[-0.48px] text-[#727272]">
                  {GROWTH_BODY}
                </p>
              </div>
            </div>

            <div className="flex w-full max-w-[596px] flex-col gap-5 pt-0 lg:pt-[47px]">
              {GROWTH_CARDS.map((card, index) => (
                <div key={card.title} className="relative" style={getCardStyle(index)}>
                  <GrainCard title={card.title} body={card.body} tagLabel={card.tagLabel} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
