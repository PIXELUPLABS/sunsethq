import type { StatItem } from "../types";

export function StatsGrid({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex min-w-0 flex-col items-start justify-center gap-2 border-dashed border-[#d4d4d4] px-3 py-8 even:border-l sm:gap-2.5 sm:px-6"
        >
          <p className="font-serif text-[39px] leading-none tracking-[-1.6px] whitespace-nowrap text-[#2a2a2a] sm:text-[64px] sm:leading-[1.1] sm:tracking-[-2.56px]">
            {stat.value}
          </p>
          <p className="text-xs leading-[1.38] tracking-[-0.25px] text-[#919191] sm:text-base sm:leading-[1.4] sm:tracking-[-0.48px]">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
