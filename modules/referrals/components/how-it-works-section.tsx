import { SectionTag } from "@/modules/landing/components/section-tag";
import { HOW_IT_WORKS_EYEBROW, HOW_IT_WORKS_HEADING, PROCESS_STEPS } from "../lib/constants";

const PROGRESS_SEGMENTS = PROCESS_STEPS.length;

export function HowItWorksSection() {
  return (
    <section className="flex flex-col items-center gap-10 bg-[#0c0c0b] px-3 py-16 sm:px-18 lg:px-[72px] lg:py-[120px]">
      <div className="flex flex-col items-center gap-6 text-center">
        <SectionTag
          label={HOW_IT_WORKS_EYEBROW}
          tone="dark"
          textClassName="text-white/60"
          borderClassName="border-dashed border-white/25"
          paddingClassName="px-2 py-1"
          heightClassName="h-auto"
        />
        <p className="font-serif text-[36px] leading-none tracking-[-1.44px] text-white sm:text-[44px] sm:tracking-[-1.76px]">
          {HOW_IT_WORKS_HEADING}
        </p>
      </div>

      <div className="grid w-full grid-cols-1 border border-dashed border-[#353535] sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS_STEPS.map((step, i) => {
          const isLastMobile = i === PROCESS_STEPS.length - 1;
          const isLastRowSm = i >= PROCESS_STEPS.length - 2;
          const needsRightBorderSm = i % 2 === 0;
          const needsRightBorderLg = i !== PROCESS_STEPS.length - 1;

          return (
            <div
              key={step.number}
              className={`flex h-[260px] flex-col justify-between border-dashed border-[#353535] bg-[#0c0c0b] p-6 ${
                isLastMobile ? "border-b-0" : "border-b"
              } ${isLastRowSm ? "sm:border-b-0" : "sm:border-b"} ${
                needsRightBorderSm ? "sm:border-r" : "sm:border-r-0"
              } lg:border-b-0 ${needsRightBorderLg ? "lg:border-r" : "lg:border-r-0"}`}
            >
              <div className="flex items-center gap-[3px]">
                <p className="font-mono text-xs text-white/40">{step.number}</p>
                <div className="flex items-start gap-[3px] pl-3">
                  {Array.from({ length: PROGRESS_SEGMENTS }).map((_, segmentIndex) => (
                    <div
                      key={segmentIndex}
                      className={`h-1 w-3.5 shrink-0 ${
                        segmentIndex <= i ? "bg-[#499df8]" : "bg-white/15"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-newsreader text-[22px] leading-[1.1] tracking-[-0.44px] text-white">
                  {step.title}
                </p>
                <p className="text-sm leading-[1.45] text-white/60">{step.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
