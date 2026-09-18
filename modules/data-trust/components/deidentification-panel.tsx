"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { useStepCycle } from "@/modules/landing/hooks/use-step-cycle";
import { useInView } from "@/modules/landing/hooks/use-in-view";
import {
  DATA_TRUST_DEIDENTIFICATION_ILLUSTRATION,
  DATA_TRUST_DETECTION_ILLUSTRATION,
  DATA_TRUST_GRAIN_STRIP,
  DATA_TRUST_GRAIN_STRIP_SIZE,
  DATA_TRUST_STANDARD_ILLUSTRATION,
  PAGE_GRAIN_TEXTURE,
  SOFT_LIGHT_TEXTURE,
  SOFT_LIGHT_TEXTURE_SIZE,
} from "../lib/assets";
import {
  DEIDENTIFICATION_BODY,
  DEIDENTIFICATION_STEPS,
  DEIDENTIFICATION_STEP_INTERVAL_MS,
  DETECTION_BODY,
  STANDARD_BODY,
} from "../lib/constants";

const PANEL_GRADIENT = "linear-gradient(180deg, #147dba 25.84%, #133264 98.35%)";

function DeidentificationProgressStrip({
  active,
  onComplete,
}: {
  active: boolean;
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }

    let frameId: number;
    const start = performance.now();

    const tick = (now: number) => {
      const ratio = Math.min((now - start) / DEIDENTIFICATION_STEP_INTERVAL_MS, 1);
      setProgress(ratio);

      if (ratio < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        onCompleteRef.current();
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [active]);

  return (
    <div className="absolute -bottom-px left-0 h-0.5 w-full overflow-hidden">
      <Image
        src="/images/valuation/how-it-works/progress-loader.svg"
        alt=""
        fill
        className="object-cover"
        style={{ clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }}
      />
    </div>
  );
}

export function DeidentificationPanel() {
  const { activeIndex, setActiveIndex, advance } = useStepCycle(DEIDENTIFICATION_STEPS.length);
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      className="relative flex justify-center overflow-hidden bg-black px-3 sm:px-18 lg:bg-[#fcfcfc]"
    >
      <Image
        src={PAGE_GRAIN_TEXTURE}
        alt=""
        fill
        className="pointer-events-none hidden object-cover lg:block"
      />

      <div className="relative mx-auto w-full max-w-[1560px] border-x border-dashed border-[#d4d4d4]">
        {/* The grain strip above the panel, framed by dashed guides 40px in
            from the container edges. */}
        <div className="hidden lg:block lg:px-10">
          <div className="border-x border-dashed border-[#a8a8a8] pt-16">
            <div
              aria-hidden
              className="pointer-events-none h-11 opacity-48 mix-blend-multiply"
              style={{
                backgroundImage: `url("${DATA_TRUST_GRAIN_STRIP}")`,
                backgroundSize: DATA_TRUST_GRAIN_STRIP_SIZE,
              }}
            />
          </div>
        </div>

        <div
          className="relative mt-6 mb-6 overflow-hidden border border-[#272727] lg:mt-0 lg:mb-0 lg:flex lg:h-[540px] lg:border-none"
          style={{ background: PANEL_GRADIENT }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{
              backgroundImage: `url("${SOFT_LIGHT_TEXTURE}")`,
              backgroundSize: SOFT_LIGHT_TEXTURE_SIZE,
            }}
          />

          <div className="relative flex flex-col bg-black pt-3 pb-3 lg:ml-10 lg:h-full lg:w-[35%] lg:min-w-[320px] lg:shrink-0 lg:justify-between lg:px-10 lg:py-10">
            <div className="flex flex-col gap-[18px] px-3 lg:gap-6 lg:px-0">
              <div className="flex flex-col gap-3.5 lg:gap-3">
                <SectionTag
                  label="The Process"
                  tone="dark"
                  textClassName="text-white/60"
                  borderClassName="border-dashed border-white/25"
                  paddingClassName="px-2 py-1"
                  heightClassName="h-auto"
                />
                <h2 className="font-serif text-[43px] leading-[40.42px] tracking-[-1.65px] text-white lg:text-[44px] lg:leading-none lg:tracking-[-1.76px]">
                  De-Identification
                </h2>
              </div>
              <p className="text-sm leading-[19.88px] tracking-[-0.32px] text-[#f2f2f2] lg:leading-[1.4] lg:tracking-[-0.42px]">
                {DEIDENTIFICATION_BODY}
              </p>
              <Link
                href="/value-my-data"
                className="hidden w-fit border border-white/25 px-4 py-2.5 font-serif text-xs leading-[0.8] text-white transition-colors duration-150 ease-snap hover:bg-white hover:text-black lg:block"
              >
                Value my data
              </Link>
            </div>

            <ol className="hidden lg:flex lg:flex-col">
              {DEIDENTIFICATION_STEPS.map((step, index) => {
                const active = index === activeIndex;
                return (
                  <li
                    key={step}
                    className="relative flex items-center border-b border-[#353535]"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-current={active}
                      className="flex w-full cursor-pointer items-center py-2 text-left"
                    >
                      <span
                        className={`text-sm leading-[1.4] tracking-[-0.42px] uppercase transition-colors duration-300 ${
                          active ? "text-white" : "text-white/50"
                        }`}
                      >
                        {step}
                      </span>
                    </button>
                    <DeidentificationProgressStrip
                      key={`${index}-${active}`}
                      active={active && inView}
                      onComplete={advance}
                    />
                  </li>
                );
              })}
            </ol>

            <div className="pt-6 lg:hidden">
              <div className="relative h-[60px] overflow-hidden border-y border-[#272727]">
                <div className="grid h-full grid-cols-3">
                  {DEIDENTIFICATION_STEPS.map((step, index) => {
                    const active = index === activeIndex;
                    const match = step.match(/^(\[\d+\])\s*(.+)$/);
                    const [stepIndex, stepLabel] = match ? [match[1], match[2]] : [step, ""];
                    return (
                      <button
                        key={step}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-current={active}
                        className={`flex h-[58px] cursor-pointer flex-col items-start justify-center gap-[7px] self-start border-r border-[#272727] px-2.5 pt-2 pb-[9px] last:border-r-0 ${
                          active ? "bg-[#080808]" : "bg-black"
                        }`}
                      >
                        <span
                          className={`font-mono text-[9px] leading-[9px] whitespace-nowrap ${
                            active ? "text-white" : "text-white/56"
                          }`}
                        >
                          {stepIndex}
                        </span>
                        <span
                          className={`border-b pb-px text-[9px] leading-[9.36px] font-medium tracking-[-0.1px] whitespace-nowrap uppercase ${
                            active ? "border-white text-white" : "border-transparent text-white/56"
                          }`}
                        >
                          {stepLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 overflow-hidden">
                  <div
                    className="h-full w-1/3 transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(${activeIndex * 100}%)` }}
                  >
                    <DeidentificationProgressStrip
                      key={`mobile-${activeIndex}`}
                      active={inView}
                      onComplete={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[400px] overflow-hidden lg:h-full lg:min-h-0 lg:flex-1">
            <div
              className={`absolute inset-0 flex flex-col gap-4 px-3 pt-6 pb-6 transition-opacity duration-700 ease-in-out lg:items-center lg:justify-between lg:gap-0 lg:px-8 lg:pt-14 lg:pb-0 ${
                activeIndex === 0 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="flex flex-col gap-6 lg:w-full lg:max-w-[696px] lg:gap-6 min-[1440px]:flex-row min-[1440px]:items-start">
                <p className="font-serif text-[28px] leading-[1.1] tracking-[-0.28px] text-white lg:flex-1 lg:text-[36px] lg:leading-none lg:tracking-[-1.44px]">
                  Your data.
                  <br />
                  De-identified.
                </p>
                <p className="text-sm leading-[20.02px] tracking-[-0.35px] text-white lg:w-full lg:leading-[1.4] lg:tracking-[-0.42px] min-[1440px]:w-[360px] min-[1440px]:max-w-[360px] min-[1440px]:shrink-0 min-[1440px]:break-words">
                  {DEIDENTIFICATION_BODY}
                </p>
              </div>

              <div className="relative min-h-[280px] flex-1 overflow-hidden lg:flex lg:w-full lg:max-w-[696px] lg:min-h-0 lg:flex-none lg:flex-col lg:justify-end">
                <Image
                  src={DATA_TRUST_DEIDENTIFICATION_ILLUSTRATION}
                  alt="A customer email with names, contact details, and an API key struck out by redaction bars"
                  width={696}
                  height={372}
                  className="h-auto w-full lg:max-w-[696px]"
                />
              </div>
            </div>

            <div
              className={`absolute inset-0 flex flex-col gap-4 px-3 pt-6 pb-6 transition-opacity duration-700 ease-in-out lg:items-center lg:justify-between lg:gap-0 lg:px-8 lg:pt-14 lg:pb-0 ${
                activeIndex === 1 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="flex flex-col gap-6 lg:w-full lg:max-w-[696px] lg:gap-6 min-[1440px]:flex-row min-[1440px]:items-start">
                <p className="font-serif text-[28px] leading-[1.1] tracking-[-0.28px] text-white lg:flex-1 lg:text-[36px] lg:leading-none lg:tracking-[-1.44px]">
                  How your data
                  <br />
                  gets cleaned
                </p>
                <p className="text-sm leading-[20.02px] tracking-[-0.35px] text-white lg:w-full lg:leading-[1.4] lg:tracking-[-0.42px] min-[1440px]:w-[360px] min-[1440px]:max-w-[360px] min-[1440px]:shrink-0 min-[1440px]:break-words">
                  {DETECTION_BODY}
                </p>
              </div>

              <div className="relative min-h-[280px] flex-1 overflow-hidden lg:flex lg:w-full lg:max-w-[696px] lg:min-h-0 lg:flex-none lg:flex-col lg:justify-end">
                <Image
                  src={DATA_TRUST_DETECTION_ILLUSTRATION}
                  alt="A benchmark card showing PII coverage across Slack, PDFs, tickets, commits, images, and email, with Replay finding 3x more identifiers than the leading frontier model"
                  width={696}
                  height={372}
                  className="h-auto w-full lg:max-w-[696px]"
                />
              </div>
            </div>

            <div
              className={`absolute inset-0 flex flex-col gap-4 px-3 pt-6 pb-6 transition-opacity duration-700 ease-in-out lg:items-center lg:justify-between lg:gap-0 lg:px-8 lg:pt-14 lg:pb-0 ${
                activeIndex === 2 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="flex flex-col gap-6 lg:w-full lg:max-w-[696px] lg:gap-6 min-[1440px]:flex-row min-[1440px]:items-start">
                <p className="font-serif text-[28px] leading-[1.1] tracking-[-0.28px] text-white lg:flex-1 lg:text-[36px] lg:leading-none lg:tracking-[-1.44px]">
                  We&rsquo;re setting
                  <br />
                  the standard
                </p>
                <p className="text-sm leading-[20.02px] tracking-[-0.35px] text-white lg:w-full lg:leading-[1.4] lg:tracking-[-0.42px] min-[1440px]:w-[360px] min-[1440px]:max-w-[360px] min-[1440px]:shrink-0 min-[1440px]:break-words">
                  {STANDARD_BODY}
                </p>
              </div>

              <div className="relative min-h-[280px] flex-1 overflow-hidden lg:flex lg:w-full lg:max-w-[696px] lg:min-h-0 lg:flex-none lg:flex-col lg:justify-end">
                <Image
                  src={DATA_TRUST_STANDARD_ILLUSTRATION}
                  alt="The Replay Standard for Real-World Data De-identification: 60+ categories, per-class thresholds, a 4-stage process, and benchmark-held verification, with isolated tenants, raw data in, no shared storage, no cross-client access, and clean data out"
                  width={696}
                  height={372}
                  className="h-auto w-full lg:max-w-[696px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
