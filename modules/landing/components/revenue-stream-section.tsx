import Image from "next/image";
import { RevenueStreamShelf } from "./revenue-stream-shelf";

export function RevenueStreamSection() {
  return (
    <section className="relative flex flex-col items-center overflow-hidden">
      <Image
        src="/images/texture-grain-white.png"
        alt=""
        fill
        className="pointer-events-none object-cover"
      />

      <div className="relative w-full border-b border-dashed border-[#d4d4d4] px-4 sm:px-18 lg:px-[72px]">
        <div className="mx-auto h-20 max-w-[1560px] border-x border-dashed border-[#d4d4d4]" />
      </div>

      <div className="relative flex w-full flex-col items-center gap-16 bg-[#eaebf1] pt-20">
        <Image
          src="/images/texture-grain-white.png"
          alt=""
          fill
          className="pointer-events-none object-cover"
        />

        <div className="relative mx-auto w-full max-w-[1560px]">
          <div className="pointer-events-none absolute inset-x-4 inset-y-0 sm:inset-x-18 lg:inset-x-[72px]">
            <div className="h-full border-x border-dashed border-[#d4d4d4]" />
          </div>
          <div className="pointer-events-none absolute inset-x-4 top-[28px] sm:inset-x-18 lg:inset-x-[72px]">
            <div className="border-t border-dashed border-[#d4d4d4]" />
          </div>
          <div className="pointer-events-none absolute inset-x-4 top-0 h-[372px] sm:inset-x-18 lg:inset-x-[152px]">
            <div className="h-full border-x border-dashed border-[#d4d4d4]" />
          </div>
          <div className="relative w-full px-4 sm:px-18 lg:px-[72px]">
            <div className="relative mb-16 flex w-full flex-col items-start gap-10 sm:flex-row sm:gap-10 lg:gap-10 lg:px-[86px]">
              <h2 className="flex-1 font-serif text-[32px] leading-none tracking-tight text-black sm:text-[44px]">
                You already own your
                <br />
                next revenue stream.
              </h2>
              <div className="w-[552px] max-w-full shrink-0 text-base leading-[1.4] tracking-[-0.48px] text-[#727272]">
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
              <RevenueStreamShelf />
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
