import Image from "next/image";
import {
  DOCS_PANEL_LINES,
  DOCS_PANEL_OVERLAY_1,
  DOCS_PANEL_OVERLAY_2,
  PANEL_GRAIN,
} from "../lib/assets";

const SWATCH_BORDER = "border-t border-r border-l border-dashed border-[rgba(232,232,232,0.6)]";

function CategoryLabel({ code, label, top }: { code: string; label: string; top: number }) {
  return (
    <p
      className="absolute left-10 -translate-y-1/2 font-serif-regular text-[20.845px] leading-[1.04] tracking-[-0.6253px] text-[#fafafa]"
      style={{ top }}
    >
      {label}
      <br />/ {code}
    </p>
  );
}

/**
 * The "CODE / LOGS / DOCS" illustration on the referral payouts section,
 * ported 1:1 from Figma (node 7170:28661). Desktop-only, like the rest of
 * this site's fixed-position decorative diagrams.
 */
export function ReferralCategoryPanel() {
  return (
    <div className="relative hidden bg-black/10 lg:block lg:h-[595px] lg:w-[637px] lg:shrink-0">
      <CategoryLabel code="01" label="CODE" top={64.94} />
      <div
        className={`absolute overflow-hidden bg-white ${SWATCH_BORDER}`}
        style={{ left: 151, top: 43, width: 208.593, height: 153.088 }}
      >
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{ backgroundImage: `url(${PANEL_GRAIN})`, backgroundSize: "905.726px 679.294px" }}
        />
      </div>

      <CategoryLabel code="02" label="LOGS" top={244.94} />
      <div
        className={`absolute overflow-hidden bg-[#4ed3cf] ${SWATCH_BORDER}`}
        style={{ left: 151, top: 223, width: 281.109, height: 152.193 }}
      >
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{ backgroundImage: `url(${PANEL_GRAIN})`, backgroundSize: "905.726px 679.294px" }}
        />
      </div>

      <CategoryLabel code="03" label="DOCS" top={423.94} />
      <div
        className={`absolute overflow-hidden ${SWATCH_BORDER}`}
        style={{ left: 151, top: 402, width: 452.997, height: 151.297 }}
      >
        <div
          className="absolute -translate-x-1/2"
          style={{
            left: "calc(50% + 2.38px)",
            top: -22.41,
            width: 551.927,
            height: 167.465,
            backgroundImage:
              "linear-gradient(269.0727505382672deg, rgb(20, 125, 186) 11.124%, rgb(28, 165, 245) 58.002%)",
          }}
        />
        <div
          className="absolute mix-blend-overlay"
          style={{ left: -42.29, top: -57.42, width: 1961, height: 1401 }}
        >
          <div
            className="absolute inset-0 opacity-50"
            style={{ backgroundImage: `url(${DOCS_PANEL_OVERLAY_1})`, backgroundSize: "185px 185px" }}
          />
        </div>
        <div
          className="absolute overflow-hidden"
          style={{ left: 0, top: 0, width: 438.711, height: 258.273 }}
        >
          <div
            className="absolute overflow-hidden"
            style={{ left: -183.98, top: 0, width: 622.687, height: 255.915 }}
          >
            <div
              className="absolute -translate-x-1/2 bg-gradient-to-r from-[#133264] from-[2.261%] to-[#147dba] to-[67.993%]"
              style={{ left: "calc(50% + 90.81px)", top: -23.59, width: 443.428, height: 290.115 }}
            />
          </div>
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 mix-blend-overlay"
            style={{ left: "calc(50% + 2.36px)", top: "calc(50% + 1.18px)" }}
          >
            <Image src={DOCS_PANEL_LINES} alt="" width={434} height={256} />
          </div>
        </div>
        <div
          className="absolute mix-blend-overlay"
          style={{
            left: -42.29,
            top: -57.42,
            width: 1961,
            height: 1401,
            backgroundImage: `url(${DOCS_PANEL_OVERLAY_2})`,
            backgroundSize: "155.4px 155.4px",
          }}
        />
      </div>
    </div>
  );
}
