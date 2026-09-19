"use client";

import { useCallback, useEffect, useState } from "react";
import { DEIDENTIFICATION_TABS, HOW_IT_WORKS_STEP_INTERVAL_MS, SCROLL_PLAY_THRESHOLD } from "../lib/constants";
import { useInView } from "./use-in-view";
import { useStepCycle } from "./use-step-cycle";

export function useDeidentificationCycle() {
  const { activeIndex, setActiveIndex, advance, reset } = useStepCycle(DEIDENTIFICATION_TABS.length);
  const { ref, inView } = useInView<HTMLElement>({ threshold: SCROLL_PLAY_THRESHOLD, once: false });
  const [selectionVersion, setSelectionVersion] = useState(0);

  useEffect(() => {
    if (inView) reset();
  }, [inView, reset]);

  useEffect(() => {
    if (!inView) return;
    const timer = window.setTimeout(advance, HOW_IT_WORKS_STEP_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, advance, inView, selectionVersion]);

  const onSelect = useCallback((index: number) => {
    setActiveIndex(index);
    // Clicking even the current tab restarts its full reading interval.
    setSelectionVersion((version) => version + 1);
  }, [setActiveIndex]);

  return { ref, activeIndex, onSelect, inView, selectionVersion };
}
