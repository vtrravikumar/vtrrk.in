CREATE TABLE IF NOT EXISTS download_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  redeemed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  issued_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_download_codes_hash ON download_codes(code_hash);

-- Existing databases: run this once if issued_at is not yet present.
-- ALTER TABLE download_codes ADD COLUMN issued_at TEXT;
