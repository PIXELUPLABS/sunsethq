"use client";

import { useEffect, useRef } from "react";

/**
 * A muted video that plays once and stops on its last frame. Calls
 * `.play()` explicitly on mount in addition to the `autoPlay` attribute —
 * some browsers silently ignore `autoPlay` when the element is inserted via
 * React rather than present in the initial HTML, so the attribute alone
 * isn't reliable.
 *
 * The mount-time `.play()` call can lose the race against the video's own
 * buffering on slower mobile connections: at that instant `readyState` is
 * still `HAVE_NOTHING`, and some mobile browsers fall back to showing the
 * paused/play-button state instead of queuing the play. `muted` is also set
 * imperatively (not just via the JSX attribute) since a couple of mobile
 * browsers check the live property rather than the initial attribute when
 * deciding whether to honor autoplay. `canplay`/`loadeddata` retry the play
 * once the video actually has data to play.
 */
export function AutoplayVideo({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const tryPlay = () => video.play().catch(() => {});

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
      className={className}
    />
  );
}
