/** Illustration assets specific to the Data & Trust page. */
/**
 * The whole perspective sheet, exported flat from Figma (node 6423:21738) at
 * 2x. The gradient mask and the coloured top sheet are baked into the export,
 * so it drops straight into the 1297x422 box the design gives it.
 */
export const DATA_TRUST_HERO_PLANE = "/images/data-trust/hero-plane.webp";

/** Portrait replacement for the hero illustration on mobile, swapped in
 *  for `DATA_TRUST_HERO_PLANE` below `lg` only. */
export const DATA_TRUST_HERO_PLANE_MOBILE =
  "/images/data-trust/data-trust-hero-mobile.png";

/**
 * Tiling textures. Each one is exported at the size the design paints it at,
 * so they are tiled with `background-size` rather than stretched to fit.
 */
export const DATA_TRUST_GRAIN_STRIP = "/images/data-trust/grain-strip.webp";
export const DATA_TRUST_GRAIN_STRIP_SIZE = "516px 387px";

export const DATA_TRUST_CARD_BACKDROP = "/images/data-trust/card-backdrop.webp";
export const DATA_TRUST_CARD_BACKDROP_SIZE = "358px 358px";

export const DATA_TRUST_REDACTION_TEXTURE =
  "/images/data-trust/redaction-texture.webp";
export const DATA_TRUST_REDACTION_TEXTURE_SIZE = "465px 348px";

export const DATA_TRUST_INDICATOR_TEXTURE =
  "/images/data-trust/indicator-texture.webp";
export const DATA_TRUST_INDICATOR_TEXTURE_SIZE = "336px 252px";

/** The oversized watermark in the bottom-left of the de-identification panel. */
export const DATA_TRUST_PANEL_MARK = "/images/data-trust/panel-mark.webp";

/**
 * The whole card area under "Your data. De-identified." (Figma node
 * 6672:20349) - the glass card, its woven-texture surround, the email
 * copy, and the redaction bars are all one live composition in Figma, not
 * an exportable image, so this is a flattened screenshot of that node at
 * 2x (696x372 native, upscaled with Lanczos resampling) rather than a
 * source asset.
 */
export const DATA_TRUST_DEIDENTIFICATION_ILLUSTRATION =
  "/images/data-trust/deidentification-card.webp";

/**
 * The whole card area under "How your data gets cleaned" (Figma node
 * 6672:23005) - the grain-textured backdrop, glass card, coverage-type
 * grid, and benchmark bars are all one live composition in Figma, not an
 * exportable image, so this is a flattened screenshot of that node at 3x
 * (696x372 native, 2088x1116 exported) rather than a source asset - a
 * higher export scale than `DATA_TRUST_DEIDENTIFICATION_ILLUSTRATION`'s 2x
 * since this card carries finer detail (the coverage grid's icons/labels,
 * the benchmark bars) that read soft at 2x.
 */
export const DATA_TRUST_DETECTION_ILLUSTRATION =
  "/images/data-trust/detection-card.webp";

/**
 * The whole card area under "We're setting the standard" (Figma node
 * 6672:23214) - the grain-textured backdrop, glass card, hexagon lock
 * mark, spec table, and feature-check chips are all one live composition
 * in Figma, not an exportable image, so this is a flattened screenshot of
 * that node at 3x (696x372 native, 2088x1116 exported), matching
 * `DATA_TRUST_DETECTION_ILLUSTRATION`'s scale for the same fine-detail
 * reason (the spec table's numerals/labels and chip text read soft at 2x).
 */
export const DATA_TRUST_STANDARD_ILLUSTRATION =
  "/images/data-trust/standard-card.webp";

/** The plate image beside each of the 4 "Your data stays yours" rows,
 *  in row order. */
export const DATA_TRUST_ASSURANCE_IMAGES = [
  "/images/data-trust/legal-1.webp",
  "/images/data-trust/legal-2.webp",
  "/images/data-trust/legal-3.webp",
  "/images/data-trust/legal-4.webp",
];

/** Shared with the landing page. */
export const SOFT_LIGHT_TEXTURE = "/images/texture-canvas-blue.png";
export const SOFT_LIGHT_TEXTURE_SIZE = "296px 296px";
export const PAGE_GRAIN_TEXTURE = "/images/grain-light-texture.svg";
export const JURISDICTION_ICON = "/images/jurisdiction-icon.svg";
