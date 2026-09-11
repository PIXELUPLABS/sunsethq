import type {
  BuyerCard,
  DataCategory,
  FooterColumn,
  IndustryCard,
  NavLink,
  StatItem,
} from "../types";

export const NAV_LINKS: NavLink[] = [
  { label: "What you earn", href: "#what-you-earn" },
  { label: "How it works", href: "#how-it-works" },
  { label: "De-identification", href: "#de-identification" },
  { label: "Who it's for", href: "#who-its-for" },
];

export const HERO_STATS: StatItem[] = [
  { value: "90 min", label: "First call to wire" },
  { value: "$50+", label: "Paid for a single dataset" },
  { value: "25M+", label: "Names & identifiers stripped" },
  { value: "4/5", label: "Frontier AI labs, working with" },
];

export const DATA_CATEGORIES: DataCategory[] = [
  { label: "Product logs", icon: "product-logs" },
  { label: "Support history", icon: "support-history" },
  { label: "Decision threads", icon: "decision-threads" },
  { label: "Product data", icon: "product-data" },
  { label: "Billing", icon: "billing" },
  { label: "Internal docs", icon: "internal-docs" },
  { label: "Support", icon: "support" },
  { label: "CRM", icon: "crm" },
  { label: "Code and commits", icon: "code" },
  { label: "Sales conversations", icon: "sales" },
];

export const PRICING_TIERS = [
  { value: "$10K+", people: "<25 People", segments: 2, tone: "muted" as const },
  { value: "$100K+", people: "25-100 People", segments: 7, tone: "cyan" as const },
  { value: "$1M+", people: "100+ People", segments: 11, tone: "blue" as const },
];

export const HOW_IT_WORKS_STEP_INTERVAL_MS = 5000;

/**
 * How long one revenue-stream tile takes to settle back into its slot.
 * The tiles are also sequenced a full transition apart, so this sets the
 * pace of the whole shelf animation: ten tiles run in 10x this.
 */
export const REVENUE_STREAM_TILE_MS = 320;

export const VALUATION_STEPS = [
  {
    label: "Value",
    title: "Get a valuation",
    description:
      "Replay reviews your industry, the systems you run on, how much data sits in each, and how your team worked, to understand what it's worth.",
    image: "/images/valuation-illustration.png",
    alt: "Illustration of stacked data cards totalling an 8M indicated value across 25M+ records",
  },
  {
    label: "Terms",
    title: "Receive an offer",
    description:
      "Based on the valuation, Replay presents an offer to license your data. These are typically structured as an upfront cash payment plus a perpetual revenue share.",
    image: "/images/terms-illustration.png",
    alt: "Illustration of an offer to license card showing an $8M indicated total split between an upfront payment and a perpetual revenue share",
  },
  {
    label: "Protect",
    title: "De-identify your data",
    description:
      "We securely export your data and remove every category of identifying information, from names and emails to customer records and account numbers.",
    image: "/images/protect-illustration.png",
    alt: "Illustration of records having identifying information stripped out during de-identification",
  },
  {
    label: "Payout",
    title: "Get paid",
    description:
      "You're paid for your historical data first. New data you produce follows the same path, and continues to pay you.",
    image: "/images/payout-illustration.png",
    alt: "Bar chart illustration showing payments over time, starting with historical data and continuing with recurring new data",
  },
];

export const DEIDENTIFICATION_TABS = ["Coverage", "The pipeline", "Policy"] as const;

export type DeidentificationTab = (typeof DEIDENTIFICATION_TABS)[number];

export const BUYER_CARDS: BuyerCard[] = [
  {
    headline: "Frontier labs and data labs, not brokers reselling on.",
    tagLabel: "Entity",
    icon: "entity",
    tone: "dark",
  },
  {
    headline: "US buyers only. No foreign adversaries, no exceptions.",
    tagLabel: "Jurisdiction",
    icon: "jurisdiction",
    tone: "light",
  },
  {
    headline: "Named buyers. You see who they are before anything moves.",
    tagLabel: "Identity",
    icon: "identity",
    tone: "light",
  },
];

export const INDUSTRY_CARDS: IndustryCard[] = [
  { label: "Legal", icon: "gavel", className: "left-0 top-[26%]" },
  { label: "Healthcare", icon: "heart", className: "left-[31%] top-0" },
  { label: "Service", icon: "user-box", className: "right-0 top-[22%]" },
  { label: "Insurance", icon: "file", className: "left-[9%] top-[47%]" },
  { label: "Media", icon: "film", className: "right-[3%] top-[47%]" },
  { label: "Energy", icon: "zap", className: "left-0 bottom-0" },
  { label: "Finance", icon: "landmark", className: "left-[31%] bottom-0" },
  { label: "CPG", icon: "box", className: "right-0 bottom-[6%]" },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    index: "01",
    title: "Product",
    links: ["Overview", "How it works", "Valuation", "Data cleaning"],
  },
  {
    index: "02",
    title: "Company",
    links: ["About", "Customers", "Blog", "Careers"],
  },
  {
    index: "03",
    title: "Partners",
    links: ["Clients", "Investors", "Law Firms", "Accountants"],
  },
  {
    index: "04",
    title: "Legal",
    links: ["Privacy", "Terms", "Cookies", "Compliance"],
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

/**
 * The bar along the bottom of the open mobile menu. Widths are the design's
 * own pixel values against a 1440px canvas, kept as pixels because the menu
 * shows only the left-hand slice of the bar - see NavColorStrip.
 */
export const NAV_STRIP_SEGMENTS = [
  { color: "#499df8", width: "237.182px" },
  { color: "#54702f", width: "93px" },
  { color: "#7e7e7e", width: "264.289px" },
  { color: "#499df8", width: "52.18px" },
  { color: "#54702f", width: "142.309px" },
  { color: "#7e7e7e", width: "262.256px" },
] as const;
