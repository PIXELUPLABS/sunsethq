// Card-1 "document" rows: each row is a Figma auto-layout frame of fixed-width
// bar segments (the growing outer box clips them like a typing reveal).
// left/top are Figma-canvas-absolute (from get_metadata — the DOM's own
// arbitrary-value classes for these nested auto-layout rows do not match
// Figma's real geometry, so metadata is the source of truth here).
// width/height are the row's own pre-transform flex-box size (from
// get_design_context), and bars are each segment's pre-transform width.

export type TermsRow = {
  left: number;
  top: number;
  outerWidth: number;
  outerHeight: number;
  contentWidth: number;
  contentHeight: number;
  bars: number[] | null;
};

const GAP = 4.367;
const ROW_LEFT = 144.5547;
const CONTENT_H = 6.062;

export const TERMS_ROWS: TermsRow[] = [
  { left: ROW_LEFT, top: 442.7193, outerWidth: 76.5438, outerHeight: 20.7715, contentWidth: 77.725, contentHeight: 7.275, bars: null },
  { left: ROW_LEFT, top: 454.8404, outerWidth: 102.3451, outerHeight: 25.3209, contentWidth: 103.924, contentHeight: 7.275, bars: null },
  { left: ROW_LEFT, top: 483.9425, outerWidth: 180.609, outerHeight: 37.9085, contentWidth: 183.395, contentHeight: CONTENT_H, bars: [33.186, 41.919, 24.453, 24.453, 41.919] },
  { left: ROW_LEFT, top: 493.6397, outerWidth: 208.1304, outerHeight: 42.7613, contentWidth: 211.341, contentHeight: CONTENT_H, bars: [57.638, 16.593, 24.453, 41.919, 41.919, 6.986] },
  { left: ROW_LEFT, top: 503.339, outerWidth: 149.6475, outerHeight: 32.4492, contentWidth: 151.956, contentHeight: CONTENT_H, bars: [33.186, 13.973, 7.86, 24.453, 41.919, 8.733] },
  { left: ROW_LEFT, top: 513.0397, outerWidth: 226.1913, outerHeight: 45.9459, contentWidth: 229.681, contentHeight: CONTENT_H, bars: [33.186, 41.919, 24.453, 24.453, 41.919, 41.919] },
  { left: ROW_LEFT, top: 523.9522, outerWidth: 229.6315, outerHeight: 46.5525, contentWidth: 233.174, contentHeight: CONTENT_H, bars: [33.186, 41.919, 11.353, 41.046, 41.919, 41.919] },
  { left: ROW_LEFT, top: 533.6476, outerWidth: 218.4509, outerHeight: 44.5811, contentWidth: 221.821, contentHeight: CONTENT_H, bars: [33.186, 24.453, 41.919, 16.593, 41.919, 41.919] },
  { left: ROW_LEFT, top: 543.3487, outerWidth: 226.1913, outerHeight: 45.9459, contentWidth: 229.681, contentHeight: CONTENT_H, bars: [33.186, 41.919, 24.453, 24.453, 41.919, 41.919] },
  { left: ROW_LEFT, top: 554.2628, outerWidth: 208.1304, outerHeight: 42.7613, contentWidth: 211.341, contentHeight: CONTENT_H, bars: [6.986, 57.638, 16.593, 24.453, 41.919, 41.919] },
  { left: ROW_LEFT, top: 563.9635, outerWidth: 226.1913, outerHeight: 45.9459, contentWidth: 229.681, contentHeight: CONTENT_H, bars: [33.186, 41.919, 24.453, 24.453, 41.919, 41.919] },
  { left: ROW_LEFT, top: 573.6588, outerWidth: 226.1913, outerHeight: 45.9459, contentWidth: 229.681, contentHeight: CONTENT_H, bars: [33.186, 41.919, 24.453, 24.453, 41.919, 41.919] },
  { left: ROW_LEFT, top: 584.5729, outerWidth: 159.968, outerHeight: 34.2689, contentWidth: 162.436, contentHeight: CONTENT_H, bars: [33.186, 6.986, 24.453, 16.593, 41.919, 17.466] },
  { left: ROW_LEFT, top: 594.2726, outerWidth: 209.8505, outerHeight: 43.0646, contentWidth: 213.088, contentHeight: CONTENT_H, bars: [16.593, 41.919, 24.453, 24.453, 41.919, 41.919] },
  { left: ROW_LEFT, top: 603.9732, outerWidth: 226.1913, outerHeight: 45.9459, contentWidth: 229.681, contentHeight: CONTENT_H, bars: [33.186, 41.919, 24.453, 24.453, 41.919, 41.919] },
  { left: ROW_LEFT, top: 614.8819, outerWidth: 190.0695, outerHeight: 39.5766, contentWidth: 193.002, contentHeight: CONTENT_H, bars: [33.186, 20.086, 24.453, 24.453, 41.919, 27.073] },
  { left: ROW_LEFT, top: 677.9352, outerWidth: 180.609, outerHeight: 37.9085, contentWidth: 183.395, contentHeight: CONTENT_H, bars: [33.186, 41.919, 24.453, 56.765, 9.606] },
  { left: ROW_LEFT, top: 688.8438, outerWidth: 210.7105, outerHeight: 43.2162, contentWidth: 213.961, contentHeight: CONTENT_H, bars: [110.037, 9.606, 24.453, 56.765] },
  { left: ROW_LEFT, top: 700.4391, outerWidth: 210.7105, outerHeight: 43.2162, contentWidth: 213.961, contentHeight: CONTENT_H, bars: [56.765, 24.453, 9.606, 110.037] },
];

export const TERMS_ROW_GAP = GAP;

export const TERMS_DIVIDER = {
  left: 143.6953,
  top: 650.3248,
  outerWidth: 223.059,
  outerHeight: 39.3313,
  contentWidth: 226.5,
};
