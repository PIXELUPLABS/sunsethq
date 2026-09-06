import Image from "next/image";
import { SectionTag } from "./section-tag";
import { ValuationAccordion } from "./valuation-accordion";

export function ValuationSection() {
  return (
    <section className="flex justify-center bg-[#0c0c0b] px-6 py-24 sm:px-18">
      <div className="grid w-full max-w-[1382px] grid-cols-1 border border-[#444] lg:grid-cols-2">
        <div className="flex flex-col justify-between gap-14 border-b border-[#444] p-8 sm:p-12 lg:border-b-0 lg:border-r">
          <div className="flex flex-col items-start gap-6">
            <SectionTag label="How it works" tone="dark" />
            <h2 className="font-serif text-[32px] leading-none tracking-tight text-white sm:text-[44px]">
              Four steps. 120 minutes of your time.
            </h2>
          </div>

          <ValuationAccordion />
        </div>

        <div className="relative min-h-[420px] overflow-hidden bg-[#0c0c0b]">
          <Image
            src="/images/valuation-illustration.png"
            alt="Illustration of stacked data cards (code, documents, tickets, messages) totalling an 8M indicated value across 25M+ records"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
