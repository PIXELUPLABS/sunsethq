import dynamic from "next/dynamic";
import Image from "next/image";
import { HeroBottomFade } from "./hero-bottom-fade";
import { HeroCtaButton } from "./hero-cta-button";
import { HeroFooterBar } from "./hero-footer-bar";
import { HeroGridLines } from "./hero-grid-lines";
import { HERO_HOME_ILLUSTRATION_MOBILE } from "../lib/hero-assets";

// Desktop-only animated scene. The engine is ~37KB of imperative DOM code
// that never renders on the server, so it's split out of the initial bundle.
// The fallback reserves the scene's 1440x520 footprint so nothing shifts.
const DeidentificationPass = dynamic(
  () =>
    import("./deid-pass/deidentification-pass").then(
      (m) => m.DeidentificationPass
    ),
  { loading: () => <div aria-hidden className="aspect-[1440/520] w-full" /> }
);

export function HomeHero() {
  return (
    <section
      id="overview"
      className="relative overflow-hidden border-b border-dashed border-black/8 bg-[#fcfcfc]"
    >
      <Image
        src="/images/grain-light-texture.svg"
        alt=""
        fill
        priority
        className="pointer-events-none object-cover"
      />

      <HeroGridLines />

      <div className="relative z-10 flex flex-col items-center gap-7 px-6 pt-[108px] pb-6 text-center lg:absolute lg:inset-x-0 lg:top-[178px] lg:mx-auto lg:w-[898px] lg:gap-10 lg:px-0 lg:pt-0 lg:pb-0">
        <div className="flex max-w-[420px] flex-col items-center gap-3 lg:max-w-[840px] lg:gap-6">
          <h1 className="font-serif text-[42px] leading-[1.035] tracking-[-1.75px] text-black sm:text-[56px] sm:leading-none sm:tracking-tight lg:text-[72px] lg:tracking-[-2.88px]">
            Fund growth by licensing the data you already have.
          </h1>
          <p className="max-w-[669px] text-[14.5px] leading-[1.45] tracking-[-0.37px] text-[#727272] sm:text-base sm:leading-relaxed sm:tracking-tight lg:leading-[1.4] lg:tracking-[-0.48px]">
            Frontier AI labs need training data on how real companies run.
            You&apos;re sitting on years of it. We value your data, strip out
            every name and identifier, and get you paid.
          </p>
        </div>

        <HeroCtaButton />
      </div>

      <div className="relative mt-8 left-[-17.69%] w-[135.38%] lg:hidden">
        <Image
          src={HERO_HOME_ILLUSTRATION_MOBILE}
          alt="A spreadsheet of operating records shown in perspective, with columns of values highlighted"
          width={528}
          height={360}
          priority
          sizes="136vw"
          className="h-auto w-full"
        />

        <HeroBottomFade heightClass="h-[30%]" />
      </div>

      <div className="relative hidden lg:block lg:mt-[571px]">
        <DeidentificationPass />
        <HeroBottomFade heightClass="h-[45%]" />
      </div>

      <HeroFooterBar />
    </section>
  );
}
