"use client";

import { useEffect, useRef, useState } from "react";

type UseInViewOptions = {
  /** Fraction of the element that must be visible before it counts as in view. */
  threshold?: number;
  rootMargin?: string;
  /**
   * `true` (default) latches on the first entry. `false` keeps tracking:
   * in view once `threshold` is reached, out of view only once the element
   * has fully left the viewport, so a partly visible element never flips.
   */
  once?: boolean;
};

export function useInView<T extends HTMLElement>({
  threshold = 0,
  rootMargin,
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // A hair of tolerance: the ratio reported at the crossing can sit a
        // rounding error below the threshold it just crossed.
        if (entry.isIntersecting && entry.intersectionRatio >= threshold - 0.001) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once && !entry.isIntersecting) {
          setInView(false);
        }
      },
      { threshold: threshold > 0 ? [0, threshold] : 0, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
