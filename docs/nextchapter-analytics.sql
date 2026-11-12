-- Apply once to the existing vtrrk-travelogue D1 database.
-- The table is isolated from the Travelogue download-code data.
CREATE TABLE IF NOT EXISTS nextchapter_metrics (
  metric_date TEXT NOT NULL,
  event TEXT NOT NULL CHECK (event IN ('page_view', 'share_click', 'card_download', 'arrival_view')),
  event_count INTEGER NOT NULL DEFAULT 0 CHECK (event_count >= 0),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (metric_date, event)
);

CREATE INDEX IF NOT EXISTS idx_nextchapter_metrics_event_date
  ON nextchapter_metrics (event, metric_date);
