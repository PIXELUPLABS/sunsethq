const DOT_COUNT = 13;

const PAGE_TEXTURE = "/images/grain-light-texture-optimized.svg";
const PAGE_TEXTURE_TILE_SIZE = "20px 20px";

const BLUE_DEEP: [number, number, number] = [19, 50, 100];
const BLUE_BRIGHT: [number, number, number] = [20, 125, 186];
const GRADIENT_SPAN = 100 / 160;

function dotColor(index: number) {
  const progress = ((index - 1) / (DOT_COUNT - 2)) * GRADIENT_SPAN;
  const [r, g, b] = BLUE_DEEP.map((start, i) => Math.round(start + (BLUE_BRIGHT[i] - start) * progress));
  return `rgb(${r}, ${g}, ${b})`;
}

export function FormDecorativeRail({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none flex flex-col items-center justify-between ${className ?? ""}`}
    >
      {Array.from({ length: DOT_COUNT }).map((_, index) =>
        index === 0 ? (
          <div
            key={index}
            className="size-4 shrink-0 rounded-full shadow-[inset_0_1.6px_3.3px_rgba(0,0,0,0.25)]"
            style={{
              backgroundImage: `url(${PAGE_TEXTURE})`,
              backgroundSize: PAGE_TEXTURE_TILE_SIZE,
            }}
          />
        ) : (
          <div
            key={index}
            className="size-4 shrink-0 rounded-full shadow-[inset_0_1.6px_3.3px_rgba(0,0,0,0.25)]"
            style={{ backgroundColor: dotColor(index) }}
          />
        ),
      )}
    </div>
  );
}
