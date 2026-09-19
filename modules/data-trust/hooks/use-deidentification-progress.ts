"use client";

import { useEffect, useRef, useState } from "react";
import { DEIDENTIFICATION_STEP_INTERVAL_MS } from "../lib/constants";

export function useDeidentificationProgress(active: boolean, onComplete: () => void) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => {
    if (!active) {
      const frameId = requestAnimationFrame(() => setProgress(0));
      return () => cancelAnimationFrame(frameId);
    }
    let frameId: number;
    const start = performance.now();
    const tick = (now: number) => {
      const ratio = Math.min((now - start) / DEIDENTIFICATION_STEP_INTERVAL_MS, 1);
      setProgress(ratio);
      if (ratio < 1) frameId = requestAnimationFrame(tick);
      else onCompleteRef.current();
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [active]);

  return active ? progress : 0;
}
