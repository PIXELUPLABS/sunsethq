"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hides the navbar the instant the page scrolls down (it just goes away,
 * rather than staying stuck to the top), and brings it back - sliding down
 * from the top - once the user has scrolled back up by at least this
 * fraction of the page's total scrollable height. Always visible at the
 * very top of the page.
 */
const REVEAL_THRESHOLD_RATIO = 0.015;

export function useNavbarVisibility() {
  const [visible, setVisible] = useState(true);
  const lastYRef = useRef(0);
  const upAccumRef = useRef(0);
  const frameIdRef = useRef(0);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const measure = () => {
      frameIdRef.current = 0;
      const currentY = window.scrollY;
      const delta = currentY - lastYRef.current;
      lastYRef.current = currentY;

      if (currentY <= 0) {
        upAccumRef.current = 0;
        setVisible(true);
        return;
      }

      if (delta > 0) {
        upAccumRef.current = 0;
        setVisible(false);
      } else if (delta < 0) {
        upAccumRef.current += -delta;
        const threshold = document.documentElement.scrollHeight * REVEAL_THRESHOLD_RATIO;
        if (upAccumRef.current >= threshold) {
          setVisible(true);
        }
      }
    };

    const onScroll = () => {
      if (frameIdRef.current) return;
      frameIdRef.current = requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    };
  }, []);

  return visible;
}
