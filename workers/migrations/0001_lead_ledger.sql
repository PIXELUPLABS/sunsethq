CREATE TABLE lead_submissions (
  submission_id TEXT PRIMARY KEY,
  environment TEXT NOT NULL,
  payload TEXT,
  payload_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','delivered')),
  created_at INTEGER NOT NULL,
  next_dispatch_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  last_failure_code TEXT,
  delivered_at INTEGER,
  attio_entry_id TEXT
);
CREATE INDEX leads_pending_dispatch ON lead_submissions(environment, status, next_dispatch_at);
CREATE INDEX leads_pending_age ON lead_submissions(environment, status, created_at);
CREATE INDEX leads_delivered_retention ON lead_submissions(status, delivered_at);
CREATE TABLE lead_monitor (
  environment TEXT PRIMARY KEY,
  last_reconciled_at INTEGER NOT NULL DEFAULT 0,
  last_alert_at INTEGER NOT NULL DEFAULT 0,
  incident_open INTEGER NOT NULL DEFAULT 0
);
