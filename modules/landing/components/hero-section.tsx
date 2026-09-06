import Image from "next/image";
import { ProcessBar } from "./process-bar";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-dashed border-black/8 bg-[#fcfcfc]">
      <div className="flex items-stretch">
        <div className="hidden flex-1 items-end justify-center overflow-hidden lg:flex">
          <Image
            src="/images/hero-illustration-left.png"
            alt=""
            width={271}
            height={731}
            className="h-[731px] w-auto max-w-none object-contain object-bottom opacity-90"
            priority
          />
        </div>

        <div className="flex w-full flex-col items-center gap-10 border-dashed border-black/8 px-6 pt-[120px] pb-[90px] lg:w-[898px] lg:shrink-0 lg:border-x lg:px-0">
          <div className="flex max-w-[840px] flex-col items-center gap-6 text-center">
            <h1 className="font-serif text-[40px] leading-none tracking-tight text-black sm:text-[56px] lg:text-[68px] lg:tracking-[-0.04em]">
              Fund growth by licensing the data you already have.
            </h1>
            <p className="max-w-[669px] text-base leading-relaxed tracking-tight text-[#727272]">
              Frontier AI labs need training data on how real companies run.
              You&apos;re sitting on years of it. We value your data, strip out
              every name and identifier, and get you paid.
            </p>
          </div>

          <a
            href="#value-my-data"
            className="flex w-[300px] items-center justify-center bg-ink py-6 font-serif text-base uppercase tracking-wide text-white"
          >
            Value my data
          </a>
        </div>

        <div className="hidden flex-1 items-end justify-center overflow-hidden lg:flex">
          <Image
            src="/images/hero-illustration-right.png"
            alt=""
            width={382}
            height={793}
            className="h-[793px] w-auto max-w-none object-contain object-bottom opacity-90"
            priority
          />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="grid w-full grid-cols-3 border-t border-dashed border-black/8">
          <div className="border-r border-dashed border-black/8 px-4.5 py-4">
            <p className="font-mono text-[8px] uppercase tracking-wide text-[#898989]">
              process
            </p>
            <p className="font-mono text-[8px] uppercase tracking-wide text-[#898989]">
              identified → structured → verified → licensed
            </p>
          </div>
          <div className="flex items-center border-r border-dashed border-black/8 px-4.5 py-4">
            <div className="border border-dashed border-[#d9d9d9] px-2 py-1.5">
              <p className="font-mono text-[8px] uppercase tracking-wide text-[#898989]">
                RL-2026-001 // Version 1.0
              </p>
            </div>
          </div>
          <div className="hidden items-center px-4.5 py-4 sm:flex">
            <p className="font-mono text-[8px] uppercase leading-tight tracking-wide text-[#898989]">
              CLASSIFICATION
              <br />
              PROPRIETARY DATA / LICENSING
            </p>
          </div>
        </div>
        <ProcessBar className="h-5" />
      </div>
    </section>
  );
}
