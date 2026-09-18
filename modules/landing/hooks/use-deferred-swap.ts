"use client";

import { useEffect, useState } from "react";

/**
 * Holds a value back for `delayMs` and reports the wait, so a caller can hide
 * an element, let it move, and show it again. Used where a layout change is
 * instant and would otherwise read as a jump.
 */
export function useDeferredSwap<T>(value: T, delayMs: number) {
  const [settled, setSettled] = useState(value);
  const [tracked, setTracked] = useState(value);
  const [swapping, setSwapping] = useState(false);

  // Caught during render rather than in an effect, so the element is already
  // hidden in the same paint that starts the swap.
  if (value !== tracked) {
    setTracked(value);
    setSwapping(true);
  }

  useEffect(() => {
    if (!swapping) return;

    const timeout = setTimeout(() => {
      setSettled(value);
      setSwapping(false);
    }, delayMs);

    return () => clearTimeout(timeout);
  }, [swapping, value, delayMs]);

  return { settled, swapping };
}
