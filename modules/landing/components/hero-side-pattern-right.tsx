import Image from "next/image";
import { HeroClassificationText } from "./hero-classification-text";
import { HeroCodeSnippetCard } from "./hero-code-snippet-card";
import {
  HERO_CLASSIFICATION_TEXT_RIGHT_LONG,
  HERO_CLASSIFICATION_TEXT_RIGHT_SHORT,
  HERO_FORM_3,
  HERO_GRAIN_MULTIPLY,
  HERO_LINE_VERTICAL_RIGHT,
  HERO_MASK_RIGHT_ACCENT_LARGE,
  HERO_MASK_RIGHT_ACCENT_SMALL,
  HERO_PHOTO_DOCUMENT,
  HERO_PHOTO_FORM,
} from "../lib/hero-assets";

export function HeroSidePatternRight() {
  return (
    <div className="relative h-full w-full">
      <div className="contents">
        {/* paper grain patch */}
        <div className="absolute top-[534px] left-[-0.55px] h-[194px] w-[207px] overflow-hidden">
          <div
            className="absolute top-[-197px] left-[-49px] h-[453px] w-[305px] pointer-events-none mix-blend-multiply opacity-[0.48]"
            style={{
              backgroundImage: `url(${HERO_GRAIN_MULTIPLY})`,
              backgroundSize: "516.467px 387.35px",
              backgroundPosition: "top left",
            }}
          />
        </div>

        <HeroClassificationText
          className="top-[192.5px] left-[212.45px] h-[215px] w-[161px] text-[#bcbcbc]"
          text={HERO_CLASSIFICATION_TEXT_RIGHT_LONG}
        />
        <HeroClassificationText
          className="top-[386.5px] left-[228.45px] h-[215px] w-[161px] text-[#bcbcbc]"
          text={HERO_CLASSIFICATION_TEXT_RIGHT_SHORT}
        />

        <HeroCodeSnippetCard
          className="top-[707px] left-[-111px] gap-[7.241px] border-[0.724px] border-solid border-[#bab8b8] p-[7.241px]"
          textClassName="font-mono text-[7.771px] tracking-[0.7px] text-[#bab8b8]"
          dotClassName="top-[34.76px] left-[1.45px] size-[4.345px] bg-[#9a9a9a]"
        />
        <HeroCodeSnippetCard
          className="top-[483px] left-[-27.55px] gap-[10px] border border-solid border-[#cdcdcd] p-[10px]"
          textClassName="font-mono text-[10.731px] tracking-[0.97px] text-[#cdcdcd]"
          dotClassName="top-[48px] left-[2px] size-[6px] bg-[#cdcdcd]"
        />

        {/* vertical dashed divider */}
        <div
          className="absolute top-0 right-[73px] left-[198px] flex h-[731px] items-center justify-center"
          style={{ containerType: "size" }}
        >
          <div className="h-0 w-[100cqh] flex-none rotate-90">
            <div className="relative size-full">
              <div className="absolute inset-[-1px_0_0_0]">
                <Image
                  src={HERO_LINE_VERTICAL_RIGHT}
                  alt=""
                  width={731}
                  height={1}
                  className="block size-full max-w-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* large torn-form accent */}
        <div className="contents">
          <div className="absolute top-[calc(50%+221.36px)] left-[calc(50%+83.13px)] flex h-[301.715px] w-[416.367px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <div className="-scale-y-100 flex-none">
              <div
                className="relative h-[301.715px] w-[416.367px]"
                style={{
                  maskImage: `url(${HERO_MASK_RIGHT_ACCENT_LARGE})`,
                  maskPosition: "-22px -8.999px",
                  maskSize: "422.424px 284.5px",
                  maskRepeat: "no-repeat",
                }}
              >
                <Image
                  src={HERO_PHOTO_FORM}
                  alt=""
                  fill
                  className="pointer-events-none object-fill"
                />
              </div>
            </div>
          </div>
          <div
            className="absolute top-[405px] left-[46.45px] h-[236px] w-[259px] bg-[#d9eae8] mix-blend-color"
            style={{
              maskImage: `url(${HERO_MASK_RIGHT_ACCENT_LARGE})`,
              maskPosition: "-58px 22.001px",
              maskSize: "422.424px 284.5px",
              maskRepeat: "no-repeat",
            }}
          />
        </div>

        {/* small torn-document accent */}
        <div className="contents">
          <div className="absolute top-[509.81px] left-[20.31px] flex h-[204.903px] w-[282.766px] items-center justify-center">
            <div className="-scale-y-100 flex-none">
              <div
                className="relative h-[204.903px] w-[282.766px]"
                style={{
                  maskImage: `url(${HERO_MASK_RIGHT_ACCENT_SMALL})`,
                  maskPosition: "9.219px 28.269px",
                  maskSize: "259.333px 150.56px",
                  maskRepeat: "no-repeat",
                }}
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <Image
                    src={HERO_PHOTO_DOCUMENT}
                    alt=""
                    width={483}
                    height={665}
                    className="absolute top-[-199.78px] left-[-8.43px] max-w-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute top-[480px] left-[9.45px] h-[267px] w-[283px] bg-[#e3efff] mix-blend-color"
            style={{
              maskImage: `url(${HERO_MASK_RIGHT_ACCENT_SMALL})`,
              maskPosition: "20.084px 58.083px",
              maskSize: "259.333px 150.56px",
              maskRepeat: "no-repeat",
            }}
          />
        </div>

        <div className="absolute top-[628.54px] left-[-79.55px] flex h-[164.459px] w-[395.441px] items-center justify-center">
          <div className="flex-none rotate-0">
            <div className="relative h-[164.459px] w-[395.441px]">
              <Image
                src={HERO_FORM_3}
                alt=""
                fill
                className="pointer-events-none object-fill"
              />
            </div>
          </div>
        </div>

        <div className="absolute top-[619px] left-[-16.55px] size-[9px] rounded-full bg-[#acacac]" />
      </div>
    </div>
  );
}
