"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

const MAX_TILT_DEG = 8;

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
