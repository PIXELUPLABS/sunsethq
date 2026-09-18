import Image from "next/image";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { BenefitRow } from "./benefit-row";
import { ValueMyDataForm } from "./value-my-data-form";
import {
  BENEFITS,
  VALUE_MY_DATA_BODY,
  VALUE_MY_DATA_EYEBROW,
  VALUE_MY_DATA_HEADLINE_LEAD,
  VALUE_MY_DATA_HEADLINE_TAIL,
} from "../lib/constants";

const GRAIN_TEXTURE = "/images/pricing/grain-texture.webp";

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

      <div className="relative mx-auto grid w-full max-w-[1560px] grid-cols-1 gap-16 px-6 pt-[108px] pb-0 sm:px-18 lg:grid-cols-[45fr_55fr] lg:items-stretch lg:gap-20 lg:pt-[120px] min-[1800px]:px-0!">
        <div className="flex flex-col items-start gap-10 lg:max-w-[560px] lg:pt-2">
          <div className="flex flex-col items-start gap-5">
            <SectionTag
              label={VALUE_MY_DATA_EYEBROW}
              icon={
                <Image
                  src="/images/value/data-valuation.webp"
                  alt=""
                  width={18}
                  height={18}
                />
              }
            />
            <h1 className="font-serif text-[36px] leading-[1.08] tracking-[-1.3px] text-black sm:text-[44px] sm:tracking-[-1.76px] lg:text-[52px] lg:tracking-[-2.08px]">
              {VALUE_MY_DATA_HEADLINE_LEAD}{" "}
              <span className="whitespace-nowrap">{VALUE_MY_DATA_HEADLINE_TAIL}</span>
            </h1>
            <p className="max-w-[440px] text-[14.5px] leading-[1.5] tracking-[-0.2px] text-[#727272] sm:text-base sm:leading-[1.5]">
              {VALUE_MY_DATA_BODY}
            </p>
          </div>

          <div className="flex flex-col gap-8 pb-10 sm:gap-9 sm:pb-14">
            {BENEFITS.map((benefit) => (
              <BenefitRow key={benefit.title} benefit={benefit} />
            ))}
          </div>
        </div>

        <div className="relative w-full lg:flex lg:flex-col">
          <div
            aria-hidden
            className="absolute top-[55px] right-0 bottom-0 -left-[57px] hidden overflow-hidden sm:block"
            style={{ backgroundImage: "linear-gradient(180deg, #133264 0%, #147dba 160%)" }}
          >
            <div
              className="pointer-events-none absolute inset-0 mix-blend-soft-light"
              style={{
                backgroundImage: `url(${GRAIN_TEXTURE})`,
                backgroundSize: "296px 296px",
              }}
            />
          </div>
          <div
            aria-hidden
            className="absolute top-[55px] -left-[22px] hidden h-[calc(100%-55px)] w-[7px] bg-black/10 blur-[1.5px] sm:block"
          />
          <ValueMyDataForm />
        </div>
      </div>
    </section>
  );
}
