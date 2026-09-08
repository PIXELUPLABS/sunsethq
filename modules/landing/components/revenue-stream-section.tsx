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

      <div className="relative w-full border-b border-dashed border-[#d4d4d4] px-4 sm:px-18 lg:px-[75px]">
        <div className="h-20 border-x border-dashed border-[#d4d4d4]" />
      </div>

      <div className="relative flex w-full flex-col items-center gap-16 pt-20 lg:gap-0">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[448px] px-4 sm:px-18 lg:px-[75px]">
          <div className="h-full border-x border-dashed border-[#d4d4d4]" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-[28px] px-4 sm:px-18">
          <div className="border-t border-dashed border-[#d4d4d4]" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[317px] px-[96px] sm:px-[152px]">
          <div className="h-full border-x border-dashed border-[#d4d4d4]" />
        </div>

        <div className="flex w-full flex-col items-start gap-10 pr-[calc(17.3611%+10.444px)] pl-[calc(6.6358%+13.876px)] sm:flex-row sm:gap-10 sm:pr-[calc(17.3611%+47px)] sm:pl-[calc(6.6358%+62.444px)] lg:h-[237px] lg:gap-[164px] lg:pl-[calc(6.6358%+65.046px)]">
          <h2 className="flex-1 font-serif text-[32px] leading-none tracking-tight text-black sm:text-[44px]">
            You already own your
            <br />
            next revenue stream.
          </h2>
          <div className="w-[552px] max-w-full shrink-0 text-base leading-relaxed tracking-tight text-[#727272] sm:ml-auto lg:absolute lg:top-20 lg:left-1/2 lg:ml-0">
            <p className="mb-4">
              Raising a round costs a piece of your company. Debt has to be paid
              back no matter what. New customers take quarters you may not
              have. And when none of that works, you cut the team you spent
              years building.
            </p>
            <p>
              But there&apos;s one more thing you own. It costs you none of
              that, and it wasn&apos;t worth anything until now. It&apos;s the
              record of how your company actually operates. Historically,
              there was never anywhere to sell it. Now there is.
            </p>
          </div>
        </div>

        <div className="w-full px-4 sm:px-18 lg:px-[75px]">
          <RevenueStreamShelf />
        </div>
      </div>

      <div className="relative h-[51px] w-full px-4 sm:px-18 lg:px-[75px]">
        <div className="relative h-full border-x border-dashed border-[#d4d4d4]" />
        <Image
          src="/images/revenue-stream/section-bottom.png"
          alt=""
          width={2292}
          height={103}
          className="absolute top-0 left-[155px] h-full w-[calc(100%-310px)] max-w-none object-cover"
        />
      </div>

      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1440 / 525" }}>
        <Image
          src="/images/revenue-stream-road.png"
          alt="Illustration of a converging highway representing data flowing into a revenue stream"
          fill
          className="object-cover object-bottom"
        />
      </div>
    </section>
  );
}
