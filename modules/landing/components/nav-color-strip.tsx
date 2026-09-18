import { NAV_STRIP_SEGMENTS } from "../lib/constants";
import { HERO_BAR_NOISE } from "../lib/hero-assets";

export function NavColorStrip() {
  return (
    <div className="flex h-2 w-full shrink-0 overflow-hidden border-b border-[#b8b8b8]">
      {NAV_STRIP_SEGMENTS.map((segment, index) => (
        <div
          key={index}
          className="relative h-full shrink-0"
          style={{ width: segment.width, backgroundColor: segment.color }}
        >
          <div
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{
              backgroundImage: `url(${HERO_BAR_NOISE})`,
              backgroundSize: "487.92px 20.49px",
              backgroundPosition: "top left",
            }}
          />
        </div>
      ))}
    </div>
  );
}
