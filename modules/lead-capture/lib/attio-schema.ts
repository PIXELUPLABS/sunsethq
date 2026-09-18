// Namespaced fields preserve existing CRM attributes and retain each inquiry.
export const ATTIO_FIELDS = [
  { slug: "replay_submission_id", title: "Submission ID", type: "text", unique: true },
  { slug: "replay_company_name", title: "Company name", type: "text" },
  { slug: "replay_work_email", title: "Submitted work email", type: "text" },
  { slug: "replay_years_of_operation", title: "Years of operation", type: "text" },
  { slug: "replay_business_size", title: "Business size", type: "text" },
  { slug: "replay_english_share", title: "English communications", type: "text" },
  { slug: "replay_submitted_at", title: "Submitted at", type: "timestamp" },
  { slug: "replay_source_url", title: "Source page", type: "text" },
  { slug: "replay_campaign", title: "Campaign attribution", type: "text" },
  { slug: "replay_environment", title: "Environment", type: "text" },
  { slug: "replay_verification_status", title: "Verification status", type: "text" },
  { slug: "replay_verification_reason", title: "Verification detail", type: "text" },
] as const;
