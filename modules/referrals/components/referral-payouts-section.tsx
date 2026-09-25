import Image from "next/image";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { BottomStripes } from "@/modules/landing/components/bottom-stripes";
import { CONTRACT_ICON, COPPER_COIN_ICON } from "../lib/assets";
import { PAYOUTS_EYEBROW, PAYOUTS_POINTS } from "../lib/constants";
import type { PayoutPointIcon } from "../types";
import { ReferralCategoryPanel } from "./referral-category-panel";

const GRAIN_TEXTURE = "/images/pricing/grain-texture.webp";

const POINT_ICONS: Record<PayoutPointIcon, string> = {
  contract: CONTRACT_ICON,
  coin: COPPER_COIN_ICON,
};

export function ReferralPayoutsSection() {
  return (
    <section className="relative flex flex-col overflow-hidden bg-brand-gradient bg-ink px-3 pt-16 pb-32 sm:px-18 sm:pt-[110px] sm:pb-40 lg:px-18">
      <div
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: `url(${GRAIN_TEXTURE})`,
          backgroundSize: "296px 296px",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-[1560px] flex-col gap-16 overflow-hidden bg-black/10 px-3 py-10 sm:px-10 sm:py-[60px] lg:flex-row">
        <div className="flex flex-col gap-10 lg:h-[595px] lg:w-[400px] lg:shrink-0 lg:justify-between">
          <div className="flex flex-col items-start gap-6 lg:w-[351px]">
            <SectionTag
              label={PAYOUTS_EYEBROW}
              tone="dark"
              borderClassName="border-dashed border-white/40"
              paddingClassName="px-2 py-1"
              heightClassName="h-auto"
            />
            <h2 className="font-serif text-[36px] leading-none tracking-[-1.44px] text-[#f1f1f1] sm:text-[44px] sm:tracking-[-1.76px]">
              What you earn
              <br />
              for each referral.
            </h2>
          </div>

          <div className="flex flex-col gap-16">
            {PAYOUTS_POINTS.map((point) => (
              <div key={point.title} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Image src={POINT_ICONS[point.icon]} alt="" width={24} height={24} />
                  <p className="font-serif-regular text-2xl leading-[1.1] tracking-[-0.24px] text-white">
                    {point.title}
                  </p>
                </div>
                <p className="text-base leading-[1.4] tracking-[-0.48px] text-white/80">
                  {point.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <ReferralCategoryPanel />
      </div>

      <BottomStripes />
    </section>
  );
}
