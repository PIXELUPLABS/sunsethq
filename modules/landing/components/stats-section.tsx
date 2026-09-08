import Image from "next/image";
import { HERO_STATS } from "../lib/constants";

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
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {HERO_STATS.map((stat, i) => {
            const isSecondCol = i % 2 === 1;
            const isSecondRow = i >= 2;
            const lgBorderLeft = i > 0;

            return (
              <div
                key={stat.label}
                className={`flex flex-col items-start justify-center gap-2.5 border-dashed border-[#d4d4d4] px-6 py-8 ${
                  isSecondCol ? "border-l" : ""
                } ${isSecondRow ? "border-t" : ""} ${
                  lgBorderLeft ? "lg:border-l" : "lg:border-l-0"
                } lg:border-t-0`}
              >
                <p className="font-serif text-4xl leading-[1.1] tracking-[-2.56px] text-[#2a2a2a] sm:text-[64px]">
                  {stat.value}
                </p>
                <p className="text-base leading-[1.4] tracking-[-0.48px] text-[#919191]">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
