"use client";

import Image from "next/image";
import { PrimaryButtonHover } from "@/components/ui/primary-button-hover";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { useElementParallax } from "../hooks/use-element-parallax";
import { CtaSectionMobile } from "./cta-section-mobile";
import {
  CTA_CARD_SIZE,
  CTA_COLLAGE_IMAGES,
  CTA_COLLAGE_IMAGE_SIZES,
  CTA_STAGE_ASPECT,
  cq,
} from "../lib/cta-layout";

type CtaSectionProps = {
  headline?: string;
  buttonLabel?: string;
  href?: string;
  topBandClassName?: string;
  sideBorderClassName?: string;
  bottomBandImageSrc?: string;
  /** Defaults to a single object-cover texture; pass `topBandImageRepeat` to tile it instead. */
  topBandImageSrc?: string;
  topBandImageRepeat?: boolean;
};

const DEFAULT_HEADLINE = "Find out what your data is worth";
const DEFAULT_BUTTON_LABEL = "Value my data";
const DEFAULT_HREF = "/value-my-data";
const DEFAULT_TOP_BAND_CLASS_NAME = "bg-[#eaebf1]";
const DEFAULT_SIDE_BORDER_CLASS_NAME = "border-[#d4d4d4]";
const DEFAULT_BOTTOM_BAND_IMAGE_SRC = "/images/cta/cta-bg-text.png";
const DEFAULT_TOP_BAND_IMAGE_SRC = "/images/texture-grain-white.png";

function Arrow() {
  return (
    <span className="flex shrink-0" style={{ width: cq(6), height: cq(6) }}>
      <ArrowRightIcon className="size-full" />
    </span>
  );
}

const CODE_SNIPPET = (
  <>
    def load_dataset(source):
    <br />
    records = source.read()
    <br />
    return normalize(records)
  </>
);

export function CtaSection({
  headline = DEFAULT_HEADLINE,
  buttonLabel = DEFAULT_BUTTON_LABEL,
  href = DEFAULT_HREF,
  topBandClassName = DEFAULT_TOP_BAND_CLASS_NAME,
  sideBorderClassName = DEFAULT_SIDE_BORDER_CLASS_NAME,
  bottomBandImageSrc = DEFAULT_BOTTOM_BAND_IMAGE_SRC,
  topBandImageSrc = DEFAULT_TOP_BAND_IMAGE_SRC,
  topBandImageRepeat = false,
}: CtaSectionProps = {}) {
  const { containerRef, offset } = useElementParallax<HTMLElement>();

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#080808] md:bg-transparent"
    >
      <div className="relative aspect-[390/490] w-full md:hidden">
        <CtaSectionMobile
          headline={headline}
          buttonLabel={buttonLabel}
          href={href}
          topBandClassName={topBandClassName}
        />
      </div>

      <div className="relative hidden w-full md:block">
        {/* Full-bleed bands and the dashed content-column borders. */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-[43%] overflow-hidden ${topBandClassName}`}
        >
          <Image
            src="/images/texture-grain-white.webp"
            alt=""
            fill
            className="pointer-events-none object-cover mix-blend-multiply"
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[57%] bg-[#080808]">
          {/* The text strip along the top of the band: a 1835 x 107 export
              centered on the viewport, its height tied to the section so it
              scales with the collage instead of the viewport. 107/716 of the
              section is 26.2172% of this 57% band. */}
          <div className="absolute top-0 left-1/2 aspect-[1835/107] h-[26.2172%] -translate-x-1/2">
            <Image
              src={bottomBandImageSrc}
              alt=""
              fill
              sizes="100vw"
              className="pointer-events-none object-cover"
            />
          </div>
        </div>
        {/* The dashed column borders stop with the grey band; they must not
            run on through the black band below. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[43%] px-18">
          <div className={`mx-auto h-full w-full max-w-[1560px] border-x border-dashed ${sideBorderClassName}`} />
        </div>

        {/* The stage: the content column. The collage and card are laid out
            in percentages of it, so they scale together and stop at 1560px. */}
        <div className="px-18">
          <div
            className="relative mx-auto w-full max-w-[1560px]"
            style={{ aspectRatio: CTA_STAGE_ASPECT }}
          >
            {CTA_COLLAGE_IMAGES.map((image) => (
              <div
                key={image.src}
                className="pointer-events-none absolute"
                style={{
                  ...image.style,
                  transform: `translate3d(${offset.x * image.shift.x}px, ${offset.y * image.shift.y}px, 0)`,
                }}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes={CTA_COLLAGE_IMAGE_SIZES}
                  className="pointer-events-none object-cover"
                />
              </div>
            ))}

            {/* The grey card. Its contents are sized in container units of
                its own width, so it scales as one piece with the stage. */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-[#eaebf1]"
              style={{ ...CTA_CARD_SIZE, containerType: "inline-size" }}
            >
              <Image
                src="/images/texture-grain-white.webp"
                alt=""
                fill
                className="pointer-events-none object-cover mix-blend-multiply"
              />

              <div
                className="relative flex h-full w-full flex-col items-center justify-center"
                style={{ gap: cq(56) }}
              >
                <p
                  className="relative w-full text-center font-serif leading-none text-black"
                  style={{ maxWidth: cq(755), fontSize: cq(50), letterSpacing: cq(-2.16) }}
                >
                  {headline}
                </p>
                <Link
                  href={href}
                  className="cta-type group relative flex w-[260px] max-w-full items-center justify-center overflow-hidden bg-[#141518] px-6 py-5 text-base text-white transition-transform duration-150 ease-snap active:scale-[0.97]"
                >
                  <PrimaryButtonHover />
                  <span className="relative leading-[0.8]">
                    {buttonLabel}
                  </span>
                </Link>

                <div
                  className="pointer-events-none absolute flex items-center justify-between font-mono tracking-[-0.012em] text-[#898989] uppercase"
                  style={{ top: cq(342), left: cq(24), right: cq(24), fontSize: cq(6) }}
                >
                  <div className="flex items-center" style={{ gap: cq(32) }}>
                    <div className="flex flex-col" style={{ gap: cq(4) }}>
                      <p>process</p>
                      <p className="flex items-center" style={{ gap: cq(4) }}>
                        <span>identified</span>
                        <Arrow />
                        <span>structured</span>
                        <Arrow />
                        <span>verified</span>
                        <Arrow />
                        <span>licensed</span>
                      </p>
                    </div>
                    <div
                      className="border border-dashed border-black/20"
                      style={{ padding: `${cq(6)} ${cq(8)}` }}
                    >
                      <p className="whitespace-nowrap">RL-2026-001 // Version 1.0</p>
                    </div>
                    <p className="leading-tight">
                      classification
                      <br />
                      proprietary data / licensing
                    </p>
                  </div>

                  <div className="flex items-center">
                    {[0, 1].map((i) => (
                      <div
                        key={i}
                        className="relative flex items-center border-[0.5px] border-[#898989]/40"
                        style={{ padding: cq(4), gap: cq(4) }}
                      >
                        <p className="leading-[1.1] tracking-wide" style={{ fontSize: cq(4.2) }}>
                          {CODE_SNIPPET}
                        </p>
                        <span
                          className="absolute rounded-full bg-[#898989]"
                          style={{ bottom: cq(2), left: cq(2), width: cq(2), height: cq(2) }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guides: the horizontal runs edge to edge at y=330 of the 378
                    design; the verticals drop from the top and stop on it. */}
                <div
                  className="pointer-events-none absolute top-0 w-px border-l border-dashed border-black/10"
                  style={{ left: cq(24), height: cq(330) }}
                />
                <div
                  className="pointer-events-none absolute top-0 w-px border-l border-dashed border-black/10"
                  style={{ right: cq(24), height: cq(330) }}
                />
                <div
                  className="pointer-events-none absolute inset-x-0 border-t border-dashed border-black/10"
                  style={{ top: cq(330) }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
