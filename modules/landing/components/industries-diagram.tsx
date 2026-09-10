"use client";

import Image from "next/image";
import { IndustryDiagramCard } from "./industry-diagram-card";
import {
  INDUSTRIES_GRID_LINES,
  INDUSTRY_DIAGRAM_CARDS,
} from "../lib/industries-diagram-assets";
import { useInView } from "../hooks/use-in-view";

// Uneven, hand-picked delays (not a simple index * N stagger) so the 8
// cards read as an organic, one-after-another reveal rather than a uniform
// sweep.
const CARD_REVEAL_DELAYS_MS = [0, 260, 90, 420, 150, 340, 60, 500] as const;

const CONNECTOR_BARS = [
  { left: 108, top: 94.25, width: 94, height: 99 },
  { left: 434, top: 94.25, width: 94, height: 99 },
  { left: 497, top: 248.25, width: 31, height: 127 },
  { left: 104, top: 245.25, width: 31, height: 127 },
  { left: 108, top: 423.25, width: 94, height: 99 },
  { left: 434, top: 423.25, width: 94, height: 99 },
  { left: 255, top: 13.25, width: 127, height: 127 },
  { left: 254, top: 468.25, width: 128, height: 54 },
] as const;

function pct(value: number) {
  return `${(value / 665) * 100}cqw`;
}

export function IndustriesDiagram() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <div
      ref={ref}
      className="relative aspect-[665/671] w-full max-w-[560px] overflow-hidden min-[1800px]:max-w-[630px]"
      style={{ containerType: "inline-size" }}
    >
      <Image
        src={INDUSTRIES_GRID_LINES}
        alt=""
        fill
        className="pointer-events-none object-fill"
      />

      {/* large background panel */}
      <div
        className="absolute border-[0.5px] border-dashed border-black/70"
        style={{
          left: pct(108),
          top: pct(94),
          width: pct(420),
          height: pct(428),
        }}
      >
        <Image
          src="/images/who-its-for-pattern.svg"
          alt=""
          fill
          className="pointer-events-none object-cover"
        />
      </div>

      {/* connector bars */}
      {CONNECTOR_BARS.map((bar, i) => (
        <div
          key={i}
          className="absolute bg-[#c0c0c8]"
          style={{
            left: pct(bar.left),
            top: pct(bar.top),
            width: pct(bar.width),
            height: pct(bar.height),
          }}
        >
          <Image
            src="/images/texture-grain-white.png"
            alt=""
            fill
            className="pointer-events-none object-cover opacity-[0.11] mix-blend-multiply"
          />
        </div>
      ))}

      {/* center gradient square */}
      <div
        className="absolute border-[0.5px] border-dashed border-black/70 bg-[#dddee4]"
        style={{ left: pct(202.5), top: pct(194.25), width: pct(232), height: pct(232) }}
      >
        <Image
          src="/images/texture-grain-white.png"
          alt=""
          fill
          className="pointer-events-none object-cover opacity-[0.11] mix-blend-multiply"
        />
        <div
          className="absolute overflow-hidden"
          style={{ left: pct(19.5), top: pct(19.5), width: pct(192), height: pct(192) }}
        >
          <Image
            src="/images/who-its-for-blue-bg.svg"
            alt=""
            fill
            className="pointer-events-none object-cover"
          />
          <Image
            src="/images/texture-grain-white.png"
            alt=""
            fill
            className="pointer-events-none object-cover mix-blend-soft-light"
          />
        </div>
      </div>

      {INDUSTRY_DIAGRAM_CARDS.map((card, i) => (
        <IndustryDiagramCard
          key={card.label}
          {...card}
          start={inView}
          delayMs={CARD_REVEAL_DELAYS_MS[i]}
        />
      ))}
    </div>
  );
}
