"use client";

import Image from "next/image";
import { AlignLeftIcon } from "@/components/ui/icons";
import { PRICING_TIERS } from "../lib/constants";
import { SectionTag } from "./section-tag";
import { BottomStripes } from "./bottom-stripes";
import { useInView } from "../hooks/use-in-view";

const GRAIN_TEXTURE = "/images/pricing/grain-texture.webp";
const WHO_ITS_FOR_MARK = "/images/pricing/who-its-for-mark.png";
const TEXTURE_PANEL = "/images/pricing/Union.svg";

const TONE_COLOR: Record<(typeof PRICING_TIERS)[number]["tone"], string> = {
  muted: "#3a5979",
  cyan: "#1a99aa",
  blue: "#118ecc",
};

export function PricingSection() {
  const { ref: barsRef, inView: barsInView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section
      id="what-you-earn"
      className="relative flex h-[990px] scroll-mt-16 flex-col overflow-hidden bg-brand-gradient bg-ink px-6 pt-[110px] sm:px-18"
    >
      <div
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: `url(${GRAIN_TEXTURE})`,
          backgroundSize: "296px 296px",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-[1560px] flex-col gap-10 overflow-hidden bg-black/10 px-6 py-10 sm:gap-[60px] sm:px-10 sm:py-[60px]">
        {/* tag + heading + texture panel, and the pricing tiers */}
        <div className="flex flex-col gap-8 lg:h-[400px] lg:flex-row lg:items-start">
          <div className="flex flex-col gap-10 lg:w-[400px] lg:shrink-0 lg:gap-[49px]">
            <div className="flex flex-col items-start gap-6 lg:w-[351px]">
              <SectionTag
                label="Who it's for"
                tone="dark"
                icon={
                  <Image
                    src={WHO_ITS_FOR_MARK}
                    alt=""
                    width={18}
                    height={18}
                  />
                }
              />
              <h2 className="font-serif text-[32px] leading-none tracking-tight text-[#f1f1f1] sm:text-[44px] sm:tracking-[-1.76px]">
                What companies
                <br />
                your size get paid.
              </h2>
            </div>

            <div className="relative hidden h-[200px] w-full overflow-hidden lg:block">
              <Image
                src={TEXTURE_PANEL}
                alt=""
                fill
                className="pointer-events-none object-cover mix-blend-multiply"
              />
            </div>
          </div>

          <div
            ref={barsRef}
            className="flex items-end gap-6 overflow-hidden lg:h-full lg:flex-1 lg:gap-[42px] lg:pl-8"
          >
            {PRICING_TIERS.map((tier, tierIndex) => (
              <div key={tier.value} className="flex h-full flex-1 items-end overflow-hidden">
                <div className="h-full w-3 shrink-0 border-y border-l border-dashed border-white/30" />

                <div className="flex flex-1 flex-col items-start gap-[26px] pb-3">
                  <div className="flex w-full flex-col items-start gap-[14px]">
                    <p
                      className="font-serif text-[27px] leading-[1.04] tracking-[-0.81px] text-[#fafafa] uppercase transition-[transform,opacity] duration-500 ease-out"
                      style={{
                        transitionDelay: `${tierIndex * 150}ms`,
                        transform: barsInView ? "translateX(0)" : "translateX(-24px)",
                        opacity: barsInView ? 1 : 0,
                      }}
                    >
                      {tier.value}
                    </p>
                    <div className="flex w-full flex-col items-start gap-[6px]">
                      {Array.from({ length: tier.segments }).map((_, i) => (
                        <div
                          key={i}
                          className="relative h-5 w-full overflow-hidden transition-[transform,opacity] duration-500 ease-out"
                          style={{
                            backgroundColor: TONE_COLOR[tier.tone],
                            transitionDelay: `${(tier.segments - 1 - i) * 90}ms`,
                            transform: barsInView ? "translateY(0)" : "translateY(16px)",
                            opacity: barsInView ? 1 : 0,
                          }}
                        >
                          <div
                            className="absolute inset-0 mix-blend-soft-light"
                            style={{
                              backgroundImage: `url(${GRAIN_TEXTURE})`,
                              backgroundSize: "296px 296px",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="font-mono text-[10px] leading-[1.1] font-medium tracking-[0.9px] text-[#ddd] uppercase">
                    {tier.people}
                  </p>
                </div>

                <div className="h-full w-3 shrink-0 border-y border-r border-dashed border-white/30" />
              </div>
            ))}
          </div>
        </div>

        {/* the deal / why it recurs */}
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          <div className="flex flex-1 flex-col items-start gap-3">
            <div className="flex items-start gap-4">
              <AlignLeftIcon className="size-6" />
              <p className="font-serif text-2xl leading-[1.1] tracking-[-0.24px] text-white">
                The deal
              </p>
            </div>
            <div className="hidden h-5 w-full lg:block" />
            <p className="text-base leading-[1.4] tracking-[-0.48px] text-white">
              Headcount is a proxy. How long you&apos;ve been operating, what
              industry you&apos;re in, which apps you run on and how much
              data sits in each all factor into the final price.
            </p>
          </div>
          <div className="flex flex-1 flex-col items-start gap-3">
            <div className="flex items-start gap-4">
              <AlignLeftIcon className="size-6" />
              <p className="font-serif text-2xl leading-[1.1] tracking-[-0.24px] text-white">
                Why it recurs
              </p>
            </div>
            <div className="hidden h-5 w-full lg:block" />
            <p className="text-base leading-[1.4] tracking-[-0.48px] text-white">
              You&apos;re paid up front, plus a revenue share of every
              license. And because your company keeps producing data, the
              revenue recurs.
            </p>
          </div>
        </div>
      </div>

      <BottomStripes />
    </section>
  );
}
