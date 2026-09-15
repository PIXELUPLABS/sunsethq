const DOT_COUNT = 13;

/**
 * Purely decorative vertical rail of dots down the form card's left inner
 * edge - lifted structurally from the Figma "Value My Data" card comp
 * (node 6750:673 in file AYzBKhVneW9mct6tUchEo7), which itself is Pogo's
 * own dot-rail motif with Replay's copy dropped in. Recolored here:
 * the source's dots reuse its own backdrop color (`#b2d1af` sage green)
 * rather than contrasting it, so this keeps that same "echo the backdrop"
 * relationship using Replay's own `#eaebf1` backdrop tone instead
 * (`value-my-data-hero.tsx`'s backdrop block, also `cta-section.tsx`'s
 * top-band color) - only the first dot stays white.
 */
export function FormDecorativeRail({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none flex flex-col items-center gap-[17px] ${className ?? ""}`}
    >
      {Array.from({ length: DOT_COUNT }).map((_, index) => (
        <div
          key={index}
          className={`size-4 shrink-0 rounded-full shadow-[inset_0_1.6px_3.3px_rgba(0,0,0,0.25)] ${
            index === 0 ? "bg-white" : "bg-[#eaebf1]"
          }`}
        />
      ))}
    </div>
  );
}
