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

const BLUE_CARD_BY_TAB: Record<DeidentificationTab, string> = {
  Coverage: "/images/deidentification/blue-card.webp",
  "The pipeline": "/images/deidentification/blue-card-2.webp",
  Policy: "/images/deidentification/blue-card-3.webp",
};

const VIDEO_BY_TAB: Partial<Record<DeidentificationTab, string>> = {
  Coverage: encodeURI("/images/deidentification/De-Identification - 1.webm"),
  "The pipeline": encodeURI("/images/deidentification/De-Identification - 2.webm"),
  Policy: encodeURI("/images/deidentification/De-Identification - 3.webm"),
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
            icon={
              <Image
                src="/images/the-process-icon.svg"
                alt=""
                width={18}
                height={18}
              />
            }
          />
          <h2 className="font-serif text-[36px] leading-none tracking-[-1.44px] text-black sm:text-[44px] sm:tracking-[-1.76px]">
            De-Identification
          </h2>
        </div>

        <div className="flex flex-col">
          <div className="relative flex flex-col overflow-hidden lg:aspect-[1236/522] lg:flex-row lg:items-stretch">
            <Image
              src="/images/medium-grey-texture-bg.svg"
              alt=""
              fill
              className="pointer-events-none object-cover"
            />
            <Image
              src={GRAIN_TEXTURE}
              alt=""
              fill
              className="pointer-events-none object-cover opacity-[0.11] mix-blend-multiply"
            />

            <div className="relative flex min-w-0 flex-1 items-center px-5 pt-10 pb-5 lg:h-full lg:w-1/2 lg:flex-none lg:gap-10 lg:py-0 lg:pr-[108px] lg:pl-0">
              <div className="relative hidden h-full w-10 shrink-0 self-stretch overflow-hidden lg:block">
                <Image
                  src={SIDE_GRAIN}
                  alt=""
                  fill
                  className="pointer-events-none object-cover opacity-48 mix-blend-multiply"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 lg:gap-[100px]">
                <h3 className="font-serif text-2xl leading-[1.1] tracking-[-0.24px] text-black lg:text-[40px] lg:tracking-[-0.4px]">
                  Your data leaves cleaner than a medical record.
                </h3>
                <div className="flex max-w-[294px] flex-col gap-3.5 text-sm leading-[1.4] tracking-[-0.42px] text-black/60 opacity-80 lg:max-w-none lg:gap-2 lg:text-base lg:tracking-[-0.48px] lg:text-[#727272] lg:opacity-100">
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

            <div className="relative h-5 w-full shrink-0 overflow-hidden lg:hidden">
              <Image
                src={SIDE_GRAIN}
                alt=""
                fill
                className="pointer-events-none object-cover opacity-48 mix-blend-multiply"
              />
            </div>

            <div className="relative h-[292px] w-full min-w-0 overflow-hidden lg:h-full lg:w-1/2 lg:flex-none">
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
