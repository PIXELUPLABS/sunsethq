"use client";

import { useEffect, useState } from "react";

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
