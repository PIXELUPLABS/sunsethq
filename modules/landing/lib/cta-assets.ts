export const CTA_BG_TEXT = "/images/cta-bg-text.png";
export const CTA_GRAIN_LIGHT = "/images/grain-light-texture.svg";
export const CTA_GRAIN_WHITE = "/images/texture-grain-white.png";

/**
 * The mobile CTA's 4 decorative corners are a different composition than
 * desktop's (Figma has bespoke artwork for the portrait layout, not the
 * same 4 images cropped differently) - each is a direct pixel crop of
 * `background-mobile.webp` at the exact box Figma places it in
 * (node 6300:21121), so they reproduce that artwork exactly instead of
 * approximating it by reusing desktop's differently-shaped assets.
 */
export const CTA_MOBILE_TOP_LEFT = "/images/cta/mobile-top-left.webp";
export const CTA_MOBILE_TOP_RIGHT = "/images/cta/mobile-top-right.webp";
export const CTA_MOBILE_BOTTOM_LEFT = "/images/cta/mobile-bottom-left.webp";
export const CTA_MOBILE_BOTTOM_RIGHT = "/images/cta/mobile-bottom-right.webp";
