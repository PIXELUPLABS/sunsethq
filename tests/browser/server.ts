// Test-only composition root. Never imported by a Worker or shipped in out/.
// All network dependencies are injected; this process does not load .env files.
import { createServer } from "node:http";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, extname } from "node:path";
import type { MessageBatch } from "@cloudflare/workers-types";
import { testDatabase } from "../sqlite-d1";
import { handleIntake, type IntakeEnv } from "../../workers/lead-intake";
import { handleDelivery, type DeliveryEnv } from "../../workers/lead-delivery";
import { deliverToAttio } from "../../modules/lead-capture/lib/attio-client";
import { reconcileLeads } from "../../modules/lead-capture/lib/lead-ledger";
import type { LeadMessage } from "../../modules/lead-capture/lib/lead-schema";

async function main() {
  const port = Number(process.env.REPLAY_BROWSER_TEST_PORT ?? 3100);
  const origin = `http://127.0.0.1:${port}`;
  const directory = await mkdtemp(resolve(tmpdir(), "replay-browser-"));
  const { db, sqlite } = testDatabase(undefined, resolve(directory, "ledger.sqlite"));
  const entries = new Map<string, { id: { entry_id: string }; entry_values: Record<string, unknown> }>();
  let queued: LeadMessage[] = [];
  let alerts = 0;
  let writes = 0;
  let retryDelays: number[] = [];
  let mode = "ok";
  const crm = (async (input, init) => {
    const url = new URL(String(input));
    if (url.origin !== "https://api.attio.com") throw new Error("Unexpected CRM origin");
    if (mode === "crm-outage") return Response.json({ code: "unavailable" }, { status: 503 });
    if (url.pathname === "/v2/self") return Response.json({ workspace_id: "test-workspace" });
    const body = JSON.parse(String(init?.body ?? "{}"));
    if (url.pathname.endsWith("/entries/query")) {
      const entry = entries.get(body.filter.replay_submission_id.$eq);
      return Response.json({ data: entry ? [entry] : [] });
    }
    if (url.pathname === "/v2/objects/people/records") return Response.json({ data: { id: { record_id: "test-person" } } });
    if (url.pathname.endsWith("/entries") && init?.method === "POST") {
      const id = body.data.entry_values.replay_submission_id;
      if (entries.has(id)) return Response.json({ code: "unique_conflict" }, { status: 409 });
      const entry = { id: { entry_id: crypto.randomUUID() }, entry_values: body.data.entry_values };
      entries.set(id, entry);
      writes++;
      if (mode === "crm-ambiguous") throw new TypeError("Simulated connection loss after CRM commit");
      return Response.json({ data: entry });
    }
    throw new Error(`Unexpected CRM request: ${url.pathname}`);
  }) as typeof fetch;
  const env = {
    APP_ENV: "local", SITE_ORIGIN: origin, ALLOWED_ORIGINS: origin,
    TURNSTILE_SECRET_KEY: "local-browser-test-only", UNVERIFIED_LEADS_ENABLED: "true",
    LEAD_DB: db, LEAD_RATE_LIMITER: { limit: async () => ({ success: true }) },
    UNVERIFIED_RATE_LIMITER: { limit: async () => ({ success: true }) },
    LEADS: { send: async (message: LeadMessage) => {
      if (mode === "queue-loss") throw new Error("Simulated queue outage");
      queued.push(message);
    } },
    FAILED_LEADS: { send: async () => {} },
    ATTIO_API_KEY: "fake-test-token", ATTIO_LIST_ID: "test-list", ATTIO_WORKSPACE_ID: "test-workspace",
    LEAD_ALERT_FROM: "test@example.com", LEAD_ALERT_TO: "operator@example.com",
    LEAD_ALERT_EMAIL: { send: async () => { alerts++; } },
  } as unknown as IntakeEnv & DeliveryEnv;
  const verify = (async () => Response.json(mode === "verify-reject" ? { success: false } : {
    success: true, hostname: "127.0.0.1", action: "lead_capture",
  })) as typeof fetch;
  async function drain() {
    const messages = queued;
    queued = [];
    for (const body of messages) {
      await handleDelivery({ messages: [{ body, attempts: 1, ack() {}, retry(options: { delaySeconds: number }) {
        retryDelays.push(options.delaySeconds);
        queued.push(body);
      } }] } as unknown as MessageBatch<LeadMessage>, env, (message, config) => deliverToAttio(message, config, crm));
    }
  }
  const mime: Record<string, string> = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain" };
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url!, origin);
      const json = (body: unknown) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(body)); };
      if (url.pathname === "/__test/state") {
        return json({ rows: sqlite.prepare("SELECT * FROM lead_submissions").all(), entries: [...entries.values()], alerts, writes, retryDelays });
      }
      if (url.pathname === "/__test/control" && req.method === "POST") {
        let raw = "";
        for await (const chunk of req) raw += chunk;
        const control = JSON.parse(raw);
        if (control.reset) {
          sqlite.exec("DELETE FROM lead_submissions; DELETE FROM lead_monitor;");
          entries.clear(); queued = []; alerts = 0; writes = 0; retryDelays = [];
          env.CAL_BOOKING_URL = undefined;
        }
        if (typeof control.calendar === "boolean") env.CAL_BOOKING_URL = control.calendar ? "https://replaydata.cal.com/sales/browser-test" : undefined;
        mode = control.mode ?? "ok";
        // Advance only the local reconciler's time; never touch hosted state.
        if (control.recover) await reconcileLeads(env, Date.now() + 360_000);
        if (control.drain) await drain();
        return json({ ok: true });
      }
      if (url.pathname === "/api/leads") {
        let raw = "";
        for await (const chunk of req) raw += chunk;
        const response = await handleIntake(new Request(url, {
          method: req.method, headers: new Headers(req.headers as Record<string, string>),
          ...(raw ? { body: raw } : {}),
        }), env, verify);
        res.writeHead(response.status, Object.fromEntries(response.headers));
        return res.end(await response.text());
      }
      const pathname = decodeURIComponent(url.pathname);
      const file = resolve("out", `.${pathname === "/" ? "/index.html" : extname(pathname) ? pathname : `${pathname}.html`}`);
      if (!file.startsWith(resolve("out") + "/")) { res.writeHead(403); return res.end(); }
      const content = await readFile(file);
      res.setHeader("Content-Type", mime[extname(file)] ?? "application/octet-stream");
      res.end(content);
    } catch { res.writeHead(500); res.end("Local test harness failed"); }
  });
  server.listen(port, "127.0.0.1");
  for (const signal of ["SIGTERM", "SIGINT"] as const) process.on(signal, () => {
    server.close(); sqlite.close(); void rm(directory, { recursive: true, force: true }).then(() => process.exit());
  });

}
void main();
