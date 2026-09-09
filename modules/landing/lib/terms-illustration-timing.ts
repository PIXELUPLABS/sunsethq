// Timing extracted from Figma (node 6079:25491, "htw-2") via get_motion_context.
// Loops forever (loopMode "loop"), unlike the Value illustration's one-shot reveal.

export const TERMS_ILLUSTRATION_DURATION_MS = 5500;

type Beat = { delayMs: number; durationMs: number };

export const TERMS_TIMING = {
  card1: { delayMs: 0, durationMs: 367 } as Beat,
  cardShadow: { delayMs: 0, durationMs: 500 } as Beat,

  rows: [
    { delayMs: 635.25, durationMs: 303.05 }, // row-1
    { delayMs: 663.85, durationMs: 303.05 }, // row-2
    { delayMs: 693.55, durationMs: 302.5 }, // row-3
    { delayMs: 717.75, durationMs: 302.5 }, // row-4
    { delayMs: 743.05, durationMs: 303.05 }, // row-5
    { delayMs: 768.9, durationMs: 302.5 }, // row-6
    { delayMs: 790.9, durationMs: 302.5 }, // row-7
    { delayMs: 812.35, durationMs: 302.5 }, // row-8
    { delayMs: 836, durationMs: 302.5 }, // row-9
    { delayMs: 861.3, durationMs: 302.5 }, // row-10
    { delayMs: 885.5, durationMs: 302.5 }, // row-11
    { delayMs: 911.35, durationMs: 302.5 }, // row-12
    { delayMs: 933.35, durationMs: 302.5 }, // row-13
    { delayMs: 953.7, durationMs: 303.05 }, // row-14
    { delayMs: 975.15, durationMs: 302.5 }, // row-15
    { delayMs: 994.4, durationMs: 303.05 }, // row-16
    { delayMs: 1018.6, durationMs: 302.5 }, // row-17
    { delayMs: 1043.35, durationMs: 302.5 }, // row-18
    { delayMs: 1065.35, durationMs: 302.5 }, // row-19
  ] satisfies Beat[],
  divider: { delayMs: 994.4, durationMs: 303.05 } as Beat,

  card2: { delayMs: 836, durationMs: 366.85 } as Beat,
  card3: { delayMs: 1680.8, durationMs: 366.85 } as Beat,
  cardContent: { delayMs: 1680.8, durationMs: 500 } as Beat,

  subtitleLeft: { delayMs: 2194, durationMs: 492 } as Beat,
  subtitleRight: { delayMs: 2996.4, durationMs: 499.95 } as Beat,
  barLeft: { delayMs: 2187.9, durationMs: 499.95 } as Beat,
  barsRight: { delayMs: 2994.2, durationMs: 499.95 } as Beat,

  // Two-phase diagonal connector lines: grow to mid-height in sync with
  // Card-2's reveal, hold, then grow to full height in sync with Card-3's.
  connectorLine: {
    phase1DelayMs: 836,
    phase1DurationMs: 366.85,
    phase2DelayMs: 1679.15,
    phase2DurationMs: 368.5,
  },
} as const;
