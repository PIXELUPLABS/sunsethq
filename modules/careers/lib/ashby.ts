import type { Role, Team } from "../types";

export const ASHBY_JOB_BOARD_URL = "https://api.ashbyhq.com/posting-api/job-board/sunset";

type AshbyJob = {
  id: string;
  title: string;
  department: string | null;
  team: string | null;
  location: string;
  employmentType: string;
  isListed: boolean;
  descriptionHtml: string;
  jobUrl: string;
  applyUrl: string;
};

type AshbyJobBoardResponse = {
  jobs: AshbyJob[];
};

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FullTime: "Full-time",
  PartTime: "Part-time",
  Intern: "Internship",
  Contract: "Contract",
  Temporary: "Temporary",
  Apprenticeship: "Apprenticeship",
};

function mapEmploymentType(raw: string): string {
  return EMPLOYMENT_TYPE_LABELS[raw] ?? raw;
}

/**
 * Ashby's `department`/`team` values are already clean, human-facing
 * category names (confirmed against the live Sunset board: "Engineering",
 * "Sales", "Marketing", "Product", "Customer Success") - this just guards
 * against stray whitespace or a missing value rather than remapping real
 * departments onto the placeholder categories this page used before it had
 * a live data source.
 */
function resolveTeamName(job: AshbyJob): string {
  const raw = (job.department ?? job.team ?? "").trim();
  return raw.length > 0 ? raw : "General";
}

function mapAshbyJobToRole(job: AshbyJob): Role {
  return {
    id: job.id,
    title: job.title,
    team: resolveTeamName(job),
    location: job.location,
    employmentType: mapEmploymentType(job.employmentType),
    description: job.descriptionHtml,
    applyHref: job.applyUrl,
    jobUrl: job.jobUrl,
  };
}

/** Groups roles by team, preserving each team's first-seen order from Ashby's own response. */
function groupRolesByTeam(roles: Role[]): Team[] {
  const teams: Team[] = [];
  const indexByTeamName = new Map<string, number>();

  for (const role of roles) {
    let index = indexByTeamName.get(role.team);
    if (index === undefined) {
      index = teams.length;
      indexByTeamName.set(role.team, index);
      teams.push({ name: role.team, roles: [] });
    }
    teams[index].roles.push(role);
  }

  return teams;
}

/**
 * Fetches Sunset's live job postings from Ashby's public job board API (no
 * key required - see the linked docs) and groups the publicly listed ones
 * by team. Ashby is the source of truth: nothing here is cached beyond the
 * request itself, so a role published or unpublished in Ashby Admin shows
 * up on next page load.
 *
 * Runs client-side (`useOpenRoles`), hence `cache: "no-store"` - the
 * listing should always reflect whatever's live when someone opens the
 * page, not a stale build/edge cache.
 */
export async function fetchAshbyTeams(): Promise<Team[]> {
  const response = await fetch(ASHBY_JOB_BOARD_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Ashby job board request failed with status ${response.status}`);
  }

  const data: AshbyJobBoardResponse = await response.json();
  const listedRoles = data.jobs.filter((job) => job.isListed).map(mapAshbyJobToRole);
  return groupRolesByTeam(listedRoles);
}

/**
 * Fetches one listed role by id, for the dedicated role page
 * (`app/careers/roles/[id]/page.tsx`). The public API has no per-role
 * endpoint, so this re-fetches the same job board response `fetchAshbyTeams`
 * does and finds the match - a small, infrequently-changing payload, so
 * re-requesting it here for a server-rendered route (rather than plumbing
 * state over from the client-rendered listing) is the simplest correct
 * option. Runs server-side, so it uses a 5-minute ISR window instead of
 * `no-store`: a role published in Ashby Admin should show up quickly, but
 * this route doesn't need to hit Ashby on every single request the way the
 * always-fresh client listing does.
 *
 * Returns `null` for an id that doesn't exist or isn't currently listed -
 * the caller (`app/careers/roles/[id]/page.tsx`) turns that into a 404
 * rather than rendering a role a candidate shouldn't be able to see.
 */
export async function fetchAshbyRoleById(id: string): Promise<Role | null> {
  const response = await fetch(ASHBY_JOB_BOARD_URL, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`Ashby job board request failed with status ${response.status}`);
  }

  const data: AshbyJobBoardResponse = await response.json();
  const job = data.jobs.find((candidate) => candidate.id === id && candidate.isListed);
  return job ? mapAshbyJobToRole(job) : null;
}
