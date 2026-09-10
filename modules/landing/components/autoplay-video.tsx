"use client";

import { useEffect, useRef } from "react";

/**
 * A muted video that plays once and stops on its last frame. Calls
 * `.play()` explicitly on mount in addition to the `autoPlay` attribute —
 * some browsers silently ignore `autoPlay` when the element is inserted via
 * React rather than present in the initial HTML, so the attribute alone
 * isn't reliable.
 */
export function AutoplayVideo({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      playsInline
      className={className}
    />
  );
}
