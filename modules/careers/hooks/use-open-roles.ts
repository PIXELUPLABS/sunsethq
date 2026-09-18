"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchAshbyTeams } from "../lib/ashby";
import type { Team } from "../types";

const TEAM_SWITCH_MS = 150;

export type RolesFetchStatus = "loading" | "success" | "error";

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
