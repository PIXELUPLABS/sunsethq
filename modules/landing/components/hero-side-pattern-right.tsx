import Image from "next/image";
import { HERO_RIGHT_COLLAGE_IMAGES } from "../lib/hero-assets";

export function HeroSidePatternRight() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute top-12 right-0 h-[666px] w-[272px] min-[1800px]:origin-top min-[1800px]:scale-y-[1.15]">
        {HERO_RIGHT_COLLAGE_IMAGES.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="absolute"
            style={{ left: image.x, top: image.y, width: image.w, height: image.h }}
          >
            <Image src={image.src} alt="" fill className="object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
