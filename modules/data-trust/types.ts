export type AssuranceRow = {
  tagLabel: string;
  title: string;
  /** One entry per paragraph. */
  body: string[];
  /**
   * Two of the four headings in the design are tracked tighter than the other
   * two (-1.28px against -0.32px at 32px). Kept as drawn rather than
   * normalised so the page matches the file.
   */
  headingTracking: "tight" | "open";
  /** The design also runs the first row's body a size down from the rest. */
  bodySize: "sm" | "base";
};
