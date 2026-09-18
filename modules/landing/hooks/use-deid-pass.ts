import { useEffect, useRef } from "react";
import { mountDeidPass, type DeidPassOptions } from "../lib/deid-pass-engine";

/**
 * Mounts the de-identification scene into the referenced element and tears
 * it down on unmount. The engine is imperative (one rAF loop over ~700 nodes),
 * so React owns only the shell; returning the teardown from the effect also
 * covers Fast Refresh in dev.
 */
export function useDeidPass({ assetBase }: DeidPassOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return mountDeidPass(ref.current, { assetBase });
  }, [assetBase]);

  return ref;
}
