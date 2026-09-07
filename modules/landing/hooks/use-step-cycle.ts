"use client";

import { useCallback, useEffect, useState } from "react";

export function useStepCycle(length: number, intervalMs: number) {
  const [activeIndex, setActiveIndexState] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndexState((current) => (current + 1) % length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [length, intervalMs, activeIndex]);

  const setActiveIndex = useCallback((index: number) => {
    setActiveIndexState(index);
  }, []);

  return { activeIndex, setActiveIndex };
}
