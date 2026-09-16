import type { Value, WhyReplayStatement } from "../types";

export const CAREERS_EYEBROW = "Careers";

export const CAREERS_INTRO =
  "We're a small team of engineers, data scientists, and operators building that pipeline end to end — and we're looking for people who want real ownership over hard, consequential work.";

export const TEAM_COLLAGE_EYEBROW = "Inside Replay";

export const TEAM_COLLAGE_TITLE = "The people behind the work.";

export const TEAM_COLLAGE_BODY =
  "We're a small team building ambitious things together — with plenty happening beyond the screen too.";

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

export const VALUES: Value[] = [
  {
    title: "Be the painkiller",
    body: "Lead with empathy, understand the fundamental problem, and fix it.",
    icon: "/images/careers/values-icons/pill.svg",
  },
  {
    title: "Keep your promises",
    body: "If you say you're going to do something, do it. Follow through every time.",
    icon: "/images/careers/values-icons/shield-check.svg",
  },
  {
    title: "Swing big, learn fast",
    body: "Bias towards action, learn by doing, and pursue the big opportunities.",
    icon: "/images/careers/values-icons/trend-up.svg",
  },
  {
    title: "Make it world-class",
    body: "With everything you do, no matter how big or small, ask: “is this world-class?”",
    icon: "/images/careers/values-icons/sparkle.svg",
  },
  {
    title: "Carry each other",
    body: "We win and we lose as one team. Show humility, help your teammates.",
    icon: "/images/careers/values-icons/unite.svg",
  },
  {
    title: "Set good goals",
    body: "What’s outcome (not the output) you’re aiming to achieve. Make it clear and measurable.",
    icon: "/images/careers/values-icons/cube-transparent.svg",
  },
];

export const DONT_SEE_A_FIT_BODY =
  "We're always interested in people who think they should be working on Replay. Tell us why.";

/** Confirm the real inbox/domain before shipping. */
export const CAREERS_EMAIL = "careers@replay.xyz";
