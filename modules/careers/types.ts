export type WhyReplayStatement = {
  title: string;
  body: string;
};

export type Value = {
  title: string;
  body: string;
  /** Path under `public/images/careers/values-icons/`. */
  icon: string;
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

/**
 * One photo in the culture collage (`team-collage-section.tsx`).
 * `widthCqw`/`heightCqw` are set to the same ratio as the source image
 * itself (see `team-collage-items.ts`) so it renders full-bleed with
 * `object-cover` and nothing gets cropped or letterboxed.
 */
export type CollagePhoto = {
  id: string;
  src: string;
  alt: string;
  /** Position/size as a percentage of the collage container's own width
   * (not height) - see `team-collage-section.tsx` for why. */
  leftCqw: number;
  topCqw: number;
  widthCqw: number;
  heightCqw: number;
  rotationDeg: number;
  /** Stacking order before any hover interaction - the hovered photo is
   * always raised above this regardless of its own value. */
  baseZ: number;
};
