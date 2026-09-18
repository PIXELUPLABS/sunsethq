import Image from "next/image";
import { ProcessBar } from "@/modules/landing/components/process-bar";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { BLOGS_HERO_BACKGROUND } from "../lib/assets";
import { BLOGS_HERO_BODY, BLOGS_HERO_HEADLINE, BLOGS_HERO_TAG } from "../lib/constants";
import { DiamondMarkIcon } from "./diamond-mark-icon";

export function BlogsHero() {
  return (
    <section className="relative h-screen overflow-hidden bg-[#fcfcfc]">
      <Image
        src="/images/grain-light-texture.svg"
        alt=""
        fill
        priority
        className="pointer-events-none object-cover"
      />

      <Image
        src={BLOGS_HERO_BACKGROUND}
        alt=""
        width={2880}
        height={1280}
        priority
        unoptimized
        className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover lg:block"
      />

      <div className="relative flex flex-col items-center px-6 pt-[108px] pb-16 text-center lg:px-[72px] lg:pt-[160px] lg:pb-[200px]">
        <div className="flex flex-col items-center gap-6 lg:w-[583px]">
          <SectionTag
            label={BLOGS_HERO_TAG}
            icon={<DiamondMarkIcon className="size-5" />}
          />

          <div className="flex flex-col items-center gap-3">
            <h1 className="font-serif text-[42px] leading-[1.035] tracking-[-1.75px] text-black mix-blend-hard-light sm:text-[56px] sm:leading-none sm:tracking-tight lg:text-[72px] lg:tracking-[-2.88px]">
              {BLOGS_HERO_HEADLINE}
            </h1>
            <p className="max-w-[349px] text-[14.5px] leading-[1.45] tracking-[-0.37px] text-[#727272] sm:text-base sm:leading-[1.4] sm:tracking-[-0.48px]">
              {BLOGS_HERO_BODY}
            </p>
          </div>
        </div>
      </div>

      <ProcessBar className="absolute inset-x-0 bottom-0 h-5" />
    </section>
  );
}
