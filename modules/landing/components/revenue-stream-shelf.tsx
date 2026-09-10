import Image from "next/image";
import { RevenueStreamShelfItem } from "./revenue-stream-shelf-item";
import {
  REVENUE_STREAM_DASH_TICK_LEFT,
  REVENUE_STREAM_DASH_TICK_RIGHT,
  REVENUE_STREAM_FLOOR_BAND,
  REVENUE_STREAM_ITEMS,
  REVENUE_STREAM_PANEL_FLOOR,
  REVENUE_STREAM_PANEL_SIDE_LEFT,
  REVENUE_STREAM_PANEL_SIDE_RIGHT,
  REVENUE_STREAM_PANEL_TOP,
  REVENUE_STREAM_PATTERN_LEFT,
  REVENUE_STREAM_PATTERN_RIGHT,
  REVENUE_STREAM_WIREFRAME,
} from "../lib/revenue-stream-assets";

export function RevenueStreamShelf() {
  return (
    <div
      className="relative aspect-[1296/674] w-full"
      style={{ containerType: "inline-size" }}
    >
      {/* dashed perspective wireframe (only the side notches that overlap the
          zigzag side patterns below are clipped out, so the top/bottom end
          caps — including the line above "Historical operating data" —
          still reach the side dashed lines) */}
      <Image
        src={REVENUE_STREAM_WIREFRAME}
        alt=""
        width={1297}
        height={515}
        className="absolute top-0 left-0 h-[39.7639cqw] w-full max-w-none"
        style={{
          clipPath:
            "polygon(0% 0%, 100% 0%, 100% 3%, 94.2901% 3%, 94.2901% 6.15%, 85.8025% 6.15%, 85.8025% 91.2833%, 100% 91.2833%, 100% 100%, 0% 100%, 0% 91.2833%, 14.1975% 91.2833%, 14.1975% 6.15%, 5.787% 6.15%, 5.787% 3%, 0% 3%)",
        }}
      />

      {/* full-bleed floor color (navy + cyan bands, center dash tick baked in) extending past the box below the card */}
      <Image
        src={REVENUE_STREAM_FLOOR_BAND}
        alt=""
        width={1874}
        height={205}
        className="absolute top-[36.2654cqw] left-1/2 z-10 h-[15.8179cqw] w-auto max-w-none -translate-x-1/2"
      />

      {/* white card with the two-column data list */}
      <div className="absolute top-[7.3302cqw] left-[14.1975cqw] h-[23.9198cqw] w-[71.6049cqw] bg-white">
        <Image
          src="/images/texture-grain-white.png"
          alt=""
          fill
          className="pointer-events-none object-cover mix-blend-multiply"
        />
        <div className="relative grid h-full grid-cols-2 grid-rows-5 border-t border-l border-dashed border-[#a8a8a8]">
          {REVENUE_STREAM_ITEMS.map((item, index) => (
            <RevenueStreamShelfItem
              key={item.label}
              {...item}
              isLastRow={index >= REVENUE_STREAM_ITEMS.length - 2}
            />
          ))}
        </div>
      </div>

      {/* zigzag side patterns */}
      <Image
        src={REVENUE_STREAM_PATTERN_LEFT}
        alt=""
        width={184}
        height={440}
        className="absolute top-[2.3148cqw] left-0 h-[33.9506cqw] w-[14.1975cqw] max-w-none"
      />
      <Image
        src={REVENUE_STREAM_PATTERN_RIGHT}
        alt=""
        width={184}
        height={440}
        className="-scale-x-100 absolute top-[2.3148cqw] left-[85.8025cqw] h-[33.9506cqw] w-[14.1975cqw] max-w-none"
      />

      <p className="absolute top-[1.3503cqw] left-[6.6358cqw] -translate-y-1/2 font-mono text-[1.2346cqw] tracking-[-0.0086cqw] whitespace-nowrap text-black/60 uppercase">
        Historical operating data
      </p>

      {/* short vertical dash ticks */}
      <Image
        src={REVENUE_STREAM_DASH_TICK_LEFT}
        alt=""
        width={1}
        height={377}
        className="absolute top-[4.7855cqw] left-[9.8765cqw] h-[29.0895cqw] w-px max-w-none"
      />
      <Image
        src={REVENUE_STREAM_DASH_TICK_RIGHT}
        alt=""
        width={1}
        height={381}
        className="absolute top-[4.6312cqw] left-[90.4321cqw] h-[29.3981cqw] w-px max-w-none"
      />

      {/* room walls (painted last so they sit above the wireframe/patterns/floor bleed) */}
      <Image
        src={REVENUE_STREAM_PANEL_SIDE_RIGHT}
        alt=""
        width={109.5}
        height={440}
        className="-scale-y-100 absolute top-[2.3148cqw] left-[85.7253cqw] h-[33.9506cqw] w-[8.4491cqw] max-w-none"
      />
      <Image
        src={REVENUE_STREAM_PANEL_TOP}
        alt=""
        width={1147}
        height={65}
        className="-scale-y-100 translate-y-[1px] absolute top-[2.3148cqw] left-[5.787cqw] h-[5.0154cqw] w-[88.5031cqw] max-w-none"
      />
      <Image
        src={REVENUE_STREAM_PANEL_FLOOR}
        alt=""
        width={1147}
        height={95.5}
        className="absolute left-[5.787cqw] top-[31.2515cqw] h-[7.3688cqw] w-[88.5031cqw] max-w-none"
      />
      <Image
        src={REVENUE_STREAM_PANEL_SIDE_LEFT}
        alt=""
        width={109.5}
        height={440}
        className="absolute top-[2.3148cqw] left-[5.8256cqw] h-[33.9506cqw] w-[8.4491cqw] max-w-none rotate-180"
      />
    </div>
  );
}
