# NextChapter aggregate analytics

NextChapter records a small set of aggregate product events through the Cloudflare Pages Function at `/api/countdown/metrics`.

## Events

- `page_view` — a visit to the countdown page; this powers the discreet public visit total.
- `share_click` — the share action was used.
- `card_download` — a share graphic was generated/downloaded.
- `arrival_view` — a completed countdown displayed its arrival card.

The D1 table stores one row per India-calendar day and event type. The endpoint increments the aggregate atomically, so concurrent visits do not overwrite each other.

## Privacy

No IP address, cookie, user-agent, referrer, event title, personal countdown details, or stable visitor identifier is stored. These are aggregate event totals, not unique-person counts. The public endpoint exposes only the total page-view count; the other aggregates remain in D1.

## Deployment prerequisite

The endpoint reuses the existing Cloudflare Pages D1 binding named `TRAVELOGUE_DB`, but writes only to the separate `nextchapter_metrics` table.

Before deploying the code:

1. Open the existing `vtrrk-travelogue` D1 database in Cloudflare.
2. Open its SQL console and run the contents of [nextchapter-analytics.sql](./nextchapter-analytics.sql).
3. Confirm that the `nextchapter_metrics` table exists.
4. Merge the feature branch after the repository Quality Gate passes.

No new database, Worker, secret, or browser storage identifier is required. If the D1 migration has not been applied, the metrics endpoint will return an error; the countdown itself remains usable and hides the public counter.

## Interpretation

The visible number is labelled **Visits to NextChapter**. It counts page loads, not unique visitors or people. Repeated visits and automated requests can contribute to the total. The endpoint accepts only the four allowlisted event names and rejects cross-origin POSTs.
