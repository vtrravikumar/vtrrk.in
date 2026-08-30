# vtrrk.in — Feature Catalogue

This document defines the intended feature set. It is not a statement that every feature is already implemented.

## F01 — Personal Home

The home page introduces Ravi and provides a curated view of who he is, what he is doing now, and selected work and experiences.

**Priority:** P0

## F02 — About

A concise human profile explaining the person behind the site beyond résumé-style employment history.

**Priority:** P1

## F03 — Now

A current snapshot of what Ravi is focused on, maintained independently from the rest of the site.

**Priority:** P0

## F04 — Books

A dedicated area for published books with concise individual book presentations and external purchase/read links.

**Priority:** P0

## F05 — Writing

An owned publishing area for essays, reflections and other long-form writing, using portable content where practical.

**Priority:** P0

## F06 — Projects

A curated presentation of projects Ravi is building, exploring or has built. Projects communicate purpose and status rather than functioning as a developer portfolio.

**Priority:** P0

## F07 — Photography Gateway

A lightweight visual destination that points to Ravi's photography on Instagram, 500px and other external platforms. V1 does not attempt to host the complete photographic archive.

**Priority:** P1

## F08 — Travelogue

A detailed personal travelogue covering roughly 20 countries visited over approximately 20 years, together with individual journeys within India.

Travel is deliberately richer than the other presentation-oriented sections and can combine stories, practical information and visual material.

**Priority:** P1

## F09 — Travel Geography

Travel is organised deliberately by **Continent → Country**, with individual journeys/stories beneath a country where appropriate.

India is one country in the same geography; its index presents individual journeys rather than states.

**Priority:** P1

## F10 — Common Travel Template

All travel content uses one common underlying template and rendering mechanism. India journeys and international country/trip stories may have different URL depth or content emphasis, but they do not use separate page implementations.

**Priority:** P1

## F11 — Trip Metadata

Each trip/journey has a structured metadata record that can be copied and edited for the next destination. Metadata may include dates, places, travel companions, journey type, flights, airlines, accommodation, transport, rides and photography references.

**Priority:** P1

## F12 — Travel Stories

Individual trips, places and experiences can become detailed stories within the geographic structure.

**Priority:** P1

## F13 — Travel Practical Knowledge

Travel content can include where to stay, how to get around, what to do, mistakes to avoid, what Ravi would do differently, and other first-hand observations.

**Priority:** P1

## F14 — Travel Interview Workflow

Travel stories are developed through pointed, adaptive questions before drafting, using Ravi's memories and available travel records to recover detail and authenticity.

**Priority:** P1

## F15 — Travel Photography Integration

Travel stories can reference Ravi's photographs or selectively embed external photography where appropriate, without requiring the site to host the full archive.

**Priority:** P1

## F16 — Related Content

Books, writing, projects, travel, rides and photography can be explicitly connected when the relationship adds context.

**Priority:** P2

## F17 — External Presence

A curated set of relevant external destinations such as Instagram, 500px, X, Amazon and GitHub.

**Priority:** P1

## F18 — Contact

A simple way for people to reach Ravi.

**Priority:** P1

## F19 — Search Engine Foundations

Page titles, descriptions, canonical URLs, Open Graph metadata, sitemap and sensible structured data where useful.

**Priority:** P1

## F20 — Accessibility

Semantic markup, keyboard access, alt text, focus states and sensible contrast/motion behaviour.

**Priority:** P1

## F21 — Performance

Fast static pages, optimised images and minimal client-side JavaScript. The homepage must remain lightweight and must not become a photo album.

**Priority:** P1

## F22 — RSS / Feed

Optional feed for writing and/or other chronological content.

**Priority:** P3

## F23 — Map-based Travel View

Optional visual map showing countries/places visited. This should enhance the travelogue rather than replace narrative pages.

**Priority:** P3

## F24 — Search

Optional site-wide search once the volume of writing and travel content makes it useful.

**Priority:** P3

## F25 — Analytics

Privacy-conscious analytics may be considered after the core site is stable.

**Priority:** P3

## F26 — Dedicated Photography Site

A future photography-focused site/gallery may be created if the photographic archive warrants it. vtrrk.in should be able to act as the gateway to it.

**Priority:** P3

## F27 — CMS

A CMS is explicitly not part of V1. Reconsider only if repository-based publishing becomes a genuine burden.

**Priority:** P4

## F28 — Newsletter

Not part of V1. Consider only if there is a clear publishing/distribution strategy that warrants it.

**Priority:** P4

## Feature Design Rules

1. Features must improve understanding of Ravi or exploration of his work and experiences.
2. The homepage must remain curated, lightweight and not photo-heavy.
3. Books and Projects should remain concise.
4. Writing is the main prose-oriented section.
5. Travel is intentionally detailed and practical where first-hand knowledge exists.
6. Photography is a gateway in V1, not a full archive.
7. Rides belong within the Travel model rather than primary navigation.
8. India and international travel share one underlying travel mechanism; differences are represented by data and geography rather than duplicate implementations.
9. Features should not be added merely because they are technically interesting.
10. Avoid further architectural changes unless a demonstrated requirement shows that the current foundation cannot support the feature.
