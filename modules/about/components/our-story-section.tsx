import Image from "next/image";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { FOUNDER_SIGNATURE } from "../lib/assets";
import {
  FOUNDER_NAME,
  FOUNDER_TITLE,
  LETTER_CARDS,
  OUR_STORY_EYEBROW,
  OUR_STORY_TITLE,
} from "../lib/constants";
import { LetterCard } from "./letter-card";

export function OurStorySection() {
  return (
    <section className="relative flex justify-center overflow-hidden bg-[#fcfcfc] px-3 sm:px-18">
      <Image
        src="/images/grain-light-texture.svg"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative mx-auto w-full max-w-[1560px] border-x border-dashed border-[#d4d4d4]">
        <div className="flex flex-col gap-20 px-5 py-20">
          <div className="flex flex-col items-start gap-6">
            <SectionTag
              label={OUR_STORY_EYEBROW}
              textClassName="text-black/60"
              borderClassName="border-dashed border-black/25"
              paddingClassName="px-2 py-1"
              heightClassName="h-auto"
            />
            <h2 className="font-serif text-[36px] leading-none tracking-[-1.44px] text-black sm:text-[44px] sm:tracking-[-1.76px]">
              {OUR_STORY_TITLE}
            </h2>
          </div>

          <div className="flex flex-col items-end gap-10">
            <div className="flex w-full flex-col gap-5 sm:flex-row">
              {LETTER_CARDS.map((card) => (
                <LetterCard key={card.number} card={card} />
              ))}
            </div>

            <div className="flex flex-col items-end">
              <div className="relative h-[78px] w-[225px] opacity-80">
                <Image
                  src={FOUNDER_SIGNATURE}
                  alt={`${FOUNDER_NAME}'s signature`}
                  fill
                  className="object-contain object-bottom"
                />
              </div>
              <p className="-mt-[10px] font-mono text-xs tracking-wide text-black/60 uppercase">
                {FOUNDER_TITLE}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
