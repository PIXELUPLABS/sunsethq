export type WhyReplayStatement = {
  title: string;
  body: string;
};

export type Value = {
  title: string;
  body: string;
};

export type Role = {
  id: string;
  title: string;
  location: string;
  employmentType: string;
  /** Only rendered if supplied - never a placeholder range. */
  compensation?: string;
  description: string;
  applyHref: string;
};

export type Team = {
  name: string;
  roles: Role[];
};
