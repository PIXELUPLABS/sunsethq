import { useEffect, useRef } from "react";

export const REPLAY_WORDMARK_VB_WIDTH = 1297;
export const REPLAY_WORDMARK_VB_HEIGHT = 337;
export const REPLAY_WORDMARK_GLOW_BLUR_PX = 60;
export const REPLAY_WORDMARK_GLOW_RGBA = "rgba(45,45,45,.55)";

const BAND_WIDTH = 334;
const ANGLE_DEG = -83;
const EASE = 0.44;

function easeInOutCubic(p: number) {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

/**
 * Drives the "Replay" wordmark's shimmer: a gradient band that follows the
 * pointer on hover, and a one-shot sweep the first time the mark scrolls
 * into view. Returns refs to attach to the wrapping div, the svg, and the
 * shimmer gradient.
 */
export function useReplayWordmark() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gradRef = useRef<SVGLinearGradientElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    const grad = gradRef.current;
    if (!wrap || !svg || !grad) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const angle = (ANGLE_DEG * Math.PI) / 180;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    const current = { x: REPLAY_WORDMARK_VB_WIDTH * 0.5, y: REPLAY_WORDMARK_VB_HEIGHT * 0.5 };
    const target = { ...current };
    let hovering = false;
    let raf: number | null = null;

    function setGradient(cx: number, cy: number) {
      const half = BAND_WIDTH / 2;
      grad!.setAttribute("x1", String(cx - dx * half - dy * REPLAY_WORDMARK_VB_HEIGHT));
      grad!.setAttribute("y1", String(cy - dy * half + dx * REPLAY_WORDMARK_VB_HEIGHT));
      grad!.setAttribute("x2", String(cx + dx * half + dy * REPLAY_WORDMARK_VB_HEIGHT));
      grad!.setAttribute("y2", String(cy + dy * half - dx * REPLAY_WORDMARK_VB_HEIGHT));
    }

    function loop() {
      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      setGradient(current.x, current.y);
      if (
        hovering ||
        Math.abs(target.x - current.x) > 0.4 ||
        Math.abs(target.y - current.y) > 0.4
      ) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }

    function startLoop() {
      if (!raf) raf = requestAnimationFrame(loop);
    }

    function updateFromEvent(e: PointerEvent) {
      const rect = svg!.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      target.x = Math.max(0, Math.min(1, px)) * REPLAY_WORDMARK_VB_WIDTH;
      target.y = Math.max(0, Math.min(1, py)) * REPLAY_WORDMARK_VB_HEIGHT;
      startLoop();
    }

    // One eased traversal across the whole mark, used for the one-shot
    // reveal the first time the wordmark scrolls into view.
    function playSweep(duration: number, amplitude: number) {
      if (reduced) {
        wrap!.classList.add("is-hovering");
        setGradient(REPLAY_WORDMARK_VB_WIDTH * 0.5, REPLAY_WORDMARK_VB_HEIGHT * 0.5);
        window.setTimeout(() => wrap!.classList.remove("is-hovering"), 300);
        return;
      }
      const span = REPLAY_WORDMARK_VB_WIDTH * amplitude;
      const startX = REPLAY_WORDMARK_VB_WIDTH * 0.5 - span;
      const endX = REPLAY_WORDMARK_VB_WIDTH * 0.5 + span;
      let startTime: number | null = null;
      wrap!.classList.add("is-hovering");
      hovering = true;
      function tick(ts: number) {
        if (startTime === null) startTime = ts;
        const p = Math.min(1, (ts - startTime) / duration);
        const eased = easeInOutCubic(p);
        current.x = startX + (endX - startX) * eased;
        current.y = REPLAY_WORDMARK_VB_HEIGHT * 0.5;
        setGradient(current.x, current.y);
        if (p < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          hovering = false;
          raf = null;
          wrap!.classList.remove("is-hovering");
        }
      }
      raf = requestAnimationFrame(tick);
    }

    function handleEnter(e: PointerEvent) {
      hovering = true;
      wrap!.classList.add("is-hovering");
      if (!reduced) updateFromEvent(e);
    }
    function handleMove(e: PointerEvent) {
      if (!reduced) updateFromEvent(e);
    }
    function handleLeave() {
      hovering = false;
      wrap!.classList.remove("is-hovering");
    }

    wrap.addEventListener("pointerenter", handleEnter);
    wrap.addEventListener("pointermove", handleMove);
    wrap.addEventListener("pointerleave", handleLeave);
    setGradient(current.x, current.y);

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              playSweep(reduced ? 300 : 650, 0.6);
              observer?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.55 }
      );
      observer.observe(wrap);
    }

    return () => {
      wrap.removeEventListener("pointerenter", handleEnter);
      wrap.removeEventListener("pointermove", handleMove);
      wrap.removeEventListener("pointerleave", handleLeave);
      if (raf) cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, []);

  return { wrapRef, svgRef, gradRef };
}
