import Image from "next/image";
import { BUYER_CARDS } from "../lib/constants";
import { SectionTag } from "./section-tag";
import { ProcessBar } from "./process-bar";
import type { BuyerCard } from "../types";

const ICONS: Record<BuyerCard["icon"], string> = {
  entity: "/images/entity-icon.svg",
  jurisdiction: "/images/jurisdiction-icon.svg",
  identity: "/images/identity-icon.svg",
};

export function BuyersSection() {
  return (
    <section className="relative flex justify-center overflow-hidden px-3 sm:px-18">
      <Image
        src="/images/grain-light-texture.svg"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative mx-auto w-full max-w-[1560px] border-x border-t border-dashed border-[#d4d4d4]">
        <div className="flex flex-col gap-10 px-3 py-16 sm:px-10 sm:py-20">
          <div className="flex flex-col items-start gap-6">
            <SectionTag
              label="Who buys it"
              icon={
                <Image
                  src="/images/who-buys-it-icon.png"
                  alt=""
                  width={22}
                  height={22}
                />
              }
            />
            <h2 className="max-w-[522px] font-serif text-[36px] leading-none tracking-[-1.44px] text-black sm:text-[44px] sm:tracking-tight">
              You&apos;ll know exactly who ends up with it.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-5">
            {BUYER_CARDS.map((card) => (
              <div
                key={card.tagLabel}
                className="group relative flex h-[226px] flex-col justify-between overflow-hidden border border-black/15 p-5 text-black lg:h-[430px]"
              >
                {/* Wrapped 1px past the card's own edges so object-cover
                    rounding never leaves a hairline gap along any side. */}
                <div className="pointer-events-none absolute -inset-px">
                  <Image
                    src="/images/hover-card-grey-bg.svg"
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-20"
                  style={{
                    backgroundImage: "url(/images/buyer-card-hover-mesh.png)",
                    backgroundSize: "408px 306px",
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-[0.04]" />

                <p className="relative font-serif text-[26px] leading-[1.1] tracking-[-0.26px] lg:text-[32px] lg:tracking-[-0.32px]">
                  {card.headline}
                </p>
                <div className="relative mb-3 flex items-center gap-[9px] opacity-60 transition-all duration-300 lg:gap-3 lg:mb-[42px] lg:group-hover:mb-[64px]">
                  <Image
                    src={ICONS[card.icon]}
                    alt=""
                    width={18}
                    height={18}
                    className={`size-4 lg:size-[18px] ${card.icon === "entity" ? "invert" : ""}`}
                  />
                  <span className="text-sm leading-none font-medium uppercase lg:text-base">
                    {card.tagLabel}
                  </span>
                </div>

                <div
                  className="absolute -top-[2px] right-0 size-4 bg-black transition-colors duration-300 group-hover:bg-[#499DF8]"
                  style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                />

                {/* Bottom-edge texture: half-height window showing just the
                    image's top half by default, growing to full height on
                    hover - the fixed, top-anchored image behind it appears
                    to slide its bottom half into view as the window grows. */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[22px] overflow-hidden transition-[height,bottom] duration-300 lg:block lg:group-hover:h-[44px] lg:group-hover:bottom-[16px]"
                  aria-hidden
                >
                  <div
                    className="absolute inset-x-0 top-0 h-[44px] bg-top bg-no-repeat"
                    style={{
                      backgroundImage: "url(/images/hover-card-texture-lines.png)",
                      backgroundSize: "100% 44px",
                    }}
                  />
                </div>

                <ProcessBar className="absolute inset-x-0 bottom-0 h-3 transition-opacity duration-300 lg:h-[16px] lg:opacity-0 lg:group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
