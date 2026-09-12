import Image from "next/image";
import {
  CTA_BG_TEXT,
  CTA_GRAIN_LIGHT,
  CTA_MOBILE_BOTTOM_LEFT,
  CTA_MOBILE_BOTTOM_RIGHT,
  CTA_MOBILE_TOP_LEFT,
  CTA_MOBILE_TOP_RIGHT,
  CTA_GRAIN_WHITE,
} from "../lib/cta-assets";

/**
 * Portrait recomposition of the desktop CTA (see `CtaSection`) for the
 * `aspect-[390/572]` mobile box - a real, tappable version of the same
 * heading/button/footer, built from Figma node 6300:21121 (the mobile CTA
 * frame) rather than scaled off the desktop's fixed 860x378 card. Every
 * Figma px value converts to `cqw` as `px/390*100` against that same
 * 390px-wide reference (set as the container on the root below) so it
 * tracks the section's actual rendered width 1:1; everything positional
 * (image placement, the card, its footer row) uses plain percentages
 * against its own positioned ancestor, matching the frame's own layout.
 */
export function CtaSectionMobile() {
  return (
    <div className="absolute inset-0" style={{ containerType: "inline-size" }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[72%] overflow-hidden bg-[#eaebf1]">
        <Image
          src={CTA_GRAIN_WHITE}
          alt=""
          fill
          className="pointer-events-none object-cover mix-blend-multiply"
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] overflow-hidden bg-[#080808]">
        <div className="absolute inset-x-0 top-0 aspect-[4320/321] w-full">
          <Image src={CTA_BG_TEXT} alt="" fill className="pointer-events-none object-cover" />
        </div>
      </div>

      {/* The 4 corners below are direct pixel crops of the reference mobile
          design (see cta-assets.ts) placed at the exact boxes Figma node
          6300:21121 uses for them - all 4 are a fixed 195x234 (50% x
          40.9091% of the 390x572 frame), only the top/left offsets differ. */}
      <div className="pointer-events-none absolute top-[14.2045%] left-0 h-[40.9091%] w-[50%]">
        <Image src={CTA_MOBILE_TOP_LEFT} alt="" fill className="pointer-events-none object-cover" />
      </div>
      <div className="pointer-events-none absolute top-[11.4528%] left-[50%] h-[40.9091%] w-[50%]">
        <Image src={CTA_MOBILE_TOP_RIGHT} alt="" fill className="pointer-events-none object-cover" />
      </div>
      <div className="pointer-events-none absolute top-[52.3618%] left-0 h-[40.9091%] w-[50%]">
        <Image src={CTA_MOBILE_BOTTOM_LEFT} alt="" fill className="pointer-events-none object-cover" />
      </div>
      <div className="pointer-events-none absolute top-[43.75%] left-[50.2564%] h-[40.9091%] w-[49.7436%]">
        <Image src={CTA_MOBILE_BOTTOM_RIGHT} alt="" fill className="pointer-events-none object-cover" />
      </div>

      <div className="absolute top-[29.43%] right-[6.1538%] bottom-[24.77%] left-[6.1538%] border border-[#d4d4d4] bg-[#f4f4f4]">
        <Image src={CTA_GRAIN_LIGHT} alt="" fill className="pointer-events-none object-cover opacity-[0.11] mix-blend-multiply" />

        <div className="relative flex h-full w-full flex-col items-center gap-[6.1538cqw] px-[6.1538cqw] pt-[10.2564cqw] pb-[16.4103cqw]">
          <p className="relative w-full text-center font-serif text-[8.2051cqw] leading-none tracking-[-0.04em] text-black">
            Find out what your data is worth before you decide anything.
          </p>
          <a
            href="#value-my-data"
            className="group relative flex items-center overflow-hidden border border-[#141518] bg-[#141518] px-[5.1282cqw] py-[3.0769cqw]"
          >
            <div className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-active:opacity-30" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-[0.3cqw] opacity-0 transition-opacity duration-300 group-active:opacity-100">
              <Image src="/images/color-strip-left.svg" alt="" fill className="object-cover" />
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[0.3cqw] opacity-0 transition-opacity duration-300 group-active:opacity-100">
              <Image src="/images/color-strip-right.svg" alt="" fill className="object-cover" />
            </div>
            <span className="relative font-serif text-[3.0769cqw] leading-[0.8] tracking-wide text-white uppercase">
              Value my data
            </span>
          </a>

          <div className="pointer-events-none absolute bottom-[5.18%] left-[2.63%] flex items-center justify-between right-[3.22%]">
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
              <div className="relative flex items-center gap-[0.55cqw] border-[0.3px] border-[#898989] p-[0.55cqw]">
                <p className="font-mono text-[0.59cqw] leading-[1.1] tracking-[0.09em] text-[#898989] uppercase">
                  def load_dataset(source):
                  <br />
                  records = source.read()
                  <br />
                  return normalize(records)
                </p>
                <span className="absolute bottom-[0.4cqw] left-[0.1cqw] size-[0.33cqw] rounded-full bg-[#898989]" />
              </div>
              <div className="relative flex items-center gap-[0.55cqw] border-[0.3px] border-[#898989] p-[0.55cqw]">
                <p className="font-mono text-[0.59cqw] leading-[1.1] tracking-[0.09em] text-[#898989] uppercase">
                  def load_dataset(source):
                  <br />
                  records = source.read()
                  <br />
                  return normalize(records)
                </p>
                <span className="absolute bottom-[0.4cqw] left-[0.1cqw] size-[0.33cqw] rounded-full bg-[#898989]" />
              </div>
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
