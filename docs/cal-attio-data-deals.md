# Cal bookings → Attio Data Deals

Verified form submissions that fail either business rule (fewer than 10 people or less than 80% English) create a Data Deal in **Not eligible - Replay form**, with all original answers and the ineligibility reason. They are assigned to Brendan. Unverified inquiries retain the existing manual review flow and are not labeled ineligible. Qualified inquiries remain in Website Leads until a call is booked.

Confirmed bookings on Sales / Data valuation call (team `443036`, event `7202505`) create a Data Deal in the existing **Booked** stage. The record includes the contact, original form answers when matched, campaign attribution, booking UID, contact name/email, call start/end, timezone, host, meeting URL and notes. Brendan and Jackie map to their existing Attio workspace members. An unmapped host leaves a recoverable failed delivery rather than assigning the wrong person.

## Reconciliation and delivery

- The embed and direct booking link pass only `metadata[replaySubmissionId]`, the opaque saved form UUID. This is hidden booking metadata, not a booking question or calendar note. The existing email prefill is unchanged.
- `POST /api/cal/bookings` authenticates the raw bytes with Cal's `X-Cal-Signature-256` HMAC. It accepts only confirmed `BOOKING_CREATED` events for the configured event type. No browser success callback writes to Attio.
- The reference matches a saved form in the same environment and is cross-checked against the booker's email. For old/direct bookings without a reference, the latest preceding form with the same email within 30 days is used. Unmatched bookings still create Booked deals with their booking details and a visible match explanation. If someone changes their email in Cal, the original reference is retained for manual reconciliation.
- Cloudflare D1 persists a `data_deal_jobs` receipt before Cal receives HTTP 202. The existing delivery Worker's minute schedule processes jobs with leases and retry/backoff. Cal does not wait for Attio.
- A unique Attio `replay_intake_key` deduplicates each booking UID / ineligible inquiry. A retry never resets a deal's stage, owner or other sales edits. Permanent Attio 4xx errors and missing/invalid owner configuration are retained as failed jobs; network/429/5xx errors retry. Owner configuration failures use the safe codes `owner_mapping_missing` or `owner_mapping_invalid`.
- Delivered payloads are cleared from D1 after 30 days, retaining receipt IDs. Pending/failed payloads are retained for recovery. Failed jobs or jobs pending over five minutes make the existing health monitor unhealthy.
- This integration captures initial confirmed bookings. Cancellation, rescheduling and reassignment events are not subscribed to and do not change deal stages or the saved call details.

## Production configuration

The additive Attio schema is provisioned with `npx tsx scripts/setup-data-deals.mts production`. The script checks the pinned workspace and existing mappings before adding fields, the new status, and the Replay source option. The Data Deals view remains grouped on `a_inventory` (Status), with Booked first and the new ineligible column visible.

`node scripts/setup-cal-webhook.mjs` uses local `CAL_COM_API_KEY` from `.env` to create a paused team event webhook and securely puts `CAL_WEBHOOK_SECRET` in the `replay-marketing` Worker. It preserves the signing secret in `.env.production.local`. Optional `REPLAY_CAL_ENV_FILE` / `REPLAY_ENV_FILE` select absolute local env file paths. It does not put the Cal API key in browser code or a Worker.

The GitHub **production environment** holds `CAL_COM_API_KEY` only for webhook activation during release. Main's deployment checks the signing secret exists, applies migrations, deploys the delivery Worker and website, verifies health and the active commit, then runs `scripts/activate-cal-webhook.mjs`. Activation refuses an unconfigured endpoint or unexpected webhook. Pull request checks have no access to the production Cal credential. The existing Attio API key stays in the private delivery Worker.

The one-time provisioned Cal webhook ID is `2c903453-f0e1-4061-983f-dde0bfeb993a`, with default payload version `2021-10-20`, trigger `BOOKING_CREATED`, and subscriber `https://www.replay.ai/api/cal/bookings`. It is intentionally paused until this release deploys. A manual release also needs `node scripts/activate-cal-webhook.mjs` with `CAL_COM_API_KEY` available after production verification.

## Diagnosis and recovery

Use the production D1 database `replay-leads-prod-ledger`:

```sql
SELECT job_id, status, attempts, last_failure_code, attio_record_id,
       datetime(created_at / 1000, 'unixepoch') AS received_at
FROM data_deal_jobs ORDER BY created_at DESC LIMIT 25;
```

Worker logs contain receipt/booking/record IDs and safe error codes, not payloads or secrets. If there is no receipt, check Cal's webhook is active and the delivery signature/event type matches. If pending, check the delivery Worker's scheduled invocations and `/api/health`. If failed, fix the Attio schema/permissions/owner mapping, then reopen only the affected receipt:

```sql
UPDATE data_deal_jobs
SET status = 'pending', next_attempt_at = 0, lease_token = NULL, last_failure_code = NULL
WHERE job_id = '<exact job_id>' AND environment = 'production' AND status = 'failed';
```

Do not resubmit the form or create a second calendar appointment to retry CRM delivery.
