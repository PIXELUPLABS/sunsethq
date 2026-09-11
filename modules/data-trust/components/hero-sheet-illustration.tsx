import Image from "next/image";
import { ProcessBar } from "@/modules/landing/components/process-bar";
import { HERO_PROCESS_DASH } from "@/modules/landing/lib/hero-assets";
import {
  DATA_TRUST_HERO_SHEET,
  DATA_TRUST_HERO_TOPSHEET,
} from "../lib/assets";

/**
 * The perspective spreadsheet that fills the bottom of the hero, plus the
 * blueprint furniture drawn over it. The design lays this out in a 1440x444
 * band, so every length here is a percentage of that box and the whole thing
 * scales with the viewport.
 */
export function HeroSheetIllustration() {
  return (
    <div className="relative aspect-[1440/444] w-full">
      {/* The design clips the sheet twice: to a 1690x313 box, and again to the
          1297x422 rect its gradient mask covers. What survives is the overlap -
          the content column, from 103px down the band - with the fade landing
          at 52.5% and 98.2% of that. */}
      <div
        className="absolute top-[23.1892%] left-[5%] h-[70.4970%] w-[90.0694%] overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, #000 52.46%, transparent 98.24%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 52.46%, transparent 98.24%)",
        }}
      >
        <Image
          src={DATA_TRUST_HERO_SHEET}
          alt=""
          width={2767}
          height={641}
          priority
          className="absolute top-0 left-[-17.7132%] h-[125.2013%] w-[130.4279%] max-w-none"
        />
      </div>

      <Image
        src={DATA_TRUST_HERO_TOPSHEET}
        alt="A spreadsheet of operating records shown in perspective, with columns of values highlighted"
        width={2254}
        height={418}
        className="absolute top-[34.3468%] left-[9.0972%] h-[47.0721%] w-[78.2639%] max-w-none"
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

      <ProcessBar className="absolute inset-x-0 top-[50.4505%] h-[4.5045%]" />
    </div>
  );
}
