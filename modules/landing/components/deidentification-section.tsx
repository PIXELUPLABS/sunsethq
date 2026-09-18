"use client";

import Image from "next/image";
import { SectionTag } from "./section-tag";
import { DeidentificationTabs } from "./deidentification-tabs";
import { DeidentificationMediaLayer } from "./deidentification-media-layer";
import { DEIDENTIFICATION_TABS, type DeidentificationTab } from "../lib/constants";
import { useStepCycle } from "../hooks/use-step-cycle";
import { useCrossfadeLayers } from "../hooks/use-crossfade-layers";

const MEDIA_CROSSFADE_MS = 500;

const GRAIN_TEXTURE = "/images/grain-light-texture.svg";
const SIDE_GRAIN = "/images/deidentification/deidentification-left-pattern.png";
const STRIP_GRAIN = "/images/deidentification/grain-strip.webp";

const BLUE_CARD_BY_TAB: Record<DeidentificationTab, string> = {
  Coverage: "/images/deidentification/blue-card.webp",
  "The pipeline": "/images/deidentification/blue-card-2.webp",
  Policy: "/images/deidentification/blue-card-3.webp",
};

const VIDEO_BY_TAB: Partial<Record<DeidentificationTab, string>> = {
  Coverage: encodeURI("/images/deidentification/De-Identification - 1.mp4"),
  "The pipeline": encodeURI("/images/deidentification/De-Identification - 2.mp4"),
  Policy: encodeURI("/images/deidentification/De-Identification - 3.mp4"),
};

export function DeidentificationSection() {
  const { activeIndex, setActiveIndex } = useStepCycle(DEIDENTIFICATION_TABS.length);
  const mediaLayerKeys = useCrossfadeLayers(activeIndex, MEDIA_CROSSFADE_MS);

  return (
    <section
      id="de-identification"
      className="relative flex scroll-mt-16 justify-center overflow-hidden px-3 sm:px-18"
    >
      <Image
        src="/images/grain-light-texture.svg"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative mx-auto w-full max-w-[1560px] border-x border-dashed border-[#d4d4d4]">
        <div className="flex flex-col gap-10 py-16 sm:gap-20 sm:px-10 sm:py-20">
        <div className="flex flex-col items-start gap-6 px-3 sm:px-0">
          <SectionTag
            label="The Process"
            textClassName="text-black/60"
            borderClassName="border-dashed border-black/25"
            paddingClassName="px-2 py-1"
            heightClassName="h-auto"
          />
          <h2 className="font-serif text-[36px] leading-none tracking-[-1.44px] text-black sm:text-[44px] sm:tracking-[-1.76px]">
            De-Identification
          </h2>
        </div>

        <div className="flex flex-col">
          <div className="relative flex flex-col overflow-hidden bg-[#eaebf1] min-[1150px]:aspect-[1236/522] min-[1150px]:flex-row min-[1150px]:items-stretch">
            <Image
              src={GRAIN_TEXTURE}
              alt=""
              fill
              className="pointer-events-none object-cover opacity-[0.11] mix-blend-multiply"
            />

            <div className="relative flex min-w-0 flex-1 items-center px-5 pt-10 pb-5 min-[1150px]:h-full min-[1150px]:w-1/2 min-[1150px]:flex-none min-[1150px]:gap-6 min-[1150px]:py-0 min-[1150px]:pr-10 min-[1150px]:pl-0 xl:gap-10 xl:pr-[108px]">
              <Image
                src="/images/medium-grey-texture-bg.svg"
                alt=""
                fill
                className="pointer-events-none object-cover"
              />

              <div className="relative hidden h-full w-10 shrink-0 self-stretch overflow-hidden min-[1150px]:block">
                <Image
                  src={SIDE_GRAIN}
                  alt=""
                  fill
                  className="pointer-events-none object-cover opacity-48 mix-blend-multiply"
                />
              </div>

              <div className="relative flex min-w-0 flex-1 flex-col justify-center gap-5 min-[1150px]:justify-start min-[1150px]:self-start min-[1150px]:pt-16">
                <h3 className="font-serif text-2xl leading-[1.1] tracking-[-0.24px] text-black min-[1150px]:text-[32px] min-[1150px]:tracking-[-0.32px] xl:text-[40px] xl:tracking-[-0.4px]">
                  Your data leaves cleaner than a medical record.
                </h3>
                <div className="flex max-w-[90%] flex-col gap-3.5 text-sm leading-[1.4] tracking-[-0.42px] text-black/60 opacity-80 min-[1150px]:max-w-none min-[1150px]:gap-2 min-[1150px]:text-base min-[1150px]:tracking-[-0.48px] min-[1150px]:text-[#727272] min-[1150px]:opacity-100">
                  <p>
                    The federal standard for de-identifying medical records
                    (HIPAA) lists eighteen categories that have to be
                    stripped out. We cover all eighteen, and many more.
                  </p>
                  <p>
                    Names, emails, API keys, access tokens, customer
                    records. Our de-identification covers 60+ categories,
                    across every file type and application your business
                    works in.
                  </p>
                </div>
              </div>
            </div>

            <div
              aria-hidden
              className="pointer-events-none h-5 w-full shrink-0 opacity-48 mix-blend-multiply min-[1150px]:hidden"
              style={{
                backgroundImage: `url("${STRIP_GRAIN}")`,
                backgroundSize: "384px 20px",
                backgroundPosition: "left top",
                backgroundRepeat: "repeat-x",
              }}
            />

            <div className="relative aspect-[364/292] w-full min-w-0 overflow-hidden min-[1150px]:aspect-auto min-[1150px]:h-full min-[1150px]:w-1/2 min-[1150px]:flex-none">
              {mediaLayerKeys.map((index, layerPosition) => {
                const tab = DEIDENTIFICATION_TABS[index];
                return (
                  <DeidentificationMediaLayer
                    key={index}
                    videoSrc={VIDEO_BY_TAB[tab]}
                    imageSrc={BLUE_CARD_BY_TAB[tab]}
                    isIncoming={layerPosition === mediaLayerKeys.length - 1}
                  />
                );
              })}
            </div>
          </div>

          <DeidentificationTabs activeIndex={activeIndex} onSelect={setActiveIndex} />
        </div>
        </div>
      </div>
    </section>
  );
}
