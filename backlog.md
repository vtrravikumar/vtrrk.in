# vtrrk.in — Backlog

This is the authoritative execution backlog for vtrrk.in.

The backlog describes work required to move from the current implementation toward the intended product specification. It should be updated as work is completed or priorities change.

## Status Legend

- **Planned** — defined but not started.
- **In Progress** — actively being worked on.
- **Blocked** — cannot proceed until a dependency is resolved.
- **Done** — completed and verified.
- **Parked** — intentionally deferred.

## Priority

- **P0** — Foundation / essential for V1.
- **P1** — Important V1 experience.
- **P2** — V1 polish / valuable enhancement.
- **P3** — Future enhancement.
- **P4** — Ideas / not currently committed.

---

# Phase 0 — Documentation & Product Definition

## DOC-001 — Establish product specification
- Priority: P0
- Status: Done
- Area: Documentation

## DOC-002 — Establish functional requirements
- Priority: P0
- Status: Done
- Area: Documentation

## DOC-003 — Establish architecture
- Priority: P0
- Status: Done
- Area: Documentation

## DOC-004 — Establish feature catalogue
- Priority: P0
- Status: Done
- Area: Documentation

## DOC-005 — Establish authoritative backlog
- Priority: P0
- Status: Done
- Area: Documentation

## DOC-006 — Consolidate agreed product decisions
- Priority: P0
- Status: Done
- Area: Documentation

Capture the decisions made during product review, including person-first positioning, concise Books/Projects, Writing as the prose area, lightweight Photography, and the detailed Travel model.

---

# Phase 1 — Foundation Audit & Information Architecture

## IA-001 — Define final site map
- Priority: P0
- Status: Done
- Area: Information Architecture

Agreed primary destinations:

- Home
- About
- Now
- Books
- Writing
- Projects
- Travel
- Photography

Secondary destinations:

- Contact
- Elsewhere

Rides are intentionally not a primary navigation item.

## IA-002 — Define content models
- Priority: P0
- Status: Done
- Area: Content Architecture

Agreed direction:

- Books: concise reusable presentation.
- Writing: Markdown-oriented long-form content.
- Projects: concise purpose/status/link model.
- Photography: external gateway in V1.
- Travel: Continent → Country → Trips/Places/Stories with reusable trip metadata.
- India: one country containing individual journeys rather than state-based travel pages.
- Now: independently maintainable current content.

## IA-003 — Decide Markdown/content collections strategy
- Priority: P0
- Status: Done
- Area: Technical Architecture

Decision:

- Use Astro content collections for durable, narrative content and structured travel records, especially Travel and future Writing articles.
- Keep small, curated site-wide presentation data in TypeScript modules where a content collection would add unnecessary complexity, including Books and Now.
- Use the Projects content collection because each project has a durable narrative detail page; derive both the index and detail pages from the same Markdown entries.
- Keep the public site presentation simpler than the underlying travel metadata.
- Do not introduce a CMS or database for ordinary V1 publishing.
- The Travelogue redemption feature is a deliberate, narrow D1-backed exception for one-time download-code redemption.

## IA-004 — Map current implementation to intended specification
- Priority: P0
- Status: Done
- Area: Audit

Current-state audit completed on 10 September 2026. The core site shell, navigation, Now, Books, Projects, Photography gateway and Travel architecture are implemented to varying degrees. Writing, project detail pages, SEO, automated build verification, accessibility/performance verification and some editorial/content work remain incomplete. The backlog has been reconciled to reflect the actual implementation state.

---

# Phase 2 — Core Site Experience

## WEB-001 — Finalise homepage
- Priority: P0
- Status: Done
- Area: Homepage

Homepage finalised as a curated, lightweight doorway rather than a catalogue. The hero is compact, and Now, Books, Writing, Projects, Travel and Photography are presented as expandable sections using native details/summary elements. Detailed content remains on dedicated pages, keeping the initial homepage experience concise and avoiding a photo-album or infinite-scroll feel.

## WEB-002 — Build About page
- Priority: P1
- Status: Done
- Area: About

Basic About page is implemented; final editorial refinement may still be folded into the final site review.

## WEB-003 — Build Now page/section
- Priority: P0
- Status: Done
- Area: Now

## WEB-004 — Finalise global navigation
- Priority: P0
- Status: Done
- Area: Navigation

## WEB-005 — Finalise footer / Elsewhere / Contact
- Priority: P1
- Status: Done
- Area: Global UX

Footer, Elsewhere and Contact are implemented and verified. Footer content is aligned to the site's main 1000px visual grid; the secondary destinations remain deliberately simple and separate from the primary navigation.


## UX-002 — Audit site-wide typography scale and consistency
- Priority: P2
- Status: Planned
- Area: Visual consistency / Accessibility

Audit font sizes across the main site and key pages, including Vichar, Books, Writing, Travel and Photography. Inventory heading levels, body text, captions, labels, navigation, buttons and responsive overrides; identify duplicate or conflicting values and outliers. Propose a small, coherent type scale and apply only evidence-based fixes after review. Preserve intentional display typography and verify mobile layouts, readability and zoom/reflow after changes.

## UX-001 — Add explicit Home link to interior-page navigation
- Priority: P2
- Status: Done
- Area: Navigation / UX

Added a clearly labelled Home link as the first navigation item on all pages except the homepage. The homepage navigation remains unchanged, and the existing clickable VTRRK brand link is preserved. The change was committed directly to GitHub in `13d243b` on 9 October 2026 and Ravi confirmed the live behaviour is working as intended.

---

# Phase 3 — Books & Writing

## BOOK-001 — Finalise books landing experience
- Priority: P0
- Status: Done
- Area: Books

Present the three published books accurately and concisely. Travelogue is currently presented as a fourth, free digital edition and needs final content-model/positioning reconciliation.

## BOOK-002 — Create individual book pages
- Priority: P1
- Status: Done
- Area: Books

Reusable individual book route is implemented and the stale `book.href` reference has been corrected to the current `book.access.url` model. The route is used by the homepage and Books landing for individual book destinations.

## BOOK-003 — Add book metadata and related content
- Priority: P2
- Status: Done
- Area: Books

The reusable book model now distinguishes published books from the free digital Travelogue edition and supports optional related-content links. The Books landing and individual book pages expose the edition status and render related links only where defined, keeping the presentation concise and avoiding unsupported publication facts.

## WRITE-001 — Establish writing content model
- Priority: P0
- Status: Done
- Area: Writing

The existing Astro content-collection schema establishes the durable Writing model with title, description, optional date, type, tags and optional hero image. The current curated `writing.ts` presentation data remains separate until article content is migrated; that migration belongs to WRITE-004 rather than this foundation item.

## WRITE-002 — Build writing index
- Priority: P0
- Status: Done
- Area: Writing

A curated Writing landing page exists; article destinations still need to be implemented.

## WRITE-003 — Build individual article pages
- Priority: P0
- Status: Done
- Area: Writing

A reusable `[...slug]` Astro route now renders individual Markdown entries from the Writing content collection. It supports the existing Writing schema metadata (type, date, tags and optional hero image), renders the Markdown body, and provides a link back to the Writing index. Current curated `writing.ts` entries are intentionally not migrated or linked until WRITE-004.

## WRITE-004 — Migrate/curate existing writing entries
- Priority: P1
- Status: Done
- Area: Writing

Three genuine standalone essays were curated from the HomeLab-Engineering source repository and added as Markdown content: “The Repository Is the Laboratory”, “Recovery Is an Engineering Skill”, and “When the Engineer Leaves the Room”. The Writing index now links each curated entry to its individual article page. Placeholder writing entries were replaced rather than inventing new material.

---

# Phase 4 — Projects

## PROJ-001 — Build projects landing page
- Priority: P0
- Status: Done
- Area: Projects

Create a curated project index.

## PROJ-002 — Create project detail model/pages
- Priority: P1
- Status: Done
- Area: Projects

The Projects Markdown collection is the single source for the index and detail pages. The schema supports title, description, purpose, status, links and optional hero image; the Markdown body carries the project narrative. The duplicate TypeScript model and competing detail route have been removed. Production build verified: all three project detail pages are generated successfully.

## PROJ-003 — Connect current projects
- Priority: P1
- Status: Done
- Area: Projects

The three projects have dedicated Markdown-backed detail pages. Added public destination links where appropriate: HomeLab Engineering links to its book page, and VTR Press links to its public repository. Ride Together remains self-contained until a public project destination is available.

---

# Phase 5 — Photography

## PHOTO-001 — Define photography information architecture
- Priority: P1
- Status: Done
- Area: Photography

The photography experience is a locally published portfolio organised by category, with country/place and model sub-portfolios where applicable. External platforms such as 500px and Instagram are optional outbound destinations, not the primary photography experience.

## PHOTO-002 — Build photography landing experience
- Priority: P1
- Status: Done
- Area: Photography

The photography portfolio is implemented using a local published catalog and optimised image derivatives. Category and portfolio pages provide curated discovery, with paginated galleries where applicable. The site does not rely on a third-party photo feed or embed to render its core experience.

## PHOTO-003 — Define selective image/embedding strategy
- Priority: P2
- Status: Done
- Area: Photography

Verified against the current implementation. The vtrrk_photography publishing workflow reads originals from the NAS and publishes locally served, web-optimised derivatives and public/photography/catalog.json. Pages use local image paths and catalog data; external platforms are optional outbound links rather than rendering dependencies. The publishing workflow supports AVIF with WebP fallback, creates thumbnails, and preserves the existing published output if processing fails.

## PHOTO-004 — Evaluate future dedicated photography site
- Priority: P3
- Status: Parked
- Area: Photography

Revisit only if the photographic archive warrants a dedicated site/gallery.

---

# Phase 6 — Travel / Travelogue

## TRAVEL-001 — Define travelogue information architecture
- Priority: P0
- Status: Done
- Area: Travel

Agreed direction:

- Travel is a first-class primary destination.
- Geography is deliberately organised as Continent → Country.
- India is one country containing individual journeys; states are not used as the primary travel index.
- International countries may contain one or multiple trips/stories.
- Rides are a related dimension of Travel.
- Travel is intentionally detailed rather than concise.

## TRAVEL-002 — Define travel trip metadata schema
- Priority: P0
- Status: Done
- Area: Travel

A reusable structured metadata model is established for both Indian journeys and international travel. The model supports country, continent, places, dates, context, travel companions, journey/travel type, flights, routes, airline, optional flight number/seat, accommodation, transport, rides, photography references, story references, publication status and featured status where appropriate.

## TRAVEL-003 — Define common travel page template
- Priority: P0
- Status: Done
- Area: Travel

One common travel-detail rendering mechanism is established for India and international travel. URL depth may vary, but India and international content do not use separate page implementations.

## TRAVEL-004 — Define travel editorial interview workflow
- Priority: P0
- Status: Done
- Area: Travel

Document the interview-first process: use available records and Ravi's memories to ask pointed, adaptive questions before drafting each travel story.

## TRAVEL-005 — Build travelogue index
- Priority: P1
- Status: Done
- Area: Travel

Create a visually engaging overview organised by continent and country, including India as a country with individual journeys beneath it.

## TRAVEL-006 — Build individual country/trip pages
- Priority: P1
- Status: Done
- Area: Travel

Implement the common template and reusable metadata model through the unified travel detail mechanism. The system currently supports international country stories and Indian journeys.

## TRAVEL-007 — Curate initial travel destinations
- Priority: P1
- Status: Parked
- Area: Travel

Use the supplied country/status record as the initial planning data and continue adding destinations and Indian journeys through the established common travel model.

## TRAVEL-008 — Import/reconcile travel records
- Priority: P1
- Status: Parked
- Area: Travel

Review Ravi's available flight/travel records and identify useful factual metadata for the initial destinations. Preserve richer source data separately from public presentation where appropriate.

## TRAVEL-009 — Support related rides/routes
- Priority: P2
- Status: Planned
- Area: Travel

Connect motorcycle journeys to Travel without assuming all travel is riding travel.

## TRAVEL-010 — Explore map-based discovery
- Priority: P3
- Status: Parked
- Area: Travel

Consider an interactive map after the narrative travelogue is established.

---

# Phase 7 — Quality, SEO & Performance

## QA-001 — Responsive audit
- Priority: P1
- Status: Done

Reviewed on iPhone, iPad and desktop. Ravi confirmed the site is responsive and displays as expected across these device classes.
- Area: Quality

## QA-002 — Accessibility audit
- Priority: P1
- Status: In Progress
- Area: Quality

Accessibility improvements implemented and pushed in commit `796780b` on 9 October 2026. The patch was adapted from a different repository revision; header and Vichar-specific changes from the original patch were excluded. The current production build succeeds with 476 pages, and `git diff --check` reported no whitespace errors. These checks do not establish WCAG conformance.

Implemented:
- Added a "Skip to main content" link in `BaseLayout.astro`.
- Added `id="main-content"` and `tabindex="-1"` to page main elements so the skip link has a destination.
- Added reduced-motion CSS support and an `.sr-only` utility.
- Adjusted light-theme muted and accent colour tokens.
- Travelogue redeem form: associated the invalid-code error with the input using `aria-invalid` and `aria-describedby`; strengthened the input focus indicator.
- Photography: improved gallery thumbnail link labels, added visually hidden headings to photo pages, and introduced metadata-derived photo labels in `src/content/photo-label.ts`.
- Updated applicable page-level accessibility markup from the patch.

Not included or not independently verified:
- Header accessibility changes and Vichar-specific form/dark-mode changes were excluded from this patch and were not independently verified as part of this accessibility work.
- Claude's reported axe-core scan, keyboard audit and static scan of 476 pages have not been independently verified against this checkout.

Remaining work:
- Improve photo captions and alt text where metadata is insufficient; remove stray separators when place/country metadata is missing.
- Review creative-accent hover contrast and form-field border contrast.
- Check travel tag-cloud target size and overlap.
- Visually check white text over photography cards.
- Manually test keyboard navigation, VoiceOver/NVDA, 200%/400% zoom and reflow, forced-colours mode, and third-party Instagram embeds.
- Consider adding `astro check` and automated accessibility checks to CI.

Keep QA-002 In Progress until the remaining applicable fixes and manual checks are completed and documented.

## SEO-001 — Complete metadata system
- Priority: P1
- Status: Done
- Area: SEO

Centralised page metadata now derives canonical URLs from the current page, uses the canonical URL for Open Graph, and provides Open Graph plus X/Twitter card metadata. A dedicated site-wide social preview image is committed at `public/images/social-preview.jpg`. Production build verified locally: Astro generated 472 pages successfully in 4.56 seconds, and the working tree is clean.

## SEO-002 — Add sitemap / robots foundations
- Priority: P1
- Status: Done
- Area: SEO

Configured the official Astro sitemap integration and added sitemap discovery metadata plus `public/robots.txt` pointing to the sitemap index. Verified locally: production build generated 472 pages, `dist/sitemap-index.xml`, `dist/sitemap-0.xml`, and `dist/robots.txt`. The sitemap dependency and lockfile are committed; working tree is clean.

## PERF-001 — Image optimisation
- Priority: P1
- Status: Planned
- Area: Performance

Optimise locally served imagery without turning the site into a photo-hosting platform.

## PERF-002 — Minimise client-side JavaScript
- Priority: P1
- Status: In Progress
- Area: Performance

The site is predominantly static and uses only small amounts of client-side JavaScript, but a final audit is still required.

## QA-003 — Production build verification
- Priority: P0
- Status: Done

Production build verified locally from `~/LocalRepos/vtrrk.in`: Astro completed successfully, generating 472 pages in 5.11 seconds. `git status --short` was clean after the build.
- Area: Quality

---

# Phase 8 — Future Enhancements

## FUT-001 — RSS / Atom feed
- Priority: P3
- Status: Parked

## FUT-002 — Site search
- Priority: P3
- Status: Parked

## FUT-003 — Advanced travel discovery
- Priority: P3
- Status: Parked

Potential filters, map views, trip chronology and thematic discovery.

## FUT-004 — Privacy-conscious analytics
- Priority: P3
- Status: Parked

Only revisit if there is a clear publishing/distribution strategy.

## FUT-005 — CMS evaluation
- Priority: P4
- Status: Parked

Only revisit if repository-based publishing becomes a genuine burden.

## FUT-006 — Newsletter
- Priority: P4
- Status: Parked

Only revisit if there is a clear publishing/distribution strategy.

---

# Backlog Rules

1. Do not start significant coding without a corresponding backlog item.
2. Keep one backlog item focused on one meaningful outcome.
3. Update status when work begins or completes.
4. Record architectural decisions in documentation rather than burying them in implementation details.
5. Do not add features merely because they are technically interesting.
6. When the intended product changes, update the specification first and then update the backlog.
7. The backlog describes planned work; completed implementation should not be mistaken for completed product intent.
8. Keep public presentation simpler than the underlying data where richer source records are useful.
9. Avoid further architectural changes unless a demonstrated requirement shows that the current foundation cannot support the feature.


# Phase 9 — Vichar Integration

Vichar is the personal AI writing companion exposed at /vichar/. It is backed by the separately maintained the Vichar backend repository repository and its production Cloudflare Worker. The public product name is **Vichar — By VTRRK**.

## VICHAR-001 — Establish Vichar web product integration
- Priority: P0
- Status: Done
- Area: Vichar

The vtrrk.in site now provides a dedicated Vichar web creator with topic selection, optional location context, AI generation, editable output, character counting, Create Another and an action that opens the edited text in the X composer.

## VICHAR-002 — Enforce human-controlled publishing workflow
- Priority: P0
- Status: Done
- Area: Vichar

Vichar generates a draft only. The user reviews/edits it and manually publishes through X. Vichar does not post to X on the user's behalf.

## VICHAR-003 — Integrate production Vichar backend
- Priority: P0
- Status: Done
- Area: Vichar

The web client uses the production Cloudflare Worker session endpoint followed by the protected tweet-generation endpoint. The browser does not receive the OpenAI credential.

## VICHAR-004 — Apply canonical Vichar branding
- Priority: P0
- Status: Done
- Area: Vichar

The web page uses the approved Vichar artwork and documented naming/palette. The public header uses the approved Vichar lockup, with the English tagline From thought to expression and the Sanskrit brand signature where appropriate.

## VICHAR-005 — Verify production Vichar end to end
- Priority: P0
- Status: Done
- Area: Vichar

Ravi confirmed production end-to-end verification: generation, editing, character count, Copy, X composer behaviour, mobile/desktop layout and deployed web build identifier. The latest /vichar/ experience is accepted; no further changes are needed without a specific issue.

## VICHAR-006 — Add durable public-use protection
- Priority: P1
- Status: Done
- Area: Vichar / Backend

Durable public-use protection is implemented and deployed using a Cloudflare Durable Object with SQLite-backed usage counters. Production defaults are 10 generations per UTC day and 3 per minute. Extension installations use opaque installation keys; anonymous web users use a pseudonymous HMAC-derived client-IP identifier. Web usage fails closed when the required identity signal or secret is unavailable.

## VICHAR-007 — Complete canonical brand asset set
- Priority: P2
- Status: Planned
- Area: Vichar / Branding

Derive and verify the remaining website/favicon/store asset sizes from the same approved artwork rather than creating independent variants. Keep primary public-facing branding English-first, while using the Sanskrit brand signature in suitable Vichar surfaces.

## VICHAR-008 — Assess repository rename
- Priority: P3
- Status: Done
- Area: Repository / Maintenance

Decision: do not rename the repository. Keep `the Vichar backend repository` as the engineering/backend repository while the public product remains **Vichar — By VTRRK**. This avoids unnecessary production and deployment churn.

## VICHAR-009 — Improve Vichar product hardening
- Priority: P2
- Status: Done
- Area: Vichar

Core V1 hardening is complete: attribution is server-enforced and counted within `maxLength`, request bodies are capped, durable extension/web usage limits are active, usage identifiers are isolated, and regression coverage protects the controls. Production deployment and smoke testing confirmed the final attribution appears exactly once. Future UX refinements remain separate enhancements.

## VICHAR-010 — Add current-information / web-search generation
- Priority: P3
- Status: Parked
- Area: Vichar / Backend

Allow Vichar to recognise requests that depend on current information and, when appropriate, use web search before generating the thought. Examples include latest news, local news, current trends, today's events and location-aware developments. The experience should distinguish current-information generation from ordinary creative generation rather than requiring users to formulate search instructions manually.

Initial direction:
- Use the user's topic and optional location to determine when current information is needed.
- Perform web search server-side; never expose search/API credentials in the extension.
- Preserve the existing human-controlled generate → review/edit → use/post workflow.
- Consider a small free allowance for current-information searches and a larger allowance as a future paid/freemium entitlement, but defer pricing and entitlement design until the core Vichar V1 is stable.
- Do not implement this feature as part of the current V1 path; revisit after planned extension, backend hardening and production validation work is complete.
\n

## VICHAR-011 — Add Vichar attribution to generated drafts
- Priority: P1
- Status: Done
- Area: Vichar / Product / Marketing

Every generated Vichar draft ends with the exact final line **Vichar by @vtrrk**. The attribution is enforced server-side and counts within the requested character limit, so it cannot be accidentally omitted from generated drafts. The user remains free to edit or remove it before manually posting to X.
\n

---

# Repository Ownership & Cross-Repository Dependencies

## Ownership rule

This repository owns the **vtrrk.in website**, including the Vichar web experience at `/vichar/`. Website layout, accessibility, performance, SEO, content, browser-side UX, and website-specific integration/testing belong here.

The Vichar backend and Chrome extension are owned by the separate repository: [`vtrravikumar/tweetpilot`](https://github.com/vtrravikumar/tweetpilot).

## Cross-repository rules

1. Keep website implementation tasks in this backlog; keep backend/API and extension implementation tasks in the TweetPilot backlog.
2. If a website requirement needs a backend/API change, record the website outcome here and create or reference the implementation item in TweetPilot. Do not duplicate backend implementation work here.
3. Every shared backend item must declare its consumers explicitly: `Website`, `Chrome extension`, or `Both`. If only one consumer is affected, do not imply the other is included.
4. Cross-references must include the other repository, its backlog item ID/title, and a link when an item exists. If the implementation item has not yet been created, say so rather than inventing an ID.
5. Track each side independently: a backend item being Done does not complete the website integration or verification item, and a website UI change does not complete a backend dependency.
6. Keep website and extension releases independently verifiable. Validate all declared consumers when a shared API contract or behaviour changes.

## VICHAR-WEB-001 — Track Vichar web dependencies on shared backend capabilities

- Priority: P2, when a concrete dependency is identified
- Status: Planned
- Area: Vichar web / Cross-repository coordination
- Implementation owner: `vtrravikumar/tweetpilot` for backend/API changes; this repository for website integration.

Use this item as a coordination placeholder, not as permission to build speculative features. When a specific Vichar web requirement needs a backend change, create a distinct implementation item in the TweetPilot backlog, label its consumer `Website` (or `Both` if the extension is also affected), and link both items. No new backend feature is implied by this placeholder.


## VICHAR-WEB-002 — Integrate Vichar V4.0 News mode in the website

- Priority: P2
- Status: Done
- Area: Vichar web / Product integration
- Backend dependency: [`vtrravikumar/tweetpilot` — VICHAR-010B, Backend News mode](https://github.com/vtrravikumar/tweetpilot/blob/main/backlog.md)
- Related backend client contract: VICHAR-010C (website integration is tracked here; backend implementation is owned by TweetPilot).

Add an explicit News mode to the Vichar web creator, separate from the existing writing-style selector. The backend's initial recency window is 48 hours: stories older than this or without a valid publication timestamp do not qualify. The topic and optional location may refer to anywhere in the world; do not imply India-only coverage. When recent news is found, display the returned headline, publisher, article link and publication time alongside the editable draft. If no qualifying news is found, display: “No recent news found for this topic. We've generated a normal Vichar instead.” If retrieval fails, display a distinct message that news retrieval was unavailable. Never present a fallback draft as news-grounded.

When News mode is off, preserve current generation behaviour and randomised writing styles. The website remains a human-controlled drafting experience; publishing stays manual.

**Contract:** `useNews: true|false` is independent of `style`. Backend response metadata and error semantics must be agreed/available before website integration is implemented. Test website behaviour independently from backend and extension completion.


## VICHAR-WEB-003 — Align Vichar surfaces with the site theme

- Priority: P1
- Status: Done
- Area: Vichar web / Accessibility and visual quality

The Vichar creator card, form controls, feature tiles and trust strip now use the site's shared theme-aware surface tokens rather than fixed light backgrounds. Dark-mode refinements cover remaining decorative surfaces and status/error colours. Both Vichar pages have valid `#main-content` targets for the shared skip link. The change was merged in PR [#10](https://github.com/vtrravikumar/vtrrk.in/pull/10) on 2026-10-09. Ravi manually checked production in both light and dark modes and confirmed the page looks better in both. This item records Vichar-specific verification only; the broader site accessibility audit QA-002 remains In Progress until its other listed checks are complete.
