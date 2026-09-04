-- Run this once against the existing vtrrk-travelogue D1 database.
ALTER TABLE download_codes ADD COLUMN issued_at TEXT;
