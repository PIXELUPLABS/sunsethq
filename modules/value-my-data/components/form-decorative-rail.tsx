const DOT_COUNT = 13;

/** The exact asset the page section tiles behind everything
 * (`value-my-data-hero.tsx`) - its base `#fcfcfc` fill and noise pattern
 * are baked into the one file, so using it directly here (rather than a
 * flat color) reproduces both the section's true rendered tone
 * (`rgb(246,246,246)`, measured off a real screenshot - its base fill
 * alone, `#fcfcfc`, is a few points lighter) and its grain in one asset.
 * Tiled far smaller than the section's own use of it: at this dot's 16px
 * size, the SVG's full 1440x900 viewBox just renders as a compressed,
 * fine-grained noise rather than one legible cell of the pattern - which
 * happens to be exactly what a 16px sample of it should look like. */
const PAGE_TEXTURE = "/images/grain-light-texture.svg";
const PAGE_TEXTURE_TILE_SIZE = "20px 20px";

/** The backdrop block's own gradient (`value-my-data-hero.tsx`, reused
 * from `benefits-section.tsx`): deep blue at its top, reaching bright blue
 * only at 160% of its own height. The rail runs the same height as that
 * backdrop, so each dot is tinted to the shade the gradient would show at
 * that same fractional position - the "160%" is why `GRADIENT_SPAN` caps
 * the traversal at 0.625 (100/160) instead of running dots fully to the
 * bright end. */
const BLUE_DEEP: [number, number, number] = [19, 50, 100];
const BLUE_BRIGHT: [number, number, number] = [20, 125, 186];
const GRADIENT_SPAN = 100 / 160;

function dotColor(index: number) {
  const progress = ((index - 1) / (DOT_COUNT - 2)) * GRADIENT_SPAN;
  const [r, g, b] = BLUE_DEEP.map((start, i) => Math.round(start + (BLUE_BRIGHT[i] - start) * progress));
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Decorative dot rail running the height of the form card's left gutter,
 * measured off the Figma card comp (node 6724-164 in file
 * AYzBKhVneW9mct6tUchEo7): 13 dots, 16px across, ~33px apart, the top one
 * matching the page's own background, the rest filled with a flat shade
 * sampled from the backdrop block's gradient.
 *
 * `justify-between` rather than a fixed gap - the comp's dots span its full
 * card height, and our card is content-sized, so distributing them keeps
 * the same rhythm at whatever height the fields come out to instead of
 * overflowing the last dot past the bottom edge.
 */
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
