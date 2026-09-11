import Image from "next/image";
import { HERO_SIDE_COLLAGE_LEFT } from "../lib/hero-assets";

export function HeroSidePatternLeft() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={HERO_SIDE_COLLAGE_LEFT}
        alt=""
        width={270}
        height={666}
        className="pointer-events-none absolute top-12 left-0 h-auto w-[270px] max-w-none min-[1800px]:origin-top min-[1800px]:scale-y-[1.15]"
      />
      <div className="pointer-events-none absolute top-0 left-[270px] h-full border-r border-dashed border-black/8" />
    </div>
  );
}
