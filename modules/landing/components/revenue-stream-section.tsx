import Image from "next/image";
import { ProcessBar } from "./process-bar";

export function RevenueStreamSection() {
  return (
    <section className="relative flex flex-col items-center overflow-hidden bg-[#eaebf1]">
      <div className="w-full border-b border-dashed border-[#d4d4d4] px-4 sm:px-18">
        <div className="h-20 border-x border-dashed border-[#d4d4d4]" />
      </div>

      <div className="flex w-full max-w-[1296px] flex-col items-center gap-16 pt-20">
        <div className="flex w-full flex-col items-start gap-10 px-6 sm:flex-row sm:gap-10 sm:px-[86px]">
          <h2 className="flex-1 font-serif text-[32px] leading-none tracking-tight text-black sm:text-[44px]">
            You already own your next revenue stream.
          </h2>
          <div className="flex-1 text-base leading-relaxed tracking-tight text-[#727272]">
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

        <Image
          src="/images/revenue-stream-shelf.png"
          alt="Diagram showing product logs, support history, decision threads, product data, billing, internal docs, support, CRM, code and commits, and sales conversations feeding into a licensable revenue stream"
          width={1297}
          height={501}
          className="h-auto w-full max-w-[1296px]"
        />
      </div>

      <Image
        src="/images/revenue-stream-road.png"
        alt="Illustration of a converging highway representing data flowing into a revenue stream"
        width={1440}
        height={576}
        className="h-auto w-full"
      />

      <ProcessBar className="h-[9px] w-full" />
    </section>
  );
}
