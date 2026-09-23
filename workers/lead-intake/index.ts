import { isSignupProbe, PROBE_HEADER, recordSignupProbe, recordSignupSignal, type SignupMonitorEnv } from "../../modules/lead-capture/lib/signup-monitor";
import type { Queue, RateLimit } from "@cloudflare/workers-types";
import { parseSubmission, type LeadMessage } from "../../modules/lead-capture/lib/lead-schema";
import { enqueueSavedLead, persistLead, SubmissionConflict, leadHealth, type LedgerEnv } from "../../modules/lead-capture/lib/lead-ledger";
import type { LeadVerification } from "../../modules/lead-capture/lib/verification";
import { getLeadBookingUrl } from "../../modules/lead-capture/lib/booking-qualification";

export type IntakeEnv = LedgerEnv & SignupMonitorEnv & {
  LEADS: Queue<LeadMessage>;
  LEAD_RATE_LIMITER: RateLimit;
  UNVERIFIED_RATE_LIMITER?: RateLimit;
  UNVERIFIED_LEADS_ENABLED?: string;
  TURNSTILE_SECRET_KEY: string;
  ALLOWED_ORIGINS: string;
  SITE_ORIGIN: string;
  APP_ENV: "local" | "development" | "production";
  CAL_BOOKING_URL?: string;
};
const MAX_BODY_BYTES = 8192;
const TEST_SECRET = "1x0000000000000000000000000000000AA";

async function readBody(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) throw new Error("body_limit");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid_body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new Error("body_limit"); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
}

export async function handleIntake(request: Request, env: IntakeEnv, fetcher: typeof fetch = fetch) {
  if (new URL(request.url).pathname === "/health" && request.method === "GET") {
    try {
      const { healthy } = await leadHealth(env);
      return Response.json({ healthy }, { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
    } catch { return Response.json({ healthy: false }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
  }
  const origin = request.headers.get("origin");
  const allowed = env.ALLOWED_ORIGINS?.split(",").map((item) => item.trim()) ?? [];
  const headers: Record<string, string> = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", Vary: "Origin" };
  if (origin && allowed.includes(origin)) headers["Access-Control-Allow-Origin"] = origin;
  const reply = async (status: number, data: unknown) => {
    if (status === 503) {
      try { await recordSignupSignal(env, "intake_unavailable"); }
      catch { console.error(JSON.stringify({ event: "signup_signal_failed" })); }
    }
    return Response.json(data, { status, headers });
  };
  if (new URL(request.url).pathname !== "/api/leads") return reply(404, { error: "Not found." });
  if (!origin || !allowed.includes(origin)) return reply(403, { error: "Submission origin is not allowed." });
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { ...headers, "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type" } });
  }
  if (request.method !== "POST") return reply(405, { error: "Use POST." });
  const isLocal = env.APP_ENV === "local" && ["localhost", "127.0.0.1"].includes(new URL(request.url).hostname);
  if (!["local", "development", "production"].includes(env.APP_ENV) ||
      !env.TURNSTILE_SECRET_KEY || !env.SITE_ORIGIN || !env.LEADS || !env.LEAD_RATE_LIMITER || !env.LEAD_DB ||
      (!isLocal && (/^[123]x0+/.test(env.TURNSTILE_SECRET_KEY) || env.APP_ENV === "local"))) {
    return reply(503, { error: "Submissions are temporarily unavailable. Please try again shortly." });
  }
  try {
    const probe = request.headers.has(PROBE_HEADER);
    if (probe && !await isSignupProbe(request, env)) return reply(401, { error: "Invalid probe credential." });
    const ip = request.headers.get("cf-connecting-ip") ?? (isLocal ? "local" : null);
    if (!ip) return reply(403, { error: "Unable to verify this request." });
    const { success } = await env.LEAD_RATE_LIMITER.limit({ key: ip });
    if (!success) { headers["Retry-After"] = "60"; return reply(429, { error: "Too many attempts. Please wait a minute and try again." }); }
    if (!request.headers.get("content-type")?.startsWith("application/json")) return reply(415, { error: "Send a JSON submission." });
    let input: unknown;
    try { input = await readBody(request); }
    catch (error) { return reply(error instanceof Error && error.message === "body_limit" ? 413 : 400, { error: "Please check your form and try again." }); }
    const submission = parseSubmission(input);
    if (!submission) return reply(400, { error: "Please check your form and try again." });
    let leadVerification: LeadVerification;
    if (submission.turnstileToken) {
      let result: { success: boolean; hostname?: string; action?: string } | null = null;
      try {
        const verification = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: submission.turnstileToken, ...(isLocal ? {} : { remoteip: ip }) }),
          redirect: "manual",
          signal: AbortSignal.timeout(10_000),
        });
        if (verification.ok) result = await verification.json();
      } catch { /* A provider outage can be accepted for manual review below. */ }
      const usesLocalTestKey = isLocal && env.TURNSTILE_SECRET_KEY === TEST_SECRET;
      if (result && (!result.success || (!usesLocalTestKey && (result.hostname !== new URL(origin).hostname || result.action !== "lead_capture")))) {
        try { await recordSignupSignal(env, "verification_rejected", submission.submissionId); }
        catch { console.error(JSON.stringify({ event: "signup_signal_failed" })); }
        return reply(400, { error: "Please complete the verification and try again." });
      }
      leadVerification = result ? { status: "verified" } : { status: "unverified", reason: "service_unavailable" };
    } else {
      // This is a client-reported failure, never proof that a visitor is human.
      leadVerification = { status: "unverified", reason: submission.verificationFallback! };
    }
    if (probe) {
      if (leadVerification.status !== "verified") {
        await recordSignupProbe(env, false);
        return reply(503, { error: "Probe verification failed." });
      }
      // Exercise validation and real siteverify, but do not create a lead,
      // send email, offer a calendar, or enqueue a synthetic CRM write.
      await recordSignupProbe(env, true);
      return reply(202, { accepted: true, synthetic: true, submissionId: submission.submissionId, verification: "verified", bookingUrl: null });
    }
    if (leadVerification.status === "unverified") {
      if (env.UNVERIFIED_LEADS_ENABLED !== "true" || !env.UNVERIFIED_RATE_LIMITER) {
        return reply(503, { error: "Verification is unavailable. Your answers are saved—please try again shortly." });
      }
      if (!(await env.UNVERIFIED_RATE_LIMITER.limit({ key: ip })).success) {
        headers["Retry-After"] = "60";
        return reply(429, { error: "Too many attempts. Please wait a minute and try again." });
      }
    }
    const { submissionId, campaign, landingPath, companyName, workEmail, yearsOfOperation, businessSize, englishShare } = submission;
    const saved = await persistLead(env, {
      version: 1, environment: env.APP_ENV, submissionId,
      verification: leadVerification,
      campaign: { ...campaign, ...(landingPath ? { landing_page: new URL(landingPath, env.SITE_ORIGIN).href } : {}) },
      submittedAt: new Date().toISOString(), sourceUrl: new URL("/value-my-data", env.SITE_ORIGIN).href,
      lead: { companyName, workEmail, yearsOfOperation, businessSize, englishShare },
    });
    if (!saved.delivered && !saved.failed) {
      try { await enqueueSavedLead(env, saved.message); }
      catch { console.error(JSON.stringify({ event: "lead_enqueue_deferred", submissionId })); }
    }
    const verificationStatus = saved.message.verification?.status ?? "unknown";
    console.info(JSON.stringify({ event: "lead_accepted", submissionId, verification: verificationStatus }));
    return reply(202, {
      accepted: true, submissionId, verification: verificationStatus,
      bookingUrl: getLeadBookingUrl(saved.message, env.CAL_BOOKING_URL),
    });
  } catch (error) {
    if (error instanceof SubmissionConflict) return reply(409, { error: "Please reload the form before submitting different answers." });
    console.error(JSON.stringify({ event: "lead_intake_failed" }));
    return reply(503, { error: "We couldn’t receive your request. Your answers are still here—please try again." });
  }
}

const worker = { fetch: (request: Request, env: IntakeEnv) => handleIntake(request, env) };
export default worker;
