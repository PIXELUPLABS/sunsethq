"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DEIDENTIFICATION_TABS, DEIDENTIFICATION_TAB_INTERVAL_MS } from "../lib/constants";

const GRAIN_TEXTURE = "/images/deidentification/grain-texture.webp";
const PATTERN_STRIP = "/images/deidentification/pattern-strip.png";

function StripProgressLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let frameId: number;
    const start = performance.now();

    const tick = (now: number) => {
      const ratio = Math.min((now - start) / DEIDENTIFICATION_TAB_INTERVAL_MS, 1);
      setProgress(ratio);

      if (ratio < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        onCompleteRef.current();
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 w-2 overflow-hidden">
      <Image
        src={PATTERN_STRIP}
        alt=""
        fill
        className="object-cover object-left"
        style={{ clipPath: `inset(0 0 ${(1 - progress) * 100}% 0)` }}
      />
    </div>
  );
}

export function DeidentificationTabs({
  activeIndex,
  onSelect,
  onComplete,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
  onComplete: () => void;
}) {
  return (
    <div className="flex w-full">
      {DEIDENTIFICATION_TABS.map((tab, index) => {
        const isActive = activeIndex === index;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onSelect(index)}
            className={`relative flex h-[72px] flex-1 cursor-pointer items-center justify-center gap-6 overflow-hidden border border-[#ccc] font-serif text-lg transition-colors ${
              isActive ? "bg-black text-[#f2f2f2]" : "bg-transparent text-black"
            }`}
          >
            {isActive ? (
              <>
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.11] mix-blend-multiply"
                  style={{
                    backgroundImage: `url(${GRAIN_TEXTURE})`,
                    backgroundSize: "432.6px 432.6px",
                  }}
                />
                <StripProgressLoader key={index} onComplete={onComplete} />
              </>
            ) : null}

            <span className="relative">{tab}</span>
          </button>
        );
      })}
    </div>
  );
}
