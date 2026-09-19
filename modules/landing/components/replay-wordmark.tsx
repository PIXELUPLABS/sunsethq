"use client";

import { REPLAY_WORDMARK_PATHS } from "../lib/replay-wordmark-paths";
import {
  REPLAY_WORDMARK_GLOW_BLUR_PX,
  REPLAY_WORDMARK_GLOW_RGBA,
  REPLAY_WORDMARK_VB_HEIGHT,
  REPLAY_WORDMARK_VB_WIDTH,
  useReplayWordmark,
} from "../hooks/use-replay-wordmark";

export function ReplayWordmark({ className }: { className?: string }) {
  const { wrapRef, svgRef, gradRef } = useReplayWordmark();

  return (
    <div ref={wrapRef} className={`replay-wordmark ${className ?? ""}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${REPLAY_WORDMARK_VB_WIDTH} ${REPLAY_WORDMARK_VB_HEIGHT}`}
        fill="none"
        className="block h-auto w-full overflow-visible"
        aria-label="Replay"
        role="img"
      >
        <defs>
          <linearGradient
            ref={gradRef}
            id="footerShimmerGradient"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="260"
            y2="0"
          >
            <stop offset="0%" stopColor="#bcd2ff00" stopOpacity={0} />
            <stop offset="10%" stopColor="#bcd2ff00" stopOpacity={0.11} />
            <stop offset="50%" stopColor="#ffffffbd" stopOpacity={0.55} />
            <stop offset="90%" stopColor="#bcd2ff00" stopOpacity={0.11} />
            <stop offset="100%" stopColor="#bcd2ff00" stopOpacity={0} />
          </linearGradient>
          <pattern
            id="footerGrainPattern"
            patternUnits="userSpaceOnUse"
            width={280}
            height={280}
          >
            <image
              href="/images/footer/grain.png"
              x={0}
              y={0}
              width={280}
              height={280}
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        </defs>

        {/* Solid backing under the translucent grain fill, so the letters
            hide whatever sits behind the wordmark instead of showing it
            through. It matches the footer's background. */}
        {REPLAY_WORDMARK_PATHS.map((path, i) => (
          <path
            key={`backing-${i}`}
            fillRule={path.evenOdd ? "evenodd" : undefined}
            clipRule={path.evenOdd ? "evenodd" : undefined}
            d={path.d}
            fill="#080808"
          />
        ))}
        {REPLAY_WORDMARK_PATHS.map((path, i) => (
          <path
            key={`base-${i}`}
            className="logo-base"
            fillRule={path.evenOdd ? "evenodd" : undefined}
            clipRule={path.evenOdd ? "evenodd" : undefined}
            d={path.d}
            fill="url(#footerGrainPattern)"
            stroke="#FFFFFF"
            strokeOpacity={0.2}
            strokeDasharray="1.5 1"
            strokeWidth={0.5}
          />
        ))}
        {REPLAY_WORDMARK_PATHS.map((path, i) => (
          <path
            key={`shimmer-${i}`}
            className="shimmer-path"
            fillRule={path.evenOdd ? "evenodd" : undefined}
            clipRule={path.evenOdd ? "evenodd" : undefined}
            d={path.d}
            fill="url(#footerShimmerGradient)"
          />
        ))}
      </svg>

      <style jsx>{`
        .logo-base {
          fill-opacity: 0.6;
          transition: fill-opacity 200ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .shimmer-path {
          opacity: 0;
          mix-blend-mode: screen;
          transition:
            opacity 500ms cubic-bezier(0.23, 1, 0.32, 1) 80ms,
            filter 500ms cubic-bezier(0.23, 1, 0.32, 1) 80ms;
          filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
        }
        .replay-wordmark:global(.is-hovering) .shimmer-path {
          opacity: 1;
          filter: drop-shadow(
            0 0 ${REPLAY_WORDMARK_GLOW_BLUR_PX}px ${REPLAY_WORDMARK_GLOW_RGBA}
          );
          transition:
            opacity 900ms cubic-bezier(0.23, 1, 0.32, 1),
            filter 900ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        @media (prefers-reduced-motion: reduce) {
          .shimmer-path {
            transition: opacity 0.3s ease;
          }
        }
      `}</style>
    </div>
  );
}
