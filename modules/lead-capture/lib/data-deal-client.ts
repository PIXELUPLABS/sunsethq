import { attioClient, type AttioConfig } from "./attio-client";
import { BOOKED_STATUS, INELIGIBLE_STATUS } from "./data-deal-schema";
import { dataDealKey, type DataDealJob } from "./data-deal-job";
import type { LeadMessage } from "./lead-schema";

export type DataDealConfig = AttioConfig & {
  ATTIO_DATA_DEALS_ENABLED?: string;
  ATTIO_DATA_DEAL_DEFAULT_OWNER?: string;
  ATTIO_CAL_HOST_OWNERS?: string;
};
type RecordResult = { id: { record_id: string } };

function leadValues(message: LeadMessage) {
  return {
    replay_submission_id: message.submissionId, replay_company_name: message.lead.companyName,
    replay_work_email: message.lead.workEmail, replay_years_of_operation: message.lead.yearsOfOperation,
    replay_business_size: message.lead.businessSize, replay_english_share: message.lead.englishShare,
    replay_submitted_at: message.submittedAt, replay_source_url: message.sourceUrl,
    replay_campaign: JSON.stringify(message.campaign), replay_environment: message.environment,
    replay_verification_status: message.verification?.status === "verified" ? "Verified" : message.verification?.status === "unverified" ? "Unverified" : "Unknown (legacy)",
    ...(message.verification?.status === "unverified" ? { replay_verification_reason: message.verification.reason } : {}),
  };
}

export async function deliverDataDeal(job: DataDealJob, config: DataDealConfig, environment: string, fetcher: typeof fetch = fetch) {
  const request = attioClient(config.ATTIO_API_KEY, fetcher);
  if ((await request<{ workspace_id: string }>("self")).workspace_id !== config.ATTIO_WORKSPACE_ID) throw new Error("Attio workspace mismatch");
  const key = dataDealKey(job, environment);
  const recordsPath = "objects/data_deals/records";
  const findRecord = async () => (await request<{ data: RecordResult[] }>(`${recordsPath}/query`, "POST", {
    filter: { replay_intake_key: { $eq: key } }, limit: 1,
  })).data[0];
  const existing = await findRecord();
  // Never reset a deal's stage/owner after a salesperson has advanced it.
  if (existing) return { recordId: existing.id.record_id };
  const booking = job.kind === "booking" ? job.booking : undefined;
  const hostOwners = JSON.parse(config.ATTIO_CAL_HOST_OWNERS || "{}") as Record<string, string>;
  const owner = booking ? hostOwners[booking.hostEmail] : config.ATTIO_DATA_DEAL_DEFAULT_OWNER;
  if (!owner) throw new Error("Data deal owner mapping missing");
  const email = booking?.email ?? job.lead!.lead.workEmail;
  const person = await request<{ data: RecordResult }>("objects/people/records?matching_attribute=email_addresses", "PUT", {
    data: { values: { email_addresses: [email] } },
  });
  const values = {
    replay_intake_key: key, replay_environment: environment,
    deal_name: `${job.lead?.lead.companyName || booking?.name || email} - Replay`,
    deal_owner: [{ referenced_actor_type: "workspace-member", referenced_actor_id: owner }],
    associated_deal: [{ target_object: "people", target_record_id: person.data.id.record_id }],
    source: "Replay",
    a_inventory: booking ? BOOKED_STATUS : INELIGIBLE_STATUS,
    ...(job.lead ? leadValues(job.lead) : {}),
    ...(booking ? {
      replay_booking_uid: booking.uid, replay_booking_name: booking.name, replay_booking_email: booking.email,
      replay_booking_created_at: booking.createdAt, replay_booking_start: booking.startTime, replay_booking_end: booking.endTime,
      replay_booking_timezone: booking.timeZone, replay_booking_host: `${booking.hostName} <${booking.hostEmail}>`,
      replay_booking_url: booking.meetingUrl, replay_booking_notes: booking.notes,
      replay_cal_submission_ref: booking.submissionId || "",
      replay_form_match: job.lead ? (booking.submissionId ? "Submission reference and booking email" : "Latest form with matching booking email (within 30 days)") : "No recent form with matching booking email",
    } : {
      replay_ineligibility_reason: [
        job.lead!.lead.businessSize === "1 - 9" ? "Fewer than 10 employees" : "",
        !["100%", "80% - 90%"].includes(job.lead!.lead.englishShare) ? "Less than 80% English communications" : "",
      ].filter(Boolean).join("; "),
    }),
  };
  try {
    const result = await request<{ data: RecordResult }>(recordsPath, "POST", { data: { values } });
    return { recordId: result.data.id.record_id };
  } catch (error) {
    // A unique Replay intake ID also protects against concurrent workers and
    // a successful Attio write whose HTTP response was lost.
    const committed = await findRecord();
    if (committed) return { recordId: committed.id.record_id };
    throw error;
  }
}
