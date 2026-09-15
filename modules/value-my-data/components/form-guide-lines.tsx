/**
 * Recreation of the decorative "blueprint" graphic behind the Figma card
 * comp's form content (node 6750:667, exported there as a flattened SVG) -
 * two dashed vertical guide lines plus a small diagonal chevron mark that
 * bleeds past the card's right edge. Rebuilt with real markup instead of
 * importing that raw asset: it's the same dashed-guide-line idea
 * `data-trust-hero.tsx`'s `HeroBlueprintRules` already uses elsewhere on
 * the site, just at the source's much heavier `black/75%` stroke -
 * lightened here to Replay's own faint `black/8` convention.
 *
 * Percentage-based positioning (not the source's fixed px) so the lines
 * track the card's own rendered width at any breakpoint. `overflow-visible`
 * on the parent (set by the caller) lets the chevron bleed past the card's
 * right edge, matching the source.
 */
export function FormGuideLines() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute top-0 bottom-0 left-[6.3%] border-l border-dashed border-black/8" />
      <div className="absolute top-0 bottom-0 left-[93.8%] border-l border-dashed border-black/8" />
      <svg
        viewBox="0 0 163 151"
        className="absolute top-[68%] left-[94%] w-[18%] max-w-[110px]"
        style={{ aspectRatio: "163 / 151" }}
        stroke="black"
        strokeOpacity="0.08"
        strokeWidth="1"
        fill="none"
      >
        <path d="M81.238 0V150.168M162.477 69.014L81.238 150.168L0 69.014" />
      </svg>
    </div>
  );
}
