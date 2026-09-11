"use client";

import type { StatItem } from "../types";
import { useInView } from "../hooks/use-in-view";
import { AnimatedStatValue } from "./animated-stat-value";

export function StatsGrid({ stats }: { stats: StatItem[] }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });

  return (
    <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const isSecondCol = i % 2 === 1;
        const isSecondRow = i >= 2;
        const lgBorderLeft = i > 0;

        return (
          <div
            key={stat.label}
            className={`flex flex-col items-start justify-center gap-2 border-dashed border-[#d4d4d4] px-3 py-8 sm:gap-2.5 sm:px-6 ${
              isSecondCol ? "border-l" : ""
            } ${isSecondRow ? "border-t" : ""} ${
              lgBorderLeft ? "lg:border-l" : "lg:border-l-0"
            } lg:border-t-0`}
          >
            <p className="font-serif text-[39px] leading-none tracking-[-1.6px] whitespace-nowrap text-[#2a2a2a] sm:text-[64px] sm:leading-[1.1] sm:tracking-[-2.56px]">
              <AnimatedStatValue value={stat.value} start={inView} />
            </p>
            <p className="text-xs leading-[1.38] tracking-[-0.25px] text-[#919191] sm:text-base sm:leading-[1.4] sm:tracking-[-0.48px]">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
