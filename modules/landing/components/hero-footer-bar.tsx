import Image from "next/image";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ProcessBar } from "./process-bar";
import { HERO_PROCESS_DASH } from "../lib/hero-assets";

export function HeroFooterBar() {
  return (
    <div className="relative flex flex-col">
      <div className="grid w-full grid-cols-[1fr_auto] items-center gap-2 border-t border-dashed border-[#d4d4d4] px-6 pt-3.5 pb-[17px] lg:flex lg:items-stretch lg:gap-0 lg:px-0 lg:py-0">
        <div className="lg:flex lg:w-[calc((100%-898px)/2)] lg:flex-none lg:shrink-0 lg:flex-col lg:justify-center lg:border-r lg:border-dashed lg:border-[#d4d4d4] lg:px-4.5 lg:py-4">
          <div className="flex items-center gap-1">
            <p className="font-mono text-[8px] uppercase tracking-wide text-[#898989]">
              process
            </p>
            <Image
              src={HERO_PROCESS_DASH}
              alt=""
              width={193}
              height={1}
              className="hidden h-px w-[193px] max-w-none lg:block"
            />
          </div>
          <p className="flex flex-wrap items-center gap-1 font-mono text-[8px] uppercase tracking-wide text-[#898989]">
            <span className="lg:hidden">process: </span>
            <span>identified</span>
            <ArrowRightIcon className="size-2.5 shrink-0" />
            <span>structured</span>
            <ArrowRightIcon className="size-2.5 shrink-0" />
            <span>verified</span>
            <ArrowRightIcon className="size-2.5 shrink-0" />
            <span>licensed</span>
          </p>
        </div>
        <div className="flex items-center lg:w-[181px] lg:shrink-0 lg:border-r lg:border-dashed lg:border-[#d4d4d4] lg:px-4.5 lg:py-4">
          <div className="border border-dashed border-[#d4d4d4] px-1.5 py-1.5 lg:px-2">
            <p className="font-mono text-[6.8px] uppercase tracking-wide text-[#8d8d8d] lg:text-[8px] lg:text-[#898989]">
              RL-2026-001
              <br className="lg:hidden" />
              <span className="hidden lg:inline">{" // "}</span>
              Version 1.0
            </p>
          </div>
        </div>
        <div className="col-span-2 flex items-center lg:w-[258px] lg:shrink-0 lg:border-r lg:border-dashed lg:border-[#d4d4d4] lg:px-4.5 lg:py-4">
          <p className="font-mono text-[7px] uppercase tracking-wide text-[#aaa] lg:text-[8px] lg:leading-tight lg:text-[#898989]">
            classification<span className="lg:hidden">: </span>
            <br className="hidden lg:block" />
            proprietary data / licensing
          </p>
        </div>
      </div>
      <ProcessBar className="h-2 lg:h-5" />
    </div>
  );
}
