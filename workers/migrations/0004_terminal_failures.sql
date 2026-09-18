-- Rebuild to extend the existing status CHECK constraint without losing receipts.
CREATE TABLE lead_submissions_next (
  submission_id TEXT PRIMARY KEY,
  environment TEXT NOT NULL,
  payload TEXT,
  payload_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','delivered','failed')),
  created_at INTEGER NOT NULL,
  next_dispatch_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  last_failure_code TEXT,
  delivered_at INTEGER,
  attio_entry_id TEXT,
  unverified_notified_at INTEGER,
  unverified_notification_lease_until INTEGER NOT NULL DEFAULT 0,
  failed_at INTEGER,
  failed_queue_sent_at INTEGER,
  failed_queue_lease_until INTEGER NOT NULL DEFAULT 0
);
INSERT INTO lead_submissions_next (
  submission_id, environment, payload, payload_hash, status, created_at,
  next_dispatch_at, attempts, last_attempt_at, last_failure_code, delivered_at,
  attio_entry_id, unverified_notified_at, unverified_notification_lease_until
)
SELECT submission_id, environment, payload, payload_hash, status, created_at,
  next_dispatch_at, attempts, last_attempt_at, last_failure_code, delivered_at,
  attio_entry_id, unverified_notified_at, unverified_notification_lease_until
FROM lead_submissions;
DROP TABLE lead_submissions;
ALTER TABLE lead_submissions_next RENAME TO lead_submissions;
CREATE INDEX leads_pending_dispatch ON lead_submissions(environment, status, next_dispatch_at);
CREATE INDEX leads_pending_age ON lead_submissions(environment, status, created_at);
CREATE INDEX leads_delivered_retention ON lead_submissions(status, delivered_at);
CREATE INDEX leads_failed_dispatch ON lead_submissions(environment, status, failed_queue_sent_at, failed_queue_lease_until);
