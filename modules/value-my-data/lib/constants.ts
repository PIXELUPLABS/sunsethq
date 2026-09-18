import type { Benefit } from "../types";

export const VALUE_MY_DATA_EYEBROW = "Data Valuation";
// Split so the hero can keep "could be worth." on one line: "could" should
// never end the first line, whatever the viewport.
export const VALUE_MY_DATA_HEADLINE_LEAD = "See what your data";
export const VALUE_MY_DATA_HEADLINE_TAIL = "could be worth.";
export const VALUE_MY_DATA_BODY =
  "Replay helps companies turn the data they already generate into a new source of revenue — without licensing raw customer or employee data.";

export const BENEFITS: Benefit[] = [
  {
    icon: "search",
    title: "Understand the opportunity",
    body: "See whether your data could have licensing potential.",
  },
  {
    icon: "briefcase",
    title: "Built around your business",
    body: "We assess the data your company already generates.",
  },
  {
    icon: "chart",
    title: "Know what it could be worth",
    body: "Get an initial view of the opportunity and potential value.",
  },
  {
    icon: "shield",
    title: "Your data stays protected",
    body: "Everything is de-identified before it can ever be licensed.",
  },
];

export {
  YEARS_OF_OPERATION_OPTIONS,
  BUSINESS_SIZE_OPTIONS,
  ENGLISH_SHARE_OPTIONS,
} from "@/modules/lead-capture/lib/lead-schema";
