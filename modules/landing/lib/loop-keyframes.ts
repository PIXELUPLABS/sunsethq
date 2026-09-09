// Generates standalone @keyframes rules for a looping illustration, where each
// element must hold at its "before" state, animate during its own beat window,
// then hold at its "after" state for the rest of the cycle. A shared
// delay+duration+iteration-count:infinite approach doesn't work here: with
// `infinite`, the browser repeats the short beat duration itself (not the
// full cycle), so the element blinks every `durationMs` instead of once per
// loop. Baking the delay as a leading hold inside a full-cycle keyframe (this
// file) is what actually reproduces a single reveal per loop.

export type Beat = { delayMs: number; durationMs: number };

function pct(ms: number, cycleMs: number) {
  return (ms / cycleMs) * 100;
}

export function fadeKeyframes(
  name: string,
  beat: Beat,
  cycleMs: number,
  opts: { slideX?: number; slideY?: number; opacity?: number } = {}
) {
  const { slideX = 0, slideY = 0, opacity = 1 } = opts;
  const start = pct(beat.delayMs, cycleMs);
  const end = pct(beat.delayMs + beat.durationMs, cycleMs);
  const from = `opacity: 0; transform: translate(${slideX}px, ${slideY}px);`;
  const to = `opacity: ${opacity}; transform: translate(0, 0);`;

  return `@keyframes ${name} {
    0% { ${from} }
    ${start}% { ${from} }
    ${end}% { ${to} }
    100% { ${to} }
  }`;
}

export function growKeyframes(name: string, beat: Beat, cycleMs: number, property: "width" | "height", targetCss: string) {
  const start = pct(beat.delayMs, cycleMs);
  const end = pct(beat.delayMs + beat.durationMs, cycleMs);

  return `@keyframes ${name} {
    0% { ${property}: 0.6px; }
    ${start}% { ${property}: 0.6px; }
    ${end}% { ${property}: ${targetCss}; }
    100% { ${property}: ${targetCss}; }
  }`;
}
