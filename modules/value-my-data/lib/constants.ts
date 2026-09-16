import type { Benefit } from "../types";

export const VALUE_MY_DATA_EYEBROW = "Data Valuation";
export const VALUE_MY_DATA_HEADLINE = "See what your data could be worth.";
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

export const DATA_TYPE_OPTIONS = [
  "Customer conversations",
  "Support data",
  "Sales data",
  "Internal communications",
  "Code & technical data",
  "Documents & files",
  "Other",
];

export const COMPANY_SIZE_OPTIONS = [
  "1–50",
  "51–200",
  "201–500",
  "501–1,000",
  "1,001–5,000",
  "5,000+",
];
