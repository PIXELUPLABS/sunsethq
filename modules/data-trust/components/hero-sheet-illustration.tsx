import Image from "next/image";
import { ProcessBar } from "@/modules/landing/components/process-bar";
import { HERO_PROCESS_DASH } from "@/modules/landing/lib/hero-assets";
import { DATA_TRUST_HERO_PLANE_2 } from "../lib/assets";

/**
 * The perspective spreadsheet that fills the bottom of the hero, plus the
 * blueprint furniture drawn over it. The design lays this out in a 1440x444
 * band, so every length here is a percentage of that box and the whole thing
 * scales with the viewport - lg only, since mobile swaps in its own
 * portrait illustration (780x976) below, with its own aspect ratio.
 */
export function HeroSheetIllustration() {
  return (
    <>
      <div className="relative aspect-[780/976] w-full lg:aspect-[1440/444]">
        {/* The hero illustration. `z-10`, so the overlay rows below
            (`z-20`) still read on top of it.
            Widened past the band's own width (`left-[-4%] w-[108%]`) per
            review - grown out symmetrically past even the full band-width
            match (`left-0 w-full`), which itself had already grown out
            from Figma's own exact box (node 6672:20290's 72/1440-1297/1440
            ratio, `left-[5%] w-[90.0694%]`). The overflowing left/right
            edges get clipped by the section's own `overflow-hidden`
            (`data-trust-hero.tsx`), reading as a full bleed rather than a
            hard cutoff.
            Height is stretched well past the image's own native ratio
            (which stopped right at the process-bar strip, `top-50.4505%`
            + `h-4.5045%` = 54.955% - barely touching it) to `h-[85%]`
            per review, so the sheet clearly overflows past the strip and
            reads as bleeding off the bottom of the section, matching how
            `DATA_TRUST_HERO_PLANE` (the previous asset here) used to
            extend well past it too.
            `top-[4%]` (was `top-0`) per review, nudging it down slightly
            within the band. */}
        <Image
          src={DATA_TRUST_HERO_PLANE_2}
          alt="A spreadsheet of operating records shown in perspective, with columns of values highlighted"
          width={5073}
          height={940}
          priority
          sizes="108vw"
          className="absolute top-[16%] left-[-4%] z-10 hidden h-[85%] w-[108%] max-w-none lg:block"
        />

        {/* Fades the illustration's own bottom edge into the section's
            actual background - the same `grain-light-texture.svg` tile
            over `#fcfcfc` that `data-trust-hero.tsx` paints behind
            everything - rather than a flat white blur, and only over the
            image's own box (`left-[-4%] w-[108%]`, matching the image
            exactly) rather than the full section width, so it doesn't
            wash out anything beside the image. Matches Figma's own
            gradient-masked version of this asset, which this flattened
            export doesn't bake in. `z-[15]`: above the image (`z-10`)
            but below the process-bar/chip/text overlays (`z-20`), so it
            only fades the illustration, not them. A CSS mask (not
            Tailwind's `bg-gradient-to-b`, which only fades color, not a
            background-image tile) is what lets the texture itself fade
            in via opacity rather than getting cropped by a hard edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[-4%] z-[15] hidden h-[35%] w-[108%] lg:block"
          style={{
            backgroundColor: "#fcfcfc",
            backgroundImage: "url(/images/grain-light-texture.svg)",
            backgroundSize: "cover",
            maskImage: "linear-gradient(to bottom, transparent, black)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
          }}
        />

        {/* dashed band the version and classification chips sit in.
            `z-20` on this and every overlay below - the hero-plane image
            above is `z-10`, and without an explicit z-index these were
            all painting *behind* it (their DOM order after the image
            doesn't help, since it created its own stacking context),
            silently hiding the process bar and every text/chip overlay
            entirely. */}
        <div className="pointer-events-none absolute inset-x-0 top-[23.8739%] z-20 hidden h-[13.7387%] border-y border-dashed border-black/8 lg:block">
          <div className="absolute inset-y-0 left-[74.4444%] border-r border-dashed border-black/8" />
        </div>

        <div className="pointer-events-none absolute top-[26.5766%] left-[82.4306%] z-20 hidden lg:block">
          <div className="border border-dashed border-[#d9d9d9] px-2 py-1.5">
            <p className="font-mono text-[8px] tracking-wide whitespace-nowrap text-[#898989] uppercase">
              RL-2026-001 {"//"} Version 1.0
            </p>
          </div>
        </div>

        <p className="pointer-events-none absolute top-[40.9910%] left-[82.3611%] z-20 hidden font-mono text-[8px] leading-tight tracking-wide whitespace-nowrap text-[#898989] uppercase lg:block">
          classification
          <br />
          proprietary data / licensing
        </p>

        <div className="pointer-events-none absolute top-[41.4414%] left-[1.3194%] z-20 hidden lg:block">
          <div className="flex items-center gap-1">
            <p className="font-mono text-[8px] tracking-wide text-[#898989] uppercase">
              process
            </p>
            <Image
              src={HERO_PROCESS_DASH}
              alt=""
              width={193}
              height={1}
              className="h-px w-[193px] max-w-none"
            />
          </div>
          <p className="font-mono text-[8px] tracking-wide whitespace-nowrap text-[#898989] uppercase">
            identified → structured → verified → licensed
          </p>
        </div>

        {/* Per review: rather than relying on z-order (the strip sat at
            `z-[5]`, behind the image's `z-10`, but the image has real
            transparent/soft-edge pixels around its sheet shape, so the
            strip still leaked through there) or an opaque backdrop patch
            (tried and reverted - it painted a flat, untextured rectangle
            that didn't match the grained page background), this
            `clip-path` cuts the strip's own rendering down to just the
            two slivers that sit outside the sheet's opaque silhouette -
            the middle is genuinely absent, not covered, so it shows the
            real page background beneath everything.
            The cut is angled, not a straight vertical line: the sheet is
            a perspective-drawn trapezoid, wider at the bottom than the
            top, so its left/right edges slant across the strip's own
            height instead of running straight down. A vertical cut
            (matching only one row) left a sliver of the strip visibly
            peeking out from behind the sheet at whichever end of the
            strip that row didn't match. Fixed by sampling
            `hero-plane-2.webp`'s alpha channel at *both* the strip's top
            row (top-50.4505%, 40.53% down the image's own box) and
            bottom row (top-54.955%, 45.83% down) for the first/last
            non-transparent pixel, then converting those image-relative
            x's to this band's own coordinates via the image's
            `left-[-4%] w-[108%]` placement - giving four corners
            (21.4406%/20.2058% on the left, 77.5801%/78.7723% on the
            right, top/bottom respectively) instead of two. The polygon
            traces two slanted quadrilaterals joined by a zero-height seam
            at each side's own vertical midpoint - the standard way to
            clip a single element to a disjoint shape, adapted so the
            "bridge" sits exactly on the slanted line instead of a
            vertical one. */}
        <div
          className="absolute inset-x-0 top-[50.4505%] z-[5] hidden h-[4.5045%] lg:block"
          style={{
            clipPath:
              "polygon(0% 0%, 21.4406% 0%, 20.8232% 50%, 78.1762% 50%, 77.5801% 0%, 100% 0%, 100% 100%, 78.7723% 100%, 78.1762% 50%, 20.8232% 50%, 20.2058% 100%, 0% 100%)",
          }}
        >
          <ProcessBar className="h-full w-full" />
        </div>
      </div>

      {/* Mobile-only process/version/classification row + bar (Figma node
          6672:23290) - stacked in normal flow directly below the portrait
          image instead of overlaid on top of it like the desktop band
          above. */}
      <div className="lg:hidden">
        <div className="border-t border-dashed border-[#ddd] px-6 pt-3.5 pb-[17px]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-[8px] leading-[1.4] tracking-wide text-[#858585] uppercase">
                Process
              </p>
              <p className="font-mono text-[8px] leading-[1.4] tracking-wide text-[#858585] uppercase">
                Process: identified → structured → verified → licensed
              </p>
            </div>
            <div className="shrink-0 border border-dashed border-[#d4d4d4] px-1.5 py-[7px]">
              <p className="font-mono text-[6.8px] leading-[1.35] whitespace-nowrap text-[#8d8d8d]">
                RL-2026-001
                <br />
                VERSION 1.0
              </p>
            </div>
          </div>
          <p className="mt-2 font-mono text-[7px] leading-[1.3] tracking-wide text-[#aaa] uppercase">
            Classification: Proprietary data / licensing
          </p>
        </div>

        <ProcessBar className="h-2 w-full" />
      </div>
    </>
  );
}
