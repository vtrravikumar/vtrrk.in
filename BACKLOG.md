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
- Keep small, curated site-wide presentation data in TypeScript modules where a content collection would add unnecessary complexity, including Books, Projects and Now.
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

---

# Phase 3 — Books & Writing

## BOOK-001 — Finalise books landing experience
- Priority: P0
- Status: Done
- Area: Books

Present the three published books accurately and concisely. Travelogue is currently presented as a fourth, free digital edition and needs final content-model/positioning reconciliation.

## BOOK-002 — Create individual book pages
- Priority: P1
- Status: In Progress
- Area: Books

Reusable individual book route exists, but the current implementation contains a stale `book.href` reference that must be corrected to the current `book.access.url` model.

## BOOK-003 — Add book metadata and related content
- Priority: P2
- Status: Planned
- Area: Books

## WRITE-001 — Establish writing content model
- Priority: P0
- Status: Planned
- Area: Writing

Create the durable model for long-form articles, preferably using Markdown/content collections.

## WRITE-002 — Build writing index
- Priority: P0
- Status: Done
- Area: Writing

A curated Writing landing page exists; article destinations still need to be implemented.

## WRITE-003 — Build individual article pages
- Priority: P0
- Status: Planned
- Area: Writing

## WRITE-004 — Migrate/curate existing writing entries
- Priority: P1
- Status: Planned
- Area: Writing

Replace placeholder links with real destinations or intentionally remove entries until their content exists.

---

# Phase 4 — Projects

## PROJ-001 — Build projects landing page
- Priority: P0
- Status: Done
- Area: Projects

Create a curated project index.

## PROJ-002 — Create project detail model/pages
- Priority: P1
- Status: Planned
- Area: Projects

Use a concise model covering what the project is, why it exists, current status and relevant links.

## PROJ-003 — Connect current projects
- Priority: P1
- Status: Planned
- Area: Projects

Create proper destinations for Ride Together, VTR Press and HomeLab Engineering where appropriate.

---

# Phase 5 — Photography

## PHOTO-001 — Define photography information architecture
- Priority: P1
- Status: Done
- Area: Photography

V1 is defined as a lightweight gateway to external photographic platforms.

## PHOTO-002 — Build photography landing experience
- Priority: P1
- Status: Done
- Area: Photography

A lightweight landing page linking to 500px and Instagram is implemented. No full photo archive is hosted in V1.

## PHOTO-003 — Define selective image/embedding strategy
- Priority: P2
- Status: Planned
- Area: Photography

Determine when a small local image, external image reference or external embed is appropriate. External integrations must not be required for basic page rendering.

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
- Status: In Progress
- Area: Travel

Use the supplied country/status record as the initial planning data and continue adding destinations and Indian journeys through the established common travel model.

## TRAVEL-008 — Import/reconcile travel records
- Priority: P1
- Status: In Progress
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
- Status: Planned
- Area: Quality

## QA-002 — Accessibility audit
- Priority: P1
- Status: Planned
- Area: Quality

## SEO-001 — Complete metadata system
- Priority: P1
- Status: Planned
- Area: SEO

## SEO-002 — Add sitemap / robots foundations
- Priority: P1
- Status: Planned
- Area: SEO

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
- Status: Planned
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
