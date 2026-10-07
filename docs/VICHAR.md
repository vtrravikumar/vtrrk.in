# Vichar — vtrrk.in Integration

## Status

**Core web experience: implemented.**

The public Vichar experience is available at `/vichar/` on vtrrk.in. It is a human-controlled AI writing companion: it creates a short draft, the user reviews/edits it, and the user manually posts to X.

The Vichar backend is maintained separately in the `the Vichar backend repository` repository and is deployed as a Cloudflare Worker. The GitHub repository retains its historical name; the public product name is Vichar.

## Current workflow

```text
Choose topic
    ↓
Optional location context
    ↓
Create a thought
    ↓
Production Vichar backend
    ↓
Editable draft + character count
    ↓
Copy
    ↓
User manually posts through X
```

Vichar never clicks X's Post button and does not publish automatically.

## Current web capabilities

Implemented in `src/pages/vichar.astro`:

- Vichar branding and English tagline.
- Topic selection:
  - Technology & AI
  - Photography
  - Royal Enfield & Riding
  - Travel & Exploration
  - Life & Observations
  - Surprise me
- Optional location context.
- Production web-session token acquisition.
- Protected production generation request.
- Thoughtful writing style.
- 140-character UI limit for the current non-Premium X workflow.
- Editable generated text.
- Character counter.
- Create Another.
- Send the edited text to the X composer for final review.
- User-facing error status.
- Responsive layout.

The 140-character value is a current UI configuration, not a permanent product limitation.

## Backend integration

The website calls:

- Session: `https://tweetpilot-api.vtrravikumar.workers.dev/v1/web/session`
- Generation: `https://tweetpilot-api.vtrravikumar.workers.dev/v1/tweet/generate`

The browser receives a short-lived web token, not the OpenAI API key. The backend owns provider credentials and generation policy.

Backend architecture, tests, deployment configuration and abuse-protection decisions remain documented in the TweetPilot/Vichar repository.

## Branding

The canonical public name is **Vichar — By VTRRK**.

Approved public messaging:

- **From thought to expression.**

The public website and extension use English-first primary branding. The Vichar website also uses the approved Sanskrit brand signature **विचारय। आकारय। स्वकीयं कुरु।** (*Think it. Shape it. Make it yours.*) and explains **विचार (Vicāra)** as meaning thought, reflection, consideration, deliberation, or idea.

The website uses the approved Vichar artwork rather than recreating the logo independently. The current public website lockup is `public/brand/vichar-lockup-320.webp`, derived directly from the approved Vichar brand board.

## What is complete

- Product identity and public route.
- Web creator UI.
- Backend session/generation integration.
- Human-controlled publication workflow.
- Character-counting/editor experience.
- Copy workflow.
- Responsive presentation.
- Approved Vichar lockup integration.
- Documentation and backlog entry.

## Remaining work

### Immediate verification

- Verify the latest production deployment after the branding fix.
- Smoke-test generation, token acquisition, editing, character count, Copy and Create Another.
- Check desktop and mobile presentation.

### Hardening

- Add durable rate limiting / abuse protection before broad public exposure.
- Improve error recovery and copy fallbacks where useful.
- Consider duplicate-avoidance/history only if it solves a demonstrated problem.
- Continue production end-to-end validation.

### Branding

- Derive and verify the remaining favicon/store/icon sizes from the same approved artwork.
- Do not redraw or approximate the approved mark.
- Keep primary public-facing branding English-first and globally understandable.

### Repository naming

The website repository `vtrrk.in` should remain named after the website.

The engineering repository retains its historical GitHub name; this is intentionally not exposed as the public product identity.

## Source of truth

- Website implementation: this repository, `src/pages/vichar.astro`.
- Website Vichar integration notes: this document.
- Website backlog: `backlog.md`.
- Product/backend implementation: `the Vichar backend repository`.
- Brand standard: the Vichar branding documentation in the engineering repository.
