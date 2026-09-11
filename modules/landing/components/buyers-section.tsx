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
                  src="/images/the-process-icon.svg"
                  alt=""
                  width={18}
                  height={18}
                />
              }
            />
            <h2 className="max-w-[522px] font-serif text-[36px] leading-none tracking-[-1.44px] text-black sm:text-[44px] sm:tracking-tight">
              You&apos;ll know exactly who ends up with it.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
            {BUYER_CARDS.map((card) => (
              <div
                key={card.tagLabel}
                className="group relative flex h-[226px] flex-col justify-between overflow-hidden border border-black/15 p-5 text-black md:h-[430px] md:border-x-0 md:border-y"
              >
                <Image
                  src="/images/hover-card-grey-bg.svg"
                  alt=""
                  fill
                  className="pointer-events-none object-cover"
                />
                <Image
                  src="/images/hover-card-blue-bg.svg"
                  alt=""
                  fill
                  className="pointer-events-none object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                <p className="relative font-serif text-[26px] leading-[1.1] tracking-[-0.26px] transition-colors duration-300 group-hover:text-[#f4f4f4] md:text-[32px] md:tracking-[-0.32px]">
                  {card.headline}
                </p>
                <div className="relative mb-0 flex items-center gap-[9px] transition-all duration-300 group-hover:text-white group-hover:opacity-60 md:gap-3 md:group-hover:mb-5">
                  <Image
                    src={ICONS[card.icon]}
                    alt=""
                    width={18}
                    height={18}
                    className={`size-4 md:size-[18px] ${
                      card.icon === "entity"
                        ? "invert transition-[filter] duration-300 group-hover:invert-0"
                        : "transition-[filter] duration-300 group-hover:invert"
                    }`}
                  />
                  <span className="text-sm leading-none font-medium uppercase md:text-base">
                    {card.tagLabel}
                  </span>
                </div>

                <div
                  className="absolute -top-[2px] right-[0.5px] size-4 bg-black transition-colors duration-300 group-hover:bg-[#499DF8]"
                  style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                />

                <ProcessBar className="absolute inset-x-0 bottom-0 h-1.5 transition-opacity duration-300 md:h-[8px] md:opacity-0 md:group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
