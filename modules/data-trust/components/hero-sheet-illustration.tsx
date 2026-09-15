import Image from "next/image";
import { ProcessBar } from "@/modules/landing/components/process-bar";
import { HERO_PROCESS_DASH } from "@/modules/landing/lib/hero-assets";
import { DATA_TRUST_HERO_PLANE } from "../lib/assets";

/**
 * The perspective spreadsheet that fills the bottom of the hero, plus the
 * blueprint furniture drawn over it. The design lays this out in a 1440x444
 * band, so every length here is a percentage of that box and the whole thing
 * scales with the viewport.
 */
export function HeroSheetIllustration() {
  return (
    <div className="relative aspect-[1440/444] w-full">
      {/* Stretched edge-to-edge across the full band width (no side gutter),
          height unchanged at 95.045% (422/444) of the band - a deliberate
          departure from the Figma-exact 1297x422-at-72px-gutter placement
          above. */}
      <Image
        src={DATA_TRUST_HERO_PLANE}
        alt="A spreadsheet of operating records shown in perspective, with columns of values highlighted"
        width={2594}
        height={844}
        priority
        sizes="100vw"
        className="absolute top-0 left-0 z-10 h-[95.0450%] w-full max-w-none"
      />

      {/* dashed band the version and classification chips sit in */}
      <div className="pointer-events-none absolute inset-x-0 top-[23.8739%] hidden h-[13.7387%] border-y border-dashed border-black/8 lg:block">
        <div className="absolute inset-y-0 left-[74.4444%] border-r border-dashed border-black/8" />
      </div>

      <div className="pointer-events-none absolute top-[26.5766%] left-[82.4306%] hidden lg:block">
        <div className="border border-dashed border-[#d9d9d9] px-2 py-1.5">
          <p className="font-mono text-[8px] tracking-wide whitespace-nowrap text-[#898989] uppercase">
            RL-2026-001 {"//"} Version 1.0
          </p>
        </div>
      </div>

      <p className="pointer-events-none absolute top-[40.9910%] left-[82.3611%] hidden font-mono text-[8px] leading-tight tracking-wide whitespace-nowrap text-[#898989] uppercase lg:block">
        classification
        <br />
        proprietary data / licensing
      </p>

      <div className="pointer-events-none absolute top-[41.4414%] left-[1.3194%] hidden lg:block">
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

      <ProcessBar className="absolute inset-x-0 top-[50.4505%] z-0 h-[4.5045%]" />
    </div>
  );
}
