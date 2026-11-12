export const INDIA_TIME_ZONE = "Asia/Kolkata";
const INDIA_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function getNewYearTarget(year) {
  if (!Number.isInteger(year) || year < 1970 || year > 9999) {
    throw new RangeError("Year must be an integer between 1970 and 9999.");
  }
  return Date.UTC(year, 0, 1) - INDIA_OFFSET_MS;
}

export function getCountdownParts(target, now = Date.now()) {
  const targetMs = target instanceof Date ? target.getTime() : Number(target);
  if (!Number.isFinite(targetMs) || !Number.isFinite(now)) {
    throw new TypeError("Target and current time must be valid timestamps.");
  }
  const remaining = Math.max(0, targetMs - now);
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    totalSeconds,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    complete: targetMs <= now,
  };
}

export function getYearProgress(now = Date.now()) {
  const date = new Date(now);
  if (Number.isNaN(date.getTime())) throw new TypeError("Current time must be valid.");
  const year = Number(new Intl.DateTimeFormat("en", {
    timeZone: INDIA_TIME_ZONE,
    year: "numeric",
  }).format(date));
  const start = getNewYearTarget(year);
  const end = getNewYearTarget(year + 1);
  const elapsed = Math.min(Math.max(now - start, 0), end - start);
  return {
    year,
    percentage: (elapsed / (end - start)) * 100,
    elapsedMs: elapsed,
    totalMs: end - start,
  };
}

export function getDailyMessage(now = new Date()) {
  const messages = [
    "Don't just count the days. Make the days count.",
    "Small steps still move you forward.",
    "Make room for what matters.",
    "The next chapter begins with what you do today.",
    "Progress is built one ordinary day at a time.",
    "Notice how far you've come. Then keep going.",
    "A little curiosity can change an entire day.",
    "You don't need a new year to make a fresh start.",
    "Spend your time on things worth remembering.",
    "Begin where you are. Use what you have.",
    "Make today a day you will be glad you lived.",
    "The best plans leave room for unexpected joy.",
  ];
  const date = now instanceof Date ? now : new Date(now);
  if (Number.isNaN(date.getTime())) throw new TypeError("Date must be valid.");
  const key = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const day = Math.floor(key / 86400000);
  return messages[((day % messages.length) + messages.length) % messages.length];
}

export function normaliseEventTitle(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, 70);
}

export function parseSharedCountdown(search) {
  const params = search instanceof URLSearchParams
    ? search
    : new URLSearchParams(String(search ?? "").replace(/^\?/, ""));
  const title = normaliseEventTitle(params.get("title"));
  const target = params.get("target");
  if (!title || !target) return null;
  const targetMs = Date.parse(target);
  if (!Number.isFinite(targetMs)) return null;
  return { title, target: targetMs, date: new Date(targetMs) };
}

export function createCountdownShareUrl({ title, target, origin, pathname = "/countdown/" }) {
  const safeTitle = normaliseEventTitle(title);
  const targetMs = target instanceof Date ? target.getTime() : Number(target);
  if (!safeTitle || !Number.isFinite(targetMs) || targetMs <= 0) {
    throw new TypeError("A title and valid target date are required.");
  }
  const url = new URL(pathname, origin);
  url.searchParams.set("title", safeTitle);
  url.searchParams.set("target", new Date(targetMs).toISOString());
  return url.toString();
}
