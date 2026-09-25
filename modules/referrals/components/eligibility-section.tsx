import Image from "next/image";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { GrainCard } from "@/components/ui/grain-card";
import {
  ELIGIBILITY_BODY_LINES,
  ELIGIBILITY_CRITERIA,
  ELIGIBILITY_EYEBROW,
  ELIGIBILITY_HEADING,
} from "../lib/constants";

export function EligibilitySection() {
  return (
    <section className="relative flex justify-center overflow-hidden bg-[#fcfcfc] px-3 sm:px-18">
      <Image
        src="/images/grain-light-texture.svg"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative mx-auto w-full max-w-[1560px] border-x border-b border-dashed border-[#d4d4d4]">
        <div className="flex flex-col items-start justify-between gap-10 px-5 py-10 sm:px-10 sm:py-20 lg:flex-row lg:gap-16">
          <div className="flex max-w-[398px] flex-col items-start gap-6">
            <SectionTag
              label={ELIGIBILITY_EYEBROW}
              textClassName="text-black/60"
              borderClassName="border-dashed border-black/25"
              paddingClassName="px-2 py-1"
              heightClassName="h-auto"
            />
            <div className="flex flex-col items-start gap-4.5">
              <p className="font-serif text-[36px] leading-none tracking-[-1.44px] text-black sm:text-[44px] sm:tracking-[-1.76px]">
                {ELIGIBILITY_HEADING}
              </p>
              <p className="text-base leading-[1.4] tracking-[-0.48px] text-[#727272]">
                {ELIGIBILITY_BODY_LINES[0]}
                <br />
                {ELIGIBILITY_BODY_LINES[1]}
              </p>
            </div>
          </div>

          <div className="flex w-full max-w-[706px] flex-col gap-5 sm:flex-row sm:pt-[47px]">
            {ELIGIBILITY_CRITERIA.map((criterion) => (
              <GrainCard
                key={criterion.title}
                title={criterion.title}
                body={criterion.body}
                tagLabel={criterion.tagLabel}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
