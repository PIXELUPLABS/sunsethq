import { GRAIN_TEXTURE_STYLE, PURPOSE_GRAIN_TEXTURE } from "../lib/assets";
import { OUR_PURPOSE_BODY, OUR_PURPOSE_EYEBROW, OUR_PURPOSE_HEADING, OUR_PURPOSE_POINTS } from "../lib/constants";
import { PurposeDiagram } from "./purpose-diagram";

export function OurPurposeSection() {
  return (
    <section className="relative flex justify-center px-3 sm:px-18" style={GRAIN_TEXTURE_STYLE}>
      <div
        className="relative mx-auto w-full max-w-[1560px] overflow-hidden p-4 sm:p-10 lg:p-18"
        style={{ backgroundImage: "linear-gradient(179.94deg, #133264 26.96%, #147dba 143.8%)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            backgroundImage: `url(${PURPOSE_GRAIN_TEXTURE})`,
            backgroundSize: "296px 296px",
            backgroundPosition: "top left",
          }}
        />

        <div className="relative flex w-full flex-col gap-15 overflow-hidden bg-black/10 px-5 py-10 sm:px-10 sm:py-15">
          <div className="flex flex-col gap-16 lg:flex-row lg:items-start">
            <div className="flex max-w-[400px] flex-col items-start gap-6 lg:w-[400px] lg:shrink-0">
              <div className="flex h-[23.2px] items-center justify-center border border-dashed border-white/25 px-2">
                <p className="-mr-[0.08em] font-mono text-[12px] leading-[1.1] font-normal tracking-[0.08em] whitespace-nowrap text-white/60 uppercase [text-box:trim-both_cap_alphabetic]">
                  {OUR_PURPOSE_EYEBROW}
                </p>
              </div>
              <p className="font-serif text-[32px] leading-[1.05] tracking-[-1.28px] text-white sm:text-[44px] sm:leading-none sm:tracking-[-1.76px]">
                {OUR_PURPOSE_HEADING}
              </p>
              <p className="text-base leading-[1.4] tracking-[-0.48px] text-white/80">
                {OUR_PURPOSE_BODY}
              </p>
            </div>

            <PurposeDiagram />
          </div>

          <div className="flex flex-col gap-10 border-t border-dashed border-white/20 pt-10 sm:flex-row sm:gap-16">
            {OUR_PURPOSE_POINTS.map((point) => (
              <div key={point.title} className="flex flex-1 flex-col gap-4">
                <p className="font-serif text-2xl leading-none tracking-[-0.96px] text-white">
                  {point.title}
                </p>
                <p className="text-base leading-[1.4] tracking-[-0.48px] text-white">
                  {point.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
