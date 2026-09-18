import { readFile, writeFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import { cloudflareClient } from "./cloudflare-client.mjs";

loadEnvFile(".env");
const config = JSON.parse(await readFile("workers/site/wrangler.json", "utf8"));
const request = cloudflareClient();
const prefix = `accounts/${config.account_id}`;
const hostname = new URL(config.vars.SITE_ORIGIN).hostname;
const widgets = await request(`${prefix}/challenges/widgets`);
let widget = widgets.find((item) => item.name === "Replay Marketing Staging");
widget = widget ? await request(`${prefix}/challenges/widgets/${widget.sitekey}`) : await request(`${prefix}/challenges/widgets`, "POST", {
  name: "Replay Marketing Staging", domains: [hostname], mode: "managed",
});
if (!widget.domains.includes(hostname)) throw new Error("Staging widget is not configured for this hostname.");
let env = await readFile(".env", "utf8");
for (const [key, value] of Object.entries({ TURNSTILE_STAGING_SITE_KEY: widget.sitekey, TURNSTILE_STAGING_SECRET_KEY: widget.secret })) {
  const line = `${key}=${value}`;
  env = new RegExp(`^${key}=.*$`, "m").test(env) ? env.replace(new RegExp(`^${key}=.*$`, "m"), line) : env.trimEnd() + "\n" + line + "\n";
}
await writeFile(".env", env, { mode: 0o600 });
console.log("Staging Turnstile widget configured; secrets saved to ignored .env.");
