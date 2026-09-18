import type { LeadMessage } from "./lead-schema";

export type AttioConfig = {
  ATTIO_API_KEY: string;
  ATTIO_LIST_ID: string;
  ATTIO_WORKSPACE_ID: string;
};
type AttioRecord = { id: { record_id: string }; web_url: string };
type AttioEntry = { id: { entry_id: string }; parent_record_id: string; entry_values: Record<string, unknown[]> };

export class AttioError extends Error {
  constructor(public status: number, public code: string, public retryAfter = 60) {
    // Never include upstream response bodies, submitted PII, or credentials in errors.
    super(`Attio request failed (${status}, ${code})`);
  }
}

export function attioClient(token: string, fetcher: typeof fetch = fetch) {
  return async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
    const response = await fetcher(`https://api.attio.com/v2/${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({})) as { code?: string };
      const retryAfter = Number(response.headers.get("retry-after"));
      throw new AttioError(response.status, error.code ?? "unknown", Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 60);
    }
    return response.json() as Promise<T>;
  };
}

export async function deliverToAttio(message: LeadMessage, config: AttioConfig, fetcher: typeof fetch = fetch) {
  if (!config.ATTIO_API_KEY || !config.ATTIO_LIST_ID || !config.ATTIO_WORKSPACE_ID) {
    throw new Error("Attio configuration missing");
  }
  const request = attioClient(config.ATTIO_API_KEY, fetcher);
  // Fail closed if someone supplies the production token to the dev worker.
  const identity = await request<{ workspace_id: string }>("self");
  if (identity.workspace_id !== config.ATTIO_WORKSPACE_ID) throw new Error("Attio workspace mismatch");
  const listPath = `lists/${encodeURIComponent(config.ATTIO_LIST_ID)}`;
  const findEntry = () => request<{ data: AttioEntry[] }>(`${listPath}/entries/query`, "POST", {
    filter: { replay_submission_id: { $eq: message.submissionId } }, limit: 1,
  });
  const existing = (await findEntry()).data[0];
  if (existing) return { entryId: existing.id.entry_id, duplicate: true };

  // Only the matching email is written. Existing names, addresses, and company
  // relationships are left to the CRM; we never infer a company from gmail.com.
  const person = await request<{ data: AttioRecord }>("objects/people/records?matching_attribute=email_addresses", "PUT", {
    data: { values: { email_addresses: [message.lead.workEmail] } },
  });
  const entryValues = {
    replay_submission_id: message.submissionId,
    replay_company_name: message.lead.companyName,
    replay_work_email: message.lead.workEmail,
    replay_years_of_operation: message.lead.yearsOfOperation,
    replay_business_size: message.lead.businessSize,
    replay_english_share: message.lead.englishShare,
    replay_submitted_at: message.submittedAt,
    replay_source_url: message.sourceUrl,
    replay_campaign: JSON.stringify(message.campaign),
    replay_environment: message.environment,
    replay_verification_status: message.verification?.status === "verified" ? "Verified" : message.verification?.status === "unverified" ? "Unverified" : "Unknown (legacy)",
    ...(message.verification?.status === "unverified" ? { replay_verification_reason: message.verification.reason } : {}),
  };
  try {
    const result = await request<{ data: AttioEntry }>(`${listPath}/entries`, "POST", {
      data: { parent_object: "people", parent_record_id: person.data.id.record_id, entry_values: entryValues },
    });
    return { entryId: result.data.id.entry_id, duplicate: false };
  } catch (error) {
    // A concurrent delivery or a lost HTTP response may have already committed.
    // The unique submission attribute is the atomic deduplication boundary.
    const committed = (await findEntry()).data[0];
    if (committed) return { entryId: committed.id.entry_id, duplicate: true };
    throw error;
  }
}
