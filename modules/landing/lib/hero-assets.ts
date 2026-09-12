export const HERO_BUTTON_PATTERN = "/images/hero/button-pattern.webp";
export const HERO_BAR_NOISE = "/images/hero/bar-noise.webp";

export const HERO_LINE_HORIZONTAL = "/images/hero/line-720.svg";
export const HERO_PROCESS_DASH = "/images/hero/vector-1803447439.svg";

export const HERO_SIDE_COLLAGE_LEFT = "/images/hero/side-collage-left.webp";
export const HERO_SIDE_COLLAGE_RIGHT = "/images/hero/side-collage-right.webp";

export const HERO_CARD_2 = "/images/hero/card-2.png";
export const HERO_CARD_3 = "/images/hero/card-3.webp";
export const HERO_CARD_4 = "/images/hero/card-4.webp";

export const HERO_PATTERN = "/images/hero/hero-pattern.webp";

/**
 * Shared by HeroSidePatternLeft/Right and HeroSection: the point (in the
 * side patterns' own local box coordinates, box top offset by
 * HERO_PATTERN_TOP_OFFSET within the row) that every collage piece
 * converges on while scrolling through the hero, and where later
 * scroll-triggered elements (e.g. HERO_CARD_2) anchor themselves relative
 * to that same stack.
 */
export const HERO_PATTERN_TOP_OFFSET = 48; // px - matches the `top-12` on both boxes
export const HERO_CONVERGE_X_VW = 27;
export const HERO_CONVERGE_STACK_CENTER_Y = 170;
export const HERO_CONVERGE_STACK_STEP_Y = 10;

/**
 * HERO_CONVERGE_X_VW as a CSS length, capped at its value for a 1800px-wide
 * viewport (1800 * HERO_CONVERGE_X_VW/100). Past that width the whole
 * converged cluster (stack, cards 2-4, both patterns) is a fixed-px-wide
 * group anchored to a vw fraction, so left uncapped it drifts away from
 * center as the viewport keeps growing - this freezes its horizontal anchor
 * once the row is wide enough that the drift would show.
 */
export const HERO_CONVERGE_X_CSS = `min(${HERO_CONVERGE_X_VW}vw, ${HERO_CONVERGE_X_VW * 18}px)`;

/**
 * Bounding box the converged collage stack plus cards 2-4 occupy once
 * card-4 has fully arrived, in the same row-relative coordinate space as
 * HERO_CONVERGE_X_VW/HERO_PATTERN_TOP_OFFSET (derived from that same
 * geometry - the stack's pieces all converge on one point, and the cards
 * cascade from it by fixed offsets). HERO_PATTERN sits behind all of them,
 * sized to exactly this box.
 */
export const HERO_PATTERN_BOX = {
  left: `calc(${HERO_CONVERGE_X_CSS} - 200px)`,
  top: HERO_PATTERN_TOP_OFFSET + HERO_CONVERGE_STACK_CENTER_Y - 82,
  width: 956,
  height: 529,
} as const;

export const HERO_LINE_PATTERN = "/images/hero/hero-line-pattern.png";

/**
 * Bounding box the converged collage stack alone occupies (unlike
 * HERO_PATTERN_BOX, this excludes cards 2-4), centered on the same
 * convergence anchor point the stack itself converges on. HERO_LINE_PATTERN
 * sits behind the stack, aligned to this box, so the stack renders on top
 * of it.
 */
export const HERO_LINE_PATTERN_BOX = {
  left: `calc(${HERO_CONVERGE_X_CSS} - 223px)`,
  top: HERO_PATTERN_TOP_OFFSET + HERO_CONVERGE_STACK_CENTER_Y - 85,
  width: 772,
  height: 520,
} as const;

/**
 * Individual torn-paper pieces making up the left-side hero collage, laid
 * out inside a 270x666 box (matching HERO_SIDE_COLLAGE_LEFT's rendered
 * size). Coordinates are pixel offsets within that box, several pieces
 * bleeding past its edges by design - positions were measured against the
 * flattened HERO_SIDE_COLLAGE_LEFT composite so the two stay visually in
 * sync. Order is back-to-front (later entries paint on top).
 */
export const HERO_LEFT_COLLAGE_IMAGES = [
  { src: "/images/hero/hero-img-1.png", x: -170, y: 30, w: 420, h: 165 },
  { src: "/images/hero/hero-img-2.png", x: 155, y: 35, w: 80, h: 23 },
  { src: "/images/hero/hero-img-3.png", x: 13, y: 225, w: 235, h: 84 },
  { src: "/images/hero/hero-img-4.png", x: 3, y: 303, w: 108, h: 30 },
  { src: "/images/hero/hero-img-5.png", x: -10, y: 328, w: 273, h: 152 },
  { src: "/images/hero/hero-img-7.png", x: -60, y: 500, w: 325, h: 166 },
  { src: "/images/hero/hero-img-6.png", x: -189, y: 352, w: 341, h: 280 },
] as const;

/**
 * Same idea as HERO_LEFT_COLLAGE_IMAGES, mirrored for the right-side hero
 * collage - laid out inside a 272x666 box (matching
 * HERO_SIDE_COLLAGE_RIGHT's rendered size), measured against the flattened
 * HERO_SIDE_COLLAGE_RIGHT composite. hero-img-10 (the small code-chip) is
 * reused twice, matching the two chip accents in the reference. Order is
 * back-to-front (later entries paint on top).
 */
export const HERO_RIGHT_COLLAGE_IMAGES = [
  { src: "/images/hero/hero-img-10.png", x: 28, y: 7, w: 95, h: 26 },
  { src: "/images/hero/hero-img-9.png", x: 0, y: 118, w: 315, h: 181 },
  { src: "/images/hero/hero-img-8.png", x: 46, y: 33, w: 280, h: 161 },
  { src: "/images/hero/hero-img-10.png", x: 10, y: 283, w: 150, h: 41 },
  { src: "/images/hero/hero-img-11.png", x: 120, y: 315, w: 153, h: 88 },
  { src: "/images/hero/hero-img-12.png", x: 58, y: 455, w: 275, h: 113 },
  { src: "/images/hero/hero-img-13.png", x: 5, y: 545, w: 263, h: 157 },
] as const;
