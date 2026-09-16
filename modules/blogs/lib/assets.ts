/** Illustration assets specific to the Blogs page. */

/**
 * The hero's entire decorative background - dozens of faded, scattered
 * mockup fragments (code snippets, classification/version chips) bleeding
 * in from the edges (Figma node 6672:14817) - flattened from Figma at 2x
 * rather than hand-built as ~950 individual elements, since none of it is
 * real content. The live headline/tag/subtext/process-bar render as real
 * HTML on top, in the same position, so only this decorative layer (and
 * the page's own base grain texture) comes from the image.
 * The flattened export also baked in Figma's own copy of that live
 * content (same text, same spot) - a transparent hole is punched out at
 * exactly the live content block's measured position (583x256.78 centered
 * at 1440px wide, 160px from the top, plus a 16px margin) so the two don't
 * double-render on top of each other.
 * A second, full-width hole is punched from y=1235px down to the image's
 * own bottom edge (2880x1280 native) for the same reason: the export also
 * baked in a copy of the colored process-bar strip the live `<ProcessBar>`
 * renders at this section's own bottom edge. Both scale together (uniform
 * `object-cover` at a matching aspect ratio, no cropping), but the live
 * strip's height is a fixed `h-5` (20px) that doesn't grow with the
 * image's own proportional scale-up past ~1500px viewport width, letting
 * a sliver of the baked-in strip peek out above/below it - the reported
 * "double stroke" - once the two stopped lining up exactly.
 */
export const BLOGS_HERO_BACKGROUND = "/images/blogs/hero-bg.webp";

/**
 * The whole chart card under "The Replay De-identification Standard"
 * (Figma node 6672:16865) - the glass container, grain/soft-light texture
 * overlays, and both benchmark bar charts (Nvidia 30% / Replay 86%) are all
 * one live composition in Figma, not an exportable image, so this is a
 * flattened screenshot of that node at 3x (664x438 native, 1992x1314
 * exported) rather than a source asset - matching the same technique the
 * data-trust page's own chart/glass-card illustrations use.
 */
export const BLOGS_STANDARD_CARD = "/images/blogs/standard-card.webp";

/**
 * The small mark inside the "Featured" tag next to it (Figma node
 * 6672:16917) - a vector composition of rotated, masked gradient bars, not
 * a simple icon glyph, so it's exported as a flattened image (4x, 72x72)
 * rather than hand-built as SVG.
 */
export const BLOGS_STANDARD_ICON = "/images/blogs/featured-icon.webp";
