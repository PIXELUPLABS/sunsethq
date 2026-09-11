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
      className="relative flex scroll-mt-16 justify-center overflow-hidden px-6 sm:px-18"
    >
      <Image
        src="/images/grain-light-texture.svg"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative mx-auto w-full max-w-[1560px] border-x border-dashed border-[#d4d4d4]">
        <div className="flex flex-col gap-20 px-5 py-20 sm:px-10">
        <div className="flex flex-col items-start gap-6">
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
          <h2 className="font-serif text-[32px] leading-none tracking-tight text-black sm:text-[44px] sm:tracking-[-1.76px]">
            De-Identification
          </h2>
        </div>

        <div className="flex flex-col">
          <div className="relative flex flex-col gap-10 overflow-hidden lg:aspect-[1236/522] lg:flex-row lg:items-stretch lg:gap-0">
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

            <div className="relative flex min-w-0 flex-1 items-center gap-10 pr-6 pl-6 sm:pr-10 sm:pl-10 lg:h-full lg:w-1/2 lg:flex-none lg:pr-[108px] lg:pl-0">
              <div className="relative hidden h-full w-10 shrink-0 self-stretch overflow-hidden lg:block">
                <Image
                  src={SIDE_GRAIN}
                  alt=""
                  fill
                  className="pointer-events-none object-cover opacity-48 mix-blend-multiply"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center gap-[100px]">
                <h3 className="font-serif text-3xl leading-[1.1] tracking-tight text-black sm:text-[40px] sm:tracking-[-0.4px]">
                  Your data leaves cleaner than a medical record.
                </h3>
                <div className="flex flex-col gap-2 text-base leading-[1.4] tracking-[-0.48px] text-[#727272]">
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

            <div className="relative min-w-0 flex-1 overflow-hidden lg:h-full lg:w-1/2 lg:flex-none">
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
