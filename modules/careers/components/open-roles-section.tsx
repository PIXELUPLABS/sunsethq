"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { SearchIcon } from "@/components/ui/icons";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { useOpenRoles } from "../hooks/use-open-roles";
import { CAREERS_EMAIL, DONT_SEE_A_FIT_BODY } from "../lib/constants";
import { RoleRow } from "./role-row";

/** Matches `--ease-swift` in `globals.css` - the indicator bar's own
 * `translateY` already animates with this curve, so switching teams and
 * the bar sliding to point at the new one read as one coordinated motion
 * rather than two animations on different curves. WAAPI's `easing` option
 * takes a literal easing-function string, not a `var()` reference, so the
 * value is duplicated here; keep the two in sync if either changes. */
const PANEL_HEIGHT_EASE = "cubic-bezier(0.77, 0, 0.175, 1)";
const PANEL_HEIGHT_EASE_MS = 220;

/** Matches the rail buttons' own `min-h-[56px]` / `h-14` - see the
 * indicator bar below, positioned by this fixed value rather than a
 * percentage of the rail's rendered height. */
const RAIL_ROW_HEIGHT_PX = 56;

/**
 * Team rail: pick a team on the left, its roles listed on the right, each
 * one linking out to its own page (`RoleRow` → `/careers/roles/[id]`). One
 * team visible at a time, chosen over the earlier flat-list layout after
 * reviewing it alongside two other options on a since-removed comparison
 * route.
 *
 * Teams and roles come from Sunset's live Ashby job board
 * (`useOpenRoles` → `lib/ashby.ts`), grouped by Ashby's own
 * department field - the rail is whatever departments currently have a
 * listed role, not a fixed local list.
 *
 * Rail rows share a `min-h` (`RAIL_ROW_HEIGHT_PX`) so the active-team
 * indicator bar can be positioned with fixed pixel math
 * (`activeTeamIndex * RAIL_ROW_HEIGHT_PX`) instead of measuring rendered
 * heights - without it, a department name long enough to wrap to two
 * lines would throw the bar off.
 *
 * The rail column relies on grid's default `align-items: stretch`: it sits
 * in the same grid row as the roles panel, and that panel's height swings
 * wildly by team (1 role vs. Engineering's 8, plus whatever's expanded).
 * Stretching keeps the rail's box - and its right-hand divider - matching
 * the panel's full height instead of stopping at its own ~330px of content,
 * so the two columns always read as one bordered block. Safe to rely on the
 * indicator bar's own fixed-pixel math (`activeTeamIndex * RAIL_ROW_HEIGHT_PX`)
 * staying correct regardless, since it's positioned from row height, not
 * the rail box's total height.
 */
export function OpenRolesSection() {
  const {
    status,
    teams,
    activeTeamIndex,
    selectTeam,
    isSwitchingTeam,
    activeTeam,
    visibleRoles,
    query,
    setQuery,
    hasAnyRoles,
  } = useOpenRoles();

  const panelRef = useRef<HTMLDivElement>(null);
  const previousPanelHeightRef = useRef<number | null>(null);

  /**
   * Eases the roles panel's height across a team switch instead of letting
   * it snap - Engineering (8 roles) and Product (1 role) differ enough
   * that an instant swap visibly jumps everything below the section.
   * Scoped to `activeTeamIndex` (and `status`, so the first team's real
   * height gets captured once data loads) rather than `visibleRoles`,
   * since that also changes on every search keystroke - a frequent,
   * keyboard-driven update that shouldn't animate per the "should this
   * animate at all" rule (occasional mouse actions do, frequent
   * keystrokes don't).
   *
   * `useLayoutEffect` runs after the new team's content is already in the
   * DOM but before paint, so `getBoundingClientRect()` reads the real
   * final height - the WAAPI keyframes below then animate from the
   * *previous* render's height to it, exactly like a FLIP transition,
   * without a separate measure-old-height step.
   */
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const nextHeight = panel.getBoundingClientRect().height;
    const previousHeight = previousPanelHeightRef.current;

    if (previousHeight !== null && previousHeight !== nextHeight) {
      panel.animate(
        [{ height: `${previousHeight}px` }, { height: `${nextHeight}px` }],
        { duration: PANEL_HEIGHT_EASE_MS, easing: PANEL_HEIGHT_EASE },
      );
    }

    previousPanelHeightRef.current = nextHeight;
  }, [activeTeamIndex, status]);

  return (
    <section
      id="open-roles"
      className="relative scroll-mt-16 overflow-hidden bg-[#eaebf1] px-3 sm:px-18"
    >
      {/* `grain-light-texture.svg`, same source as `why-replay-section.tsx`
          (and `careers-hero.tsx` above that), but back on `mix-blend-multiply`
          here - unlike those two, this section is immediately followed by
          the CTA section's own top band, which shares this exact
          `bg-[#eaebf1]` fill (`cta-section.tsx`'s `DEFAULT_TOP_BAND_CLASS_NAME`)
          textured with `mix-blend-multiply` too. Dropping the blend here
          left this section visibly lighter than that band despite the
          identical hex value, reading as two different fills meeting at a
          seam rather than one continuous surface running into the CTA.
          Still a tiled CSS background rather than `next/image`'s `fill` +
          `object-cover`, though: this section's height isn't fixed (the
          panel-height WAAPI animation above grows/shrinks it on a team
          switch), and `object-cover` re-fits the image to the container's
          *current* height on every layout frame - visibly rescaling the
          grain mid-transition. `background-size: 100% auto` ties the
          tile's size to the section's width only (stable during that
          animation) and repeats it downward instead, so a taller team's
          roles reveal more tile rather than rescaling it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/images/grain-light-texture.svg')] bg-top bg-repeat bg-[length:100%_auto] mix-blend-multiply"
      />

      {/* Dashed grid frame matching the main page's own grid system
          (`buyers-section.tsx`, `stats-section.tsx`, etc: a max-w-[1560px]
          column bracketed by `border-x border-dashed border-[#d4d4d4]`) -
          ties this section into the site's structure instead of floating
          as a plain block. Closed with a `border-b` too (full `border`,
          not just `border-x border-t`), matching `benefits-section.tsx`'s
          frame, so the boundary reads as complete down to the bottom of
          the section rather than left open on that side.
          `#d4d4d4` also matches `cta-section.tsx`'s default line color
          directly below this section, and (per review) `team-collage-section.tsx`/
          `why-replay-section.tsx`/`careers-hero.tsx` above it, now that
          those all use the main page's own `#d4d4d4` too instead of the
          page-local `#a8a8a8` they briefly diverged to - one color for
          the whole chain, matching the main page throughout. */}
      <div className="relative mx-auto w-full max-w-[1560px] border border-dashed border-[#d4d4d4]">
        {/* Same `max-w-[1560px]` frame + `px-3 py-16 sm:px-10 sm:py-20`
            inner padding as `<WhyReplaySection>` (and, above that,
            `<TeamCollageSection>` - see that file's own comment) - all
            three sections need to land at the same content width/margins
            stacked on top of each other, so this mirrors that exact
            structure rather than defining its own. Only the heading text
            narrows further (`max-w-[560px]`, matching why-replay's own
            heading), not the search/role-list content below it - same
            split why-replay uses between its heading and its (uncapped)
            card grid. */}
        <div className="flex flex-col gap-10 px-3 py-16 sm:px-10 sm:py-20">
          <div className="flex max-w-[560px] flex-col items-start gap-6">
            <SectionTag
              label="Open Roles"
              icon={
                <Image
                  src="/images/careers/values-icons/our_team_interlocking_modules_4x.webp"
                  alt=""
                  width={18}
                  height={18}
                />
              }
            />
            <h2 className="font-serif text-[36px] leading-none tracking-[-1.44px] text-black sm:text-[44px] sm:tracking-tight">
              Every role, in full, right here.
            </h2>
          </div>

          {status === "error" ? (
            <p className="text-sm text-[#727272]">
              We couldn&rsquo;t load open roles right now. Refresh to try again, or reach us
              directly below.
            </p>
          ) : status === "loading" ? (
            <p className="text-sm text-[#727272]">Loading open roles&hellip;</p>
          ) : hasAnyRoles && activeTeam ? (
            <div className="w-full">
              <div className="relative mb-6">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#a8a8a8]" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={`Search ${activeTeam.name.toLowerCase()} roles`}
                  aria-label={`Search ${activeTeam.name} roles`}
                  className="w-full border border-[#d4d4d4] bg-transparent py-3 pr-4 pl-11 text-sm text-black transition-colors duration-150 ease-snap placeholder:text-[#727272] focus:border-black focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] lg:border lg:border-[#d4d4d4]">
                <div className="relative flex flex-col border-b border-[#d4d4d4] lg:border-r lg:border-b-0 lg:p-6">
                  {/* Fixed pixels, not a percentage of this container's
                      height: `h-14` (56px) matches each row's own
                      `min-h-[56px]`, and `lg:top-6` (24px) matches this
                      container's own `lg:p-6` top padding - so the
                      indicator's size/position come from the same spacing
                      tokens the rows and padding already use, rather than
                      being derived from the container's total rendered
                      height. That total height isn't a reliable basis: it
                      also depends on padding contributing to it (a %
                      calc'd against the padded box came out to 65.6px for
                      one 56px row), so pixel values sidestep the whole
                      category of "size relative to the wrong box" bug
                      instead of getting the box exactly right. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute top-0 left-0 h-14 w-[2px] bg-black transition-transform duration-300 ease-swift lg:top-6"
                    style={{ transform: `translateY(${activeTeamIndex * RAIL_ROW_HEIGHT_PX}px)` }}
                  />

                  {teams.map((team, i) => {
                    const isActive = i === activeTeamIndex;
                    const hasNoRoles = team.roles.length === 0;
                    return (
                      <button
                        key={team.name}
                        type="button"
                        onClick={() => selectTeam(i)}
                        aria-pressed={isActive}
                        className={`flex min-h-[56px] items-center justify-between gap-3 border-b border-dashed border-[#d4d4d4] px-6 py-4 text-left font-mono text-xs tracking-wide uppercase transition-[color,transform] duration-150 ease-snap last:border-b-0 active:scale-[0.98] lg:px-0 ${
                          hasNoRoles
                            ? "text-[#a8a8a8] hover:text-[#727272]"
                            : isActive
                              ? "text-black"
                              : "text-[#727272] hover:text-black"
                        }`}
                      >
                        <span>{team.name}</span>
                        <span>{team.roles.length}</span>
                      </button>
                    );
                  })}
                </div>

                <div
                  ref={panelRef}
                  className={`flex flex-col overflow-hidden px-6 py-4 transition-opacity duration-150 ease-snap lg:p-6 ${
                    isSwitchingTeam ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {activeTeam.roles.length === 0 ? (
                    <p className="py-4 text-sm text-[#727272]">
                      No open roles on this team right now.
                    </p>
                  ) : visibleRoles.length === 0 ? (
                    <p className="py-4 text-sm text-[#727272]">
                      No roles match &ldquo;{query}&rdquo;.
                    </p>
                  ) : (
                    visibleRoles.map((role, i) => (
                      <RoleRow
                        key={role.id}
                        role={role}
                        index={i}
                        isLast={i === visibleRoles.length - 1}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex w-full flex-col gap-2 text-left">
            <h3 className="max-w-[480px] font-serif text-[20px] tracking-[-0.4px] text-black">
              Don&rsquo;t see a fit?
            </h3>
            <p className="max-w-[480px] text-sm leading-[1.5] text-[#727272]">
              {DONT_SEE_A_FIT_BODY}{" "}
              <a
                href={`mailto:${CAREERS_EMAIL}`}
                className="text-sm text-black underline decoration-[#d4d4d4] underline-offset-4 transition-colors hover:decoration-black"
              >
                {CAREERS_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
