# vtrrk.in — Product Specification

## 1. Purpose

vtrrk.in is Ravi Kumar's personal digital home.

The site presents the **person first** and his work and experiences second: books, writing, projects, travel, photography, engineering and riding.

It is a personal editorial site, not a résumé, corporate portfolio, generic developer portfolio, travel guide, photo archive or social-media replacement.

## 2. Product Principles

- Person first; work and experiences second.
- Editorial rather than corporate.
- Personal rather than promotional.
- Concise where presentation is sufficient; detailed where the story warrants it.
- Simple rather than feature-heavy.
- Visual without becoming image-heavy.
- Travel is a first-class expression of the person.
- Rides are a related dimension of travel, not a primary navigation item.
- Photography is primarily a gateway to Ravi's photographic presence rather than a photo-hosting platform in V1.
- Content should be owned and portable wherever practical.
- External platforms are distribution/extensions, not dependencies.
- The site should age well and remain maintainable by one person.

## 3. Primary Audiences

The site should serve:

1. People who know Ravi and want to know what he is doing now.
2. Readers interested in his books and writing.
3. People interested in his engineering and technology work.
4. Fellow photographers, travellers, riders and explorers.
5. People discovering Ravi through search or external platforms.
6. People who want a richer picture of Ravi than a résumé provides.

## 4. Information Architecture

### Primary navigation

- Home
- About
- Now
- Books
- Writing
- Projects
- Travel
- Photography

### Secondary destinations

- Contact
- Elsewhere

Rides are intentionally not a primary navigation item. They appear as related content within Travel where appropriate.

The travel hierarchy is geographic at the index level but uses one underlying travel content model. India is a country containing individual journeys; international countries may contain one or multiple trips/stories. This is a content distinction, not a separate application architecture.

## 5. Homepage

The homepage is the editorial front door.

It should:

- Introduce Ravi concisely.
- Show what he is focused on now.
- Surface selected books, writing and projects.
- Provide an invitation into Travel.
- Provide a lightweight Photography presence.
- Link to relevant external platforms.

The homepage must **not become a photo album**. It should not load or display a large photography archive merely to make the page visually rich.

Content shown on the homepage should be curated rather than exhaustive.

## 6. About

About should describe the person beyond a résumé.

It may cover engineering, authorship, photography, travel, riding and the transitions between different stages of life, but should remain reasonably concise.

## 7. Books

Books are first-class published work.

Current published books:

- Engineering Home: Rediscovering the Engineer Beyond the Workplace
- Gen Z
- The White Envelope

The Books experience should be a **concise presentation**, not a long prose treatment.

The landing page should present the books clearly. Each book should have a reusable presentation template containing, as appropriate:

- Cover
- Title/subtitle
- Short synopsis
- Brief author's perspective or context
- Publication information
- Purchase/read links
- Optional related links

Reviews, excerpts, interviews and other extended material are optional future enhancements.

## 8. Writing

Writing is the primary prose-oriented area of the site.

It should support essays, reflections, engineering/technology writing, book-related writing and other long-form material.

The writing index should be curated and readable rather than a dense feed or CMS-style archive.

Each article should support:

- Title
- Publication date
- Short description/dek
- Body
- Optional image
- Optional tags/categories
- Canonical URL
- SEO/social metadata
- Optional related content

Markdown/content files are preferred for long-form writing.

## 9. Projects

Projects answer: **What is Ravi building, exploring or working on?**

Projects should not turn vtrrk.in into a technology résumé or developer portfolio.

Important current projects include:

- Ride Together
- VTR Press
- HomeLab Engineering

A project presentation should normally include:

- Name
- Concise description
- Why it exists
- Current status
- Relevant links
- Optional imagery
- Optional related writing

The project's own repository or technical site remains the appropriate place for implementation detail.

## 10. Photography

Photography is a visual pillar of Ravi's identity, but vtrrk.in is **not intended to host the complete photographic archive** in V1.

The Photography destination should be a lightweight gateway to Ravi's photographic presence, including platforms such as Instagram, 500px and other future destinations.

The site may use a small number of carefully selected images as visual accents or contextual material, but should not become a second photo-hosting platform.

A dedicated photography site/gallery may be considered in the future.

## 11. Travel

Travel is a first-class, deliberately detailed content area.

Ravi has travelled to roughly 20 countries over approximately two decades. The travelogue should document those experiences as personal, useful and visually supported stories rather than as a generic travel guide.

### 11.1 Geographic classification

Travel uses a deliberate geographic classification:

**Continent → Country → Travel content**

Countries provide the broad index and orientation. Individual trips, places and stories provide the substantive content.

India is represented as one country within the same geography. Because India contains many individual journeys, its visitor-facing index presents those journeys beneath India rather than treating Indian states as countries. International countries can similarly contain one or more stories when needed.

### 11.2 Common travel template

All country/trip/journey presentations use one common underlying travel template and rendering mechanism.

The template is consistent in its metadata and presentation conventions but flexible in depth and content.

The system determines whether a URL represents a country-level story or an individual journey from the travel data. India versus international does **not** select a different page implementation.

Potential sections include:

- Country / place / region
- Continent
- Visit date or period
- Duration
- Travelled with / trip context
- Journey or travel type where useful
- Personal narrative
- Places and experiences
- What stood out
- What I would do again
- Mistakes / things to avoid
- Where to stay
- Getting around
- Practical observations
- Photography links or embeds where appropriate
- Related rides/routes
- Related writing
- Journey/flight details where useful

Not every trip needs every section.

### 11.3 Unified travel implementation

The travel detail system uses a single underlying module for India and international travel.

It must support variable route depth, for example:

```text
/travel/italy/
/travel/jordan/
/travel/armenia/
/travel/india/amarnath/
```

The URL depth reflects how the content is organised for visitors. It must not result in separate travel rendering mechanisms.

The common implementation is responsible for:

- Loading travel metadata
- Resolving the requested country/journey
- Normalising and formatting dates
- Calculating/displaying duration where applicable
- Rendering common travel metadata
- Rendering the travel narrative
- Handling featured travel content
- Providing consistent SEO/page metadata

Country- or journey-specific differences should be expressed through structured data and optional fields.

### 11.4 Trip metadata

Each trip/journey should have a reusable structured metadata record that acts as the factual backbone for the site.

The metadata should be easy to edit, copy and reuse for the next destination/journey. It may contain richer information than is publicly displayed.

Potential metadata includes:

- Country
- Continent
- Places
- Trip dates
- Trip purpose/context
- Journey/travel type
- Travel companions
- Flights
- Flight dates/routes
- Airlines
- Flight numbers where useful
- Seats where useful
- Accommodation
- Transport
- Rides/routes
- Photography references
- Story references
- Publication status
- Featured status where appropriate

Indian journeys and international travel use the same core metadata conventions. Fields remain optional where they do not apply.

The site should derive repeatable presentation from this data rather than requiring facts to be duplicated across components or pages.

### 11.5 Travel writing process

Travel content should be developed through an interview-led editorial process.

For each country/trip, ChatGPT should first ask **pointed, adaptive questions** designed to recover memories, observations, people, incidents, emotions, surprises, lessons and useful practical details. The interview should respond to Ravi's answers rather than follow a rigid generic questionnaire.

The resulting narrative is then edited into the common travel template and supplemented with photographs or links/embeds where appropriate.

Existing travel records, including flight history, may be used as factual source material to establish chronology and prompt more precise questions. Detailed metadata should only be exposed publicly when it adds value.

### 11.6 Travel and rides

Riding experiences may appear as trips, stories or related content within Travel. The model must support ordinary travel that has no motorcycle component.

### 11.7 Travel depth

Unlike most sections of vtrrk.in, Travel is intentionally allowed to be detailed. It can contain substantial narrative, practical advice and multiple related stories where the experience warrants it.

## 12. Now

Now is a deliberately current, concise view of what Ravi is focused on.

It should be easy to update without unnecessary code changes and may reference projects, writing, travel, photography, learning or other current priorities.

## 13. External Presence

External platforms are extensions of the site.

Examples include Instagram, 500px, X, Amazon/book pages and GitHub.

The site should remain useful if an external platform changes or disappears.

## 14. Contact

V1 should provide a simple contact path without requiring a custom backend.

## 15. Cross-Content Relationships

Books, writing, projects, travel and photography should be able to reference one another when the relationship adds context.

Examples:

- An article can reference a book.
- A travel story can reference photographs.
- A travel story can reference a ride.
- A project can reference related writing.
- A book can reference related writing.

Relationships should be editorially chosen rather than automatically generated everywhere.

## 16. Visual Specification

The visual language should be:

- Quiet
- Editorial
- Modern
- Personal
- Photographic
- Timeless

Avoid:

- Corporate portfolio aesthetics
- Generic developer-portfolio layouts
- Excessive card grids
- Decorative animation without purpose
- Stock imagery
- Skill bars
- Feature clutter

Photography should have room to breathe without dominating page weight.

Travel should be visually engaging while remaining readable and useful.

## 17. Content Model

Content should be separated from presentation wherever practical.

Initial content types:

- Site identity/settings
- Books
- Projects
- Writing
- Travel continents/countries
- Travel trips/journeys
- Travel stories
- Travel trip metadata
- Photography/external collections
- Now entries

The travel content types share one underlying travel model and rendering mechanism. India is not a separate technical content system from international travel.

Portable Markdown and structured data files are preferred initially. A CMS or database is not required for V1.

## 18. Technology

Target stack:

- Astro
- TypeScript
- CSS
- Markdown/content files
- Git/GitHub
- Cloudflare Pages

No database or CMS initially.

## 19. Deployment

Source repository: `vtrravikumar/vtrrk.in`

Production domain: `vtrrk.in`

Hosting target: Cloudflare Pages.

The repository remains the source of truth for site code and owned content.

## 20. V1 Boundaries

V1 should remain small and maintainable.

Not initially required:

- Authentication
- Database
- CMS
- Comments
- Newsletter infrastructure
- E-commerce
- Complex backend
- User accounts
- Full photography archive
- Advanced travel map
- Site-wide search

These can be reconsidered when a real use case emerges.

## 21. Quality Bar

Before V1 is considered complete, the site should be:

- Responsive
- Accessible to a reasonable modern standard
- Fast on mobile and desktop
- SEO-ready
- Free of intentional placeholder links in published sections
- Visually coherent
- Easy to update
- Reproducibly deployable from GitHub
- Structured so future content can be added without redesigning the foundation
- Able to add Indian journeys and international travel stories through the same travel mechanism
