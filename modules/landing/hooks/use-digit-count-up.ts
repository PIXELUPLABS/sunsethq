"use client";

import { useEffect, useState } from "react";

const COUNT_UP_DURATION_MS = 500;
const DIGIT_STAGGER_MS = 120;

export function useDigitCountUp(target: number, start: boolean, digitIndex: number) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start || target === 0) return;

    let frame: number;
    let startTime: number | null = null;

    const timeout = setTimeout(() => {
      const tick = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / COUNT_UP_DURATION_MS, 1);
        setDisplay(Math.round(progress * target));

        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, digitIndex * DIGIT_STAGGER_MS);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [start, target, digitIndex]);

  return display;
}
