import type { Lead, LeadMessage } from "./lead-schema";

const QUALIFYING_BUSINESS_SIZES = new Set(["10 - 19", "20 - 49", "50 - 199", "200 or more"]);
const QUALIFYING_ENGLISH_SHARES = new Set(["100%", "80% - 90%"]);

export function qualifiesForBooking(lead: Pick<Lead, "businessSize" | "englishShare">) {
  return QUALIFYING_BUSINESS_SIZES.has(lead.businessSize) && QUALIFYING_ENGLISH_SHARES.has(lead.englishShare);
}

export function getLeadBookingUrl(message: LeadMessage, bookingUrl?: string) {
  if (!bookingUrl || message.verification?.status !== "verified" || !qualifiesForBooking(message.lead)) return null;

  try {
    const url = new URL(bookingUrl);
    // Only a public event on Replay's Cal.com organization can be embedded.
    if (url.origin !== "https://replaydata.cal.com" || url.username || url.password ||
        url.pathname.split("/").filter(Boolean).length < 2 || url.search || url.hash) return null;
    return url.href;
  } catch {
    return null;
  }
}
