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

Create the authoritative intended product specification.

## DOC-002 — Establish functional requirements

- Priority: P0
- Status: Done
- Area: Documentation

Document functional, content, UX, accessibility, SEO, performance and maintainability requirements.

## DOC-003 — Establish architecture

- Priority: P0
- Status: Done
- Area: Documentation

Document the intended technical and content architecture.

## DOC-004 — Establish feature catalogue

- Priority: P0
- Status: Done
- Area: Documentation

Create a catalogue separating intended features from current implementation status.

## DOC-005 — Establish authoritative backlog

- Priority: P0
- Status: Done
- Area: Documentation

Create this backlog and use it as the execution source of truth.

---

# Phase 1 — Foundation Audit & Information Architecture

## IA-001 — Define final site map

- Priority: P0
- Status: Planned
- Area: Information Architecture

Confirm the final primary destinations and canonical URL structure before building additional pages.

Acceptance criteria:

- Primary destinations are agreed.
- Canonical URLs are documented.
- Navigation hierarchy is documented.
- No route exists solely because of an implementation accident.

## IA-002 — Define content models

- Priority: P0
- Status: Planned
- Area: Content Architecture

Define the final schemas for books, writing, projects, travel, photography and Now content.

## IA-003 — Decide Markdown/content collections strategy

- Priority: P0
- Status: Planned
- Area: Technical Architecture

Determine which content remains in TypeScript data modules and which moves to Markdown/content collections.

## IA-004 — Map current implementation to intended specification

- Priority: P0
- Status: Planned
- Area: Audit

Produce an explicit current-state versus intended-state gap assessment.

---

# Phase 2 — Core Site Experience

## WEB-001 — Finalise homepage

- Priority: P0
- Status: Planned
- Area: Homepage

Bring the existing homepage into alignment with the approved specification and visual direction.

## WEB-002 — Build About page

- Priority: P1
- Status: Planned
- Area: About

Create a narrative personal About experience.

## WEB-003 — Build Now page/section

- Priority: P0
- Status: Planned
- Area: Now

Provide a maintainable current-focus experience.

## WEB-004 — Finalise global navigation

- Priority: P0
- Status: Planned
- Area: Navigation

Implement the agreed navigation across desktop and mobile.

## WEB-005 — Finalise footer / Elsewhere / Contact

- Priority: P1
- Status: Planned
- Area: Global UX

Create coherent secondary navigation and contact paths.

---

# Phase 3 — Books & Writing

## BOOK-001 — Finalise books landing experience

- Priority: P0
- Status: Planned
- Area: Books

Present the published books accurately and consistently.

## BOOK-002 — Create individual book pages

- Priority: P1
- Status: Planned
- Area: Books

Create dedicated pages for each published book.

## BOOK-003 — Add book metadata and related content

- Priority: P2
- Status: Planned
- Area: Books

Support publication metadata, related writing and other useful context.

## WRITE-001 — Establish writing content model

- Priority: P0
- Status: Planned
- Area: Writing

Create the durable model for long-form articles.

## WRITE-002 — Build writing index

- Priority: P0
- Status: Planned
- Area: Writing

Create a browsable writing landing page.

## WRITE-003 — Build individual article pages

- Priority: P0
- Status: Planned
- Area: Writing

Create the canonical article route and reading experience.

## WRITE-004 — Migrate/curate existing writing entries

- Priority: P1
- Status: Planned
- Area: Writing

Replace placeholder links with real destinations or intentionally remove entries until their content exists.

---

# Phase 4 — Projects

## PROJ-001 — Build projects landing page

- Priority: P0
- Status: Planned
- Area: Projects

Create a curated project index.

## PROJ-002 — Create project detail model/pages

- Priority: P1
- Status: Planned
- Area: Projects

Support individual project narratives and relevant links.

## PROJ-003 — Connect current projects

- Priority: P1
- Status: Planned
- Area: Projects

Create proper destinations for Ride Together, VTR Press and HomeLab Engineering where appropriate.

---

# Phase 5 — Photography

## PHOTO-001 — Define photography information architecture

- Priority: P1
- Status: Planned
- Area: Photography

Decide between a curated external-first experience and locally owned galleries for V1.

## PHOTO-002 — Build photography landing experience

- Priority: P1
- Status: Planned
- Area: Photography

Create a dedicated visual photography destination.

## PHOTO-003 — Define image pipeline

- Priority: P2
- Status: Planned
- Area: Photography

Define image storage, optimisation, responsive sizing, alt text and performance strategy.

---

# Phase 6 — Travel & Rides / Travelogue

## TRAVEL-001 — Define travelogue information architecture

- Priority: P0
- Status: Planned
- Area: Travel

Design the long-term structure for documenting approximately 20 countries and two decades of travel.

Acceptance criteria:

- Country/place is a first-class concept.
- Individual stories have durable URLs.
- A trip can contain multiple places where appropriate.
- The model supports both travel and riding stories.
- Photography is integrated naturally.
- Adding future destinations does not require structural redesign.

## TRAVEL-002 — Define travel content schema

- Priority: P0
- Status: Planned
- Area: Travel

Define fields for place, country, dates, trip context, narrative, observations, photography and related content.

## TRAVEL-003 — Build travelogue index

- Priority: P1
- Status: Planned
- Area: Travel

Create a visually engaging overview of destinations/stories.

## TRAVEL-004 — Build individual travel pages

- Priority: P1
- Status: Planned
- Area: Travel

Create the core travelogue story experience.

## TRAVEL-005 — Curate initial travel destinations

- Priority: P1
- Status: Planned
- Area: Travel

Identify the initial countries/places to publish and establish a consistent editorial structure.

## TRAVEL-006 — Support related rides/routes

- Priority: P2
- Status: Planned
- Area: Travel & Rides

Connect relevant motorcycle/riding experiences to travel stories without forcing every trip into a riding format.

## TRAVEL-007 — Explore map-based discovery

- Priority: P3
- Status: Parked
- Area: Travel

Consider an interactive or visual map after the narrative travelogue is established.

---

# Phase 7 — Quality, SEO & Performance

## QA-001 — Responsive audit

- Priority: P1
- Status: Planned
- Area: Quality

Validate layouts and interactions across mobile, tablet and desktop.

## QA-002 — Accessibility audit

- Priority: P1
- Status: Planned
- Area: Quality

Validate semantics, keyboard navigation, focus states, alt text and contrast.

## SEO-001 — Complete metadata system

- Priority: P1
- Status: Planned
- Area: SEO

Implement page-specific titles, descriptions, canonical URLs and social metadata.

## SEO-002 — Add sitemap / robots foundations

- Priority: P1
- Status: Planned
- Area: SEO

Ensure search engines can discover canonical public content appropriately.

## PERF-001 — Image optimisation

- Priority: P1
- Status: Planned
- Area: Performance

Optimise locally served imagery without compromising the visual character of the site.

## PERF-002 — Minimise client-side JavaScript

- Priority: P1
- Status: Planned
- Area: Performance

Keep the site static-first and introduce browser-side behaviour only when justified.

## QA-003 — Production build verification

- Priority: P0
- Status: Planned
- Area: Quality

Verify clean build, deployment and production routing before V1 release.

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
