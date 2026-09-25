import type { EligibilityCriterion, PayoutPoint, ProcessStep } from "../types";

export const REFERRALS_EYEBROW = "Referrals";

export const REFERRALS_INTRO =
  "Know a company sitting on years of operating data? Refer them to Replay. If we license their data, they get paid and so do you: $10,000 or 10% of their upfront fee, whichever is greater. No cap on referrals.";

export const REFER_A_COMPANY_LABEL = "Refer a company";

export const REFER_A_COMPANY_HREF = "#refer";

export const PAYOUTS_EYEBROW = "Referral payouts";

export const PAYOUTS_POINTS: PayoutPoint[] = [
  {
    icon: "contract",
    title: "How it's calculated",
    body: "$10,000 or 10% of the company's upfront licensing fee, whichever is greater. Every referral that closes pays at least $10,000. Larger companies mean larger upfront fees, and larger payouts.",
  },
  {
    icon: "coin",
    title: "How you're paid",
    body: "Replay pays you the day the company's upfront fee lands. It's paid on top of what they receive, never out of it. One-time per company, and no cap on how many companies you refer.",
  },
];

export const HOW_IT_WORKS_EYEBROW = "The process";

export const HOW_IT_WORKS_HEADING = "How it works.";

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Submit a referral",
    body: "Tell us the company and your contact there.",
  },
  {
    number: "02",
    title: "We reach out",
    body: "Replay contacts them, mentions you, and runs a valuation of their data.",
  },
  {
    number: "03",
    title: "They license their data",
    body: "If it's a fit, we'll send an offer and license their data.",
  },
  {
    number: "04",
    title: "You get paid",
    body: "The same day their upfront fee lands, you'll get paid.",
  },
];

export const ELIGIBILITY_EYEBROW = "Eligibility";

export const ELIGIBILITY_HEADING = "What companies qualify.";

export const ELIGIBILITY_BODY_LINES = [
  "Not sure if a company fits?",
  "Reach out and we can tell you.",
];

export const ELIGIBILITY_CRITERIA: EligibilityCriterion[] = [
  {
    title: "20+ full-time employees",
    body: "Headcount is where most valuations start.",
    tagLabel: "Size",
  },
  {
    title: "English-language operations",
    body: "US companies preferred.",
    tagLabel: "Language",
  },
  {
    title: "Most industries",
    body: "If the work is documented, it likely qualifies.",
    tagLabel: "Industry",
  },
];
