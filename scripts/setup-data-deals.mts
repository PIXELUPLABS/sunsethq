import { readFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import { attioClient } from "../modules/lead-capture/lib/attio-client";
import { BOOKED_STATUS, INELIGIBLE_STATUS, DATA_DEAL_FIELDS } from "../modules/lead-capture/lib/data-deal-schema";

// Additive only: never rename stages, modify existing deals or change defaults.
const target = process.argv[2];
if (target !== "production") throw new Error("This setup requires the existing production Data Deals object.");
loadEnvFile(process.env.REPLAY_ENV_FILE || ".env.production.local");
const config = JSON.parse(await readFile("workers/lead-delivery/wrangler.json", "utf8")).env.production.vars;
const request = attioClient(process.env.ATTIO_API_KEY || "");
if ((await request<{ workspace_id: string }>("self")).workspace_id !== config.ATTIO_WORKSPACE_ID) throw new Error("Workspace mismatch");
const path = "objects/data_deals/attributes";
type Attribute = { api_slug: string; type: string; is_unique: boolean; is_archived: boolean };
const attributes = (await request<{ data: Attribute[] }>(path)).data;
for (const [slug, type] of [["a_inventory", "status"], ["deal_name", "text"], ["deal_owner", "actor-reference"], ["associated_deal", "record-reference"], ["source", "select"]]) {
  if (!attributes.some(attribute => attribute.api_slug === slug && attribute.type === type && !attribute.is_archived)) throw new Error(`Required mapping missing: ${slug}`);
}
for (const field of DATA_DEAL_FIELDS) {
  const unique = "unique" in field && field.unique;
  const existing = attributes.find(attribute => attribute.api_slug === field.slug);
  if (existing) {
    if (existing.type !== field.type || existing.is_unique !== unique || existing.is_archived) throw new Error(`Incompatible attribute: ${field.slug}`);
    continue;
  }
  await request(path, "POST", { data: { title: field.title, description: "Replay form and Cal.com intake", api_slug: field.slug,
    type: field.type, is_required: false, is_unique: unique, is_multiselect: false, config: {} } });
  console.log(`Created attribute: ${field.slug}`);
}
const statusesPath = `${path}/a_inventory/statuses`;
const statuses = (await request<{ data: { title: string; is_archived: boolean }[] }>(statusesPath)).data;
if (!statuses.some(status => status.title === BOOKED_STATUS && !status.is_archived)) throw new Error("Existing Booked stage is missing");
if (!statuses.some(status => status.title === INELIGIBLE_STATUS && !status.is_archived)) {
  await request(statusesPath, "POST", { data: { title: INELIGIBLE_STATUS } });
  console.log(`Created status: ${INELIGIBLE_STATUS}`);
}
const optionsPath = `${path}/source/options`;
const options = (await request<{ data: { title: string; is_archived: boolean }[] }>(optionsPath)).data;
if (!options.some(option => option.title === "Replay" && !option.is_archived)) await request(optionsPath, "POST", { data: { title: "Replay" } });
console.log("Data Deals schema ready.");
