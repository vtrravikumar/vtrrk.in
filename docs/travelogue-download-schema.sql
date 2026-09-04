CREATE TABLE IF NOT EXISTS download_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  redeemed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_download_codes_lookup
  ON download_codes (code_hash, redeemed_at, expires_at);
