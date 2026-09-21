import Image from "next/image";
import { BUYER_CARDS } from "../lib/constants";
import { SectionTag } from "./section-tag";

export function BuyersSection() {
  return (
    <section className="relative flex justify-center overflow-hidden px-3 sm:px-18">
      <Image
        src="/images/grain-light-texture-optimized.svg"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative mx-auto w-full max-w-[1560px] border-x border-t border-dashed border-[#d4d4d4]">
        <div className="flex flex-col gap-16 px-3 py-12 sm:px-10 sm:py-16">
          <div className="flex flex-col items-start gap-4">
            <SectionTag
              label="Who buys it"
              textClassName="text-black/60"
              borderClassName="border-dashed border-black/25"
              paddingClassName="px-2 py-1"
              heightClassName="h-auto"
            />
            <h2 className="max-w-[522px] font-serif text-[36px] leading-none tracking-[-1.44px] text-black sm:text-[44px] sm:tracking-tight">
              Where your data gets sold
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 min-[1200px]:grid-cols-2 min-[1200px]:gap-5">
            {BUYER_CARDS.map((card) => (
              <div
                key={card.id}
                className="relative flex min-h-[226px] flex-col justify-between gap-8 overflow-hidden border border-black/15 px-8 pt-8 pb-6 text-black min-[1200px]:min-h-[300px] min-[1200px]:pb-5"
              >
                {/* Wrapped 1px past the card's own edges so object-cover
                    rounding never leaves a hairline gap along any side. */}
                <div className="pointer-events-none absolute -inset-px">
                  <Image
                    src="/images/hover-card-grey-bg-optimized.svg"
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>

                <p className="relative font-serif text-[24px] leading-[1.1] tracking-[-0.24px] min-[1200px]:text-[32px] min-[1200px]:tracking-[-0.32px]">
                  {card.headline}
                </p>

                <div
                  className="absolute -top-[2px] right-0 size-3.5 bg-black min-[1200px]:size-4"
                  style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                />

                {/* Bottom-edge texture: half-height window showing just the
                    image's top half by default, growing to full height on
                    hover - the fixed, top-anchored image behind it appears
                    to slide its bottom half into view as the window grows.
                    Phones get the same strip at the design's 18px. */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[18px] overflow-hidden min-[1200px]:h-[22px]"
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
