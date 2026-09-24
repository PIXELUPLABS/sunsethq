import { ATTIO_FIELDS } from "./attio-schema";

export const BOOKED_STATUS = "Booked";
export const INELIGIBLE_STATUS = "Not eligible - Replay form";
export const DATA_DEAL_FIELDS = [
  { slug: "replay_intake_key", title: "Replay intake ID", type: "text", unique: true },
  ...ATTIO_FIELDS.map(field => ({ ...field, unique: false })),
  { slug: "replay_ineligibility_reason", title: "Replay ineligibility reason", type: "text" },
  { slug: "replay_booking_uid", title: "Cal booking ID", type: "text" },
  { slug: "replay_cal_submission_ref", title: "Cal submission reference", type: "text" },
  { slug: "replay_booking_name", title: "Booking contact name", type: "text" },
  { slug: "replay_booking_email", title: "Booking contact email", type: "text" },
  { slug: "replay_booking_created_at", title: "Call booked at", type: "timestamp" },
  { slug: "replay_booking_start", title: "Call starts at", type: "timestamp" },
  { slug: "replay_booking_end", title: "Call ends at", type: "timestamp" },
  { slug: "replay_booking_timezone", title: "Booking timezone", type: "text" },
  { slug: "replay_booking_host", title: "Cal host", type: "text" },
  { slug: "replay_booking_url", title: "Call meeting URL", type: "text" },
  { slug: "replay_booking_notes", title: "Booking notes", type: "text" },
  { slug: "replay_form_match", title: "Replay form match", type: "text" },
] as const;
