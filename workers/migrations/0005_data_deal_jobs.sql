CREATE TABLE data_deal_jobs (
  job_id TEXT PRIMARY KEY,
  environment TEXT NOT NULL,
  payload TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'delivered', 'failed')),
  created_at INTEGER NOT NULL,
  next_attempt_at INTEGER NOT NULL,
  lease_token TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_failure_code TEXT,
  delivered_at INTEGER,
  attio_record_id TEXT
);
CREATE INDEX data_deal_jobs_pending ON data_deal_jobs(environment, status, next_attempt_at);
