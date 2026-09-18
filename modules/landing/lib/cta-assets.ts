export const CTA_BG_TEXT = "/images/cta/cta-bg-text.png";
export const CTA_GRAIN_LIGHT = "/images/grain-light-texture.svg";
export const CTA_GRAIN_WHITE = "/images/texture-grain-white.png";

/**
 * Phone collage tiles, exported from the 390 x 490 Figma frame at 3x and
 * placed by their frame position as percentages of the section.
 */
const W = 390;
const H = 490;
const pctX = (px: number) => `${((px / W) * 100).toFixed(4)}%`;
const pctY = (px: number) => `${((px / H) * 100).toFixed(4)}%`;

export const CTA_MOBILE_COLLAGE = [
  {
    src: "/images/cta/mobile-paper.png",
    style: { left: pctX(15), top: pctY(82.25), width: pctX(225.67), height: pctY(197) },
  },
  {
    src: "/images/cta/mobile-bars-dark.png",
    style: { left: pctX(10), top: pctY(225.25), width: pctX(171), height: pctY(205.2) },
  },
  {
    src: "/images/cta/mobile-bars-light.png",
    style: { left: pctX(201), top: pctY(79.25), width: pctX(171), height: pctY(205.2) },
  },
  {
    src: "/images/cta/mobile-blue.png",
    style: { left: pctX(197), top: pctY(176.25), width: pctX(173.33), height: pctY(208) },
  },
];

/** Where the black band starts in the 390 x 490 frame. */
export const CTA_MOBILE_BAND_TOP = pctY(254.49);
