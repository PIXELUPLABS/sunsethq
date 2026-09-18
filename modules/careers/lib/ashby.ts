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

export async function fetchAshbyTeams(): Promise<Team[]> {
  const response = await fetch(ASHBY_JOB_BOARD_URL, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
  if (!response.ok) {
    throw new Error(`Ashby job board request failed with status ${response.status}`);
  }

  const data: AshbyJobBoardResponse = await response.json();
  if (!Array.isArray(data.jobs) || data.jobs.some((job) =>
    typeof job.id !== "string" || !/^[a-zA-Z0-9-]+$/.test(job.id) ||
    typeof job.title !== "string" || typeof job.descriptionHtml !== "string" ||
    typeof job.applyUrl !== "string" || !job.applyUrl.startsWith("https://"))) {
    throw new Error("Ashby returned an invalid job snapshot.");
  }
  const listedRoles = data.jobs.filter((job) => job.isListed).map(mapAshbyJobToRole);
  return groupRolesByTeam(listedRoles);
}

export async function fetchAshbyRoleById(id: string): Promise<Role | null> {
  const response = await fetch(ASHBY_JOB_BOARD_URL, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`Ashby job board request failed with status ${response.status}`);
  }

  const data: AshbyJobBoardResponse = await response.json();
  const job = data.jobs.find((candidate) => candidate.id === id && candidate.isListed);
  return job ? mapAshbyJobToRole(job) : null;
}
