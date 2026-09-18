import type { CSSProperties, ReactNode } from "react";
import { ValuationPanelRulers } from "./valuation-panel-rulers";

const GRAIN_SRC = "/images/valuation/value/grain-overlay.png";

/**
 * The illustration panel of the "How it works" section, layered as in Figma:
 * fill, the illustration stage, dashed rulers, then grain in soft-light over
 * everything. The backdrop layers stretch with the column while the stage
 * caps the illustration at its design size (648 x 709) and shrinks with the
 * panel, so the video never gets cropped when the section changes shape.
 *
 * The fill matches the flat background baked into the step videos so their
 * edges disappear into the panel.
 */
export function ValuationPanel({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`relative isolate overflow-hidden bg-[#171717] ${className}`} style={style}>
      {/* The stage is the panel clamped to the design size. The video letterboxes
          inside it with object-contain, so it can never be cropped. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-full max-h-[709px] w-full max-w-[648px]">{children}</div>
      </div>

      {/* Above the stage, as in Figma, so the video's opaque background can't
          hide the rulers when the stage is nearly as wide as the panel. */}
      <ValuationPanelRulers />

      {/* Texture overlay per the design spec: soft light at 60% opacity. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[length:222px_222px] bg-repeat opacity-60 mix-blend-soft-light"
        style={{ backgroundImage: `url(${GRAIN_SRC})` }}
      />
    </div>
  );
}
