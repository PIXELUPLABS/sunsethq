import type { CalBooking } from "./cal-webhook";
import type { LeadMessage } from "./lead-schema";

export type DataDealJob = { kind: "booking"; booking: CalBooking; lead?: LeadMessage } | { kind: "ineligible"; lead: LeadMessage };
export const dataDealKey = (job: DataDealJob, environment: string) => `${environment}:${job.kind}:${job.kind === "booking" ? job.booking.uid : job.lead.submissionId}`;
