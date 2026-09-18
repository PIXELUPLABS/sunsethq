"use client";

import { useLayoutEffect, useRef } from "react";
import { SearchIcon } from "@/components/ui/icons";
import { SectionTag } from "@/modules/landing/components/section-tag";
import { useOpenRoles } from "../hooks/use-open-roles";
import { CAREERS_EMAIL, DONT_SEE_A_FIT_BODY } from "../lib/constants";
import { RoleRow } from "./role-row";

const PANEL_HEIGHT_EASE = "cubic-bezier(0.77, 0, 0.175, 1)";
const PANEL_HEIGHT_EASE_MS = 220;

const RAIL_ROW_HEIGHT_PX = 56;

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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/images/grain-light-texture.svg')] bg-top bg-repeat bg-[length:100%_auto] mix-blend-multiply"
      />

      <div className="relative mx-auto w-full max-w-[1560px] border border-dashed border-[#a8a8a8]">
        <div className="flex flex-col gap-10 px-3 py-16 sm:px-10 sm:py-20">
          <div className="flex max-w-[560px] flex-col items-start gap-6">
            <SectionTag
              label="Open Roles"
              textClassName="text-black/60"
              borderClassName="border-dashed border-black/25"
              paddingClassName="px-2 py-1"
              heightClassName="h-auto"
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
                  className="w-full border border-[#a8a8a8] bg-transparent py-3 pr-4 pl-11 text-sm text-black transition-colors duration-150 ease-snap placeholder:text-[#727272] focus:border-black focus:outline-none"
                />
              </div>

              <div className="-mx-3 grid grid-cols-1 sm:mx-0 lg:grid-cols-[220px_1fr] lg:border lg:border-[#a8a8a8]">
                <div className="relative flex flex-col border-b border-[#a8a8a8] lg:border-r lg:border-b-0 lg:p-6">
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
                        className={`flex min-h-[56px] items-center justify-between gap-3 border-b border-dashed border-[#a8a8a8] px-6 py-4 text-left font-mono text-xs tracking-wide uppercase transition-[color,transform] duration-150 ease-snap last:border-b-0 active:scale-[0.98] lg:px-0 ${
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
                  className={`flex flex-col overflow-hidden p-6 transition-opacity duration-150 ease-snap ${
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
            <h3 className="max-w-[480px] font-serif-regular text-[20px] tracking-[-0.4px] text-black">
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
