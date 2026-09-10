"use client";

import Image from "next/image";
import { SectionTag } from "./section-tag";
import { DeidentificationTabs } from "./deidentification-tabs";
import { DEIDENTIFICATION_TABS, type DeidentificationTab } from "../lib/constants";
import { useTabs } from "../hooks/use-tabs";

const GRAIN_TEXTURE = "/images/texture-grain-white.png";
const SIDE_GRAIN = "/images/deidentification/deidentification-left-pattern.png";

const BLUE_CARD_BY_TAB: Record<DeidentificationTab, string> = {
  Coverage: "/images/deidentification/blue-card.webp",
  "The pipeline": "/images/deidentification/blue-card-2.webp",
  Policy: "/images/deidentification/blue-card-3.webp",
};

export function DeidentificationSection() {
  const { activeTab, setActiveTab } = useTabs(DEIDENTIFICATION_TABS);

  return (
    <section
      id="de-identification"
      className="relative flex justify-center overflow-hidden px-6 sm:px-18"
    >
      <Image
        src="/images/texture-grain-white.png"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative w-full border-x border-dashed border-[#d4d4d4]">
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
          <div className="relative flex flex-col gap-10 overflow-hidden bg-[#eaebf1] lg:flex-row lg:items-stretch lg:gap-0">
            <Image
              src={GRAIN_TEXTURE}
              alt=""
              fill
              className="pointer-events-none object-cover opacity-[0.11] mix-blend-multiply"
            />

            <div className="relative flex min-w-0 flex-1 items-center gap-10 pr-6 pl-6 sm:pr-10 sm:pl-10 lg:h-[522px] lg:w-1/2 lg:flex-none lg:pr-[108px] lg:pl-0">
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

            <div className="relative min-w-0 flex-1 overflow-hidden lg:h-[522px] lg:w-1/2 lg:flex-none">
              <Image
                key={activeTab}
                src={BLUE_CARD_BY_TAB[activeTab]}
                alt="Redacted email preview: an original message shown alongside the same message with personally identifiable information replaced by gray redaction bars"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <DeidentificationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        </div>
      </div>
    </section>
  );
}
