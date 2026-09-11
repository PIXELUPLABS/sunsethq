import Image from "next/image";
import { HERO_LEFT_COLLAGE_IMAGES } from "../lib/hero-assets";

export function HeroSidePatternLeft() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute top-12 left-0 h-[666px] w-[270px] min-[1800px]:origin-top min-[1800px]:scale-y-[1.15]">
        {HERO_LEFT_COLLAGE_IMAGES.map((image) => (
          <div
            key={image.src}
            className="absolute"
            style={{ left: image.x, top: image.y, width: image.w, height: image.h }}
          >
            <Image src={image.src} alt="" fill className="object-contain" />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute top-0 left-[270px] h-full border-r border-dashed border-black/8" />
    </div>
  );
}
