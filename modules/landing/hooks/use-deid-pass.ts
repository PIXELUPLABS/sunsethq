import { useEffect, useRef } from "react";
import type { DeidPassOptions } from "../lib/deid-pass-engine";

/**
 * Mounts the de-identification scene into the referenced element and tears
 * it down on unmount. The engine is imperative (one rAF loop over ~700 nodes),
 * so React owns only the shell; returning the teardown from the effect also
 * covers Fast Refresh in dev.
 */
export function useDeidPass({ assetBase }: DeidPassOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    let generation = 0;
    let teardown: (() => void) | undefined;
    const sync = () => {
      const current = ++generation;
      teardown?.();
      teardown = undefined;
      if (!desktop.matches) return;
      // Do not download or construct the desktop-only scene on mobile.
      void import("../lib/deid-pass-engine").then(({ mountDeidPass }) => {
        if (current === generation) teardown = mountDeidPass(element, { assetBase });
      });
    };
    sync();
    desktop.addEventListener("change", sync);
    return () => {
      generation++;
      desktop.removeEventListener("change", sync);
      teardown?.();
    };
  }, [assetBase]);

  return ref;
}
