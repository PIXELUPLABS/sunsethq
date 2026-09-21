import type {
  BuyerCard,
  DataCategory,
  FooterColumn,
  IndustryCard,
  NavLink,
  StatItem,
} from "../types";

export const NAV_LINKS: NavLink[] = [
  { label: "Data privacy", href: "/data-privacy", isRoute: true },
  { label: "Careers", href: "/careers", isRoute: true },
];

export const HERO_STATS: StatItem[] = [
  { value: "Millions", label: "Paid to businesses like yours" },
  { value: "Billions", label: "Personal identifiers removed" },
];

export const DATA_CATEGORIES: DataCategory[] = [
  { label: "Code and commits", icon: "code" },
  { label: "Internal docs", icon: "internal-docs" },
  { label: "Decision threads", icon: "decision-threads" },
  { label: "CRM Data", icon: "crm" },
  { label: "Financial Records", icon: "billing" },
  { label: "Sales conversations", icon: "sales" },
  { label: "Support History", icon: "support" },
  { label: "Presentations", icon: "product-data" },
  { label: "Product logs", icon: "product-logs" },
  { label: "Analytics", icon: "support-history" },
];

export const PRICING_TIERS = [
  { value: "$10K - $100K", people: "20 - 50 Employees", segments: 2, tone: "muted" as const },
  { value: "$100K - $1M", people: "50 - 250 Employees", segments: 7, tone: "cyan" as const },
  { value: "$1,000,000+", people: "250+ Employees", segments: 11, tone: "blue" as const },
];

export const HOW_IT_WORKS_STEP_INTERVAL_MS = 15000;

export const REVENUE_STREAM_TILE_MS = 200;

/**
 * How long the How it works media is hidden for while it moves to sit under
 * the newly opened step on phones. Half of it fades out, half fades back in,
 * so the whole swap fits inside the accordion's own 500ms transition.
 */
export const VALUATION_MEDIA_SWAP_MS = 200;

/**
 * Universal scroll-play rule for on-page animations and videos: they start
 * once this much of the element is visible, pause once it has fully left
 * the viewport, and restart from the beginning the next time it comes in.
 */
export const SCROLL_PLAY_THRESHOLD = 0.3;

export const VALUATION_STEPS = [
  {
    label: "Value",
    title: "Get a valuation",
    description:
      "Replay reviews your industry, the systems you run on, how much data sits in each, and how your team worked, to understand what it's worth.",
    image: "/images/valuation/how-it-works/valuation-illustration.png",
    alt: "Illustration of stacked data cards totalling an 8M indicated value across 25M+ records",
  },
  {
    label: "Terms",
    title: "Receive an offer",
    description:
      "Replay presents an offer to license your data. These are typically structured as an upfront cash payment plus a perpetual revenue share.",
    image: "/images/valuation/how-it-works/terms-illustration.png",
    alt: "Illustration of an offer to license card showing an $8M indicated total split between an upfront payment and a perpetual revenue share",
  },
  {
    label: "Protect",
    title: "De-identify your data",
    description:
      "We securely export your data and remove every category of identifying information, from names and emails to customer records and account numbers.",
    image: "/images/valuation/how-it-works/protect-illustration.png",
    alt: "Illustration of records having identifying information stripped out during de-identification",
  },
  {
    label: "Payout",
    title: "Get paid",
    description:
      "You're paid for your historical data first. New data you produce follows the same path, and continues to pay you.",
    image: "/images/valuation/how-it-works/payout-illustration.png",
    alt: "Bar chart illustration showing payments over time, starting with historical data and continuing with recurring new data",
  },
];

export const DEIDENTIFICATION_TABS = ["PII Coverage", "Our Pipeline", "Data Policy"] as const;

export type DeidentificationTab = (typeof DEIDENTIFICATION_TABS)[number];

export type DeidentificationCopy = {
  heading: string;
  paragraphs: string[];
};

export const DEIDENTIFICATION_COPY: Record<DeidentificationTab, DeidentificationCopy> = {
  "PII Coverage": {
    heading: "Your data leaves cleaner than a medical record.",
    paragraphs: [
      "The federal standard for de-identifying medical records (HIPAA) lists eighteen categories that have to be stripped out. We cover all eighteen, and many more. Names, emails, API keys, access tokens, customer records. Our methods cover 60+ categories, across every file type and application your business works in.",
    ],
  },
  "Our Pipeline": {
    heading: "We built the pipeline and trained the model.",
    paragraphs: [
      "General-purpose models aren't trained to find PII in Slack threads, support tickets or commit messages. So we trained one that is. On the same benchmark, our model identifies 99% of PII where NVIDIA's GLINER model found 36%. The model is only the first layer. An ensemble of processing stages runs behind it, so nothing depends on a single pass.",
    ],
  },
  "Data Policy": {
    heading: "Set the scope and only license what you grant access to.",
    paragraphs: [
      "Every engagement runs in its own isolated environment. No shared storage, processing, or paths between one client's data and another's. And most importantly, only de-identified data is ever licensed. Raw data is never sold or shared, and never leaves the pipeline.",
    ],
  },
};

export const BUYER_CARDS: BuyerCard[] = [
  {
    id: "entity",
    headline: "Your data is only sold to frontier AI and data labs.",
  },
  {
    id: "jurisdiction",
    headline: "Your data is never sold to foreign adversaries or resold through brokers.",
  },
];

export const INDUSTRY_CARDS: IndustryCard[] = [
  { label: "Legal", icon: "gavel", className: "left-0 top-[26%]" },
  { label: "Tech", icon: "heart", className: "left-[31%] top-0" },
  { label: "Services", icon: "user-box", className: "right-0 top-[22%]" },
  { label: "E-commerce", icon: "file", className: "left-[9%] top-[47%]" },
  { label: "B2C", icon: "film", className: "right-[3%] top-[47%]" },
  { label: "Hardware", icon: "zap", className: "left-0 bottom-0" },
  { label: "Finance", icon: "landmark", className: "left-[31%] bottom-0" },
  { label: "CPG", icon: "box", className: "right-0 bottom-[6%]" },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/#overview" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "De-identification", href: "/#de-identification" },
      { label: "Who it's for", href: "/#who-its-for" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Data privacy", href: "/data-privacy" },
      { label: "Careers", href: "/careers" },
    ],
  },
];

export const PROCESS_BAR_COLORS = [
  "#499df8",
  "#54702f",
  "#7e7e7e",
  "#eae058",
  "#499df8",
  "#54702f",
] as const;

export const NAV_STRIP_SEGMENTS = [
  { color: "#499df8", width: "237.182px" },
  { color: "#54702f", width: "93px" },
  { color: "#7e7e7e", width: "264.289px" },
  { color: "#499df8", width: "52.18px" },
  { color: "#54702f", width: "142.309px" },
  { color: "#7e7e7e", width: "262.256px" },
] as const;
