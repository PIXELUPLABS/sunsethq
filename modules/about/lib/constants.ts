import type { GrowthCard, LetterCard, PurposePoint, PurposeRow } from "../types";

export const ABOUT_EYEBROW = "Our story";

export const ABOUT_HEADING = "We exist to give companies a new way to grow.";

export const FOUNDER_LETTER = {
  title: "I’ve started too many companies.",
  body: [
    "I sold one. I shut one down. And I started one called Sunset, which has helped thousands of founders wind down their companies.",
    "So I know what it’s like to give up equity for cash. I’ve felt the pain of not having enough money to keep the lights on. And I’ve experienced the magic of having the capital to truly scale.",
    "Over years of helping companies wind down, we kept seeing the same thing. The emails, Slack threads, docs, tickets and source code were all left behind. Nobody thought they were worth anything, because they never had been.",
    "That’s changed. Frontier AI labs have run out of public data. What they need now is exactly what every company produces every day: the record of how real work happens.",
  ],
  closingLine: "So we built Replay.",
} as const;

export const OUR_STORY_EYEBROW = "Our story";

export const OUR_STORY_TITLE = "From the founder";

export const LETTER_CARDS: LetterCard[] = [
  {
    number: "01",
    label: "Where I've been",
    title: "I've started too many companies.",
    body: [
      "I sold one. I shut one down. And I started one called Sunset, which has helped thousands of founders wind down their companies.",
      "So I know what it's like to give up equity for cash. I've felt the pain of not having enough money to keep the lights on. And I've experienced the magic of having the capital to truly scale.",
    ],
  },
  {
    number: "02",
    label: "What we noticed",
    title: "Almost all of the work disappears.",
    body: [
      "Over years of helping companies wind down, we kept seeing the same thing. The emails, Slack threads, docs, tickets and source code were all left behind. Nobody thought they were worth anything, because they never had been.",
      "That's changed. Frontier AI labs have run out of public data. What they need now is exactly what every company produces every day: the record of how real work happens.",
    ],
    closingLine: "So we built Replay.",
  },
];

export const FOUNDER_NAME = "Brendan Mahony";

export const FOUNDER_TITLE = "Founder & CEO";

export const OUR_PURPOSE_EYEBROW = "Our purpose";

export const OUR_PURPOSE_HEADING = "Your data should earn, just like your cash.";

export const OUR_PURPOSE_BODY =
  "Just like you keep your cash in a bank and earn yield on it, our purpose is to help you do the same with your operating data.";

export const PURPOSE_ROWS: PurposeRow[] = [
  {
    label: "What you already do",
    muted: true,
    nodes: [
      { label: "Asset", value: "Cash", tone: "muted" },
      { label: "Kept with", value: "A bank", tone: "muted" },
      { label: "Earns", value: "Yield", tone: "muted" },
    ],
  },
  {
    label: "What Replay does",
    nodes: [
      { label: "Asset", value: "Operating data", tone: "outline" },
      { label: "Kept with", value: "Replay", tone: "highlight" },
      { label: "Earns", value: "Yield", tone: "outline", showYieldBar: true },
    ],
  },
];

export const OUR_PURPOSE_POINTS: PurposePoint[] = [
  {
    title: "An asset you already own",
    body: "It's the record of how your company actually operates. It sat idle because there was never anywhere to sell it. Now there is.",
  },
  {
    title: "Yield that keeps coming",
    body: "You're paid up front, plus a revenue share of every license. And because your company keeps producing data, the revenue recurs.",
  },
];

export const GROWTH_EYEBROW = "A new way to grow";

export const GROWTH_HEADING = "Growth shouldn't cost you the company.";

export const GROWTH_BODY =
  "Sector, stage and record classes are published with the seller's consent. Nothing here identifies a customer, an employee or a counterparty.";

export const GROWTH_CARDS: GrowthCard[] = [
  {
    title: "Giving up equity",
    body: "Raising a round costs a piece of your company.",
    tagLabel: "Entity",
  },
  {
    title: "Taking on debt",
    body: "It has to be paid back no matter what.",
    tagLabel: "Debt",
  },
  {
    title: "Cutting burn",
    body: "The cuts land on the team you spent years building.",
    tagLabel: "Burn",
  },
  {
    title: "Waiting on customers",
    body: "New customers take quarters you may not have.",
    tagLabel: "Time",
  },
  {
    title: "License the data you already own.",
    body: "Something you already own that's been sitting idle for years. It costs you none of the above.",
    tagLabel: "Replay",
  },
];
