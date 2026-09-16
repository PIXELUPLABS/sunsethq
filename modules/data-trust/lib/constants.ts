import type { AssuranceRow } from "../types";

/** The three-up index beneath the de-identification copy. Cycles the same
 *  way the home page's "How it works" steps do: click to jump to a step,
 *  or let its progress strip fill and auto-advance. */
export const DEIDENTIFICATION_STEPS = [
  "[01] DEIDENTIFICATION",
  "[02] DETECTION",
  "[03] THE STANDARD",
];

/** Matches `HOW_IT_WORKS_STEP_INTERVAL_MS` on the home page - same pace. */
export const DEIDENTIFICATION_STEP_INTERVAL_MS = 5000;

export const DEIDENTIFICATION_BODY =
  "Names, emails, API keys, access tokens, customer records. Our de-identification covers 60+ categories, across every file type and application your business works in.";

export const ASSURANCE_ROWS: AssuranceRow[] = [
  {
    tagLabel: "Jurisdiction",
    title: "Most companies can do this.",
    body: [
      "With Replay, you never are licensing raw data. Anything containing customer or employee information first comes to us solely for the purpose of de-identification. Only once the data has been cleaned is it ever licensed.",
      "This structure makes it so if you've ever promised customers or employees that you wouldn't sell their data, you still aren't.",
    ],
    headingTracking: "tight",
    bodySize: "sm",
  },
  {
    tagLabel: "Jurisdiction",
    title: "We work alongside your team",
    body: [
      "Replay works through the legal groundwork with your team: what's in scope, what comes out, and what your agreements actually allow. With every new data pull, comes continuous data processing, defensibility, and regulatory cover.",
    ],
    headingTracking: "tight",
    bodySize: "base",
  },
  {
    tagLabel: "Jurisdiction",
    title: "Your exposure is capped.",
    body: [
      "You'll be asked to represent that the data is yours to license. However, we understand it's almost impossible to verify whether a decade of docs include IP you're not allowed to share.",
      "To fix this, we do three things. We work through it with you so the representation you're making is one you can actually stand behind, we de-identify and remove high-risk data, and we cap your exposure to just the fees paid.",
    ],
    headingTracking: "open",
    bodySize: "base",
  },
  {
    tagLabel: "Jurisdiction",
    title: "You keep everything",
    body: [
      "This is a license, not a sale. Your data, your source code, your trademarks and your IP all remain yours. Replay is licensed to use the cleaned version, and nothing is transferred. If you decide not to continue, your data is deleted from Replay on request.",
    ],
    headingTracking: "open",
    bodySize: "base",
  },
];
