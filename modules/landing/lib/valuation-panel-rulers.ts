/**
 * Geometry of the dashed rulers that frame the "How it works" illustration
 * panel, in CSS pixels from the panel's top edge and near side. Taken from the
 * Figma "bricks" layer, which sits at (-1, -6) inside a 648 x 709 panel, so
 * its outermost line is hidden under the border and only these remain.
 *
 * Everything is a fixed pixel offset from an edge, never a percentage, so the
 * rulers look the same on every panel size. Lines that run "to the bottom"
 * use a null end and are drawn to the panel's full height.
 */
export const RULER_STROKE = "#8A8A8A";
export const RULER_DASH = "2 2";
export const RULER_WIDTH = 41;

type Segment = { x1: number; y1: number; x2: number; y2: number | null };

export const RULER_SEGMENTS: Segment[] = [
  // Inner column line, full height.
  { x1: 20.5, y1: 0, x2: 20.5, y2: null },
  // Outer column line, top to the last inner tick.
  { x1: 40.5, y1: 0, x2: 40.5, y2: 434.5 },
  // Ticks bridging the inner and outer column.
  { x1: 20.5, y1: 81.5, x2: 40.5, y2: 81.5 },
  { x1: 20.5, y1: 189.5, x2: 40.5, y2: 189.5 },
  { x1: 20.5, y1: 434.5, x2: 40.5, y2: 434.5 },
  // Ticks bridging the panel edge and the inner column.
  { x1: 0, y1: 273.5, x2: 20.5, y2: 273.5 },
  { x1: 0, y1: 368.5, x2: 20.5, y2: 368.5 },
  { x1: 0, y1: 531.5, x2: 20.5, y2: 531.5 },
];
