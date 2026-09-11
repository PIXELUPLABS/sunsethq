import Image from "next/image";
import {
  REVENUE_STREAM_FLOOR_BAND,
  REVENUE_STREAM_MOBILE_BAND,
  REVENUE_STREAM_MOBILE_ITEMS,
  REVENUE_STREAM_MOBILE_WALL_LEFT,
  REVENUE_STREAM_MOBILE_WALL_RIGHT,
} from "../lib/revenue-stream-assets";

/**
 * Portrait version of the shelf for mobile. The desktop composition is laid
 * out for a 1296x674 landscape box with a two-column card; the mobile design
 * is a 366x460 box with the rows stacked into one column, so the geometry is
 * re-derived rather than scaled. Every length is in cqw against a 366px-wide
 * container, matching the design's own coordinates 1:1 at 390px.
 */
export function RevenueStreamShelfMobile() {
  return (
    <div className="mx-auto w-full">
      <p className="mb-1.5 px-3 font-mono text-[8px] tracking-[-0.06px] text-black/60 uppercase">
        Historical operating data
      </p>
      <div
        className="relative aspect-[366/436] w-full"
        style={{ containerType: "inline-size" }}
      >
        {/* room: top cap, two side walls, bottom cap */}
        <Image
          src={REVENUE_STREAM_MOBILE_BAND}
          alt=""
          width={346}
          height={32}
          className="-scale-y-100 absolute top-[5.4645cqw] left-[2.7322cqw] h-[8.7432cqw] w-[94.5355cqw] max-w-none"
        />
        <Image
          src={REVENUE_STREAM_MOBILE_WALL_LEFT}
          alt=""
          width={40}
          height={378}
          className="absolute top-[5.4645cqw] left-[2.7322cqw] h-[103.2787cqw] w-[10.929cqw] max-w-none rotate-180"
        />
        <Image
          src={REVENUE_STREAM_MOBILE_WALL_RIGHT}
          alt=""
          width={40}
          height={378}
          className="absolute top-[5.4645cqw] left-[86.3388cqw] h-[103.2787cqw] w-[10.929cqw] max-w-none"
        />
        <Image
          src={REVENUE_STREAM_MOBILE_BAND}
          alt=""
          width={346}
          height={32}
          className="absolute top-[100cqw] left-[2.7322cqw] h-[8.7432cqw] w-[94.5355cqw] max-w-none"
        />

        {/* blue floor, bleeding past the room like it does on desktop */}
        <Image
          src={REVENUE_STREAM_FLOOR_BAND}
          alt=""
          width={1874}
          height={205}
          className="absolute top-[103cqw] left-1/2 z-10 h-[16cqw] w-auto max-w-none -translate-x-1/2 scale-x-90"
        />

        {/* the stacked data rows */}
        <div className="absolute top-[14.2077cqw] left-[13.6612cqw] h-[85.7923cqw] w-[72.6776cqw] bg-white">
          <Image
            src="/images/texture-grain-white.png"
            alt=""
            fill
            className="pointer-events-none object-cover mix-blend-multiply"
          />
          <div className="relative flex h-full flex-col">
            {REVENUE_STREAM_MOBILE_ITEMS.map((item) => (
              <div
                key={item.label}
                className="flex flex-1 items-center gap-[2.7322cqw] border-[0.5px] border-dashed border-[#a8a8a8] px-[2.7322cqw]"
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={14}
                  height={14}
                  className="h-[3.8251cqw] w-[3.8251cqw] shrink-0"
                />
                <p className="font-mono text-[3.0055cqw] leading-[1.3] tracking-[-0.0156cqw] whitespace-nowrap text-black uppercase">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
