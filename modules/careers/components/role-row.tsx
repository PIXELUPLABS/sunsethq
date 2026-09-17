import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/icons";
import type { Role } from "../types";

type RoleRowProps = {
  role: Role;
  index: number;
  isLast: boolean;
};

/**
 * Each row is a full link into the role's own page
 * (`app/careers/roles/[id]/page.tsx`) - this used to toggle an inline
 * accordion panel, but per direction the row should read as navigation
 * into the role rather than an in-place expand, so the description moved
 * to that page and the "+" became a chevron.
 *
 * "Apply Now" + the chevron are one trailing group that reveals together
 * on hover - plain text (`font-mono text-xs`, the same treatment as the
 * location/employment line below the title), no fill, no pill, no border,
 * since this is one of several rows in a list, not a standalone CTA (the
 * real primary button lives on the role's own page). The label is always
 * in the DOM at `[@media(hover:hover)]` widths so its layout space is
 * reserved - animating `opacity`/`transform` instead of conditionally
 * rendering it means the chevron doesn't jump sideways when the label
 * appears. It's `hidden` outside that media query rather than just
 * invisible, since a hover-only device would otherwise pay for space that
 * can never reveal anything.
 *
 * The whole row is the link (not just the chevron), so `group`/hover live
 * on the `<Link>` itself, and `active:!bg-black/[0.05]` gives it press
 * feedback that works on touch too (unlike hover, `:active` isn't gated
 * behind `hover:hover`) - a background shift rather than the usual
 * `scale(0.97)` button-press, since scaling a full-width row would visibly
 * squeeze its edges inward rather than read as a press. The `!important`
 * is deliberate: on a real mouse, pressing is always simultaneously
 * hovering, so `active:` and the `hover:` rule above have equal
 * specificity and would otherwise resolve by Tailwind's generated source
 * order rather than the stronger press state reliably winning.
 *
 * `mx-6` insets the link's fill from the panel's own padding edges -
 * without it, the hover/active fill ran flush against the rail's divider
 * on one side and the section's dashed frame on the other. A first pass at
 * `mx-3` (12px) measured out to an equal 37px gap from both edges (the
 * panel's own 24px padding plus the margin) but still read as tight on the
 * divider side specifically - a hard vertical stroke sitting right at the
 * edge makes the same gap look smaller than open space does on the other
 * side. `mx-6` (24px, 48px total) is the size that reads as clearly inset
 * next to that line, not just technically non-zero. No `rounded-*`: this
 * design uses sharp corners everywhere, so the fix is breathing room, not
 * softened edges.
 *
 * `border-b` lives directly on the `<Link>` now, not a separate wrapping
 * `<div>` around it - that wrapper existed only to keep the divider
 * full-bleed across the panel while the fill above it was inset, which by
 * this point was the one thing on the row *not* matching the inset
 * treatment everything else got. Putting the border on the same inset box
 * is both simpler (one fewer element) and more consistent (the divider
 * now respects the same margin as the fill it sits under).
 *
 * `my-1.5` does the same thing vertically - the fill previously ran flush
 * to this row's own top/bottom (0-1px measured), touching the divider
 * above and below it directly. Unlike the horizontal margin, this one
 * isn't "free": the panel's height is intrinsic to its rows' content, so
 * 6px of margin on each side adds 12px to this row's total slot instead of
 * being absorbed by a stretched flex parent. Kept small deliberately -
 * enough to stop the fill touching the dividers without visibly loosening
 * the list's row-to-row rhythm.
 *
 * `p-5` is a separate concern from `mx-6`/`my-1.5` above: margin moves the
 * fill's own edges away from the panel/divider; this padding moves the
 * *content* (the "01" number, the chevron) away from the fill's own edges,
 * since without it the text sat flush against the highlighted box's
 * boundary the same way the box itself used to sit flush against the
 * panel's. Uniform on all four sides deliberately - an earlier pass had
 * `px-3 py-5` (12px/20px), which fixed the horizontal gap but left the
 * padding itself inconsistent between axes. `py-5` (20px) predates this
 * round of fixes and sets the row's actual height/rhythm, so horizontal
 * was brought up to match it rather than shrinking vertical down to meet
 * horizontal, which would have visibly compressed every row.
 */
export function RoleRow({ role, index, isLast }: RoleRowProps) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/careers/roles/${role.id}`}
      className={`group relative mx-6 my-1.5 flex items-start gap-4 border-b p-5 text-left transition-colors duration-200 ease-snap active:!bg-black/[0.05] [@media(hover:hover)]:hover:bg-black/[0.03] ${
        isLast ? "border-transparent" : "border-black/10"
      }`}
    >
      <span className="mt-1 font-mono text-xs text-[#898989]">{num}</span>
      <span className="flex flex-1 flex-col gap-1">
        <span className="w-fit font-serif text-lg tracking-[-0.3px] text-black">
          {role.title}
        </span>
        <span className="flex flex-wrap gap-x-3 font-mono text-xs tracking-wide text-[#919191] uppercase">
          <span>{role.location}</span>
          <span>{role.employmentType}</span>
          {role.compensation ? <span>{role.compensation}</span> : null}
        </span>
      </span>
      <span className="mt-1.5 flex shrink-0 items-center gap-1.5">
        <span className="hidden -translate-x-1 font-mono text-xs tracking-wide text-[#898989] uppercase opacity-0 transition-[opacity,transform] duration-200 ease-snap [@media(hover:hover)]:inline-block [@media(hover:hover)]:group-hover:translate-x-0 [@media(hover:hover)]:group-hover:opacity-100">
          Apply Now
        </span>
        <ChevronRightIcon className="size-4 text-[#898989] transition-colors duration-200 ease-snap [@media(hover:hover)]:group-hover:text-black" />
      </span>
    </Link>
  );
}
