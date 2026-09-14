"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TEAMS } from "../lib/constants";

/** How long the panel fades out before its content swaps to the newly
 * selected team (it then fades back in over the same duration) - see
 * `selectTeam` below. */
const TEAM_SWITCH_MS = 150;

/**
 * Team-rail state: one active team at a time (its roles shown on the
 * right), a search that filters within the active team, and which of its
 * roles are expanded. `openRoleIds` is a `Set` rather than a single index
 * since more than one role can be open at once, unlike
 * `ValuationAccordion`'s single `activeIndex`.
 */
export function useOpenRoles() {
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [isSwitchingTeam, setIsSwitchingTeam] = useState(false);
  const [openRoleIds, setOpenRoleIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const switchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const toggleRole = useCallback((id: string) => {
    setOpenRoleIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const hasAnyRoles = useMemo(() => TEAMS.some((team) => team.roles.length > 0), []);

  const activeTeam = TEAMS[activeTeamIndex];
  const normalizedQuery = query.trim().toLowerCase();

  const visibleRoles = useMemo(() => {
    if (!normalizedQuery) return activeTeam.roles;
    return activeTeam.roles.filter((role) =>
      `${role.title} ${role.location}`.toLowerCase().includes(normalizedQuery),
    );
  }, [activeTeam, normalizedQuery]);

  return {
    teams: TEAMS,
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
  };
}
