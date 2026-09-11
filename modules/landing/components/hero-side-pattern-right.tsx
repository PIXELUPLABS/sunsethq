import Image from "next/image";
import { HERO_SIDE_COLLAGE_RIGHT } from "../lib/hero-assets";

export function HeroSidePatternRight() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={HERO_SIDE_COLLAGE_RIGHT}
        alt=""
        width={272}
        height={666}
        className="pointer-events-none absolute top-12 right-0 h-auto w-[272px] max-w-none"
      />
    </div>
  );
}
