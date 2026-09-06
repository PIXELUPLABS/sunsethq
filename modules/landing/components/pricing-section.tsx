import { AlignLeftIcon } from "@/components/ui/icons";
import { PRICING_TIERS } from "../lib/constants";
import { SectionTag } from "./section-tag";

const TONE_COLOR: Record<(typeof PRICING_TIERS)[number]["tone"], string> = {
  muted: "rgba(255,255,255,0.35)",
  cyan: "rgba(37,255,249,0.55)",
  blue: "#118ecc",
};

export function PricingSection() {
  return (
    <section className="bg-brand-gradient bg-ink px-6 py-24 sm:px-18">
      <div className="mx-auto flex max-w-[1296px] flex-col gap-16 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex max-w-[637px] flex-col justify-between gap-14">
          <div className="flex flex-col items-start gap-6">
            <SectionTag label="Who it's for" tone="dark" />
            <h2 className="font-serif text-[32px] leading-none tracking-tight text-[#f1f1f1] sm:text-[44px]">
              What companies your size get paid.
            </h2>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 border-t border-white/0 pt-0 sm:flex-row sm:items-start">
              <div className="flex w-[199px] shrink-0 items-start gap-4">
                <AlignLeftIcon className="mt-1 size-6 text-white" />
                <p className="font-serif text-2xl tracking-tight text-white">
                  The deal
                </p>
              </div>
              <p className="max-w-[309px] text-base leading-relaxed tracking-tight text-white">
                Headcount is a proxy. How long you&apos;ve been operating, what
                industry you&apos;re in, which apps you run on and how much
                data sits in each all factor into the final price.
              </p>
            </div>
            <div className="flex flex-col gap-4 border-t border-white/15 pt-5 sm:flex-row sm:items-start">
              <div className="flex w-[199px] shrink-0 items-start gap-4">
                <AlignLeftIcon className="mt-1 size-6 text-white" />
                <p className="font-serif text-2xl tracking-tight text-white">
                  Why it recurs
                </p>
              </div>
              <p className="max-w-[309px] text-base leading-relaxed tracking-tight text-white">
                You&apos;re paid up front, plus a revenue share of every
                license. And because your company keeps producing data, the
                revenue recurs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex h-[420px] w-full max-w-[548px] items-end justify-center gap-10 border border-white/10 bg-black/25 px-10 py-10">
          {PRICING_TIERS.map((tier) => (
            <div key={tier.value} className="flex h-full w-[82px] flex-col items-center">
              <div className="flex flex-1 flex-col-reverse items-stretch justify-start gap-1">
                {Array.from({ length: tier.segments }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[21px] w-[82px]"
                    style={{ backgroundColor: TONE_COLOR[tier.tone] }}
                  />
                ))}
              </div>
              <p className="mt-4 font-serif text-2xl uppercase tracking-tight text-[#fafafa]">
                {tier.value}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-[#ddd]">
                {tier.people}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
