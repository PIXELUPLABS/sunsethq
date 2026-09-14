import Image from "next/image";
import { ProcessMarkIcon } from "@/components/ui/process-mark-icon";
import { SectionTag } from "@/modules/landing/components/section-tag";
import {
  DATA_TRUST_GRAIN_STRIP,
  DATA_TRUST_GRAIN_STRIP_SIZE,
  DATA_TRUST_PANEL_MARK,
  PAGE_GRAIN_TEXTURE,
  SOFT_LIGHT_TEXTURE,
  SOFT_LIGHT_TEXTURE_SIZE,
} from "../lib/assets";
import {
  DEIDENTIFICATION_BODY,
  DEIDENTIFICATION_EYEBROW,
  DEIDENTIFICATION_STEPS,
} from "../lib/constants";
import { RedactedEmailCard } from "./redacted-email-card";

/** Top-to-bottom, the design's panel gradient runs bright blue into navy. */
const PANEL_GRADIENT =
  "linear-gradient(180deg, #147dba 25.84%, #133264 98.35%)";

/** No #de-identification anchor here - that one belongs to the home page. */
export function DeidentificationPanel() {
  return (
    <section className="relative flex justify-center overflow-hidden bg-[#fcfcfc] px-3 sm:px-18">
      <Image
        src={PAGE_GRAIN_TEXTURE}
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative mx-auto w-full max-w-[1560px] border-x border-dashed border-black/8">
        <div className="pt-10 sm:pt-[65px]">
          {/* the grain band and rule the design opens the section with */}
          <div
            aria-hidden
            className="pointer-events-none h-[46px] opacity-48 mix-blend-multiply sm:mx-10"
            style={{
              backgroundImage: `url("${DATA_TRUST_GRAIN_STRIP}")`,
              backgroundSize: DATA_TRUST_GRAIN_STRIP_SIZE,
            }}
          />
          <div className="border-t border-dashed border-black/8" />
        </div>

        <div
          className="relative overflow-hidden lg:flex lg:h-[600px] lg:gap-8 lg:pt-6"
          style={{ background: PANEL_GRADIENT }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{
              backgroundImage: `url("${SOFT_LIGHT_TEXTURE}")`,
              backgroundSize: SOFT_LIGHT_TEXTURE_SIZE,
            }}
          />

          <Image
            src={DATA_TRUST_PANEL_MARK}
            alt=""
            width={733}
            height={735}
            aria-hidden
            className="pointer-events-none absolute top-[237px] left-[39px] hidden h-[367px] w-[366px] -scale-x-100 opacity-40 lg:block"
          />

          <div className="relative flex flex-col gap-5 px-5 pt-8 pb-10 lg:h-full lg:w-[405px] lg:shrink-0 lg:gap-6 lg:px-0 lg:pt-0 lg:pb-6 lg:pl-6">
            <SectionTag
              label="The Process"
              tone="dark"
              borderClassName="border-[#a3a3a3]"
              textClassName="text-[#ebebeb]"
              icon={<ProcessMarkIcon tone="dark" className="size-[18px]" />}
            />
            <h2 className="font-serif text-[36px] leading-none tracking-[-1.44px] text-white lg:text-[44px] lg:tracking-[-1.76px]">
              De-Identification
            </h2>
            <p className="text-sm leading-[1.4] tracking-[-0.42px] text-[#f2f2f2]">
              {DEIDENTIFICATION_BODY}
            </p>
          </div>

          <div className="relative bg-black/20 lg:flex lg:h-full lg:min-w-0 lg:flex-1 lg:items-center lg:overflow-hidden lg:pt-10">
            <div className="flex flex-col gap-10 px-5 pt-8 pb-6 lg:h-full lg:w-[442px] lg:shrink-0 lg:justify-between lg:gap-0 lg:px-8 lg:pt-0 lg:pb-8">
              <div className="flex flex-col gap-6 lg:gap-[42px]">
                <div className="flex flex-col gap-2">
                  <p className="flex h-[33px] items-center text-sm leading-[1.4] tracking-[-0.42px] text-white">
                    {DEIDENTIFICATION_EYEBROW}
                  </p>
                  <h3 className="font-serif text-[26px] leading-[1.1] tracking-[-0.26px] text-white lg:text-[36px] lg:leading-none lg:tracking-[-1.44px]">
                    Your data.
                    <br />
                    De-identified.
                  </h3>
                </div>
                <p className="text-sm leading-[1.4] tracking-[-0.42px] text-white lg:max-w-[360px]">
                  {DEIDENTIFICATION_BODY}
                </p>
              </div>

              <ol className="flex flex-col lg:w-[161px]">
                {DEIDENTIFICATION_STEPS.map((step) => (
                  <li
                    key={step}
                    className="flex h-[33px] items-center justify-center border-b border-[#353535] text-sm leading-[1.4] tracking-[-0.42px] text-white"
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* The design lets the card run past the panel's right edge; the
                clip on this column is what cuts it off. */}
            <div className="relative flex justify-center border border-dashed border-white/28 bg-black/[0.07] p-4 lg:h-full lg:w-[494px] lg:shrink-0 lg:p-10">
              <RedactedEmailCard className="lg:absolute lg:top-7 lg:left-[27px] lg:w-[572px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
