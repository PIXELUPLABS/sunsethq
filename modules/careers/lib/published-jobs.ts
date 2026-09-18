import snapshot from "../data/jobs.json";
import type { Team } from "../types";

export const publishedTeams: Team[] = snapshot.teams;
export const publishedRoles = publishedTeams.flatMap((team) => team.roles);
export const jobsUpdatedAt = snapshot.fetchedAt;

export function getPublishedRole(id: string) {
  return publishedRoles.find((role) => role.id === id) ?? null;
}
