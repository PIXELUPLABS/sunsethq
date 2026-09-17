import Image from "next/image";
import { HeroCtaButton } from "./hero-cta-button";
import { HeroFooterBar } from "./hero-footer-bar";
import { HeroGridLines } from "./hero-grid-lines";
import { HERO_HOME_ILLUSTRATION, HERO_HOME_ILLUSTRATION_MOBILE } from "../lib/hero-assets";

/**
 * The static home hero: same copy/CTA/footer as the scroll-animated
 * `HeroSection` (now used on the data-and-trust page), but laid out as a
 * fixed composition with a single illustration instead of the scroll-driven
 * collage - matching the Figma frame 1:1 at the 1440px reference width.
 *
 * The text column is pinned to `top-[178px]` exactly as Figma has it
 * (absolutely positioned, not flowed), so the illustration below - a plain
 * flow child - can be pushed down by its own exact `top` value
 * (`mt-[571px]`, i.e. 570.96px) without needing to know the text column's
 * rendered height.
 *
 * The column itself is `w-[898px]`, not Figma's own 786px: this project's
 * web font renders the headline slightly wider than Figma's, so 786px wraps
 * "the data you already have." onto its own third line instead of Figma's
 * two. 898px is the width `HeroSection` already uses for this exact
 * headline/copy (confirmed to wrap the same two-line way there) and matches
 * the footer bar's own 898px-wide centre column and `HeroGridLines`' inner
 * rules, so it keeps the whole hero on one consistent grid.
 */
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

      {/* pt on mobile clears the 64px fixed header plus the design's own 44px. */}
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

      {/* Dedicated portrait crop for mobile/tablet (Figma node 6672:23318),
          not the landscape desktop asset scaled down - that asset is a
          5.4:1 wide strip that reads as a thin, cramped sliver at phone
          widths. Matches how the data-trust hero this shell was adapted
          from always carried its own separate mobile plane. Unclipped
          (528px wide against the 390px frame, left -69px), so it bleeds
          past both edges - `left-[-17.69%] w-[135.38%]` reproduces that
          box as a percentage of the section's own width. */}
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

        {/* Fades the illustration's own bottom edge into the section's
            actual background - the same grain-texture-over-#fcfcfc this
            section paints behind everything - rather than a hard cutoff. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%]"
          style={{
            backgroundColor: "#fcfcfc",
            backgroundImage: "url(/images/grain-light-texture.svg)",
            backgroundSize: "cover",
            maskImage: "linear-gradient(to bottom, transparent, black)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
          }}
        />
      </div>

      {/* Pushed down by its own exact Figma `top` (570.96px, here mt-[571px])
          rather than a margin tuned against the text column above - the
          text column is `lg:absolute` at `lg:top-[178px]` and out of flow,
          so this is the first flow child and lands exactly on that offset
          regardless of how tall the text column renders. `overflow-hidden`
          on the section (above) keeps this margin from collapsing with it.
          The asset itself is unclipped (1690.971px wide at the 1440px
          frame), so it bleeds past both edges on lg - `left-[-10.93%]
          w-[117.43%]` reproduces that exact box as a percentage of the
          section's own width. */}
      <div className="relative hidden lg:block lg:mt-[571px] lg:left-[-10.93%] lg:w-[117.43%]">
        <Image
          src={HERO_HOME_ILLUSTRATION}
          alt="A spreadsheet of operating records shown in perspective, with columns of values highlighted"
          width={1691}
          height={313}
          priority
          sizes="117vw"
          className="h-auto w-full"
        />

        {/* Fades the illustration's own bottom edge into the section's
            actual background - the same grain-texture-over-#fcfcfc this
            section paints behind everything - rather than a hard cutoff. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%]"
          style={{
            backgroundColor: "#fcfcfc",
            backgroundImage: "url(/images/grain-light-texture.svg)",
            backgroundSize: "cover",
            maskImage: "linear-gradient(to bottom, transparent, black)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
          }}
        />
      </div>

      <HeroFooterBar />
    </section>
  );
}
