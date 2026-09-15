"use client";

import Image from "next/image";
import { ArrowRightIcon } from "@/components/ui/icons";
import { useElementParallax } from "../hooks/use-element-parallax";
import { CtaSectionMobile } from "./cta-section-mobile";

const TOP_LEFT_PARALLAX_SHIFT_X = 20;
const TOP_LEFT_PARALLAX_SHIFT_Y = 12;
const TOP_RIGHT_PARALLAX_SHIFT_X = 16;
const TOP_RIGHT_PARALLAX_SHIFT_Y = 10;
const RIGHT_BOTTOM_PARALLAX_SHIFT_X = 18;
const RIGHT_BOTTOM_PARALLAX_SHIFT_Y = 11;
const LEFT_BOTTOM_PARALLAX_SHIFT_X = 14;
const LEFT_BOTTOM_PARALLAX_SHIFT_Y = 9;

type CtaSectionProps = {
  headline?: string;
  buttonLabel?: string;
  href?: string;
  /** Override the section's top-band color to match whatever precedes it on the page (defaults to `bg-[#eaebf1]`, matching the section that precedes this on the home and data-trust pages). */
  topBandClassName?: string;
  /** Override the dashed stroke color of the two vertical lines that run the full height of this section, to match the frame color the preceding section closes with (defaults to `border-[#d4d4d4]`, matching `industries-section.tsx`/`assurance-section.tsx` on the home and data-trust pages) - e.g. Careers passes `border-[#a8a8a8]` to match `open-roles-section.tsx`'s own frame color, chosen there because `#d4d4d4` read as invisible against that page's grain-textured backgrounds. */
  sideBorderClassName?: string;
  /** Override the bottom band's image (defaults to `cta-bg-text.png`) - e.g. Careers passes the same striped asset used in `benefits-section.tsx` so the page's two dark sections share one motif. */
  bottomBandImageSrc?: string;
};

const DEFAULT_HEADLINE = "Find out what your data is worth before you decide anything.";
const DEFAULT_BUTTON_LABEL = "Value my data";
const DEFAULT_HREF = "#value-my-data";
const DEFAULT_TOP_BAND_CLASS_NAME = "bg-[#eaebf1]";
const DEFAULT_SIDE_BORDER_CLASS_NAME = "border-[#d4d4d4]";
const DEFAULT_BOTTOM_BAND_IMAGE_SRC = "/images/cta-bg-text.png";

export function CtaSection({
  headline = DEFAULT_HEADLINE,
  buttonLabel = DEFAULT_BUTTON_LABEL,
  href = DEFAULT_HREF,
  topBandClassName = DEFAULT_TOP_BAND_CLASS_NAME,
  sideBorderClassName = DEFAULT_SIDE_BORDER_CLASS_NAME,
  bottomBandImageSrc = DEFAULT_BOTTOM_BAND_IMAGE_SRC,
}: CtaSectionProps = {}) {
  const { containerRef, offset } = useElementParallax<HTMLElement>();

  return (
    <section
      ref={containerRef}
      // Kept as "value-my-data" regardless of `href` above - the navbar's
      // own CTA always points at "#value-my-data" on every page, so this
      // section needs to stay reachable at that id no matter what its own
      // button links to.
      id="value-my-data"
      className="relative aspect-[390/572] w-full scroll-mt-16 overflow-hidden bg-[#080808] lg:aspect-[1440/716] lg:bg-transparent"
    >
      <div className="lg:hidden">
        <CtaSectionMobile
          headline={headline}
          buttonLabel={buttonLabel}
          href={href}
          topBandClassName={topBandClassName}
          bottomBandImageSrc={bottomBandImageSrc}
        />
      </div>
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 hidden h-[43%] overflow-hidden lg:block ${topBandClassName}`}
      >
        <Image
          src="/images/texture-grain-white.png"
          alt=""
          fill
          className="pointer-events-none object-cover mix-blend-multiply"
        />
      </div>

      {/* Left/right continuation of the frame the section above
          (`open-roles-section.tsx` on careers, `industries-section.tsx`/
          `assurance-section.tsx` elsewhere) draws around its own
          `max-w-[1560px]` column - same `px-3 sm:px-18` outer padding +
          `mx-auto max-w-[1560px]` inner column those frames use, so these
          two lines land exactly under that frame's own left/right edges
          and read as one continuous line running down into this section,
          not a second, offset pair starting fresh. Full section height
          (not just the top band) so the line carries all the way through
          to the CTA content below. `sideBorderClassName` matches the
          stroke color to whichever of those frames precedes this section. */}
      <div className="pointer-events-none absolute inset-0 hidden px-3 sm:px-18 lg:block">
        <div className={`mx-auto h-full w-full max-w-[1560px] border-x border-dashed ${sideBorderClassName}`} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[57%] overflow-hidden bg-[#080808] lg:block">
        <div className="absolute inset-x-0 top-0 aspect-[4320/321] w-full">
          <Image
            src={bottomBandImageSrc}
            alt=""
            fill
            className="pointer-events-none object-cover"
          />
        </div>
      </div>
      <div
        className="pointer-events-none absolute top-[14.9441%] left-[12.7778%] hidden h-[42.0391%] w-[45%] lg:block"
        style={{
          transform: `translate3d(${offset.x * TOP_LEFT_PARALLAX_SHIFT_X}px, ${offset.y * TOP_LEFT_PARALLAX_SHIFT_Y}px, 0)`,
        }}
      >
        <Image
          src="/images/top-left-cta-img.webp"
          alt=""
          fill
          className="pointer-events-none object-cover"
        />
      </div>
      <div
        className="pointer-events-none absolute top-[14.9441%] right-[12.8472%] hidden h-[44.8324%] w-[37.6389%] lg:block"
        style={{
          transform: `translate3d(${offset.x * TOP_RIGHT_PARALLAX_SHIFT_X}px, ${offset.y * TOP_RIGHT_PARALLAX_SHIFT_Y}px, 0)`,
        }}
      >
        <Image
          src="/images/top-right-cta-img.png"
          alt=""
          fill
          className="pointer-events-none object-cover"
        />
      </div>
      <div
        className="pointer-events-none absolute top-[43.0168%] left-[42.1528%] hidden h-[42.0391%] w-[45%] lg:block"
        style={{
          transform: `translate3d(${offset.x * RIGHT_BOTTOM_PARALLAX_SHIFT_X}px, ${offset.y * RIGHT_BOTTOM_PARALLAX_SHIFT_Y}px, 0)`,
        }}
      >
        <Image
          src="/images/right-bottom-cta-img.webp"
          alt=""
          fill
          className="pointer-events-none object-cover"
        />
      </div>
      <div
        className="pointer-events-none absolute bottom-[14.9441%] left-[12.7778%] hidden h-[44.8324%] w-[37.6389%] lg:block"
        style={{
          transform: `translate3d(${offset.x * LEFT_BOTTOM_PARALLAX_SHIFT_X}px, ${offset.y * LEFT_BOTTOM_PARALLAX_SHIFT_Y}px, 0)`,
        }}
      >
        <Image
          src="/images/left-bottom-cta-img.png"
          alt=""
          fill
          className="pointer-events-none object-cover"
        />
      </div>
      <div className="absolute top-1/2 left-1/2 hidden h-[378px] w-[860px] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-[#eaebf1] lg:block">
        {/* `mix-blend-multiply`, unlike this same texture's plain
            `object-cover` use in `careers-hero.tsx`/`why-replay-section.tsx`
            - those sit on `#fcfcfc`, close enough to the texture's own
            near-white fill that it reads fine unblended. This card's
            `#eaebf1` is visibly darker, so without multiplying, the
            texture's own near-white background painted over it washed the
            card back out to white instead of showing the tint through. */}
        <Image
          src="/images/texture-grain-white.png"
          alt=""
          fill
          className="pointer-events-none object-cover mix-blend-multiply"
        />

        <div className="relative flex h-full w-full flex-col items-center justify-center gap-14">
          <p className="relative w-full max-w-[755px] text-center font-serif text-[50px] leading-none tracking-[-2.16px] text-black">
            {headline}
          </p>
          <a
            href={href}
            className="group relative flex items-center overflow-hidden bg-[#141518] px-5 py-3 transition-transform duration-150 ease-snap active:scale-[0.97]"
          >
            <div className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-30" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100">
              <Image src="/images/color-strip-left.svg" alt="" fill className="object-cover" />
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100">
              <Image src="/images/color-strip-right.svg" alt="" fill className="object-cover" />
            </div>
            <span className="relative font-serif text-xs leading-[0.8] tracking-wide text-white">
              {buttonLabel}
            </span>
          </a>

          <div className="pointer-events-none absolute inset-x-6 top-[342px] flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex flex-col gap-1">
                <p className="font-mono text-[6px] tracking-[-0.07px] text-[#898989] uppercase">
                  process
                </p>
                <p className="flex items-center gap-1 font-mono text-[6px] tracking-[-0.07px] text-[#898989] uppercase">
                  <span>identified</span>
                  <ArrowRightIcon className="size-1.5 shrink-0" />
                  <span>structured</span>
                  <ArrowRightIcon className="size-1.5 shrink-0" />
                  <span>verified</span>
                  <ArrowRightIcon className="size-1.5 shrink-0" />
                  <span>licensed</span>
                </p>
              </div>
              <div className="border border-dashed border-black/20 px-2 py-1.5">
                <p className="font-mono text-[6px] tracking-[-0.07px] text-[#898989] whitespace-nowrap uppercase">
                  RL-2026-001 // Version 1.0
                </p>
              </div>
              <p className="font-mono text-[6px] leading-tight tracking-[-0.07px] text-[#898989] uppercase">
                classification
                <br />
                proprietary data / licensing
              </p>
            </div>

            <div className="flex items-center">
              <div className="relative flex items-center gap-1 border-[0.5px] border-[#898989]/40 p-1">
                <p className="font-mono text-[4.2px] leading-[1.1] tracking-wide text-[#898989] uppercase">
                  def load_dataset(source):
                  <br />
                  records = source.read()
                  <br />
                  return normalize(records)
                </p>
                <span className="absolute bottom-0.5 left-0.5 size-0.5 rounded-full bg-[#898989]" />
              </div>
              <div className="relative flex items-center gap-1 border-[0.5px] border-[#898989]/40 p-1">
                <p className="font-mono text-[4.2px] leading-[1.1] tracking-wide text-[#898989] uppercase">
                  def load_dataset(source):
                  <br />
                  records = source.read()
                  <br />
                  return normalize(records)
                </p>
                <span className="absolute bottom-0.5 left-0.5 size-0.5 rounded-full bg-[#898989]" />
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute top-[calc(50%-22px)] left-6 h-[334px] w-px -translate-y-1/2 border-l border-dashed border-black/10" />
          <div className="pointer-events-none absolute top-[calc(50%-22px)] right-6 h-[334px] w-px -translate-y-1/2 border-l border-dashed border-black/10" />
          <div className="pointer-events-none absolute inset-x-[61px] top-[calc(50%+141px)] border-t border-dashed border-black/10" />
        </div>
      </div>
    </section>
  );
}
