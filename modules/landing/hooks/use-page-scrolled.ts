"use client";

import { useEffect, useState } from "react";

/**
 * Whether the page has been scrolled down past `threshold` px, plus the raw
 * scroll position - the boolean drives discrete fades/swaps, the raw value
 * lets scroll-linked motion (e.g. a shift that tracks the scroll itself
 * rather than snapping in via a CSS transition) stay perfectly in sync with
 * the user's actual scroll gesture.
 */
export function usePageScrolled(threshold = 10) {
  const [state, setState] = useState({ scrolled: false, scrollY: 0 });

  useEffect(() => {
    let frameId = 0;

    const measure = () => {
      frameId = 0;
      const scrollY = window.scrollY;
      setState({ scrolled: scrollY > threshold, scrollY });
    };

    const onScroll = () => {
      if (frameId) return;
      frameId = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [threshold]);

  return state;
}
