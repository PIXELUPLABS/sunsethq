import Image from "next/image";
import { HeroClassificationText } from "./hero-classification-text";
import { HeroCodeSnippetCard } from "./hero-code-snippet-card";
import {
  HERO_CLASSIFICATION_TEXT_TALL,
  HERO_GRAIN_MULTIPLY,
  HERO_LINE_VERTICAL_LEFT,
  HERO_MASK_COLLAGE,
  HERO_MASK_LEFT_ACCENT,
  HERO_PHOTO_DOCUMENT,
  HERO_PHOTO_FORM,
  HERO_SHAPE_TAN,
} from "../lib/hero-assets";

export function HeroSidePatternLeft() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* paper grain patch */}
      <div className="absolute top-[228px] left-0 h-[236px] w-[72px] overflow-hidden">
        <div
          className="absolute top-[-295px] left-[-49px] h-[560px] w-[305px] pointer-events-none mix-blend-multiply opacity-[0.48]"
          style={{
            backgroundImage: `url(${HERO_GRAIN_MULTIPLY})`,
            backgroundSize: "516.467px 387.35px",
            backgroundPosition: "top left",
          }}
        />
      </div>

      <HeroClassificationText
        className="top-[678px] left-[-67px] h-[148px] w-[161px] text-[#bcbcbc]"
        text={HERO_CLASSIFICATION_TEXT_TALL}
      />
      <HeroClassificationText
        className="top-[535px] left-[-67px] h-[148px] w-[161px] text-[#bcbcbc]"
        text={HERO_CLASSIFICATION_TEXT_TALL}
      />

      <HeroCodeSnippetCard
        className="top-[319px] left-[78px] gap-[7.831px] border-[0.783px] border-solid border-[#cdcdcd] p-[7.831px]"
        textClassName="font-mono text-[8.404px] tracking-[0.76px] text-[#cdcdcd]"
        dotClassName="top-[37.59px] left-[1.56px] size-[4.699px] bg-[#cdcdcd]"
      />
      <HeroCodeSnippetCard
        className="top-[409px] left-[80px] gap-[7.831px] border-[0.783px] border-solid border-[#cdcdcd] p-[7.831px]"
        textClassName="font-mono text-[8.404px] tracking-[0.76px] text-[#cdcdcd]"
        dotClassName="top-[35.59px] left-[1.57px] size-[4.699px] bg-[#cdcdcd]"
      />

      {/* vertical dashed divider */}
      <div
        className="absolute top-0 right-[199px] left-[72px] flex h-[731px] items-center justify-center"
        style={{ containerType: "size" }}
      >
        <div className="h-0 w-[100cqh] flex-none rotate-90">
          <div className="relative size-full">
            <div className="absolute inset-[-1px_0_0_0]">
              <Image
                src={HERO_LINE_VERTICAL_LEFT}
                alt=""
                width={731}
                height={1}
                className="block size-full max-w-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* torn-paper collage cluster */}
      <div className="absolute top-[59px] left-[-348.14px] h-[256px] w-[491px] overflow-hidden">
        <div
          className="absolute top-[-2.59px] left-[-31.69px] h-[283px] w-[500.836px]"
          style={{
            maskImage: `url(${HERO_MASK_COLLAGE})`,
            maskPosition: "-12.017px -19.259px",
            maskSize: "554.706px 349.706px",
            maskRepeat: "no-repeat",
          }}
        >
          <Image
            src={HERO_SHAPE_TAN}
            alt=""
            width={501}
            height={283}
            className="absolute inset-0 max-w-none"
          />
        </div>

        <div
          className="absolute top-[5px] left-[182.31px] h-[362px] w-[443px] mix-blend-luminosity"
          style={{
            maskImage: `url(${HERO_MASK_COLLAGE})`,
            maskPosition: "-226.017px -26.853px",
            maskSize: "554.706px 349.706px",
            maskRepeat: "no-repeat",
          }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <Image
              src={HERO_PHOTO_DOCUMENT}
              alt=""
              width={532}
              height={732}
              className="absolute top-[-269.7px] left-[-88.6px] max-w-none"
            />
          </div>
        </div>

        <div
          className="absolute top-[68.41px] left-[41.31px] h-[191px] w-[299px] bg-[#b6ceed]"
          style={{
            maskImage: `url(${HERO_MASK_COLLAGE})`,
            maskPosition: "-85.017px -90.259px",
            maskSize: "554.706px 349.706px",
            maskRepeat: "no-repeat",
          }}
        />

        <div className="absolute top-[30.41px] left-[63.31px] flex h-[532px] w-[277px] items-center justify-center mix-blend-luminosity">
          <div className="-scale-y-100 flex-none">
            <div
              className="relative h-[532px] w-[277px]"
              style={{
                maskImage: `url(${HERO_MASK_COLLAGE})`,
                maskPosition: "-107.017px -52.259px",
                maskSize: "554.706px 349.706px",
                maskRepeat: "no-repeat",
              }}
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <Image
                  src={HERO_PHOTO_DOCUMENT}
                  alt=""
                  width={532}
                  height={732}
                  className="absolute top-[90.9px] left-[-190.4px] max-w-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-[136.41px] left-[146.31px] flex h-[282px] w-[388px] items-center justify-center">
          <div className="-scale-y-100 flex-none">
            <div
              className="relative h-[282px] w-[388px]"
              style={{
                maskImage: `url(${HERO_MASK_COLLAGE})`,
                maskPosition: "-190.017px -158.259px",
                maskSize: "554.706px 349.706px",
                maskRepeat: "no-repeat",
              }}
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <Image
                  src={HERO_PHOTO_DOCUMENT}
                  alt=""
                  width={663}
                  height={915}
                  className="absolute top-[-274.95px] left-[-11.56px] max-w-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* torn insurance-form accent */}
      <div className="contents">
        <div className="absolute top-[calc(50%+0.93px)] left-[calc(50%-33.27px)] flex h-[164.904px] w-[227.567px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <div className="flex-none rotate-180">
            <div
              className="relative h-[164.904px] w-[227.567px]"
              style={{
                maskImage: `url(${HERO_MASK_LEFT_ACCENT})`,
                maskPosition: "-41.135px -24.668px",
                maskSize: "240.381px 150.23px",
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
        <Image
          src="/images/hero/blue-img-left.svg"
          alt=""
          width={235}
          height={145}
          className="pointer-events-none absolute top-[247.93px] left-[-36.76px] mix-blend-color"
        />
      </div>

      <div className="absolute top-[404px] left-[85px] size-[9px] rounded-full bg-[#acacac]" />
    </div>
  );
}
