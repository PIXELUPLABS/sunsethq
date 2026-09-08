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

      <div className="relative w-full border-x border-dashed border-[#d4d4d4]">
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
            {BUYER_CARDS.map((card) => {
              const isDark = card.tone === "dark";
              return (
                <div
                  key={card.tagLabel}
                  className={`relative flex h-[430px] flex-col justify-between overflow-hidden border border-black/15 p-5 ${
                    isDark ? "bg-brand-gradient text-white" : "bg-[#dcdde3] text-black"
                  }`}
                >
                  <p className="font-serif text-[32px] leading-tight tracking-tight">
                    {card.headline}
                  </p>
                  <div
                    className={`flex items-center gap-3 ${
                      isDark ? "opacity-60" : ""
                    }`}
                  >
                    <Image
                      src={ICONS[card.icon]}
                      alt=""
                      width={18}
                      height={18}
                    />
                    <span className="text-base font-medium uppercase">
                      {card.tagLabel}
                    </span>
                  </div>

                  <div
                    className="absolute right-0 top-0 size-4"
                    style={{
                      clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                      backgroundColor: isDark ? "#499DF8" : "#000000",
                    }}
                  />

                  {isDark ? (
                    <ProcessBar className="absolute inset-x-0 bottom-0 h-[8px]" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
