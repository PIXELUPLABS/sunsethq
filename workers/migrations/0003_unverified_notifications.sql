ALTER TABLE lead_submissions ADD COLUMN unverified_notified_at INTEGER;
ALTER TABLE lead_submissions ADD COLUMN unverified_notification_lease_until INTEGER NOT NULL DEFAULT 0;
