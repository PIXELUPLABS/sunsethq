"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

/** Max rotateX/rotateY at the cursor's furthest point from center - kept
 * small deliberately (a "slight" pointer-follow, per the brief), not the
 * much larger tilt a generic tilt.js-style effect defaults to. */
const MAX_TILT_DEG = 8;

/**
 * Drives the collage's per-photo tilt/lift via CSS custom properties
 * written straight to each photo's own `style` (see `.team-collage-photo`
 * in `globals.css`) instead of React state, so a mousemove doesn't
 * re-render all eight photos on every frame - only entering/leaving a
 * photo touches state, to raise it above its neighbors via z-index.
 *
 * Pointer tilt is skipped entirely on coarse/touch pointers (checked once
 * via `matchMedia`, not per-event) - touch has no continuous pointer
 * position to follow, and forcing it off leaves the base rotation/hover
 * lift+scale still available there through CSS `:active` if ever wanted.
 */
export function useTeamCollageTilt() {
  const photoRefs = useRef(new Map<string, HTMLDivElement>());
  const [activeId, setActiveId] = useState<string | null>(null);
  const hasFinePointerRef = useRef(false);

  useEffect(() => {
    hasFinePointerRef.current = window.matchMedia("(pointer: fine)").matches;
  }, []);

  const registerPhoto = useCallback(
    (id: string) => (node: HTMLDivElement | null) => {
      if (node) photoRefs.current.set(id, node);
      else photoRefs.current.delete(id);
    },
    [],
  );

  const handlePointerEnter = useCallback((id: string) => {
    setActiveId(id);
    if (!hasFinePointerRef.current) return;

    const node = photoRefs.current.get(id);
    node?.style.setProperty("--tilt-lift", "-8px");
    node?.style.setProperty("--tilt-scale", "1.03");
  }, []);

  const handlePointerMove = useCallback(
    (id: string) => (event: MouseEvent<HTMLDivElement>) => {
      if (!hasFinePointerRef.current) return;

      const node = photoRefs.current.get(id);
      if (!node) return;

      const rect = node.getBoundingClientRect();
      // -0.5..0.5 across each axis, cursor relative to this photo alone -
      // surrounding photos never read this, so they can't move.
      const normX = (event.clientX - rect.left) / rect.width - 0.5;
      const normY = (event.clientY - rect.top) / rect.height - 0.5;

      node.style.setProperty("--tilt-y", `${normX * MAX_TILT_DEG * 2}deg`);
      node.style.setProperty("--tilt-x", `${-normY * MAX_TILT_DEG * 2}deg`);
    },
    [],
  );

  const handlePointerLeave = useCallback((id: string) => {
    setActiveId((current) => (current === id ? null : current));

    const node = photoRefs.current.get(id);
    if (!node) return;

    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
    node.style.setProperty("--tilt-lift", "0px");
    node.style.setProperty("--tilt-scale", "1");
  }, []);

  return { activeId, registerPhoto, handlePointerEnter, handlePointerMove, handlePointerLeave };
}
