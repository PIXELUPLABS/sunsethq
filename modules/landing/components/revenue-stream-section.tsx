import Image from "next/image";
import { RevenueStreamShelf } from "./revenue-stream-shelf";
import { RevenueStreamShelfMobile } from "./revenue-stream-shelf-mobile";

export function RevenueStreamSection() {
  return (
    <section className="relative flex flex-col items-center overflow-hidden">
      <Image
        src="/images/grain-light-texture.svg"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative w-full border-b border-dashed border-[#d4d4d4] px-3 sm:px-18 lg:px-[72px] min-[1800px]:px-0">
        <div className="mx-auto h-16 max-w-[1560px] sm:h-20 border-x border-dashed border-[#d4d4d4]" />
      </div>

      <div className="relative flex w-full flex-col items-center gap-16 bg-[#eaebf1]">
        <Image
          src="/images/grain-light-texture.svg"
          alt=""
          fill
          className="pointer-events-none object-cover"
        />

        <div className="relative mx-auto w-full max-w-[1560px]">
          <div className="pointer-events-none absolute inset-x-3 inset-y-0 sm:inset-x-18 lg:inset-x-[72px] min-[1800px]:inset-x-0">
            <div className="h-full border-x border-dashed border-[#d4d4d4]" />
          </div>
          <div className="pointer-events-none absolute inset-x-3 top-[28px] sm:inset-x-18 lg:inset-x-[72px] min-[1800px]:inset-x-0">
            <div className="border-t border-dashed border-[#d4d4d4]" />
          </div>
          <div className="pointer-events-none absolute inset-x-3 top-0 h-full sm:inset-x-18 lg:inset-x-[152px]">
            <div className="h-full border-x border-dashed border-[#d4d4d4]" />
          </div>
          <div className="relative w-full px-3 pt-16 sm:px-18 sm:pt-20 lg:px-[72px] min-[1800px]:px-0">
            <div className="relative mb-16 flex w-full flex-col items-start gap-5 px-3 lg:flex-row lg:gap-10 lg:px-[86px]">
              <h2 className="flex-1 font-serif text-[36px] leading-none tracking-[-1.44px] text-[#181a1b] sm:text-[44px] sm:tracking-tight">
                <span className="lg:hidden">
                  You already
                  <br />
                  own your next revenue stream.
                </span>
                <span className="hidden lg:inline">
                  You already own your
                  <br />
                  next revenue stream.
                </span>
              </h2>
              <div className="w-full text-base leading-[1.4] tracking-[-0.48px] text-[#727272] lg:w-[552px] lg:shrink-0">
                <p className="mb-4">
                  Raising a round costs a piece of your company. Debt has to be
                  paid back no matter what. New customers take quarters you may
                  not have. And when none of that works, you cut the team you
                  spent years building.
                </p>
                <p>
                  But there&apos;s one more thing you own. It costs you none of
                  that, and it wasn&apos;t worth anything until now. It&apos;s
                  the record of how your company actually operates.
                  Historically, there was never anywhere to sell it. Now there
                  is.
                </p>
              </div>
            </div>

            <div className="relative w-full">
              <div className="lg:hidden">
                <RevenueStreamShelfMobile />
              </div>
              <div className="hidden lg:block">
                <RevenueStreamShelf />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-[100px] w-full">
        <Image
          src="/images/revenue-stream/revenue-bottom-panel.svg"
          alt=""
          fill
          className="pointer-events-none object-cover"
        />
      </div>
    </section>
  );
}
