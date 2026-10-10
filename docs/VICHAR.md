# Vichar — vtrrk.in Integration

## Status

**Core web experience: implemented and production-verified.**

The public Vichar experience is available at `/vichar/` on vtrrk.in. It is a human-controlled AI writing companion: it creates a short draft, the user reviews/edits it, and the user manually posts to X.

The Vichar backend is maintained in the [TweetPilot repository](https://github.com/vtrravikumar/tweetpilot) under its historical repository name and is deployed as a Cloudflare Worker. The public product name is Vichar.

## Current workflow

```text
Choose topic / enter custom topic
    ↓
Optional location and recent-news choice
    ↓
Request short-lived web session
    ↓
Create a thought through the production Vichar API
    ↓
Editable draft + character count + news sources when applicable
    ↓
Review / edit / create another
    ↓
Open X composer
    ↓
User manually publishes
```

Vichar never clicks X's Post button and does not publish automatically.

## Current web capabilities

Implemented in `src/pages/vichar.astro`:

- Vichar branding and English tagline.
- Topic selection and custom topic entry.
- Optional location context.
- Optional recent-news mode.
- Production web-session token acquisition.
- Protected production generation request.
- Randomised writing style.
- 140-character UI limit for the current non-Premium X workflow.
- Editable generated text and character counter.
- Create Another.
- Recent news source links and graceful fallback to normal generation if recent news is unavailable.
- Open the X composer with the edited text for final review.
- User-facing error status.
- Responsive layout.
- Footer version and Cloudflare Pages source commit identifier.

The 140-character value is a current UI configuration, not a permanent product limitation.

## Website authentication and entitlement

The website does **not** ask visitors to enter or store a Vichar license key. The browser requests a short-lived session from the backend and keeps the returned token in memory.

1. The frontend sends `POST https://api.vtrrk.in/vichar/v1/web/session` from the allowed first-party origin `https://vtrrk.in`.
2. The Worker validates the exact `Origin` and uses the server-side `VICHAR_WEB_SECRET` to sign a token with audience `vichar-web` and a 10-minute lifetime.
3. The frontend sends the token as a Bearer token to `POST /v1/tweet/generate`.
4. The Worker verifies the signature, audience, expiry and first-party origin.
5. A valid website session is mapped server-side to the existing owner entitlement. Successful generation is unlimited, omits the free-tier `Vichar by @vtrrk` attribution, and remains subject to the shared owner burst guard.
6. If owner entitlement is not configured, web generation fails closed rather than falling back to free extension usage.

The owner license key remains in Cloudflare Worker secret configuration and is never sent to the browser. The web token is short-lived and is not persisted in localStorage. The backend's secrets are documented in the TweetPilot repository's deployment and web-auth documentation.

This website entitlement is separate from Chrome extension customer licensing. Free and paid extension keys continue to use their server-side credit balance and attribution rules; the website session does not consume extension credits.

## Backend integration

The website calls:

- Session: `https://api.vtrrk.in/vichar/v1/web/session`
- Generation: `https://api.vtrrk.in/vichar/v1/tweet/generate`

The browser receives a short-lived web token, not the OpenAI API key or owner license key. The backend owns provider credentials, entitlement decisions, burst protection and generation policy.

Backend architecture, tests, secrets and deployment configuration remain documented in the [TweetPilot/Vichar repository](https://github.com/vtrravikumar/tweetpilot).

## Branding

The canonical public name is **Vichar — By VTRRK**.

Approved public messaging:

- **From thought to expression.**

The public website and extension use English-first primary branding. The Vichar website also uses the approved Sanskrit brand signature **विचारय। आकारय। स्वकीयं कुरु।** (*Think it. Shape it. Make it yours.*) and explains **विचार (Vicāra)** as meaning thought, reflection, consideration, deliberation, or idea.

The website uses the approved Vichar artwork rather than recreating the logo independently. The current public website lockup is `public/brand/vichar-lockup-320.webp`, derived directly from the approved Vichar brand board.

## Version visibility

The public Vichar footer displays the version derived from the first two segments of the website package version and the short Cloudflare Pages source commit SHA. The build identifier is read from `CF_PAGES_COMMIT_SHA` at build time, so the deployed site can be matched to its source commit. If that environment variable is unavailable, the footer explicitly says the build ID is unavailable rather than inventing one.

When the generation milestone changes, update the displayed Web version and this note in the same change. The short SHA identifies the exact website build independently of the milestone label.

## What is complete

- Product identity and public route.
- Web creator UI, including custom topics and recent-news mode.
- Short-lived web session integration.
- Server-side owner entitlement for website generations.
- Unlimited website generation without exposing or entering a license key.
- Owner burst protection and attribution suppression.
- Human-controlled publication workflow.
- Character-counting/editor experience and X composer handoff.
- Approved Vichar lockup integration.
- Production smoke test: website generation confirmed working after backend deployment.

## Remaining work

### Hardening

- Continue production end-to-end validation and monitor Worker errors and usage.
- Review public web abuse/rate-control separately from extension credit limits if usage grows.
- Improve error recovery and copy fallbacks where useful.
- Consider duplicate-avoidance/history only if it solves a demonstrated problem.

### Branding

- Derive and verify the remaining favicon/store/icon sizes from the same approved artwork.
- Do not redraw or approximate the approved mark.
- Keep primary public-facing branding English-first and globally understandable.

### Repository naming

The website repository `vtrrk.in` should remain named after the website.

The engineering repository retains its historical GitHub name; this is intentionally not exposed as the public product identity.

## Source of truth

- Website implementation: `src/pages/vichar.astro`.
- Website Vichar integration notes: this document.
- Website backlog: `backlog.md`.
- Backend implementation, web authentication, owner entitlement and deployment: [TweetPilot repository](https://github.com/vtrravikumar/tweetpilot).
- Brand standard: `docs/vichar-brand.md` in the engineering repository.
