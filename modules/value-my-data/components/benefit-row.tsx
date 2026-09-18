import Image from "next/image";
import type { Benefit, BenefitIcon } from "../types";

const ICON_SRC: Record<BenefitIcon, string> = {
  search: "/images/value/icon-1.svg",
  briefcase: "/images/value/icon-2.svg",
  chart: "/images/value/icon-3.svg",
  shield: "/images/value/icon-4.svg",
};

export function BenefitRow({ benefit }: { benefit: Benefit }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center border border-black/15">
        <Image
          src={ICON_SRC[benefit.icon]}
          alt=""
          width={18}
          height={18}
          className="opacity-70"
        />
      </div>
      <div className="flex flex-col gap-1 pt-0.5">
        <p className="font-serif text-base tracking-[-0.2px] text-black">{benefit.title}</p>
        <p className="text-sm leading-[1.45] text-[#727272]">{benefit.body}</p>
      </div>
    </div>
  );
}
