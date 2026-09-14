import type { Team, Value, WhyReplayStatement } from "../types";

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

/**
 * Illustrative only - no real open roles were found anywhere in this repo
 * or the live site at the time this page was built. Confirm real team
 * names and current openings before shipping; do not treat these as live
 * listings.
 */
export const TEAMS: Team[] = [
  {
    name: "Engineering",
    roles: [
      {
        id: "ml-engineer",
        title: "Machine Learning Engineer",
        location: "Remote (US)",
        employmentType: "Full-time",
        description:
          "Work on the detection models that find PII across Slack threads, support tickets, code commits, PDFs, images, and email — the pipeline that currently finds 3x more identifiers than the leading frontier model on our benchmark. You'll own accuracy and recall across new data sources as we add them.",
        applyHref: "#",
      },
      {
        id: "product-engineer",
        title: "Product Engineer",
        location: "Remote (US)",
        employmentType: "Full-time",
        description:
          "Build the systems companies use to connect their data sources, review a valuation, and track a license end to end — from first call to ongoing payout. Full-stack, small team, direct ownership of what you ship.",
        applyHref: "#",
      },
      {
        id: "design-engineer",
        title: "Design Engineer",
        location: "Remote (US)",
        employmentType: "Full-time",
        description:
          "Shape how Replay explains a genuinely unfamiliar transaction — licensing your own operating data — clearly enough that a founder or ops lead trusts it on first read. Equal parts interface and interaction craft.",
        applyHref: "#",
      },
    ],
  },
  {
    name: "Data / Trust & Safety",
    roles: [],
  },
  {
    name: "Go-to-Market",
    roles: [],
  },
];

export const DONT_SEE_A_FIT_BODY =
  "We're always interested in people who think they should be working on Replay. Tell us why.";

/** Confirm the real inbox/domain before shipping. */
export const CAREERS_EMAIL = "careers@replay.xyz";
