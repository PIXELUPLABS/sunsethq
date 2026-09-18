"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Team } from "../types";

const TEAM_SWITCH_MS = 150;

export function useOpenRoles(fetchedTeams: Team[]) {
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [isSwitchingTeam, setIsSwitchingTeam] = useState(false);
  const [query, setQuery] = useState("");
  const switchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousPanelHeightRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const nextHeight = panel.getBoundingClientRect().height;
    const previousHeight = previousPanelHeightRef.current;
    if (previousHeight !== null && previousHeight !== nextHeight) {
      panel.animate([{ height: `${previousHeight}px` }, { height: `${nextHeight}px` }], {
        duration: 220, easing: "cubic-bezier(0.77, 0, 0.175, 1)",
      });
    }
    previousPanelHeightRef.current = nextHeight;
  }, [activeTeamIndex]);

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
    panelRef,
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
