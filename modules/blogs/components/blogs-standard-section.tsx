import Image from "next/image";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { SOFT_LIGHT_TEXTURE, SOFT_LIGHT_TEXTURE_SIZE } from "@/modules/data-trust/lib/assets";
import { BLOGS_STANDARD_CARD, BLOGS_STANDARD_ICON } from "../lib/assets";
import {
  BLOGS_STANDARD_BODY,
  BLOGS_STANDARD_CTA,
  BLOGS_STANDARD_HEADLINE,
  BLOGS_STANDARD_TAG,
} from "../lib/constants";

/** Figma's own gradient (node 6672:16863) - navy at the top fading into
 *  blue, the reverse direction of the de-identification panel's
 *  `PANEL_GRADIENT` (blue-to-navy top-to-bottom). */
const SECTION_GRADIENT = "linear-gradient(180deg, #133264 26.96%, #147dba 143.8%)";

/**
 * "Featured" tease for the de-identification standard write-up, matching
 * Figma node 6672:16863 pixel-for-pixel at `lg:`. No Figma spec exists for
 * mobile, so it falls back to this site's own established mobile/desktop
 * pairings for the same type sizes used elsewhere (the de-identification
 * panel's own `h2`, this page's own hero paragraph, and the site's shared
 * "Value my data" outline-button style).
 */
export function BlogsStandardSection() {
  return (
    <section
      className="relative flex flex-col items-center gap-10 overflow-hidden px-3 pt-20 pb-20 sm:px-18 lg:gap-16 lg:px-18 lg:pt-28 lg:pb-[130px]"
      style={{ background: SECTION_GRADIENT }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: `url("${SOFT_LIGHT_TEXTURE}")`,
          backgroundSize: SOFT_LIGHT_TEXTURE_SIZE,
        }}
      />

      {/* Same grain-texture treatment as the Journal index section below
          (blogs-journal-index.tsx) and the careers page's open-roles
          section it was copied from - laid over this whole section (not
          just the area right behind the stripes) so the blue background
          and the white one past the stripes read as one continuous
          textured surface instead of two different fills meeting at a
          seam. Sits behind `BottomStripes` (DOM order, both `absolute`) so
          the stripes themselves stay crisp on top of it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/images/grain-light-texture.svg')] bg-top bg-repeat bg-[length:100%_auto] mix-blend-multiply"
      />

      <div className="relative flex w-full max-w-[1296px] flex-col gap-8 bg-black/10 p-5 sm:p-8 lg:flex-row lg:items-start lg:p-10">
        {/* The whole chart card, flattened - see `BLOGS_STANDARD_CARD`'s
            own comment for why. Rendered at its real 664x438 native export
            size at `lg:` and scaled fluidly below that. */}
        <Image
          src={BLOGS_STANDARD_CARD}
          alt="A benchmark chart comparing identifier coverage: Nvidia at 30% versus Replay at 86%"
          width={664}
          height={438}
          className="h-auto w-full lg:h-[438px] lg:w-[664px] lg:shrink-0"
        />

        <div className="relative flex flex-1 flex-col items-start gap-8 lg:h-[438px] lg:justify-between lg:gap-0">
          <div className="flex flex-col items-start gap-6 lg:gap-4">
            <div className="flex flex-col items-start gap-6 lg:h-[144px] lg:gap-6">
              <SectionTag
                label={BLOGS_STANDARD_TAG}
                tone="dark"
                borderClassName="border-[rgba(255,255,255,0.4)]"
                icon={<Image src={BLOGS_STANDARD_ICON} alt="" width={18} height={18} />}
              />
              <h2 className="font-serif text-[36px] leading-none tracking-[-1.44px] text-[#f1f1f1] lg:w-[436px] lg:text-[44px] lg:tracking-[-1.76px]">
                {BLOGS_STANDARD_HEADLINE}
              </h2>
            </div>
            <p className="text-[14.5px] leading-[1.45] tracking-[-0.37px] text-white/60 sm:text-base sm:leading-[1.4] sm:tracking-[-0.48px] lg:w-[431px]">
              {BLOGS_STANDARD_BODY}
            </p>
          </div>

          <div className="flex items-center justify-center border border-[rgba(20,21,24,0.1)] bg-[#eaebf1] px-5 py-3">
            <p className="font-serif text-xs leading-[0.8] tracking-wide text-[#010101] uppercase">
              {BLOGS_STANDARD_CTA}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
