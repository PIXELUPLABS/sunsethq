"use client";

import { useEffect, useState } from "react";

export function useCrossfadeLayers<T>(activeKey: T, durationMs: number) {
  const [layerKeys, setLayerKeys] = useState<T[]>([activeKey]);
  const [trackedKey, setTrackedKey] = useState(activeKey);

  if (activeKey !== trackedKey) {
    setTrackedKey(activeKey);
    setLayerKeys((current) => [...current, activeKey]);
  }

  useEffect(() => {
    if (layerKeys.length <= 1) return;

    const timeout = setTimeout(() => {
      setLayerKeys((current) => current.slice(-1));
    }, durationMs);

    return () => clearTimeout(timeout);
  }, [layerKeys, durationMs]);

  return layerKeys;
}
