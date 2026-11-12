import test from "node:test";
import assert from "node:assert/strict";
import {
  createCountdownShareUrl,
  getCountdownParts,
  getDailyMessage,
  getNewYearTarget,
  getYearProgress,
  normaliseEventTitle,
  parseSharedCountdown,
} from "../src/utils/countdown-core.mjs";

test("New Year target is midnight in India Standard Time", () => {
  assert.equal(new Date(getNewYearTarget(2027)).toISOString(), "2026-12-31T18:30:00.000Z");
});

test("countdown splits remaining time into calendar units", () => {
  const target = Date.UTC(2026, 0, 2, 1, 1, 1);
  const now = Date.UTC(2026, 0, 1, 0, 0, 0);
  assert.deepEqual(getCountdownParts(target, now), {
    totalSeconds: 90061,
    days: 1,
    hours: 1,
    minutes: 1,
    seconds: 1,
    complete: false,
  });
});

test("completed countdowns never show negative values", () => {
  assert.deepEqual(getCountdownParts(1000, 2000), {
    totalSeconds: 0, days: 0, hours: 0, minutes: 0, seconds: 0, complete: true,
  });
});

test("year progress is bounded and uses the India calendar year", () => {
  const start = getNewYearTarget(2026);
  const progress = getYearProgress(start + 1000);
  assert.equal(progress.year, 2026);
  assert.ok(progress.percentage > 0 && progress.percentage < 1);
  assert.equal(getYearProgress(getNewYearTarget(2027)).year, 2027);
});

test("daily message is stable for a given UTC day", () => {
  assert.equal(getDailyMessage(new Date("2026-11-12T01:00:00Z")), getDailyMessage(new Date("2026-11-12T22:00:00Z")));
  assert.notEqual(getDailyMessage(new Date("2026-11-12T00:00:00Z")), getDailyMessage(new Date("2026-11-13T00:00:00Z")));
});

test("event titles are trimmed, collapsed and length-limited", () => {
  assert.equal(normaliseEventTitle("  Summer   holiday  "), "Summer holiday");
  assert.equal(normaliseEventTitle("x".repeat(90)).length, 70);
});

test("shared countdown URLs round-trip safely", () => {
  const url = createCountdownShareUrl({
    title: "Our anniversary",
    target: Date.UTC(2027, 3, 10, 12),
    origin: "https://vtrrk.in",
  });
  const parsed = parseSharedCountdown(new URL(url).search);
  assert.equal(parsed.title, "Our anniversary");
  assert.equal(parsed.target, Date.UTC(2027, 3, 10, 12));
});

test("invalid shared countdowns are ignored", () => {
  assert.equal(parseSharedCountdown("?title=MissingDate"), null);
  assert.equal(parseSharedCountdown("?title=Bad&target=not-a-date"), null);
});

test("invalid years and timestamps are rejected", () => {
  assert.throws(() => getNewYearTarget(1800), RangeError);
  assert.throws(() => getCountdownParts("not-a-date"), TypeError);
});
