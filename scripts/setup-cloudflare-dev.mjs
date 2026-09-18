import { readFile, writeFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import { cloudflareClient } from "./cloudflare-client.mjs";

loadEnvFile(".env");
const config = JSON.parse(await readFile("workers/lead-intake/wrangler.json", "utf8"));
const request = cloudflareClient();
const prefix = `accounts/${config.account_id}`;
const queues = await request(`${prefix}/queues`);
for (const name of ["replay-leads-dev", "replay-leads-dev-failed"]) {
  if (!queues.some((queue) => queue.queue_name === name)) {
    await request(`${prefix}/queues`, "POST", { queue_name: name, settings: { message_retention_period: 86400 } });
  }
}
const widgets = await request(`${prefix}/challenges/widgets`);
let widget = widgets.find((item) => item.name === "Replay Leads Development");
widget = widget ? await request(`${prefix}/challenges/widgets/${widget.sitekey}`) : await request(`${prefix}/challenges/widgets`, "POST", {
  name: "Replay Leads Development", domains: ["localhost", "127.0.0.1"], mode: "managed",
});
let env = await readFile(".env", "utf8");
for (const [key, value] of Object.entries({ TURNSTILE_DEV_SITE_KEY: widget.sitekey, TURNSTILE_DEV_SECRET_KEY: widget.secret })) {
  const line = `${key}=${value}`;
  env = new RegExp(`^${key}=.*$`, "m").test(env) ? env.replace(new RegExp(`^${key}=.*$`, "m"), line) : env.trimEnd() + "\n" + line + "\n";
}
await writeFile(".env", env, { mode: 0o600 });
console.log("Cloudflare dev queue, failed-delivery queue, and localhost Turnstile widget configured. Secrets saved to ignored .env.");
