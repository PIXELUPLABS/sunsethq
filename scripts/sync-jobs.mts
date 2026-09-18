import { mkdir, writeFile } from "node:fs/promises";
import sanitizeHtml from "sanitize-html";
import { fetchAshbyTeams } from "../modules/careers/lib/ashby";

// Fail the build on upstream failure: the last deployed website stays online.
const teams = await fetchAshbyTeams();
for (const team of teams) {
  for (const role of team.roles) {
    role.description = sanitizeHtml(role.description, {
      allowedTags: sanitizeHtml.defaults.allowedTags,
      allowedAttributes: { a: ["href", "title"] },
      allowedSchemes: ["https", "mailto"],
      allowProtocolRelative: false,
    });
  }
}
await mkdir("modules/careers/data", { recursive: true });
await writeFile("modules/careers/data/jobs.json", JSON.stringify({ fetchedAt: new Date().toISOString(), teams }, null, 2) + "\n");
console.log(`Captured ${teams.reduce((count, team) => count + team.roles.length, 0)} published jobs.`);
