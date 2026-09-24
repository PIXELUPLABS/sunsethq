import type { LedgerEnv } from "./lead-ledger";
import { saveDataDealJob } from "./data-deal-ledger";

export type CalBooking = {
  uid: string; createdAt: string; eventTypeId: number; title: string;
  startTime: string; endTime: string; name: string; email: string;
  timeZone: string; hostName: string; hostEmail: string; meetingUrl: string;
  notes: string; submissionId?: string;
};
export type CalWebhookEnv = LedgerEnv & { CAL_WEBHOOK_SECRET?: string; CAL_EVENT_TYPE_ID?: string };
const text = (value: unknown, max = 500) => typeof value === "string" ? value.slice(0, max).trim() : "";
const date = (value: unknown) => typeof value === "string" && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : "";
const email = (value: unknown) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(value, 254)) ? text(value, 254).toLowerCase() : "";
const object = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};

export function parseCalBooking(body: unknown, eventTypeId: string): CalBooking | null {
  const envelope = object(body);
  const payload = object(envelope.payload);
  if (envelope.triggerEvent !== "BOOKING_CREATED" || String(payload.eventTypeId) !== eventTypeId) return null;
  // Requested bookings must never be represented as a confirmed sales call.
  if (payload.status !== "ACCEPTED" && !(payload.status === undefined && payload.requiresConfirmation === false)) return null;
  const responses = object(payload.responses);
  const attendees = Array.isArray(payload.attendees) ? payload.attendees.map(object) : [];
  const bookerEmail = email(object(responses.email).value) || email(attendees[0]?.email);
  const booker = attendees.find(attendee => email(attendee.email) === bookerEmail);
  const organizer = object(payload.organizer);
  const uid = text(payload.uid, 100);
  const createdAt = date(envelope.createdAt);
  const startTime = date(payload.startTime);
  const endTime = date(payload.endTime);
  if (!/^[a-zA-Z0-9_-]+$/.test(uid) || !bookerEmail || !createdAt || !startTime || !endTime || endTime <= startTime || !email(organizer.email)) {
    throw new Error("Invalid booking payload");
  }
  const candidateUrl = text(object(payload.metadata).videoCallUrl || object(payload.videoCallData).url || payload.location, 2000);
  let meetingUrl = "";
  try { const url = new URL(candidateUrl); if (url.protocol === "https:" && !url.username && !url.password) meetingUrl = url.href; } catch { /* Non-URL meeting locations are not links. */ }
  const submissionId = text(object(payload.metadata).replaySubmissionId, 100);
  return { uid, createdAt, eventTypeId: Number(eventTypeId), title: text(payload.eventTitle || payload.title),
    ...(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(submissionId) ? { submissionId } : {}),
    startTime, endTime, email: bookerEmail, name: text(booker?.name || object(responses.name).value),
    timeZone: text(booker?.timeZone, 100), hostName: text(organizer.name), hostEmail: email(organizer.email),
    meetingUrl, notes: text(payload.additionalNotes || object(responses.notes).value, 10000) };
}

async function signedBody(request: Request, secret: string) {
  const signature = request.headers.get("x-cal-signature-256") ?? "";
  if (!/^[a-f0-9]{64}$/i.test(signature)) return null;
  // Bound actual streamed bytes, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 128 * 1024) { await reader.cancel(); throw new RangeError("Payload too large"); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const signatureBytes = Uint8Array.from(signature.match(/../g)!, part => parseInt(part, 16));
  return await crypto.subtle.verify("HMAC", key, signatureBytes, bytes) ? new TextDecoder().decode(bytes) : null;
}

export async function handleCalWebhook(request: Request, env: CalWebhookEnv) {
  const reply = (status: number, state: string) => Response.json({ status: state }, { status, headers: { "Cache-Control": "no-store" } });
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  if (!env.CAL_WEBHOOK_SECRET || !/^\d+$/.test(env.CAL_EVENT_TYPE_ID ?? "")) return reply(503, "not_configured");
  let booking: CalBooking | null;
  try {
    const raw = await signedBody(request, env.CAL_WEBHOOK_SECRET);
    if (raw === null) return reply(401, "invalid_signature");
    booking = parseCalBooking(JSON.parse(raw), env.CAL_EVENT_TYPE_ID!);
  } catch (error) { return reply(error instanceof RangeError ? 413 : 400, "invalid_payload"); }
  if (!booking) return reply(200, "ignored");
  try {
    await saveDataDealJob(env, { kind: "booking", booking });
    console.info(JSON.stringify({ event: "cal_booking_saved", bookingUid: booking.uid }));
    return reply(202, "accepted");
  } catch {
    console.error(JSON.stringify({ event: "cal_booking_save_failed", bookingUid: booking.uid }));
    return reply(503, "retry_later");
  }
}
