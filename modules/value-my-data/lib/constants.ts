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

export const YEARS_OF_OPERATION_OPTIONS = [
  "Under 2 Years",
  "2-3 years",
  "3 to 5 years",
  "5 to 10 years",
  "10+",
];

export const BUSINESS_SIZE_OPTIONS = [
  "1 to 9 people",
  "10 - 19",
  "20 - 49",
  "50 - 199",
  "200 or more",
];

export const ENGLISH_SHARE_OPTIONS = ["100%", "80% - 90%", "Less than 80%"];
