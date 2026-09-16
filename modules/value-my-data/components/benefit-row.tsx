import { BarChartIcon, BriefcaseIcon, SearchIcon, ShieldIcon } from "@/components/ui/icons";
import type { Benefit, BenefitIcon } from "../types";

const ICONS: Record<BenefitIcon, typeof SearchIcon> = {
  search: SearchIcon,
  briefcase: BriefcaseIcon,
  chart: BarChartIcon,
  shield: ShieldIcon,
};

export function BenefitRow({ benefit }: { benefit: Benefit }) {
  const Icon = ICONS[benefit.icon];

  return (
    <div className="flex items-start gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center border border-black/15">
        <Icon className="size-[18px] text-black/70" />
      </div>
      <div className="flex flex-col gap-1 pt-0.5">
        <p className="font-serif text-base tracking-[-0.2px] text-black">{benefit.title}</p>
        <p className="text-sm leading-[1.45] text-[#727272]">{benefit.body}</p>
      </div>
    </div>
  );
}
