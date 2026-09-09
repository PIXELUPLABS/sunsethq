// Timing extracted from Figma (node 6131:57, "htw-1") via get_motion_context.
// All values are milliseconds into the 4.2s build-up timeline; each entry maps
// 1:1 to one animated Figma layer so the choreography can be audited against
// the source file instead of being buried as magic numbers in JSX.

export const VALUE_ILLUSTRATION_DURATION_MS = 4200;

type Beat = { delayMs: number; durationMs: number };

export const VALUE_TIMING = {
  bigCard: { delayMs: 0, durationMs: 373 } as Beat,

  messagesContainer: { delayMs: 497, durationMs: 261 } as Beat,
  msgBg1: { delayMs: 646, durationMs: 112 } as Beat,
  msgBg2: { delayMs: 704, durationMs: 112 } as Beat,
  msgBg3: { delayMs: 758, durationMs: 112 } as Beat,
  msgBg4: { delayMs: 816, durationMs: 112 } as Beat,
  msgBg5: { delayMs: 870, durationMs: 112 } as Beat,
  msgBg6: { delayMs: 870, durationMs: 112 } as Beat,
  msgStats: { delayMs: 982, durationMs: 116 } as Beat,

  ticketsContainer: { delayMs: 1137, durationMs: 261 } as Beat,
  ticketRow1: { delayMs: 1286, durationMs: 112 } as Beat,
  ticketRow2: { delayMs: 1342, durationMs: 112 } as Beat,
  ticketRow3: { delayMs: 1398, durationMs: 112 } as Beat,
  ticketStats: { delayMs: 1510, durationMs: 116 } as Beat,

  documentsContainer: { delayMs: 1726, durationMs: 261 } as Beat,
  docPlaceholder1: { delayMs: 1875, durationMs: 112 } as Beat,
  docPlaceholder2: { delayMs: 1935, durationMs: 112 } as Beat,
  docPlaceholder3: { delayMs: 1987, durationMs: 112 } as Beat,
  docPlaceholder4: { delayMs: 2046, durationMs: 112 } as Beat,
  docStats: { delayMs: 2158, durationMs: 116 } as Beat,

  codeContainer: { delayMs: 2274, durationMs: 261 } as Beat,
  codeLines: [
    { delayMs: 2423, durationMs: 112 },
    { delayMs: 2453, durationMs: 112 },
    { delayMs: 2482, durationMs: 112 },
    { delayMs: 2511, durationMs: 112 },
    { delayMs: 2546, durationMs: 112 },
    { delayMs: 2582, durationMs: 112 },
    { delayMs: 2613, durationMs: 112 },
    { delayMs: 2639, durationMs: 112 },
    { delayMs: 2671, durationMs: 112 },
    { delayMs: 2700, durationMs: 112 },
    { delayMs: 2731, durationMs: 112 },
    { delayMs: 2761, durationMs: 112 },
    { delayMs: 2800, durationMs: 112 },
  ] satisfies Beat[],
  codeFooter: { delayMs: 2912, durationMs: 116 } as Beat,

  recordsLabel: { delayMs: 2873, durationMs: 350 } as Beat,
  borderVectors: { delayMs: 503, durationMs: 367 } as Beat,
  indicator: { delayMs: 3560, durationMs: 366 } as Beat,
} as const;
