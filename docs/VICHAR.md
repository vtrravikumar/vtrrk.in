# Vichar — vtrrk.in Integration

## Status

**Core web experience: implemented.**

The public Vichar experience is available at `/vichar/` on vtrrk.in. It is a human-controlled AI writing companion: it creates a short draft, the user reviews/edits it, and the user manually posts to X.

The Vichar backend is maintained separately in the `vtrravikumar/tweetpilot` repository and is deployed as a Cloudflare Worker. The product name is Vichar even though historical infrastructure names still use TweetPilot.

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

- Vichar branding and tagline.
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
- Copy to clipboard.
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

Approved messaging:

- `विचारं लभताम्`
- `विचारात् वाक्यं भवति`
- **From thought to expression.**

The website must consume the approved Vichar artwork rather than recreating a logo independently. The current canonical website artwork asset is `public/brand/vichar-icon-128.png`, copied from the approved Vichar artwork source.

## What is complete

- Product identity and public route.
- Web creator UI.
- Backend session/generation integration.
- Human-controlled publication workflow.
- Character-counting/editor experience.
- Copy workflow.
- Responsive presentation.
- Canonical Vichar artwork integration.
- Documentation and backlog entry.

## Remaining work

### Immediate verification

- Verify the latest production deployment after the canonical artwork fix.
- Smoke-test generation, token acquisition, editing, Copy and Create Another.
- Check desktop and mobile presentation.

### Hardening

- Add durable rate limiting / abuse protection before broad public exposure.
- Improve error recovery and copy fallbacks where useful.
- Consider duplicate-avoidance/history only if it solves a demonstrated problem.
- Continue production end-to-end validation.

### Branding

- Derive remaining favicon/store/icon sizes from the approved artwork.
- Do not redraw or approximate the approved mark.

### Repository naming

The website repository `vtrrk.in` should remain named after the website.

The separate backend/product repository is currently `tweetpilot`. Renaming it to `vichar` is desirable for product consistency but optional. It should only be done after checking GitHub redirects, local remotes, Cloudflare Worker/deployment references, documentation links, extension references and any external automation.

## Source of truth

- Website implementation: this repository, `src/pages/vichar.astro`.
- Website Vichar integration notes: this document.
- Website backlog: `backlog.md`.
- Product/backend implementation: `vtrravikumar/tweetpilot`.
- Brand standard: `tweetpilot/docs/vichar-brand.md`.

## Backlog

The Vichar-specific website work is tracked under `VICHAR-*` items in `backlog.md`.
