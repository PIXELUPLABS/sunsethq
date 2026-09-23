import type { RateLimit } from "@cloudflare/workers-types";
import type { LedgerEnv } from "./lead-ledger";

export const SIGNUP_SIGNAL_CODES = ["bootstrap_timeout", "javascript_error", "verification_unavailable", "verification_rejected", "submission_failed", "intake_unavailable"] as const;
export type SignupSignalCode = typeof SIGNUP_SIGNAL_CODES[number];
export type SignupMonitorEnv = LedgerEnv & {
  SIGNUP_MONITORING_ENABLED?: string;
  SIGNUP_PROBE_SECRET?: string;
  SIGNUP_SIGNAL_RATE_LIMITER?: RateLimit;
  SITE_ORIGIN?: string;
  ALLOWED_ORIGINS?: string;
};
export const PROBE_HEADER = "X-Replay-Signup-Probe";

export async function isSignupProbe(request: Request, env: SignupMonitorEnv) {
  const provided = request.headers.get(PROBE_HEADER);
  if (!provided || !env.SIGNUP_PROBE_SECRET || provided.length > 256) return false;
  // Hash both values before comparison, with a fixed-size constant-work loop.
  const hash = (value: string) => crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  const [actual, expected] = await Promise.all([hash(provided), hash(env.SIGNUP_PROBE_SECRET)]);
  const a = new Uint8Array(actual), b = new Uint8Array(expected);
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a[i] ^ b[i];
  return mismatch === 0;
}

export async function recordSignupSignal(env: SignupMonitorEnv, code: SignupSignalCode, id = crypto.randomUUID(), now = Date.now()) {
  if (env.SIGNUP_MONITORING_ENABLED !== "true") return;
  await env.LEAD_DB.prepare(`INSERT INTO signup_signals(environment, signal_id, code, created_at)
    VALUES (?, ?, ?, ?) ON CONFLICT(environment, signal_id, code) DO NOTHING`)
    .bind(env.APP_ENV, id, code, now).run();
}

export async function recordSignupProbe(env: SignupMonitorEnv, healthy: boolean, now = Date.now()) {
  await env.LEAD_DB.prepare(`INSERT INTO signup_probe(environment, checked_at, healthy) VALUES (?, ?, ?)
    ON CONFLICT(environment) DO UPDATE SET checked_at = excluded.checked_at, healthy = excluded.healthy
    WHERE excluded.checked_at >= signup_probe.checked_at`).bind(env.APP_ENV, now, healthy ? 1 : 0).run();
}

// Accept only tiny, enumerated telemetry. Never store bodies, URLs, IPs, tokens,
// email addresses, exception text, or visitor identifiers across page loads.
export async function handleSignupSignal(request: Request, env: SignupMonitorEnv) {
  const reply = (status: number) => new Response(null, { status, headers: { "Cache-Control": "no-store" } });
  if (request.method !== "POST") return reply(405);
  if (env.SIGNUP_MONITORING_ENABLED !== "true") return reply(204);
  const isProbeReport = new URL(request.url).pathname === "/api/signup-probe";
  if (isProbeReport) {
    if (!await isSignupProbe(request, env)) return reply(401);
    // External reports can only mark failure; success requires real siteverify.
    try { await recordSignupProbe(env, false); return reply(204); }
    catch { return reply(503); }
  }
  const origin = request.headers.get("origin");
  if (!origin || !env.ALLOWED_ORIGINS?.split(",").map(value => value.trim()).includes(origin)) return reply(403);
  const ip = request.headers.get("cf-connecting-ip") ?? (env.APP_ENV === "local" ? "local" : null);
  if (!ip || !env.SIGNUP_SIGNAL_RATE_LIMITER) return reply(503);
  if (!(await env.SIGNUP_SIGNAL_RATE_LIMITER.limit({ key: ip })).success) return reply(429);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply(415);
  const reader = request.body?.getReader();
  if (!reader) return reply(400);
  let length = 0, raw = "";
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 256) { await reader.cancel(); return reply(413); }
    raw += decoder.decode(value, { stream: true });
  }
  raw += decoder.decode();
  let body: { id?: unknown; code?: unknown } | null;
  try {
    body = JSON.parse(raw) as { id?: unknown; code?: unknown } | null;
    if (!body || typeof body.id !== "string" || !/^[a-f0-9-]{36}$/i.test(body.id) ||
        !SIGNUP_SIGNAL_CODES.slice(0, 5).includes(body.code as SignupSignalCode)) return reply(400);
  } catch { return reply(400); }
  try {
    await recordSignupSignal(env, body.code as SignupSignalCode, body.id as string);
    return reply(204);
  } catch { return reply(503); }
}

export async function signupHealth(env: SignupMonitorEnv, now = Date.now()) {
  if (env.SIGNUP_MONITORING_ENABLED !== "true") return { healthy: true, enabled: false };
  const probe = await env.LEAD_DB.prepare("SELECT checked_at, healthy FROM signup_probe WHERE environment = ?")
    .bind(env.APP_ENV).first<{ checked_at: number; healthy: number }>();
  const failures = await env.LEAD_DB.prepare(`SELECT MAX(count) AS count FROM (
      SELECT COUNT(DISTINCT signal_id) AS count FROM signup_signals
      WHERE environment = ? AND created_at >= ? GROUP BY code
    )`).bind(env.APP_ENV, now - 15 * 60_000).first<{ count: number }>();
  const probeAgeSeconds = probe ? Math.max(0, Math.floor((now - probe.checked_at) / 1000)) : null;
  const repeatedFailures = failures?.count ?? 0;
  return {
    healthy: !!env.SIGNUP_PROBE_SECRET && !!env.SIGNUP_SIGNAL_RATE_LIMITER && probe?.healthy === 1 &&
      probeAgeSeconds !== null && probeAgeSeconds < 20 * 60 && repeatedFailures < 3,
    enabled: true, probeAgeSeconds, probeHealthy: probe?.healthy === 1, repeatedFailures,
  };
}
