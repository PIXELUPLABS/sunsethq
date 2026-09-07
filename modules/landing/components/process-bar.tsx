import { PROCESS_BAR_COLORS } from "../lib/constants";
import { HERO_BAR_NOISE } from "../lib/hero-assets";

const WIDTHS = ["27%", "21%", "30%", "4%", "6%", "23%"];

export function ProcessBar({ className = "h-[9px]" }: { className?: string }) {
  return (
    <div className={`flex w-full overflow-hidden ${className}`}>
      {PROCESS_BAR_COLORS.map((color, i) => (
        <div
          key={i}
          className="relative h-full"
          style={{ width: WIDTHS[i], backgroundColor: color }}
        >
          <div
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{
              backgroundImage: `url(${HERO_BAR_NOISE})`,
              backgroundSize: "720px 30.24px",
              backgroundPosition: "top left",
            }}
          />
        </div>
      ))}
    </div>
  );
}
