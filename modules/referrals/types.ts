export type PayoutPointIcon = "contract" | "coin";

export type PayoutPoint = {
  icon: PayoutPointIcon;
  title: string;
  body: string;
};

export type ProcessStep = {
  number: string;
  title: string;
  body: string;
};

export type EligibilityCriterion = {
  title: string;
  body: string;
  tagLabel: string;
};
