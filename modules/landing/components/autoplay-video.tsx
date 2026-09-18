"use client";

import { useInViewPlayback } from "../hooks/use-in-view-playback";

/** A muted inline video that plays only while scrolled into view. */
export function AutoplayVideo({ src, className }: { src: string; className?: string }) {
  const videoRef = useInViewPlayback(src);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      preload="auto"
      className={className}
    />
  );
}
