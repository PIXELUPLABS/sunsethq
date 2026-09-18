/**
 * Geometry of the desktop CTA collage, taken from the 1440-wide design.
 *
 * The collage and the grey card live on a "stage" that is the page's content
 * column: the 1440 design minus its 72px side gutters, so 1296 x 716. The
 * stage caps at the same 1560px as every other section, so on wide screens
 * the collage stops growing instead of drifting away from the fixed card.
 */
const STAGE_WIDTH = 1296;
const STAGE_HEIGHT = 716;
const GUTTER = 72;

/** The grey card's width in the design; its contents scale from this. */
export const CTA_CARD_WIDTH = 860;
const CTA_CARD_HEIGHT = 378;

const pctX = (px: number) => `${((px / STAGE_WIDTH) * 100).toFixed(4)}%`;
const pctY = (px: number) => `${((px / STAGE_HEIGHT) * 100).toFixed(4)}%`;

/** A design pixel inside the card, as a fraction of the card's width. */
export const cq = (px: number) => `${((px / CTA_CARD_WIDTH) * 100).toFixed(4)}cqw`;

export const CTA_STAGE_ASPECT = `${STAGE_WIDTH}/${STAGE_HEIGHT}`;
export const CTA_CARD_SIZE = { width: pctX(CTA_CARD_WIDTH), height: pctY(CTA_CARD_HEIGHT) };

export type CtaCollageImage = {
  src: string;
  /** Absolute position on the stage, in percentages. */
  style: { top?: string; bottom?: string; left?: string; right?: string; width: string; height: string };
  /** Parallax travel in px per unit of pointer offset. */
  shift: { x: number; y: number };
};

export const CTA_COLLAGE_IMAGES: CtaCollageImage[] = [
  {
    src: "/images/cta/top-left-cta-img-1.webp",
    style: { top: pctY(107), left: pctX(184 - GUTTER), width: pctX(648), height: pctY(301) },
    shift: { x: 20, y: 12 },
  },
  {
    src: "/images/cta/top-right-cta-img.png",
    style: { top: pctY(107), right: pctX(185 - GUTTER), width: pctX(542), height: pctY(321) },
    shift: { x: 16, y: 10 },
  },
  {
    src: "/images/cta/right-bottom-cta-img.webp",
    style: { top: pctY(308), left: pctX(607 - GUTTER), width: pctX(648), height: pctY(301) },
    shift: { x: 18, y: 11 },
  },
  {
    src: "/images/cta/left-bottom-cta-img.png",
    style: { bottom: pctY(107), left: pctX(184 - GUTTER), width: pctX(542), height: pctY(321) },
    shift: { x: 14, y: 9 },
  },
];

/** Widest a collage image gets: half the 1560px stage. */
export const CTA_COLLAGE_IMAGE_SIZES = "(min-width: 1704px) 780px, 50vw";
