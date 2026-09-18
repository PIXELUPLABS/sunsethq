import { readFile, writeFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import { attioClient } from "../modules/lead-capture/lib/attio-client";
import { ATTIO_FIELDS } from "../modules/lead-capture/lib/attio-schema";
import { writeSecretFile } from "./secret-files.mjs";

const target = process.argv[2] ?? "development";
if (!["development", "production"].includes(target)) throw new Error("Choose development or production.");
const envPath = target === "production" ? ".env.production.local" : ".env";
loadEnvFile(envPath);
const configPath = "workers/lead-delivery/wrangler.json";
const config = JSON.parse(await readFile(configPath, "utf8"));
const selected = config.env[target].vars;
const expectedWorkspace = selected.ATTIO_WORKSPACE_ID;
if (!expectedWorkspace) throw new Error("Configure the target workspace ID in Wrangler first.");
if (target === "production" && (!selected.ATTIO_LIST_ID || expectedWorkspace === config.env.development.vars.ATTIO_WORKSPACE_ID)) {
  throw new Error("Production requires an existing list ID in a different workspace from development.");
}
const request = attioClient(process.env.ATTIO_API_KEY ?? "");
const identity = await request<{ workspace_id: string; workspace_name: string; workspace_slug: string }>("self");
if (identity.workspace_id !== expectedWorkspace) throw new Error("Refusing setup outside the configured Attio workspace.");
type List = { id: { list_id: string }; name: string; api_slug: string; parent_object: string[] };
let list: List | undefined;
if (selected.ATTIO_LIST_ID) {
  list = (await request<{ data: List }>(`lists/${encodeURIComponent(selected.ATTIO_LIST_ID)}`)).data;
} else {
  const lists = await request<{ data: List[] }>("lists");
  list = lists.data.find((item) => item.api_slug === "replay_website_leads_dev");
}
if (!list) {
  list = (await request<{ data: NonNullable<typeof list> }>("lists", "POST", { data: {
    name: "Website Leads (Dev)", api_slug: "replay_website_leads_dev", parent_object: "people",
    workspace_access: "full-access", workspace_member_access: [],
  } })).data;
}
if (!list.parent_object.includes("people")) throw new Error("The target list must contain People records.");
const attributes = await request<{ data: { api_slug: string; type: string; is_unique: boolean }[] }>(`lists/${list.id.list_id}/attributes`);
for (const field of ATTIO_FIELDS) {
  const existing = attributes.data.find((item) => item.api_slug === field.slug);
  const unique = "unique" in field && field.unique;
  if (existing) {
    if (existing.type !== field.type || (unique && !existing.is_unique)) throw new Error(`Incompatible attribute: ${field.slug}`);
    continue;
  }
  await request(`lists/${list.id.list_id}/attributes`, "POST", { data: {
    title: field.title, description: "Replay website lead capture", api_slug: field.slug,
    type: field.type, is_required: false, is_unique: unique, is_multiselect: false, config: {},
  } });
}
selected.ATTIO_LIST_ID = list.id.list_id;
await writeFile(configPath, JSON.stringify(config, null, 2) + "\n");
let env = await readFile(envPath, "utf8");
for (const [key, value] of Object.entries({ ATTIO_WORKSPACE_ID: identity.workspace_id, ATTIO_LIST_ID: list.id.list_id })) {
  const line = `${key}=${value}`;
  env = new RegExp(`^${key}=.*$`, "m").test(env) ? env.replace(new RegExp(`^${key}=.*$`, "m"), line) : env.trimEnd() + "\n" + line + "\n";
}
await writeSecretFile(envPath, env);
console.log(`Configured ${identity.workspace_name}: ${list.name}, list ${list.id.list_id}`);
