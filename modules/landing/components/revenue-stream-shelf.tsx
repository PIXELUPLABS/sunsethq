import Image from "next/image";
import { RevenueStreamShelfItem } from "./revenue-stream-shelf-item";
import {
  REVENUE_STREAM_DASH_TICK_LEFT,
  REVENUE_STREAM_DASH_TICK_RIGHT,
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
      className="relative aspect-[1296/500] w-full overflow-hidden"
      style={{ containerType: "inline-size" }}
    >
      {/* floor panel */}
      <Image
        src={REVENUE_STREAM_PANEL_FLOOR}
        alt=""
        width={1147}
        height={95.5}
        className="absolute left-[5.787cqw] top-[31.2515cqw] h-[7.3688cqw] w-[88.5031cqw] max-w-none"
      />

      {/* white card with the two-column data list */}
      <div className="absolute top-1/2 left-1/2 h-[23.9198cqw] w-[71.6049cqw] -translate-x-1/2 -translate-y-1/2 bg-white">
        <Image
          src="/images/texture-grain-white.png"
          alt=""
          fill
          className="pointer-events-none object-cover mix-blend-multiply"
        />
        <div className="relative grid h-full grid-cols-2 grid-rows-5">
          {REVENUE_STREAM_ITEMS.map((item) => (
            <RevenueStreamShelfItem key={item.label} {...item} />
          ))}
        </div>
      </div>

      {/* dashed perspective wireframe */}
      <Image
        src={REVENUE_STREAM_WIREFRAME}
        alt=""
        width={1297}
        height={501}
        className="absolute inset-0 h-full w-full max-w-none"
      />

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
      <p className="absolute top-[37.5386cqw] left-[82.6389cqw] -translate-y-1/2 font-mono text-[1.2346cqw] tracking-[-0.0086cqw] whitespace-nowrap text-[#2c2c2c] uppercase">
        Revenue stream
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

      {/* room walls (painted last so they sit above the wireframe/patterns) */}
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
        className="-scale-y-100 absolute top-[2.3148cqw] left-[5.787cqw] h-[5.0154cqw] w-[88.5031cqw] max-w-none"
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
