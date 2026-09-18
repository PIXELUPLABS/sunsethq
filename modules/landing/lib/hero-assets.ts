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

export const HERO_HOME_ILLUSTRATION_MOBILE = "/images/hero/home-hero-illustration-mobile.png";

export const HERO_PATTERN_TOP_OFFSET = 48;
export const HERO_CONVERGE_X_VW = 50;
export const HERO_CONVERGE_X_PX_OFFSET = 278;
export const HERO_CONVERGE_STACK_CENTER_Y = 170;
export const HERO_CONVERGE_STACK_STEP_Y = 10;

export const HERO_CONVERGE_X_CSS = `calc(${HERO_CONVERGE_X_VW}vw - ${HERO_CONVERGE_X_PX_OFFSET}px)`;

export const HERO_PATTERN_BOX = {
  left: `calc(${HERO_CONVERGE_X_CSS} - 230px)`,
  top: HERO_PATTERN_TOP_OFFSET + HERO_CONVERGE_STACK_CENTER_Y - 82,
  width: 1016,
  height: 518,
} as const;

export const HERO_LINE_PATTERN = "/images/hero/hero-line-pattern.png";

export const HERO_LINE_PATTERN_BOX = {
  left: `calc(${HERO_CONVERGE_X_CSS} - 258px)`,
  top: HERO_PATTERN_TOP_OFFSET + HERO_CONVERGE_STACK_CENTER_Y - 85,
  width: 732,
  height: 494,
} as const;

export const HERO_LEFT_COLLAGE_IMAGES = [
  { src: "/images/hero/hero-img-1.png", x: -170, y: 30, w: 420, h: 165 },
  { src: "/images/hero/hero-img-2.png", x: 155, y: 35, w: 80, h: 23 },
  { src: "/images/hero/hero-img-3.png", x: 13, y: 225, w: 235, h: 84 },
  { src: "/images/hero/hero-img-4.png", x: 3, y: 303, w: 108, h: 30 },
  { src: "/images/hero/hero-img-5.png", x: -10, y: 328, w: 273, h: 152 },
  { src: "/images/hero/hero-img-7.png", x: -60, y: 500, w: 325, h: 166 },
  { src: "/images/hero/hero-img-6.png", x: -189, y: 352, w: 341, h: 280 },
] as const;

export const HERO_RIGHT_COLLAGE_IMAGES = [
  { src: "/images/hero/hero-img-10.png", x: 28, y: 7, w: 95, h: 26 },
  { src: "/images/hero/hero-img-9.png", x: 0, y: 118, w: 315, h: 181 },
  { src: "/images/hero/hero-img-8.png", x: 46, y: 33, w: 280, h: 161 },
  { src: "/images/hero/hero-img-10.png", x: 10, y: 283, w: 150, h: 41 },
  { src: "/images/hero/hero-img-11.png", x: 120, y: 315, w: 153, h: 88 },
  { src: "/images/hero/hero-img-12.png", x: 58, y: 455, w: 275, h: 113 },
  { src: "/images/hero/hero-img-13.png", x: 5, y: 545, w: 263, h: 157 },
] as const;
