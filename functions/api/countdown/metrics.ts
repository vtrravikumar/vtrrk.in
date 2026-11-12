interface Env {
  // Reuse the site's existing D1 binding; metrics live in a dedicated table.
  TRAVELOGUE_DB: D1Database;
}

const ALLOWED_EVENTS = new Set([
  "page_view",
  "share_click",
  "card_download",
  "arrival_view",
]);

function json(data: Record<string, number>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const result = await env.TRAVELOGUE_DB
    .prepare(
      `SELECT COALESCE(SUM(event_count), 0) AS visits
       FROM nextchapter_metrics
       WHERE event = 'page_view'`,
    )
    .first<{ visits: number }>();

  return json({ visits: Number(result?.visits ?? 0) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return new Response(null, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 256) return new Response(null, { status: 413 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const event = (payload as { event?: unknown } | null)?.event;
  if (typeof event !== "string" || !ALLOWED_EVENTS.has(event)) {
    return new Response(null, { status: 400 });
  }

  // Store only daily aggregate counts. No IP addresses, cookies, user agents,
  // referrers, event titles, or stable visitor identifiers are collected.
  await env.TRAVELOGUE_DB
    .prepare(
      `INSERT INTO nextchapter_metrics (metric_date, event, event_count)
       VALUES (date('now', '+5 hours', '+30 minutes'), ?, 1)
       ON CONFLICT(metric_date, event)
       DO UPDATE SET
         event_count = event_count + 1,
         updated_at = CURRENT_TIMESTAMP`,
    )
    .bind(event)
    .run();

  return new Response(null, {
    status: 204,
    headers: { "cache-control": "no-store" },
  });
};
