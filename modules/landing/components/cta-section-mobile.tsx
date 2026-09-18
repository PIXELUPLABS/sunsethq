import Image from "next/image";
import { PrimaryButtonHover } from "@/components/ui/primary-button-hover";
import Link from "next/link";
import { CTA_GRAIN_WHITE, CTA_MOBILE_BAND_TOP, CTA_MOBILE_COLLAGE } from "../lib/cta-assets";

type CtaSectionMobileProps = {
  headline: string;
  buttonLabel: string;
  href: string;
  topBandClassName?: string;
};

/**
 * The phone CTA, laid out from the 390 x 490 Figma frame. Everything is in
 * percentages of the section or container units of its width, so it scales
 * with the phone. Sizes in cqw are the design's px over 390.
 */
export function CtaSectionMobile({
  headline,
  buttonLabel,
  href,
  topBandClassName = "bg-[#eaebf1]",
}: CtaSectionMobileProps) {
  return (
    <div className="absolute inset-0" style={{ containerType: "inline-size" }}>
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 overflow-hidden ${topBandClassName}`}
        style={{ height: CTA_MOBILE_BAND_TOP }}
      >
        <Image src={CTA_GRAIN_WHITE} alt="" fill className="pointer-events-none object-cover mix-blend-multiply" />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-[#080808]"
        style={{ top: CTA_MOBILE_BAND_TOP }}
      />

      {CTA_MOBILE_COLLAGE.map((tile) => (
        <div key={tile.src} className="pointer-events-none absolute" style={tile.style}>
          <Image src={tile.src} alt="" fill sizes="60vw" className="pointer-events-none object-contain" />
        </div>
      ))}

      <div className="absolute top-1/2 left-1/2 w-[78.4615%] -translate-x-1/2 -translate-y-1/2 border border-[#d4d4d4] bg-[#f4f4f4]">
        <Image src={CTA_GRAIN_WHITE} alt="" fill className="pointer-events-none object-cover mix-blend-multiply" />

        <div className="relative flex w-full flex-col items-center gap-[6.1538cqw] px-[6.1538cqw] pt-[8.2051cqw] pb-[13.3333cqw]">
          <p className="relative w-full text-center font-serif text-[7.1795cqw] leading-none tracking-[-0.04em] text-black">
            {headline}
          </p>
          <Link
            href={href}
            className="group relative flex items-center overflow-hidden border border-[#141518] bg-[#141518] px-[5.1282cqw] py-[3.0769cqw] transition-transform duration-150 ease-snap active:scale-[0.97]"
          >
            <PrimaryButtonHover on="active" />
            <span className="relative font-serif text-[3.0769cqw] leading-[0.8] tracking-wide text-white">
              {buttonLabel}
            </span>
          </Link>

          <div className="pointer-events-none absolute bottom-[5.45%] left-[2.94%] flex items-center justify-between right-[4.25%]">
            <div className="flex items-center gap-[0.85cqw]">
              <div className="flex flex-col gap-[0.15cqw]">
                <p className="font-mono text-[0.72cqw] text-[#898989] uppercase">process</p>
                <p className="font-mono text-[0.72cqw] text-[#898989] uppercase">
                  identified → structured → verified → licensed
                </p>
              </div>
              <div className="border border-dashed border-black/17 px-[0.65cqw] py-[0.65cqw]">
                <p className="font-mono text-[0.72cqw] whitespace-nowrap text-[#898989] uppercase">
                  RL-2026-001 // Version 1.0
                </p>
              </div>
              <p className="font-mono text-[0.72cqw] leading-tight text-[#898989] uppercase">
                classification
                <br />
                proprietary data / licensing
              </p>
            </div>

            <div className="flex items-center">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="relative flex items-center gap-[0.55cqw] border-[0.3px] border-[#898989] p-[0.55cqw]"
                >
                  <p className="font-mono text-[0.59cqw] leading-[1.1] tracking-[0.09em] text-[#898989] uppercase">
                    def load_dataset(source):
                    <br />
                    records = source.read()
                    <br />
                    return normalize(records)
                  </p>
                  <span className="absolute bottom-[0.4cqw] left-[0.1cqw] size-[0.33cqw] rounded-full bg-[#898989]" />
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute top-0 left-[2.79%] h-[88.36%] w-px border-l border-dashed border-black/10" />
          <div className="pointer-events-none absolute top-0 right-[2.79%] h-[88.36%] w-px border-l border-dashed border-black/10" />
          <div className="pointer-events-none absolute inset-x-[7.09%] top-[93.4%] border-t border-dashed border-black/10" />
        </div>
      </div>
    </div>
  );
}
