"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchAshbyTeams } from "../lib/ashby";
import type { Team } from "../types";

/** How long the panel fades out before its content swaps to the newly
 * selected team (it then fades back in over the same duration) - see
 * `selectTeam` below. */
const TEAM_SWITCH_MS = 150;

export type RolesFetchStatus = "loading" | "success" | "error";

/**
 * Team-rail state: one active team at a time (its roles shown on the
 * right), and a search that filters within it. Each role itself now links
 * out to its own page (`RoleRow` → `/careers/roles/[id]`) rather than
 * expanding inline, so there's no open/expanded-role state to own here
 * any more.
 *
 * Teams themselves are fetched from Ashby's public job board API on mount
 * (see `lib/ashby.ts`) rather than imported as a static constant - `status`
 * lets the section render a subtle loading/error state around the exact
 * same layout while that request is in flight or fails.
 */
export function useOpenRoles() {
  const [fetchedTeams, setFetchedTeams] = useState<Team[]>([]);
  const [status, setStatus] = useState<RolesFetchStatus>("loading");
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [isSwitchingTeam, setIsSwitchingTeam] = useState(false);
  const [query, setQuery] = useState("");
  const switchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchAshbyTeams()
      .then((fetchedTeams) => {
        if (cancelled) return;
        setFetchedTeams(fetchedTeams);
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /** An "All" tab, every fetched team's roles combined, pinned first so it's
   * the default-selected tab (`activeTeamIndex` starts at 0) - unfiltered
   * by team, only by the search query like any other tab. */
  const teams = useMemo<Team[]>(() => {
    if (fetchedTeams.length === 0) return fetchedTeams;
    const allRoles = fetchedTeams.flatMap((team) => team.roles);
    return [{ name: "All", roles: allRoles }, ...fetchedTeams];
  }, [fetchedTeams]);

  useEffect(() => {
    return () => {
      if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
    };
  }, []);

  /** Fades the panel out, swaps the active team once invisible, then lets
   * it fade back in - an instant content swap otherwise reads as a jarring
   * pop rather than a transition. */
  const selectTeam = useCallback(
    (index: number) => {
      if (index === activeTeamIndex) return;

      if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
      setIsSwitchingTeam(true);
      switchTimeoutRef.current = setTimeout(() => {
        setActiveTeamIndex(index);
        setIsSwitchingTeam(false);
      }, TEAM_SWITCH_MS);
    },
    [activeTeamIndex],
  );

  const hasAnyRoles = useMemo(() => teams.some((team) => team.roles.length > 0), [teams]);

  const activeTeam = teams[activeTeamIndex];
  const normalizedQuery = query.trim().toLowerCase();

  const visibleRoles = useMemo(() => {
    if (!activeTeam) return [];
    if (!normalizedQuery) return activeTeam.roles;
    return activeTeam.roles.filter((role) =>
      `${role.title} ${role.team} ${role.location}`.toLowerCase().includes(normalizedQuery),
    );
  }, [activeTeam, normalizedQuery]);

  return {
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
  };
}
