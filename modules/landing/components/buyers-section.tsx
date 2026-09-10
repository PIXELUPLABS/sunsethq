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
    <section className="relative flex justify-center overflow-hidden px-6 sm:px-18">
      <Image
        src="/images/texture-grain-white.png"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative w-full border-x border-t border-dashed border-[#d4d4d4]">
        <div className="flex flex-col gap-10 px-5 py-20 sm:px-10">
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
            <h2 className="max-w-[522px] font-serif text-[32px] leading-none tracking-tight text-black sm:text-[44px]">
              You&apos;ll know exactly who ends up with it.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {BUYER_CARDS.map((card) => (
              <div
                key={card.tagLabel}
                className="group relative flex h-[430px] flex-col justify-between overflow-hidden border-y border-black/15 p-5 text-black"
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

                <p className="relative font-serif text-[32px] leading-tight tracking-tight transition-colors duration-300 group-hover:text-white">
                  {card.headline}
                </p>
                <div className="relative mb-0 flex items-center gap-3 transition-all duration-300 group-hover:mb-5 group-hover:text-white group-hover:opacity-60">
                  <Image
                    src={ICONS[card.icon]}
                    alt=""
                    width={18}
                    height={18}
                    className={
                      card.icon === "entity"
                        ? "invert transition-[filter] duration-300 group-hover:invert-0"
                        : "transition-[filter] duration-300 group-hover:invert"
                    }
                  />
                  <span className="text-base font-medium uppercase">
                    {card.tagLabel}
                  </span>
                </div>

                <div
                  className="absolute -top-[2px] right-[0.5px] size-4 bg-black transition-colors duration-300 group-hover:bg-[#499DF8]"
                  style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                />

                <ProcessBar className="absolute inset-x-0 bottom-0 h-[8px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
