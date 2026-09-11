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
        className="pointer-events-none absolute top-0 left-0 h-auto w-[270px] max-w-none"
      />
    </div>
  );
}
