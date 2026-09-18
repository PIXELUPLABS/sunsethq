export function HeroGridLines() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      <div className="absolute inset-y-0 left-[72px] border-l border-dashed border-black/8" />
      <div className="absolute inset-y-0 right-[72px] border-r border-dashed border-black/8" />
      <div className="absolute inset-y-0 left-[271.5px] border-l border-dashed border-black/8" />
      <div className="absolute inset-y-0 right-[270.5px] border-r border-dashed border-black/8" />
    </div>
  );
}
