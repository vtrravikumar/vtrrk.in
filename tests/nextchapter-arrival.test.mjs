import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("NextChapter switches to a branded arrival card at zero", async () => {
  const page = await read("../src/pages/countdown/index.astro");
  assert.match(page, /id="arrival-card"/);
  assert.match(page, /Happy New Year \\{year\\}!/);
  assert.match(page, /The moment is here!/);
  assert.match(page, /id="arrival-watermark"|class="arrival-watermark"/);
  assert.match(page, /vtrrk\\.in/);
  assert.match(page, /arrival-card.*hidden/);
  assert.match(page, /if \\(parts\\.complete\\)/);
  assert.match(page, /id="next-countdown-button"/);
  assert.match(page, /prefers-reduced-motion:reduce/);
});

test("completed countdown share graphics carry the greeting and VTRRK watermark", async () => {
  const page = await read("../src/pages/countdown/index.astro");
  assert.match(page, /HAPPY NEW YEAR/);
  assert.match(page, /THE MOMENT IS HERE!/);
  assert.match(page, /context\\.fillText\\("vtrrk\\.in", 88, 584\\)/);
  assert.match(page, /canvas\\.width = 1200/);
  assert.match(page, /canvas\\.height = 630/);
  assert.match(page, /trackMetric\\("card_download"\\)/);
});

test("NextChapter tracks only allowlisted aggregate events", async () => {
  const endpoint = await read("../functions/api/countdown/metrics.ts");
  const migration = await read("../docs/nextchapter-analytics.sql");
  assert.match(endpoint, /"page_view"/);
  assert.match(endpoint, /"share_click"/);
  assert.match(endpoint, /"card_download"/);
  assert.match(endpoint, /"arrival_view"/);
  assert.match(endpoint, /ON CONFLICT\\(metric_date, event\\)/);
  assert.match(endpoint, /SUM\\(event_count\\)/);
  assert.match(endpoint, /origin !== new URL\\(request\\.url\\)\\.origin/);
  assert.doesNotMatch(endpoint, /request\\.headers\\.get\\("cf-connecting-ip"\\)/);
  assert.doesNotMatch(endpoint, /user-agent|document\\.referrer|localStorage/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS nextchapter_metrics/);
  assert.match(migration, /PRIMARY KEY \\(metric_date, event\\)/);
});

test("NextChapter public counter is explicitly labelled as visits, not unique users", async () => {
  const page = await read("../src/pages/countdown/index.astro");
  const docs = await read("../docs/nextchapter-analytics.md");
  assert.match(page, /Visits to NextChapter/);
  assert.match(page, /fetch\\("\/api\/countdown\/metrics"/);
  assert.match(docs, /not unique visitors or people/);
  assert.match(docs, /No IP address, cookie, user-agent, referrer/);
});
