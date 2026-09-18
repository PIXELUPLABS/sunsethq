import { useId } from "react";

type ProcessMarkIconProps = {
  tone?: "light" | "dark";
  className?: string;
};

const BARS = [
  { x: 1.42606, w: 9.60544, shadowY: 2.45605, y: 1.45605 },
  { x: 1.19324, w: 8.60547, shadowY: 15.2974, y: 14.4561 },
  { x: 5.19579, w: 15.60551, shadowY: 8.99707, y: 7.45605 },
];

const SHADOW_HEIGHT = 5.6054;
const BAR_HEIGHT = 3.6054;

/**
 * In Figma the light-tone shadow is #EBEBEB multiplied by a grain texture
 * tiled at 32.49 x 24.36 icon px. The tile below is that texture with the
 * multiply pre-applied, so it can be used as a plain pattern fill.
 */
const GRAIN_TILE = "/images/process-mark-grain.webp";
const GRAIN_TILE_W = 32.4864;
const GRAIN_TILE_H = 24.3648;

export function ProcessMarkIcon({
  tone = "light",
  className,
}: ProcessMarkIconProps) {
  const grainId = useId();
  const stroke = tone === "dark" ? "#A3A3A3" : "#B2B2B2";
  const shadow = tone === "dark" ? "rgba(66,66,66,0.45)" : `url(#${grainId})`;

  return (
    <svg
      className={className}
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {tone === "light" ? (
        <defs>
          <pattern
            id={grainId}
            patternUnits="userSpaceOnUse"
            width={GRAIN_TILE_W}
            height={GRAIN_TILE_H}
          >
            <image
              href={GRAIN_TILE}
              width={GRAIN_TILE_W}
              height={GRAIN_TILE_H}
              preserveAspectRatio="none"
            />
          </pattern>
        </defs>
      ) : null}
      {BARS.map((bar) => (
        <rect
          key={`shadow-${bar.x}`}
          x={bar.x}
          y={bar.shadowY}
          width={bar.w}
          height={SHADOW_HEIGHT}
          fill={shadow}
          stroke={stroke}
          strokeWidth={0.394406}
        />
      ))}
      {BARS.map((bar) => (
        <rect
          key={`bar-${bar.x}`}
          x={bar.x}
          y={bar.y}
          width={bar.w}
          height={BAR_HEIGHT}
          fill="#FCFCFC"
          stroke={stroke}
          strokeWidth={0.394406}
        />
      ))}
    </svg>
  );
}
