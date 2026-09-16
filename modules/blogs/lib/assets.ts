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
 */
export const BLOGS_HERO_BACKGROUND = "/images/blogs/hero-bg.webp";
