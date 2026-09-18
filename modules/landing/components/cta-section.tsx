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
};

const DEFAULT_HEADLINE = "Find out what your data is worth before you decide anything.";
const DEFAULT_BUTTON_LABEL = "Value my data";
const DEFAULT_HREF = "/value-my-data";
const DEFAULT_TOP_BAND_CLASS_NAME = "bg-[#eaebf1]";
const DEFAULT_SIDE_BORDER_CLASS_NAME = "border-[#d4d4d4]";
const DEFAULT_BOTTOM_BAND_IMAGE_SRC = "/images/cta/cta-bg-text.png";

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
}: CtaSectionProps = {}) {
  const { containerRef, offset } = useElementParallax<HTMLElement>();

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#080808] md:bg-transparent"
    >
      <div className="relative aspect-[390/572] w-full md:hidden">
        <CtaSectionMobile
          headline={headline}
          buttonLabel={buttonLabel}
          href={href}
          topBandClassName={topBandClassName}
          bottomBandImageSrc={bottomBandImageSrc}
        />
      </div>

      <div className="relative hidden w-full md:block">
        {/* Full-bleed bands and the dashed content-column borders. */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-[43%] overflow-hidden ${topBandClassName}`}
        >
          <Image
            src="/images/texture-grain-white.png"
            alt=""
            fill
            className="pointer-events-none object-cover mix-blend-multiply"
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[57%] overflow-hidden bg-[#080808]">
          <div className="absolute inset-x-0 top-0 aspect-[4320/321] w-full">
            <Image
              src={bottomBandImageSrc}
              alt=""
              fill
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
                src="/images/texture-grain-white.png"
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
                  className="group relative flex items-center overflow-hidden bg-[#141518] transition-transform duration-150 ease-snap active:scale-[0.97]"
                  style={{ padding: `${cq(12)} ${cq(20)}` }}
                >
                  <PrimaryButtonHover />
                  <span
                    className="relative font-serif leading-[0.8] tracking-wide text-white"
                    style={{ fontSize: cq(12) }}
                  >
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

                <div
                  className="pointer-events-none absolute w-px -translate-y-1/2 border-l border-dashed border-black/10"
                  style={{ top: `calc(50% - ${cq(22)})`, left: cq(24), height: cq(334) }}
                />
                <div
                  className="pointer-events-none absolute w-px -translate-y-1/2 border-l border-dashed border-black/10"
                  style={{ top: `calc(50% - ${cq(22)})`, right: cq(24), height: cq(334) }}
                />
                <div
                  className="pointer-events-none absolute border-t border-dashed border-black/10"
                  style={{ top: `calc(50% + ${cq(141)})`, left: cq(61), right: cq(61) }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
