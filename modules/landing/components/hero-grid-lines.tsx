/**
 * The faint blueprint rules behind the static home hero: the page gutter at
 * 72px on each side (full height), plus a pair of inner rules marking the
 * 898px content column used elsewhere in the hero (partial height, matching
 * the design).
 */
export function HeroGridLines() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      <div className="absolute inset-y-0 left-[72px] border-l border-dashed border-black/8" />
      <div className="absolute inset-y-0 right-[72px] border-r border-dashed border-black/8" />
      <div className="absolute top-0 h-[766px] left-[271.5px] border-l border-dashed border-black/8" />
      <div className="absolute top-0 h-[766px] right-[270.5px] border-r border-dashed border-black/8" />
    </div>
  );
}
