export type LetterCard = {
  number: string;
  label: string;
  title: string;
  body: string[];
  closingLine?: string;
};

export type PurposeNodeTone = "muted" | "outline" | "highlight";

export type PurposeNode = {
  label: string;
  value: string;
  tone: PurposeNodeTone;
  showYieldBar?: boolean;
};

export type PurposeRow = {
  label: string;
  nodes: PurposeNode[];
  muted?: boolean;
};

export type PurposePoint = {
  title: string;
  body: string;
};

export type GrowthCard = {
  title: string;
  body: string;
  tagLabel: string;
};
