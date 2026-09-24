import type { RateLimit } from "@cloudflare/workers-types";
import type { LedgerEnv } from "./lead-ledger";

const BROWSER_SIGNAL_CODES = ["bootstrap_timeout", "javascript_error", "verification_unavailable", "submission_failed"] as const;
export type SignupSignalCode = typeof BROWSER_SIGNAL_CODES[number] | "verification_rejected" | "intake_unavailable";
export type SignupMonitorEnv = LedgerEnv & {
  SIGNUP_MONITORING_ENABLED?: string;
  SIGNUP_SIGNAL_RATE_LIMITER?: RateLimit;
  ALLOWED_ORIGINS?: string;
};
export async function recordSignupSignal(env: SignupMonitorEnv, code: SignupSignalCode, id = crypto.randomUUID(), now = Date.now()) {
  if (env.SIGNUP_MONITORING_ENABLED !== "true") return;
  await env.LEAD_DB.prepare(`INSERT INTO signup_signals(environment, signal_id, code, created_at)
    VALUES (?, ?, ?, ?) ON CONFLICT(environment, signal_id, code) DO NOTHING`)
    .bind(env.APP_ENV, id, code, now).run();
}

// Accept only tiny, enumerated telemetry. Never store bodies, URLs, IPs, tokens,
// email addresses, exception text, or visitor identifiers across page loads.
export async function handleSignupSignal(request: Request, env: SignupMonitorEnv) {
  const reply = (status: number) => new Response(null, { status, headers: { "Cache-Control": "no-store" } });
  if (request.method !== "POST") return reply(405);
  if (env.SIGNUP_MONITORING_ENABLED !== "true") return reply(204);
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
        !BROWSER_SIGNAL_CODES.includes(body.code as typeof BROWSER_SIGNAL_CODES[number])) return reply(400);
  } catch { return reply(400); }
  try {
    await recordSignupSignal(env, body.code as SignupSignalCode, body.id as string);
    return reply(204);
  } catch { return reply(503); }
}

export async function signupHealth(env: SignupMonitorEnv, now = Date.now()) {
  if (env.SIGNUP_MONITORING_ENABLED !== "true") return { healthy: true, enabled: false };
  const failures = await env.LEAD_DB.prepare(`SELECT MAX(count) AS count FROM (
      SELECT COUNT(DISTINCT signal_id) AS count FROM signup_signals
      WHERE environment = ? AND created_at >= ? GROUP BY code
    )`).bind(env.APP_ENV, now - 15 * 60_000).first<{ count: number }>();
  const repeatedFailures = failures?.count ?? 0;
  return {
    healthy: !!env.SIGNUP_SIGNAL_RATE_LIMITER && repeatedFailures < 3,
    enabled: true, repeatedFailures,
  };
}
