import { SectionTag } from "@/modules/landing/components/section-tag";
import { GrainCard } from "@/components/ui/grain-card";
import { GRAIN_TEXTURE_STYLE } from "../lib/assets";
import { GROWTH_BODY, GROWTH_CARDS, GROWTH_EYEBROW, GROWTH_HEADING } from "../lib/constants";
import { FadeUpReveal } from "./fade-up-reveal";

/**
 * The heading column stays pinned (sticky) while the cards scroll past with
 * the page, each fading up as it enters view. `overflow-clip` rather than
 * `overflow-hidden` on the ancestors keeps `position: sticky` working.
 */
export function ANewWayToGrowSection() {
  return (
    <section className="relative flex justify-center overflow-clip bg-[#fcfcfc] px-3 sm:px-18">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={GRAIN_TEXTURE_STYLE} />

      <div className="relative mx-auto w-full max-w-[1560px] overflow-clip border border-dashed border-[#d4d4d4]">
        <div className="flex flex-col items-start justify-between gap-10 px-5 py-10 sm:px-10 sm:py-20 lg:flex-row lg:gap-16">
          <div className="flex max-w-[597px] flex-col items-start gap-6 lg:sticky lg:top-[120px] lg:mb-80">
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
            {GROWTH_CARDS.map((card) => (
              <FadeUpReveal key={card.title}>
                <GrainCard title={card.title} body={card.body} tagLabel={card.tagLabel} hoverable />
              </FadeUpReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
