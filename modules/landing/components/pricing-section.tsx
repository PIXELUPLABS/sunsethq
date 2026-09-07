import { AlignLeftIcon } from "@/components/ui/icons";
import { PRICING_TIERS } from "../lib/constants";
import { SectionTag } from "./section-tag";

const GRAIN_TEXTURE = "/images/pricing/grain-texture.webp";

const TONE_COLOR: Record<(typeof PRICING_TIERS)[number]["tone"], string> = {
  muted: "rgba(255,255,255,0.19)",
  cyan: "rgba(37,255,249,0.5)",
  blue: "#118ecc",
};

export function PricingSection() {
  return (
    <section className="relative overflow-hidden bg-brand-gradient bg-ink px-6 py-24 sm:px-18">
      <div
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: `url(${GRAIN_TEXTURE})`,
          backgroundSize: "296px 296px",
        }}
      />

      <div className="relative flex flex-col gap-16 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex max-w-[637px] flex-col justify-between gap-14">
          <div className="flex flex-col items-start gap-6">
            <SectionTag label="Who it's for" tone="dark" />
            <h2 className="font-serif text-[32px] leading-none tracking-tight text-[#f1f1f1] sm:text-[44px] sm:tracking-[-1.76px]">
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
              <p className="max-w-[309px] text-base leading-[1.4] tracking-[-0.48px] text-white">
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
              <p className="max-w-[309px] text-base leading-[1.4] tracking-[-0.48px] text-white">
                You&apos;re paid up front, plus a revenue share of every
                license. And because your company keeps producing data, the
                revenue recurs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex h-[494px] w-full max-w-[548px] items-start justify-center gap-6 overflow-hidden bg-black/25 px-16 py-[47px]">
          {PRICING_TIERS.map((tier) => (
            <div key={tier.value} className="relative h-[400px] w-[124px] shrink-0">
              {/* dashed measurement brackets */}
              <div className="absolute top-[6px] bottom-[11px] left-[12px] w-0 border-l border-dashed border-white/30" />
              <div className="absolute top-[6px] bottom-[11px] right-[12px] w-0 border-l border-dashed border-white/30" />

              <p className="absolute inset-x-0 bottom-0 text-center font-mono text-[10px] tracking-[0.9px] text-[#ddd] uppercase">
                {tier.people}
              </p>

              <div className="absolute inset-x-0 bottom-[31px] flex flex-col items-center">
                <p className="mb-1.5 font-serif text-[27px] leading-[1.04] tracking-[-0.81px] text-[#fafafa] uppercase">
                  {tier.value}
                </p>
                <div className="flex flex-col-reverse items-stretch gap-[5.83px]">
                  {Array.from({ length: tier.segments }).map((_, i) => (
                    <div
                      key={i}
                      className="relative h-[20.65px] w-[82.6px] overflow-hidden"
                      style={{ backgroundColor: TONE_COLOR[tier.tone] }}
                    >
                      <div
                        className="absolute inset-0 mix-blend-soft-light backdrop-blur-[2.7px]"
                        style={{
                          backgroundImage: `url(${GRAIN_TEXTURE})`,
                          backgroundSize: "296px 296px",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
