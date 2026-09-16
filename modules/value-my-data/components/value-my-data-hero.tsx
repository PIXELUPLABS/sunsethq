import Image from "next/image";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { BenefitRow } from "./benefit-row";
import { ValueMyDataForm } from "./value-my-data-form";
import {
  BENEFITS,
  VALUE_MY_DATA_BODY,
  VALUE_MY_DATA_EYEBROW,
  VALUE_MY_DATA_HEADLINE,
} from "../lib/constants";

export function ValueMyDataHero() {
  return (
    <section className="relative overflow-hidden border-b border-dashed border-black/8 bg-[#fcfcfc]">
      <Image
        src="/images/grain-light-texture.svg"
        alt=""
        fill
        priority
        className="pointer-events-none object-cover"
      />

      {/* pt clears the 64px fixed header; lg value leaves generous air above
          the headline to match the site's other hero sections. */}
      <div className="relative mx-auto grid w-full max-w-[1560px] grid-cols-1 gap-16 px-6 pt-[108px] pb-16 sm:px-18 lg:grid-cols-[45fr_55fr] lg:items-start lg:gap-20 lg:pt-[180px] lg:pb-28 min-[1800px]:px-0!">
        <div className="flex flex-col items-start gap-10 lg:max-w-[560px] lg:pt-2">
          <div className="flex flex-col items-start gap-5">
            <SectionTag label={VALUE_MY_DATA_EYEBROW} />
            <h1 className="font-serif text-[36px] leading-[1.08] tracking-[-1.3px] text-black sm:text-[44px] sm:tracking-[-1.76px] lg:text-[52px] lg:tracking-[-2.08px]">
              {VALUE_MY_DATA_HEADLINE}
            </h1>
            <p className="max-w-[440px] text-[14.5px] leading-[1.5] tracking-[-0.2px] text-[#727272] sm:text-base sm:leading-[1.5]">
              {VALUE_MY_DATA_BODY}
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:gap-7">
            {BENEFITS.map((benefit) => (
              <BenefitRow key={benefit.title} benefit={benefit} />
            ))}
          </div>
        </div>

        <div className="w-full lg:pt-2">
          <ValueMyDataForm />
        </div>
      </div>
    </section>
  );
}
