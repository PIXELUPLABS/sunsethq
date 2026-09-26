import Image from "next/image";
import { STORY_BLUE_PANEL, STORY_MONEY_STRIPS } from "../lib/assets";
import { FounderLetterCard } from "./founder-letter-card";

/**
 * The founder letter laid over a blue textured panel (bottom-left) and the
 * falling "money strip" artwork (top-right). The collage is a fixed 1074x914
 * composition, so below xl it collapses to just the letter.
 */
export function StoryCollage() {
  return (
    <div className="relative w-full max-w-[636px] xl:h-[914px] xl:w-[1074px] xl:max-w-none xl:shrink-0 xl:border-x xl:border-dashed xl:border-[#d4d4d4]">
      <div className="absolute top-0 -bottom-px -left-px hidden w-[1074px] items-center xl:flex">
        <div className="flex h-full w-[527px] shrink-0 flex-col items-center justify-end overflow-hidden border-r border-dashed border-[#d4d4d4]">
          <Image
            src={STORY_BLUE_PANEL}
            alt=""
            width={526}
            height={650}
            sizes="526px"
            className="h-[650px] w-full shrink-0 object-cover"
          />
        </div>
        <div className="flex h-full w-[546px] shrink-0 flex-col items-start overflow-hidden">
          <Image
            src={STORY_MONEY_STRIPS}
            alt=""
            width={546}
            height={650}
            sizes="546px"
            className="h-[650px] w-full shrink-0"
          />
        </div>
      </div>

      <div className="relative xl:absolute xl:top-[124px] xl:left-[219px] xl:w-[636px]">
        <FounderLetterCard />
      </div>
    </div>
  );
}
