import { HERO_STATS } from "../lib/constants";

export function StatsSection() {
  return (
    <section className="border border-dashed border-[#d4d4d4] px-4 sm:px-18">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {HERO_STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col items-start justify-center gap-2.5 border-dashed border-[#d4d4d4] px-6 py-8 ${
              i > 0 ? "border-l" : ""
            }`}
          >
            <p className="font-serif text-4xl tracking-tight text-[#2a2a2a] sm:text-[56px]">
              {stat.value}
            </p>
            <p className="text-base tracking-tight text-[#919191]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
