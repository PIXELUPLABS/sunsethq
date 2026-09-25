CREATE TABLE signup_signals (
  environment TEXT NOT NULL,
  signal_id TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY(environment, signal_id, code)
);
CREATE INDEX signup_signals_age ON signup_signals(environment, created_at);
