"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useScrollProgress } from "@/modules/landing/hooks/use-scroll-progress";

// Must match the growth card's fixed height (h-60) plus the column's gap (gap-5).
const CARD_STEP_PX = 260;
// Vertical offset left visible per card once fully stacked, so the pile still
// reads as layered cards instead of hiding everything under the top card.
const STACK_PEEK_PX = 12;

/**
 * Pins the section in place while the user scrolls through it, converging a
 * column of naturally-spaced cards into a stacked pile. Every card moves at
 * once, continuously, off the same scroll progress — a card further down the
 * list just has further to travel, so they all land in the stack together.
 * Only active at desktop widths, and disabled entirely under
 * prefers-reduced-motion — both fall back to the cards' normal spaced layout.
 */
export function useCardStackScroll(cardCount: number) {
  const { ref: pinRef, progress } = useScrollProgress<HTMLDivElement>({
    startAt: 0,
    endAt: -2.2,
  });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const getCardStyle = (index: number): CSSProperties => {
    if (!enabled || index === 0 || cardCount <= 1) {
      return { zIndex: 10 + index };
    }

    const naturalOffset = index * CARD_STEP_PX;
    const stackedOffset = index * STACK_PEEK_PX;
    const translateY = -(naturalOffset - stackedOffset) * progress;

    return { transform: `translateY(${translateY}px)`, zIndex: 10 + index };
  };

  return { pinRef, getCardStyle, enabled };
}
