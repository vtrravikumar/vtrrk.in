# vtrrk.in — Architecture

## 1. Architectural Intent

The architecture should keep vtrrk.in simple, fast, portable and easy for one person to maintain.

The site is primarily a content-driven static website. Infrastructure should only be introduced when a real requirement justifies it.

## 2. Stack

- Astro for site generation and page composition.
- TypeScript for structured data and application logic.
- CSS for presentation.
- Markdown/content files for long-form publishing.
- Git/GitHub for source control and owned content.
- Cloudflare Pages for deployment.

## 3. High-Level Model

```text
Owned Content / Structured Data
        |
        +-- Site / About / Now
        +-- Books
        +-- Writing
        +-- Projects
        +-- Travel geography
        +-- Travel trip metadata
        +-- Travel stories
        +-- Photography links/curated references
        |
        v
Astro Content/Data Layer
        |
        v
Reusable Layouts + Components
        |
        v
Static HTML/CSS/Optimised Assets
        |
        v
Cloudflare Pages
        |
        v
vtrrk.in
```

## 4. Repository Structure

Target structure:

```text
/
├── docs/
│   ├── SPECIFICATION.md
│   ├── REQUIREMENTS.md
│   ├── ARCHITECTURE.md
│   ├── FEATURES.md
│   └── ...
├── public/
│   └── images/
├── src/
│   ├── components/
│   ├── content/
│   ├── data/
│   ├── lib/
│   ├── pages/
│   └── styles/
├── AGENTS.md
├── BACKLOG.md
├── README.md
├── SITE.md
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

The exact directory structure may evolve as content collections are implemented.

## 5. Content Architecture

Content should be modelled independently from visual components.

Small, stable structured data may remain in TypeScript modules where that is the simplest solution. Long-form material should use Markdown/content collections.

Travel uses structured data for geography and trip metadata, with narrative content kept separate where practical.

The goal is to enter facts once and derive repeatable presentation from them.

## 6. Content Models

### Site / Now

Global identity, navigation, external links and current-focus content.

### Book

- title
- subtitle
- description
- cover
- publication status/date
- purchase/read links
- related content

Book pages should use a concise reusable presentation template.

### Writing

- title
- slug
- date
- description/dek
- body
- optional hero image
- optional tags/categories
- related content

### Project

- title
- slug
- short description
- purpose/why
- status
- links
- optional imagery
- related writing

Project pages should communicate the human/project story, not reproduce technical repository documentation.

### Travel geography

Travel uses a deliberate geographic classification:

```text
Continent
   |
   +-- Country
          |
          +-- Trips / Places / Stories
```

Country is a first-class index concept. India is represented as a country with individual journeys beneath it; international countries may have one or multiple trips/stories. The distinction is content structure, not a separate rendering architecture.

### Travel trip metadata

Every trip should have a reusable structured metadata record that can be copied and edited for another destination/trip.

Potential fields include:

- country
- continent
- places
- trip dates
- trip context/purpose
- flights
- flight dates/routes
- airline
- flight number where useful
- seat where useful
- accommodation
- transport
- rides/routes
- photography references
- story references
- publication status
- journey/travel type where useful
- featured status where applicable

The factual metadata model is shared by Indian journeys and international travel. A field may be optional when it is not meaningful for a particular story.

### Travel story

Narrative content may contain:

- introduction
- personal experience
- places and experiences
- memorable moments
- observations
- what to do again
- mistakes/things to avoid
- accommodation observations
- transport observations
- practical notes
- photography references/embeds
- related rides
- related writing

The common template must remain flexible: not every story needs every section.

### Unified Travel Rendering

India and international travel use one common travel-detail rendering model.

The implementation must not maintain separate page mechanisms merely because India contains individual journeys while international travel is commonly organised by country. The travel data determines the appropriate presentation and URL depth; the underlying loader, metadata handling, date handling, featured handling and story presentation remain shared.

The current canonical implementation uses a single catch-all travel detail route for variable-depth travel URLs. This allows routes such as:

```text
/travel/italy/
/travel/jordan/
/travel/armenia/
/travel/india/amarnath/
```

to be rendered through the same travel system.

This is an explicit architectural decision: **India versus international is a content classification, not a separate application/module.**

### Photography

V1 should primarily contain curated external photography references and links. Local image assets should be limited to purposeful visual accents/contextual imagery rather than a complete archive.

The architecture should leave room for a dedicated owned photography site/gallery in the future.

## 7. Travel Editorial Workflow

Travel content follows an interview-led process:

```text
Travel records / metadata
        +
Ravi's memories
        +
Photographs / external references
        |
        v
Pointed adaptive interview
        |
        v
Travel story draft
        |
        v
Common travel template
        |
        v
Published destination/trip
```

Questions should adapt to the information already known and the memories revealed during the conversation. Existing flight/travel records can be used to establish chronology and prompt precise questions.

## 8. Routing

The site should use clean, human-readable canonical URLs.

Primary routes:

```text
/
/about/
/now/
/books/
/books/<slug>/
/writing/
/writing/<slug>/
/projects/
/projects/<slug>/
/travel/
/travel/<country>/
/travel/india/<journey>/
/photography/
/contact/
/elsewhere/
```

Travel detail URLs may have different depths because India is intentionally organised as a country containing individual journeys while an international country may itself be the story destination. These URL differences do not imply different page implementations.

## 9. Rendering Strategy

Prefer static generation for public content.

Client-side JavaScript should be introduced only where a feature genuinely needs it.

Core pages must not depend on third-party embeds for basic rendering.

External photography embeds, where used, should be progressive enhancement and should not make the page unusable when unavailable.

Travel routes are statically generated from the unified travel data model.

## 10. Components

Reusable components should correspond to genuine repeated patterns:

- Header
- Footer
- Book presentation
- Project summary
- Writing preview/article layout
- Travel country/trip/story presentation
- Travel metadata display
- External-link presentation
- Image/visual presentation
- Metadata/SEO helpers

Avoid abstraction for its own sake.

## 11. Images

The site should be image-conscious rather than image-heavy.

Local images, where required, should use Astro's appropriate asset pipeline or `public/` for assets that genuinely need direct public paths.

Image handling should consider:

- responsive sizing
- compression
- appropriate formats
- meaningful alt text
- loading behaviour
- visual quality

The homepage should not load a large photographic collection.

Travel pages can carry richer imagery because Travel is intentionally a detailed visual/story experience.

Travel banner assets follow a predictable country/journey naming convention where practical, for example `public/images/travel/italy.jpg` and `public/images/travel/amarnath.jpg`.

## 12. SEO Architecture

Shared layouts should provide consistent metadata foundations.

Page-level content should provide titles, descriptions and canonical URLs.

Specialised structured data can be added for books, articles, travel/place content and personal identity where useful.

Travel metadata is rendered through the common travel system so India and international pages use the same metadata conventions.

## 13. Deployment Architecture

```text
Developer / Content Author
        |
        v
      Git
        |
        v
     GitHub
        |
        v
Cloudflare Pages build
        |
        v
   Production site
      vtrrk.in
```

The production site should be reproducible from the repository.

## 14. External Dependencies

Runtime dependence on external services should be minimal.

External links are acceptable for distribution and references. Core site content should remain available if an external platform changes or disappears.

Photography platforms may be linked or selectively embedded. Such integrations must not become required infrastructure.

## 15. Future Architecture

Potential future additions include:

- dedicated photography site/gallery
- richer image management
- site search
- map-based travel discovery
- RSS/Atom feed
- newsletter
- CMS
- privacy-conscious analytics
- richer structured data

None should be introduced until a demonstrated need exists.

## 16. Architectural Principles

1. Static first.
2. Person-first product structure.
3. Content owned by the repository wherever practical.
4. Structured travel metadata entered once and reused.
5. Long-form narrative separated from presentation where practical.
6. Minimal JavaScript.
7. Human-readable stable URLs.
8. Photography is visual support/gateway in V1, not a photo-hosting system.
9. Travel is detailed and template-driven.
10. India and international travel share one underlying travel module; geography/content differences are data, not separate application mechanisms.
11. No backend without a real requirement.
12. Prefer simple solutions that can be maintained for years.
13. Avoid further architectural changes unless an actual requirement demonstrates that the current foundation cannot support the feature.
