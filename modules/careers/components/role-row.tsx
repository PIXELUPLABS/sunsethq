import type { Role } from "../types";

type RoleRowProps = {
  role: Role;
  index: number;
  isOpen: boolean;
  isLast: boolean;
  onToggle: () => void;
};

/**
 * Adapted from `modules/landing/components/valuation-accordion.tsx`'s row:
 * same grid-template-rows expand (no JS height measurement, no library)
 * plus `aria-expanded`/`inert`. Dropped: the autoplay progress bar and
 * the equal-height stacked-panel trick, both specific to that section's
 * synced side illustration - a job description has no adjacent media to
 * keep stable. Recolored for this page's light section (that component's
 * cyan/white tokens are for a dark section). "Apply" is a plain link
 * inside the panel and never the toggle itself.
 *
 * Duration is 300ms open / 200ms close (not that component's flat 500ms):
 * this row gets toggled repeatedly while browsing, unlike the autoplaying
 * valuation steps, so it needs to feel snappier, and dismissal should
 * always read faster than the deliberate open.
 *
 * Location/employment type render on the row itself (not only inside the
 * expanded panel), per review feedback - a candidate scanning the list
 * shouldn't have to open a role to see where it is.
 */
export function RoleRow({ role, index, isOpen, isLast, onToggle }: RoleRowProps) {
  const num = String(index + 1).padStart(2, "0");
  const panelId = `role-panel-${role.id}`;

  return (
    <div
      className={`pb-5 ${isOpen || isLast ? "border-transparent" : "border-black/10"} border-b`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="group relative flex w-full cursor-pointer items-start gap-4 pt-5 text-left transition-transform duration-150 ease-snap active:scale-[0.99]"
      >
        <span className="mt-1 font-mono text-xs text-[#898989]">{num}</span>
        <span className="flex flex-1 flex-col gap-1">
          <span className="font-serif text-lg tracking-[-0.3px] text-black transition-colors [@media(hover:hover)]:group-hover:text-[#141518]">
            {role.title}
          </span>
          <span className="flex flex-wrap gap-x-3 font-mono text-xs tracking-wide text-[#919191] uppercase">
            <span>{role.location}</span>
            <span>{role.employmentType}</span>
            {role.compensation ? <span>{role.compensation}</span> : null}
          </span>
        </span>
        {/* A single "+" that rotates to a "×" rather than swapping
            characters - the transition this replaces declared
            `transition-transform` but never actually applied one. */}
        <span
          aria-hidden
          className={`mt-1 font-mono text-lg text-[#898989] transition-transform duration-200 ease-snap ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
      </button>

      <div
        id={panelId}
        inert={!isOpen}
        className={`grid transition-[grid-template-rows] ease-swift ${
          isOpen ? "grid-rows-[1fr] duration-300" : "grid-rows-[0fr] duration-200"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`mt-3 flex max-w-[620px] flex-col gap-4 pl-9 transition-opacity ease-snap ${
              isOpen ? "opacity-100 duration-200 delay-100" : "opacity-0 duration-150"
            }`}
          >
            <p className="text-sm leading-[1.5] text-[#727272]">
              {role.description}
            </p>
            {/* Only this link may leave the site. `active:opacity-70` since
                this is the page's actual conversion action - it shouldn't
                feel less responsive to press than the decorative team-rail
                buttons next to it. */}
            <a
              href={role.applyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 font-serif text-sm text-black underline decoration-[#d4d4d4] underline-offset-4 transition-[color,opacity] duration-150 ease-snap hover:decoration-black active:opacity-70"
            >
              Apply <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
