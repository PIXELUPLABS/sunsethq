"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks the pointer position within a container element as an eased -1..1
 * offset on each axis, for parallaxing a single child element. Eases back to
 * (0, 0) on pointer leave. Only active on hover-capable, fine-pointer
 * devices (desktop mice) — touch devices never attach the listeners.
 */
export function useElementParallax<T extends HTMLElement>({ ease = 0.08 } = {}) {
  const containerRef = useRef<T>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frameId = 0;

    const step = () => {
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      setOffset({ x: currentX, y: currentY });

      const settled =
        Math.abs(targetX - currentX) < 0.0005 && Math.abs(targetY - currentY) < 0.0005;
      frameId = settled ? 0 : requestAnimationFrame(step);
    };

    const requestStep = () => {
      if (!frameId) frameId = requestAnimationFrame(step);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      requestStep();
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      requestStep();
    };

    node.addEventListener("pointermove", onPointerMove);
    node.addEventListener("pointerleave", onPointerLeave);

    return () => {
      node.removeEventListener("pointermove", onPointerMove);
      node.removeEventListener("pointerleave", onPointerLeave);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [ease]);

  return { containerRef, offset };
}
