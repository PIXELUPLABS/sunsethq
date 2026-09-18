import { readFile, writeFile } from "node:fs/promises";
import { cloudflareClient } from "./cloudflare-client.mjs";
import { readOptionalEnvFile, writeSecretFile } from "./secret-files.mjs";

let env = await readOptionalEnvFile(".env.production.local");
const sitePath = "workers/site/wrangler.production.json";
const deliveryPath = "workers/lead-delivery/wrangler.json";
const site = JSON.parse(await readFile(sitePath, "utf8"));
const delivery = JSON.parse(await readFile(deliveryPath, "utf8"));
if (site.vars.SITE_ORIGIN !== "https://www.replay.ai" || site.vars.APP_ENV !== "production") throw new Error("Unexpected production target.");
const cf = cloudflareClient();
const prefix = `accounts/${site.account_id}`;
const databases = await cf(`${prefix}/d1/database`);
let database = databases.find(item => item.name === "replay-leads-prod-ledger");
database ??= await cf(`${prefix}/d1/database`, "POST", { name: "replay-leads-prod-ledger", primary_location_hint: "enam" });
if (!database.uuid || database.uuid === delivery.env.development.d1_databases[0].database_id) throw new Error("Production must have a separate ledger.");
const queues = await cf(`${prefix}/queues`);
for (const name of ["replay-leads-prod", "replay-leads-prod-failed"]) {
  if (!queues.some(item => item.queue_name === name)) await cf(`${prefix}/queues`, "POST", { queue_name: name, settings: { message_retention_period: 1209600 } });
}
const widgets = await cf(`${prefix}/challenges/widgets`);
const existing = widgets.find(item => item.name === "Replay Marketing Production");
const widget = existing ? await cf(`${prefix}/challenges/widgets/${existing.sitekey}`) : await cf(`${prefix}/challenges/widgets`, "POST", {
  name: "Replay Marketing Production", domains: ["www.replay.ai"], mode: "managed",
});
if (widget.domains.length !== 1 || widget.domains[0] !== "www.replay.ai" || !widget.secret) throw new Error("Unexpected production Turnstile scope.");
const binding = { binding: "LEAD_DB", database_name: database.name, database_id: database.uuid, migrations_dir: "../migrations" };
site.d1_databases = [binding];
delivery.env.production.d1_databases = [binding];
delivery.env.production.triggers = { crons: ["* * * * *"] };
delivery.env.production.queues.producers = [
  { binding: "LEADS", queue: "replay-leads-prod" }, { binding: "FAILED_LEADS", queue: "replay-leads-prod-failed" },
];
delivery.env.production.limits = { cpu_ms: 1000 };
await writeFile(sitePath, JSON.stringify(site, null, 2) + "\n");
await writeFile(deliveryPath, JSON.stringify(delivery, null, 2) + "\n");
for (const [key, value] of Object.entries({ NEXT_PUBLIC_SITE_URL: site.vars.SITE_ORIGIN, NEXT_PUBLIC_TURNSTILE_SITE_KEY: widget.sitekey, TURNSTILE_SECRET_KEY: widget.secret })) {
  const line = `${key}=${value}`;
  env = new RegExp(`^${key}=.*$`, "m").test(env) ? env.replace(new RegExp(`^${key}=.*$`, "m"), line) : env.trimEnd() + "\n" + line + "\n";
}
await writeSecretFile(".env.production.local", env);
console.log(`Prepared isolated production ledger ${database.uuid}, queues, and Turnstile for www.replay.ai. No public deployment yet.`);
