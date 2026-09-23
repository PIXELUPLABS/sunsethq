-- 0005 is reserved for the concurrent Cal/Attio delivery work.
CREATE TABLE signup_signals (
  environment TEXT NOT NULL,
  signal_id TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY(environment, signal_id, code)
);
CREATE INDEX signup_signals_age ON signup_signals(environment, created_at);
CREATE TABLE signup_probe (
  environment TEXT PRIMARY KEY,
  checked_at INTEGER NOT NULL,
  healthy INTEGER NOT NULL CHECK(healthy IN (0, 1))
);
