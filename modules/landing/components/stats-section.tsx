import Image from "next/image";
import { HERO_STATS } from "../lib/constants";
import { StatsGrid } from "./stats-grid";

export function StatsSection() {
  return (
    <section className="relative overflow-hidden border-t border-b border-dashed border-[#d4d4d4] px-3 sm:px-18 lg:px-[72px]">
      <Image
        src="/images/grain-light-texture.svg"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative mx-auto w-full max-w-[1560px] border-x border-dashed border-[#d4d4d4]">
        <StatsGrid stats={HERO_STATS} />
      </div>
    </section>
  );
}
