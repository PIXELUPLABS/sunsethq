export type NavLink = {
  label: string;
  href: string;
  /** A route rather than a section anchor, so it skips the `linkBase` prefix. */
  isRoute?: boolean;
};

export type StatItem = {
  value: string;
  label: string;
};

export type DataCategory = {
  label: string;
  icon: "product-logs" | "support-history" | "decision-threads" | "product-data" | "billing" | "internal-docs" | "support" | "crm" | "code" | "sales";
};

export type BuyerCard = {
  headline: string;
  tagLabel: string;
  icon: "entity" | "jurisdiction" | "identity";
  tone: "dark" | "light";
};

export type IndustryCard = {
  label: string;
  icon: "heart" | "film" | "file" | "user-box" | "gavel" | "zap" | "box" | "landmark";
  className: string;
};

export type FooterColumn = {
  index: string;
  title: string;
  links: string[];
};
