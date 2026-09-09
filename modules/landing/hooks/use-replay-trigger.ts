"use client";

import { useEffect, useRef, useState } from "react";

export function useReplayTrigger(active: boolean) {
  const [playKey, setPlayKey] = useState(0);
  const wasActive = useRef(active);

  useEffect(() => {
    if (active && !wasActive.current) {
      setPlayKey((key) => key + 1);
    }
    wasActive.current = active;
  }, [active]);

  return playKey;
}
