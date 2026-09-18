import {
  RULER_DASH,
  RULER_SEGMENTS,
  RULER_STROKE,
  RULER_WIDTH,
} from "../lib/valuation-panel-rulers";

function Ruler({ side }: { side: "left" | "right" }) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute top-0 h-full overflow-visible ${
        side === "left" ? "left-0" : "right-0 -scale-x-100"
      }`}
      width={RULER_WIDTH}
      fill="none"
      stroke={RULER_STROKE}
      strokeWidth={1}
      strokeDasharray={RULER_DASH}
    >
      {RULER_SEGMENTS.map((segment, index) => (
        <line
          key={index}
          x1={segment.x1}
          y1={segment.y1}
          x2={segment.x2}
          y2={segment.y2 ?? "100%"}
        />
      ))}
    </svg>
  );
}

/** The dashed rulers on both sides of the illustration panel. */
export function ValuationPanelRulers() {
  return (
    <>
      <Ruler side="left" />
      <Ruler side="right" />
    </>
  );
}
