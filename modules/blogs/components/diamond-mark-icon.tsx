type DiamondMarkIconProps = {
  className?: string;
};

/**
 * The interlocking-diamonds mark beside the hero's "Legal" tag - two
 * 9.362px squares rotated 45° (so each reads as a diamond), overlapping by
 * about half a diamond's width. Inline rather than an exported asset,
 * matching `ProcessMarkIcon`'s own reasoning: at this ~20px size any baked-in
 * grain texture (as Figma exports it) is invisible, so a flat two-tone fill
 * reproduces the design without the file weight.
 */
export function DiamondMarkIcon({ className }: DiamondMarkIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <polygon
        points="6.62,3.38 13.24,10 6.62,16.62 0,10"
        fill="#EBEBEB"
        stroke="#B2B2B2"
        strokeWidth="0.585"
      />
      <polygon
        points="13.38,3.38 20,10 13.38,16.62 6.76,10"
        fill="#FCFCFC"
        stroke="#B2B2B2"
        strokeWidth="0.585"
      />
    </svg>
  );
}
