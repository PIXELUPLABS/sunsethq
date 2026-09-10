"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks how far an element has scrolled through a window of the viewport,
 * as a 0-1 value — for scroll-scrubbed reveals instead of a one-shot
 * IntersectionObserver trigger.
 *
 * `startAt`/`endAt` are fractions of the viewport height, measured from the
 * top: progress is 0 while the element's top edge is at or below
 * `startAt * viewportHeight`, and 1 once it has scrolled up past
 * `endAt * viewportHeight`.
 */
export function useScrollProgress<T extends HTMLElement>({
  startAt = 0.92,
  endAt = 0.55,
}: { startAt?: number; endAt?: number } = {}) {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frameId = 0;

    const measure = () => {
      frameId = 0;
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const startPx = viewportHeight * startAt;
      const endPx = viewportHeight * endAt;
      const ratio = (startPx - rect.top) / (startPx - endPx);
      setProgress(Math.min(1, Math.max(0, ratio)));
    };

    const onScroll = () => {
      if (frameId) return;
      frameId = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [startAt, endAt]);

  return { ref, progress };
}
