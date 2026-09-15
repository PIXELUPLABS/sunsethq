import type { Value, WhyReplayStatement } from "../types";

export const CAREERS_EYEBROW = "Careers";

export const CAREERS_INTRO =
  "We're a small team of engineers, data scientists, and operators building that pipeline end to end — and we're looking for people who want real ownership over hard, consequential work.";

/**
 * The 3x/60+ categories figures and "isolated tenancy" language are
 * already-published product claims (see the de-identification section on
 * the homepage) - not invented for this page.
 */
export const WHY_REPLAY_STATEMENTS: WhyReplayStatement[] = [
  {
    title: "The bar is real.",
    body: "Our de-identification models find 3x more identifiers than the leading frontier model, on the same benchmark, across 60+ categories. That number is public. It's the floor, not the ceiling.",
  },
  {
    title: "The stakes are real.",
    body: "Get de-identification wrong and it isn't a bug ticket — it's someone's name in a dataset that should never have reached it. Isolated tenancy and no cross-client access are built into the pipeline because “probably fine” isn't a standard we accept.",
  },
  {
    title: "The ownership is real.",
    body: "Small team, no layer between the person who builds a piece of the pipeline and the company whose data runs through it.",
  },
];

/**
 * Placeholder values, per review feedback - no About page/module exists
 * yet in this repo to source real values from. Replace wholesale once
 * About defines the canonical list; Careers should then import that exact
 * content rather than keep its own.
 */
export const VALUES: Value[] = [
  {
    title: "Protect what isn't ours",
    body: "Every dataset we handle belongs to someone else first. Treat it that way.",
  },
  {
    title: "Show your work",
    body: "Named buyers, a published de-identification standard, verifiable numbers — for customers and for each other.",
  },
  {
    title: "Small team, real ownership",
    body: "Everyone touches the pipeline end to end. No layer between the work and the person who did it.",
  },
  {
    title: "Move at the speed of trust",
    body: "Fast, but never faster than the diligence requires.",
  },
  {
    title: "Make it defensible",
    body: "If we can't explain a decision plainly, we don't ship it.",
  },
  {
    title: "Compound the boring parts",
    body: "The unglamorous infrastructure work — de-identification, verification, compliance — is the product.",
  },
];

export const DONT_SEE_A_FIT_BODY =
  "We're always interested in people who think they should be working on Replay. Tell us why.";

/** Confirm the real inbox/domain before shipping. */
export const CAREERS_EMAIL = "careers@replay.xyz";
