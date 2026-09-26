import { GRAIN_TEXTURE_STYLE } from "../lib/assets";
import { ABOUT_EYEBROW, ABOUT_HEADING } from "../lib/constants";
import { StoryCollage } from "./story-collage";

export function AboutHero() {
  return (
    <section className="relative flex justify-center overflow-hidden px-3 sm:px-18">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={GRAIN_TEXTURE_STYLE} />

      <div className="relative mx-auto flex w-full max-w-[1560px] flex-col items-center border-x border-dashed border-[#d4d4d4]">
        <div className="flex w-full flex-col items-center justify-center px-5 pt-[120px] pb-16 sm:px-18 lg:pt-[184px] lg:pb-[100px]">
          <div className="flex w-full max-w-[870px] flex-col items-center gap-6">
            <div className="flex h-[23.2px] items-center justify-center border border-dashed border-black/25 px-2">
              <p className="-mr-[0.08em] font-mono text-[12px] leading-[1.1] font-normal tracking-[0.08em] whitespace-nowrap text-black/60 uppercase [text-box:trim-both_cap_alphabetic]">
                {ABOUT_EYEBROW}
              </p>
            </div>

            <h1 className="w-full text-center font-serif text-[42px] leading-[1.035] tracking-[-1.75px] text-black mix-blend-hard-light sm:text-[56px] sm:leading-none sm:tracking-[-2.24px] lg:text-[72px] lg:tracking-[-2.88px]">
              {ABOUT_HEADING}
            </h1>
          </div>
        </div>

        <div className="flex w-full flex-col items-center border-t border-dashed border-[#d4d4d4] px-4 pt-10 pb-16 sm:px-8 xl:px-20 xl:pt-0 xl:pb-20">
          <StoryCollage />
        </div>
      </div>
    </section>
  );
}
