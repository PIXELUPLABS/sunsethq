import assert from "node:assert/strict";
import { test } from "node:test";
import { qualifiesForBooking, getLeadBookingUrl } from "../modules/lead-capture/lib/booking-qualification";
import { BUSINESS_SIZE_OPTIONS, ENGLISH_SHARE_OPTIONS, YEARS_OF_OPERATION_OPTIONS, type LeadMessage } from "../modules/lead-capture/lib/lead-schema";

const bookingUrl = "https://replaydata.cal.com/sales/test-event";
const message: LeadMessage = {
  version: 1, environment: "production", submissionId: "test-submission",
  submittedAt: "2026-09-23T12:00:00.000Z", sourceUrl: "https://www.replay.ai/value-my-data",
  campaign: {}, verification: { status: "verified" },
  lead: { companyName: "Test", workEmail: "test@example.com", yearsOfOperation: "Under 2 Years", businessSize: "10 - 19", englishShare: "80% - 90%" },
};

test("booking requires 10+ people and at least 80% English, regardless of years in operation", () => {
  for (const yearsOfOperation of YEARS_OF_OPERATION_OPTIONS) {
    for (const businessSize of BUSINESS_SIZE_OPTIONS) {
      for (const englishShare of ENGLISH_SHARE_OPTIONS) {
        const lead = { ...message.lead, yearsOfOperation, businessSize, englishShare };
        const expected = businessSize !== "1 to 9 people" && englishShare !== "Less than 80%";
        assert.equal(qualifiesForBooking(lead), expected, JSON.stringify({ yearsOfOperation, businessSize, englishShare }));
        assert.equal(getLeadBookingUrl({ ...message, lead }, bookingUrl), expected ? bookingUrl : null);
      }
    }
  }
});

test("unknown answers, unverified inquiries, and legacy receipts do not unlock booking", () => {
  assert.equal(qualifiesForBooking({ ...message.lead, businessSize: "unknown" }), false);
  assert.equal(qualifiesForBooking({ ...message.lead, englishShare: "unknown" }), false);
  assert.equal(getLeadBookingUrl({ ...message, verification: undefined }, bookingUrl), null);
  assert.equal(getLeadBookingUrl({ ...message, verification: { status: "unverified", reason: "service_unavailable" } }, bookingUrl), null);
});

test("booking stays unavailable until a valid public Replay Cal.com event is configured", () => {
  for (const url of [undefined, "", "invalid", "http://replaydata.cal.com/sales/test-event", "https://attacker.example/sales/test-event",
    "https://app.cal.com/event-types?teamId=443036", "https://replaydata.cal.com/sales", "https://user:pass@replaydata.cal.com/sales/test-event",
    `${bookingUrl}?email=someone@example.com`, `${bookingUrl}#fragment`]) {
    assert.equal(getLeadBookingUrl(message, url), null, url);
  }
});
