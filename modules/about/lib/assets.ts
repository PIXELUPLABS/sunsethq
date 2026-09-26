export const FOUNDER_SIGNATURE = "/images/about/founder-signature.webp";

export const PURPOSE_DIAGRAM_ARROW = "/images/about/purpose-diagram-arrow.svg";

export const PURPOSE_GRAIN_TEXTURE = "/images/pricing/grain-texture.webp";

/**
 * The homepage hero's grain, tiled at its native 1440x900 size (never scaled,
 * so it stays crisp) and at the same grain size wherever it's used. Shared by
 * the about hero, "A new way to grow" and the about CTA's top band so the two blend seamlessly.
 */
export const GRAIN_TEXTURE_STYLE = {
  backgroundColor: "#fcfcfc",
  backgroundImage: "url(/images/grain-light-texture-optimized.svg)",
  backgroundSize: "1440px 900px",
  backgroundPosition: "center top",
  backgroundRepeat: "repeat",
} as const;

/** Paper grain on the founder letter card (Figma: 370px tile, multiply @ 11%). */
export const LETTER_GRAIN_TEXTURE = "/images/about/letter-grain-texture.webp";

export const LETTER_DIVIDER = "/images/about/letter-divider.svg";

/** Blue textured panel behind the founder letter (rendered from Figma @2x). */
export const STORY_BLUE_PANEL = "/images/about/story-blue-panel.webp";

/** Falling "money strip" artwork beside the founder letter (rendered from Figma @2x). */
export const STORY_MONEY_STRIPS = "/images/about/story-money-strips.webp";
