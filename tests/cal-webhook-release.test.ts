import assert from "node:assert/strict";
import { test } from "node:test";
import { activateCalWebhook } from "../scripts/cal-webhook-release.mjs";

test("activation checks the deployed signature gate, health and one signed event webhook before enabling it", async () => {
  let ready = false;
  let writes = 0;
  const fetcher: typeof fetch = async (input, init) => {
    const url = String(input);
    if (url === "https://www.replay.ai/api/cal/bookings") return (init?.headers as Record<string, string>)?.["x-cal-signature-256"]
      ? Response.json({ status: "ignored" }) : new Response(null, { status: ready ? 401 : 404 });
    if (url.endsWith("/api/health")) return Response.json({ healthy: true });
    assert.equal((init?.headers as Record<string, string>).Authorization, "Bearer test-key");
    if (init?.method === "PATCH") { writes++; assert.deepEqual(JSON.parse(init.body as string), { active: true }); return Response.json({ data: { active: true } }); }
    return Response.json({ data: [{ id: "hook", secret: "signing-secret", subscriberUrl: "https://www.replay.ai/api/cal/bookings", triggers: ["BOOKING_CREATED"] }] });
  };
  await assert.rejects(activateCalWebhook("test-key", fetcher), /not ready/);
  assert.equal(writes, 0);
  ready = true;
  await activateCalWebhook("test-key", fetcher);
  assert.equal(writes, 1);
});
