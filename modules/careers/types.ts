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
  /** Ashby's department/team name - carried on the role itself (not just
   * derived from which `Team` group it's rendered under) so search can
   * match against it. */
  team: string;
  location: string;
  employmentType: string;
  /** Only rendered if supplied - never a placeholder range. */
  compensation?: string;
  /** Ashby's `descriptionHtml` - rendered as HTML (see `role-row.tsx`), not plain text. */
  description: string;
  applyHref: string;
  /** Ashby's own posting page for this role (`jobUrl`) - captured for
   * data fidelity, not currently linked anywhere in the UI. */
  jobUrl?: string;
};

export type Team = {
  name: string;
  roles: Role[];
};
