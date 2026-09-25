import { loadEnvFile } from "node:process";
import { readFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { cloudflareClient } from "./cloudflare-client.mjs";
import { readOptionalEnvFile, writeSecretFile } from "./secret-files.mjs";

// Configuration credentials stay local. The public Worker gets only the HMAC secret.
loadEnvFile(process.env.REPLAY_CAL_ENV_FILE || ".env");
const productionEnv = process.env.REPLAY_ENV_FILE || ".env.production.local";
loadEnvFile(productionEnv);
if (!process.env.CAL_COM_API_KEY) throw new Error("CAL_COM_API_KEY is missing.");
const site = JSON.parse(await readFile("workers/site/wrangler.production.json", "utf8"));
if (site.name !== "replay-marketing" || site.vars.SITE_ORIGIN !== "https://www.replay.ai" || site.vars.CAL_EVENT_TYPE_ID !== "7202505") throw new Error("Unexpected production target.");
const path = "teams/443036/event-types/7202505/webhooks";
const subscriberUrl = `${site.vars.SITE_ORIGIN}/api/cal/bookings`;
async function cal(resource, method = "GET", body) {
  const response = await fetch(`https://api.cal.com/v2/${resource}`, { method,
    headers: { Authorization: `Bearer ${process.env.CAL_COM_API_KEY}`, "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Cal configuration request failed (${response.status}).`);
  return (await response.json()).data;
}
const hooks = await cal(path);
const matching = hooks.filter(hook => hook.subscriberUrl === subscriberUrl);
if (matching.length > 1) throw new Error("Multiple matching webhooks; review before changing configuration.");
const existing = matching[0];
const secret = existing?.secret || process.env.CAL_WEBHOOK_SECRET || randomBytes(32).toString("hex");
if (secret.length < 32) throw new Error("Webhook signing secret is too short.");
const contents = await readOptionalEnvFile(productionEnv);
const line = `CAL_WEBHOOK_SECRET=${secret}`;
await writeSecretFile(productionEnv, /^CAL_WEBHOOK_SECRET=.*$/m.test(contents) ? contents.replace(/^CAL_WEBHOOK_SECRET=.*$/m, line) : `${contents.trimEnd()}\n${line}\n`);
const cf = cloudflareClient();
const secretPath = `accounts/${site.account_id}/workers/scripts/${site.name}/secrets`;
await cf(secretPath, "PUT", { name: "CAL_WEBHOOK_SECRET", text: secret, type: "secret_text" });
const names = await cf(secretPath);
if (!names.some(binding => binding.name === "CAL_WEBHOOK_SECRET" && binding.type === "secret_text")) throw new Error("Production secret was not saved.");
const activate = process.argv.includes("--activate");
if (activate) {
  // Do not point live traffic at a release that does not yet have the endpoint.
  const probe = await fetch(subscriberUrl, { method: "POST", body: "{}" });
  if (probe.status !== 401 || !(await fetch(`${site.vars.SITE_ORIGIN}/api/health`)).ok) throw new Error("Deploy and verify the production endpoint before activating the webhook.");
}
const hook = await cal(existing ? `${path}/${existing.id}` : path, existing ? "PATCH" : "POST", {
  active: activate || existing?.active || false, subscriberUrl, secret, version: "2021-10-20", triggers: ["BOOKING_CREATED"],
});
const saved = await cal(`${path}/${hook.id}`);
if (saved.subscriberUrl !== subscriberUrl || saved.secret !== secret || saved.active !== (activate || existing?.active || false)) throw new Error("Webhook verification failed.");
console.log(JSON.stringify({ webhookId: saved.id, active: saved.active, subscriberUrl: saved.subscriberUrl, productionSecret: "CAL_WEBHOOK_SECRET stored and verified" }));
