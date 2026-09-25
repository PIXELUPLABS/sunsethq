import { createHmac } from "node:crypto";

export async function activateCalWebhook(token, fetcher = fetch) {
  if (!token) throw new Error("Missing production Cal configuration credential.");
  const subscriberUrl = "https://www.replay.ai/api/cal/bookings";
  const probe = await fetcher(subscriberUrl, { method: "POST", body: "{}" });
  if (probe.status !== 401 || !(await fetcher("https://www.replay.ai/api/health")).ok) throw new Error("Production Cal endpoint is not ready.");
  const endpoint = "https://api.cal.com/v2/teams/443036/event-types/7202505/webhooks";
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const response = await fetcher(endpoint, { headers });
  if (!response.ok) throw new Error(`Cal webhook lookup failed (${response.status}).`);
  const matches = (await response.json()).data.filter(hook => hook.subscriberUrl === subscriberUrl);
  if (matches.length !== 1 || !matches[0].secret || matches[0].triggers.length !== 1 || matches[0].triggers[0] !== "BOOKING_CREATED") throw new Error("Provision the signed booking webhook before release.");
  const hook = matches[0];
  // A signed ignored event checks that Cal and Cloudflare share the secret,
  // without inventing a booking or creating any CRM data.
  const body = JSON.stringify({ triggerEvent: "REPLAY_VERIFY" });
  const verified = await fetcher(subscriberUrl, { method: "POST", body, headers: {
    "Content-Type": "application/json", "x-cal-signature-256": createHmac("sha256", hook.secret).update(body).digest("hex"),
  } });
  if (!verified.ok || (await verified.json()).status !== "ignored") throw new Error("Cal and Cloudflare signing secrets do not match.");
  const result = await fetcher(`${endpoint}/${encodeURIComponent(hook.id)}`, { method: "PATCH", headers, body: JSON.stringify({ active: true }) });
  if (!result.ok || !(await result.json()).data.active) throw new Error("Cal webhook activation failed.");
  console.log(`Cal booking webhook ${hook.id} active.`);
}
