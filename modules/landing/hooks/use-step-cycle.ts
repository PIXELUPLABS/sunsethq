"use client";

import { useCallback, useState } from "react";

export function useStepCycle(length: number) {
  const [activeIndex, setActiveIndexState] = useState(0);

  const advance = useCallback(() => {
    setActiveIndexState((current) => (current + 1) % length);
  }, [length]);

  const setActiveIndex = useCallback((index: number) => {
    setActiveIndexState(index);
  }, []);

  return { activeIndex, setActiveIndex, advance };
}
