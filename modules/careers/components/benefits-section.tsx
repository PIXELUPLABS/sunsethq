"use client";

import { BottomStripes } from "@/modules/landing/components/bottom-stripes";
import { useInView } from "@/modules/landing/hooks/use-in-view";

const GRAIN_TEXTURE = "/images/pricing/grain-texture.webp";

const PLACEHOLDER_BENEFITS = [
  { label: "Salary & equity", copy: "Strong cash compensation plus meaningful ownership." },
  { label: "Health", copy: "Full medical, dental, and vision from day one." },
  { label: "Time off", copy: "Unlimited PTO that's actually used." },
  { label: "Equipment", copy: "Any setup you need, replaced on request." },
];

export function BenefitsSection() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  const enter = (delayMs: number) => ({
    className: `transition-[opacity,transform] duration-500 ease-snap ${
      inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
    }`,
    style: { transitionDelay: `${delayMs}ms` },
  });
  const leftColumnEnter = enter(0);

  return (
    <section
      className="relative flex justify-center overflow-hidden px-3 min-[900px]:px-18"
      style={{ backgroundImage: "linear-gradient(180deg, #133264 0%, #147dba 160%)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: `url(${GRAIN_TEXTURE})`,
          backgroundSize: "296px 296px",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1560px] border border-dashed border-white/30">
        <div className="pointer-events-none absolute inset-y-0 left-3 hidden border-l border-dashed border-white/30 min-[900px]:left-10 min-[900px]:block" />
        <div className="pointer-events-none absolute inset-y-0 right-3 hidden border-r border-dashed border-white/30 min-[900px]:right-10 min-[900px]:block" />

        <div className="px-3 pt-[144px] pb-32 min-[900px]:px-10 min-[900px]:pt-[144px] min-[900px]:pb-48">
          <div ref={ref} className="relative flex w-full flex-col min-[900px]:flex-row">
            <div
              style={leftColumnEnter.style}
              className={`flex flex-col bg-black/[0.18] min-[900px]:flex-1 ${leftColumnEnter.className}`}
            >
              <div className="flex min-h-[100px] items-center border border-b-0 border-dashed border-white/30 px-6 py-6 min-[900px]:min-h-[114px]">
                <h2 className="font-serif text-[32px] leading-[1.1] tracking-[-0.32px] text-white min-[900px]:text-[36px]">
                  The practical stuff.
                </h2>
              </div>

              <div className="relative w-full border border-dashed border-white/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/careers/practical-stuff-cube-grid.svg"
                  alt=""
                  width={645}
                  height={270}
                  className="h-auto w-full"
                />
              </div>

              <div className="flex min-h-[100px] items-center border border-t-0 border-dashed border-white/30 px-6 py-6 min-[900px]:min-h-[114px]">
                <p className="text-base leading-[1.4] tracking-[-0.48px] text-white/70">
                  More modular, but still restrained. A tiny system visual sits under the intro
                  while benefits occupy a structured 2×2 board.
                </p>
              </div>
            </div>

            <div className="border border-dashed border-white/30 min-[900px]:flex-1">
              <div className="grid grid-cols-1 min-[900px]:h-full min-[900px]:grid-cols-2 min-[900px]:grid-rows-2">
                {PLACEHOLDER_BENEFITS.map((benefit, i) => {
                  const isLeftCol = i % 2 === 0;
                  const isTopRow = i < 2;
                  const isLastMobile = i === PLACEHOLDER_BENEFITS.length - 1;
                  const cardEnter = enter(60 + i * 60);

                  return (
                    <div
                      key={benefit.label}
                      style={cardEnter.style}
                      className={`flex min-h-[180px] flex-col justify-between gap-10 border-dashed border-white/30 bg-black/[0.18] p-6 min-[900px]:h-full ${
                        isLastMobile ? "border-b-0" : "border-b"
                      } ${isTopRow ? "min-[900px]:border-b" : "min-[900px]:border-b-0"} ${isLeftCol ? "min-[900px]:border-r" : ""} ${cardEnter.className}`}
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center bg-white/10 font-mono text-[10px] leading-[15px] text-white/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex flex-col gap-3">
                        <p className="font-serif text-xl leading-7 text-white">{benefit.label}</p>
                        <p className="text-sm leading-[1.4] tracking-[-0.42px] text-white/70">
                          {benefit.copy}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomStripes />
    </section>
  );
}
