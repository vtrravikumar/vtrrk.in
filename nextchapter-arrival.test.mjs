import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("NextChapter switches to a branded arrival card at zero", async () => {
  const page = await read("../src/pages/countdown/index.astro");
  assert.ok(page.includes('id="arrival-card"'));
  assert.ok(page.includes('Happy New Year ${year}!'));
  assert.ok(page.includes('The moment is here!'));
  assert.ok(page.includes('class="arrival-watermark"'));
  assert.ok(page.includes("vtrrk.in"));
  assert.ok(page.includes('if (completed)'));
  assert.ok(page.includes('id="next-countdown-button"'));
  assert.ok(page.includes("prefers-reduced-motion:reduce"));
});

test("completed countdown share graphics carry the greeting and VTRRK watermark", async () => {
  const page = await read("../src/pages/countdown/index.astro");
  assert.ok(page.includes("HAPPY NEW YEAR"));
  assert.ok(page.includes("THE MOMENT IS HERE!"));
  assert.ok(page.includes('context.fillText("vtrrk.in", 88, 584)'));
  assert.ok(page.includes("canvas.width = 1200"));
  assert.ok(page.includes("canvas.height = 630"));
  assert.ok(page.includes('trackMetric("card_download")'));
});

test("NextChapter tracks only allowlisted aggregate events", async () => {
  const endpoint = await read("../functions/api/countdown/metrics.ts");
  const migration = await read("../docs/nextchapter-analytics.sql");
  for (const event of ["page_view", "share_click", "card_download", "arrival_view"]) {
    assert.ok(endpoint.includes(`"${event}"`));
  }
  assert.ok(endpoint.includes("ON CONFLICT(metric_date, event)"));
  assert.ok(endpoint.includes("SUM(event_count)"));
  assert.ok(endpoint.includes("origin !== new URL(request.url).origin"));
  assert.ok(!endpoint.includes("cf-connecting-ip"));
  assert.ok(!endpoint.includes("user-agent"));
  assert.ok(migration.includes("CREATE TABLE IF NOT EXISTS nextchapter_metrics"));
  assert.ok(migration.includes("PRIMARY KEY (metric_date, event)"));
});

test("NextChapter public counter is explicitly labelled as visits, not unique users", async () => {
  const page = await read("../src/pages/countdown/index.astro");
  const docs = await read("../docs/nextchapter-analytics.md");
  assert.ok(page.includes("Visits to NextChapter"));
  assert.ok(page.includes('fetch("/api/countdown/metrics"'));
  assert.ok(docs.includes("not unique visitors or people"));
  assert.ok(docs.includes("No IP address, cookie, user-agent, referrer"));
});
