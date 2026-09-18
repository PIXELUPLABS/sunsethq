"use client";

import { useEffect, useRef } from "react";
import { SCROLL_PLAY_THRESHOLD } from "../lib/constants";

/**
 * Drives a muted inline video by its own visibility: it starts from the
 * beginning once `SCROLL_PLAY_THRESHOLD` of it is on screen, pauses once it
 * has fully left the viewport, and restarts from zero on the next entry.
 */
export function useInViewPlayback(src: string) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    let inView = false;
    const tryPlay = () => {
      if (inView) video.play().catch(() => {});
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= SCROLL_PLAY_THRESHOLD - 0.001) {
          if (inView) return;
          inView = true;
          video.currentTime = 0;
          tryPlay();
        } else if (!entry.isIntersecting && inView) {
          inView = false;
          video.pause();
        }
      },
      { threshold: [0, SCROLL_PLAY_THRESHOLD] }
    );

    observer.observe(video);
    // If the video is still loading when it comes into view, play once it can.
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    return () => {
      observer.disconnect();
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      video.pause();
    };
  }, [src]);

  return videoRef;
}
