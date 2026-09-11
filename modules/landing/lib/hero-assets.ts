export const HERO_BUTTON_PATTERN = "/images/hero/button-pattern.webp";
export const HERO_BAR_NOISE = "/images/hero/bar-noise.webp";

export const HERO_LINE_HORIZONTAL = "/images/hero/line-720.svg";
export const HERO_PROCESS_DASH = "/images/hero/vector-1803447439.svg";

export const HERO_SIDE_COLLAGE_LEFT = "/images/hero/side-collage-left.webp";
export const HERO_SIDE_COLLAGE_RIGHT = "/images/hero/side-collage-right.webp";

/**
 * Individual torn-paper pieces making up the left-side hero collage, laid
 * out inside a 270x666 box (matching HERO_SIDE_COLLAGE_LEFT's rendered
 * size). Coordinates are pixel offsets within that box, several pieces
 * bleeding past its edges by design - positions were measured against the
 * flattened HERO_SIDE_COLLAGE_LEFT composite so the two stay visually in
 * sync. Order is back-to-front (later entries paint on top).
 */
export const HERO_LEFT_COLLAGE_IMAGES = [
  { src: "/images/hero/hero-img-1.png", x: -100, y: 28, w: 280, h: 130 },
  { src: "/images/hero/hero-img-2.png", x: 155, y: 35, w: 80, h: 23 },
  { src: "/images/hero/hero-img-3.png", x: 13, y: 225, w: 235, h: 84 },
  { src: "/images/hero/hero-img-4.png", x: 3, y: 303, w: 108, h: 30 },
  { src: "/images/hero/hero-img-5.png", x: -10, y: 328, w: 273, h: 152 },
  { src: "/images/hero/hero-img-7.png", x: -60, y: 500, w: 325, h: 166 },
  { src: "/images/hero/hero-img-6.png", x: -189, y: 352, w: 341, h: 280 },
] as const;
