import Image from "next/image";
import { HERO_STATS } from "../lib/constants";
import { StatsGrid } from "./stats-grid";

export function StatsSection() {
  return (
    <section className="relative overflow-hidden border-t border-b border-dashed border-[#d4d4d4] px-4 sm:px-18 lg:px-[75px]">
      <Image
        src="/images/texture-grain-white.png"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative border-x border-dashed border-[#d4d4d4]">
        <StatsGrid stats={HERO_STATS} />
      </div>
    </section>
  );
}
