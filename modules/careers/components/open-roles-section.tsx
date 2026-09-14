"use client";

import Image from "next/image";
import { SearchIcon } from "@/components/ui/icons";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { useOpenRoles } from "../hooks/use-open-roles";
import { CAREERS_EMAIL, DONT_SEE_A_FIT_BODY } from "../lib/constants";
import { RoleRow } from "./role-row";

/**
 * Team rail: pick a team on the left, its roles - the same accordion
 * `RoleRow` used before - expand on the right. One team visible at a
 * time, chosen over the earlier flat-list layout after reviewing it
 * alongside two other options on a since-removed comparison route.
 *
 * Rail rows share a `min-h` so the active-team indicator bar can be
 * positioned with plain percentage math (`activeTeamIndex / teams.length`)
 * instead of measuring rendered heights - without it, "Data / Trust &
 * Safety" wrapping to two lines would throw the bar off.
 */
export function OpenRolesSection() {
  const {
    teams,
    activeTeamIndex,
    selectTeam,
    isSwitchingTeam,
    activeTeam,
    visibleRoles,
    query,
    setQuery,
    openRoleIds,
    toggleRole,
    hasAnyRoles,
  } = useOpenRoles();

  return (
    <section
      id="open-roles"
      className="relative scroll-mt-16 overflow-hidden bg-[#eaebf1] px-3 sm:px-18"
    >
      {/* Same grain-over-flat-color treatment as the CTA section's top
          band (`cta-section.tsx`) directly below this one - without it,
          the two `#eaebf1` fills read as a visible seam despite sharing a
          hex value, since the CTA's texture darkens the flat color. */}
      <Image
        src="/images/texture-grain-white.png"
        alt=""
        fill
        className="pointer-events-none object-cover mix-blend-multiply"
      />

      {/* Dashed grid frame matching the main page's own grid system
          (`buyers-section.tsx`, `stats-section.tsx`, etc: a max-w-[1560px]
          column bracketed by `border-x border-dashed`) - ties this section
          into the site's structure instead of floating as a plain block.
          Closed with a `border-b` too (full `border`, not just
          `border-x border-t`), matching `benefits-section.tsx`'s frame,
          so the boundary reads as complete down to the bottom of the
          section rather than left open on that side.
          `#a8a8a8`, matching careers-hero.tsx/why-replay-section.tsx -
          `#d4d4d4` measured as applied correctly but read as effectively
          invisible against this section's grain-textured light
          background. Only this outer frame changes color; the internal
          search input/rail/row borders below keep `#d4d4d4` since they
          weren't part of the invisibility report. */}
      <div className="relative mx-auto w-full max-w-[1560px] border border-dashed border-[#a8a8a8]">
        <div className="px-3 py-16 sm:px-10 sm:py-24 lg:py-[120px]">
          <div className="mx-auto flex w-full max-w-[1100px] flex-col items-start gap-6">
            <SectionTag
              label="Open Roles"
              icon={
                <Image
                  src="/images/illustration-section-icon.png"
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

          {hasAnyRoles ? (
            <div className="mx-auto mt-10 w-full max-w-[1100px]">
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
                  <div
                    aria-hidden
                    className="pointer-events-none absolute top-0 left-0 w-[2px] bg-black transition-transform duration-300 ease-swift"
                    style={{
                      height: `${100 / teams.length}%`,
                      transform: `translateY(${activeTeamIndex * 100}%)`,
                    }}
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
                  className={`flex flex-col px-6 py-4 transition-opacity duration-150 ease-snap lg:p-6 ${
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
                        isOpen={openRoleIds.has(role.id)}
                        isLast={i === visibleRoles.length - 1}
                        onToggle={() => toggleRole(role.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mx-auto mt-8 flex w-full max-w-[1100px] flex-col gap-2 text-left">
            <h3 className="max-w-[480px] font-serif text-sm tracking-[-0.4px] text-black">
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
