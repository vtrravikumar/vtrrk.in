# vtrrk.in — Requirements

## 1. Functional Requirements

### FR-001 — Personal identity
The site shall clearly establish Ravi Kumar as the person behind the site.

### FR-002 — Primary navigation
The site shall provide clear navigation to About, Now, Books, Writing, Projects, Travel and Photography.

### FR-003 — Homepage
The homepage shall provide a curated editorial overview of Ravi and selected current work/content. It shall not become a photo archive or exhaustive catalogue.

### FR-004 — About
The site shall support a concise, human About page describing Ravi beyond a conventional résumé.

### FR-005 — Books
The site shall support first-class presentation of published books using a reusable concise presentation template, including cover, synopsis and relevant external purchase/read links.

### FR-006 — Writing
The site shall support a browsable collection of articles and individual article pages.

### FR-007 — Writing metadata
Articles shall support title, date, description, content, canonical URL and optional imagery/tags.

### FR-008 — Projects
The site shall support individual project descriptions and links, with project status/content able to evolve independently.

### FR-009 — Photography
The site shall provide a lightweight dedicated photography destination that acts primarily as a gateway to external photographic platforms in V1. It shall not require hosting the complete photographic archive.

### FR-010 — Travelogue
The site shall provide a dedicated, detailed Travel destination documenting Ravi's travel experiences.

### FR-011 — Travel geography
Travel shall support deliberate Continent → Country classification.

### FR-012 — Unified travel template
India journeys and international country/trip entries shall use one common underlying travel template and rendering mechanism. Differences in geography, URL depth or story type shall be represented by travel data rather than separate page implementations.

### FR-013 — Travel metadata
Each trip/journey shall be represented by reusable structured metadata that can be copied and edited for future destinations.

### FR-014 — Travel narrative
Travel content shall support personal narrative, visit dates, trip context, places, experiences, observations, practical advice, mistakes to avoid, accommodation and transport observations, photography references and related rides where applicable.

### FR-015 — Travel records
The travel model shall be capable of representing detailed factual journey information, including flights, dates, routes and optionally airline, flight number and seat. Richer source metadata need not all be displayed publicly.

### FR-016 — Travel discovery
Users shall be able to discover travel by continent and country and, where useful, by trip, place, year or related story.

### FR-017 — Travel editorial workflow
The travel content process shall support an interview-first workflow in which pointed, adaptive questions are used to recover Ravi's memories and experience before the travelogue is drafted.

### FR-018 — Related content
Travel, writing, books, photography and projects should be linkable to related content where meaningful.

### FR-019 — Now
Current-focus content shall be independently maintainable and easy to update.

### FR-020 — External links
The site shall support relevant external platforms without depending on them for core page rendering.

### FR-021 — Contact
The site shall provide a simple contact path without requiring a custom backend in V1.

## 2. Content Requirements

### CR-001 — Content ownership
Owned content shall be stored in the repository in portable formats wherever practical.

### CR-002 — Published status
The site shall distinguish published work from planned or unpublished work.

### CR-003 — No placeholder publishing
Published navigation and content shall not contain intentionally empty destination links.

### CR-004 — Editorial voice
Long-form content shall favour Ravi's own perspective and experience over generic informational copy.

### CR-005 — Concise presentation
Books, Projects and most general site content shall avoid unnecessary prose. Writing and Travel may be detailed where the content warrants it.

### CR-006 — Photography gateway
Photography links/embeds shall be used selectively and shall not turn the homepage or core site into a photo-hosting service.

### CR-007 — Reusable travel data
Travel facts shall be entered once into structured trip metadata wherever practical rather than duplicated across page markup.

### CR-008 — Common travel data model
Indian journeys and international travel shall use the same core travel metadata conventions. Optional fields may be omitted where they do not apply.

## 3. UX Requirements

### UX-001 — Responsive
The site shall work across desktop, tablet and mobile screen sizes.

### UX-002 — Clear hierarchy
Content hierarchy shall remain understandable without excessive decoration.

### UX-003 — Readability
Long-form pages shall provide comfortable typography, line length, spacing and navigation.

### UX-004 — Image presentation
Travel imagery shall receive sufficient size and whitespace to remain meaningful without requiring large image payloads on the homepage.

### UX-005 — Navigation consistency
Header/footer behaviour shall remain consistent across pages.

### UX-006 — No unnecessary interaction
Animations and interactive elements shall be used only where they improve comprehension or navigation.

### UX-007 — Travel usability
Travel pages shall balance detailed information with clear scanning/navigation so practical information does not disappear inside prose.

### UX-008 — Travel metadata consistency
Travel metadata such as dates, duration, companion/travel context and journey type shall be presented consistently for India and international stories, while allowing fields to remain optional where appropriate.

## 4. Accessibility Requirements

### A11Y-001
Semantic HTML shall be preferred.

### A11Y-002
Images shall have meaningful alternative text where required.

### A11Y-003
Interactive elements shall be keyboard accessible.

### A11Y-004
Colour contrast and focus states shall be sufficient for normal use.

### A11Y-005
Motion shall not be essential to understanding content.

## 5. SEO Requirements

### SEO-001
Every indexable page shall have a meaningful title and description.

### SEO-002
Canonical URLs shall be defined for published pages.

### SEO-003
Open Graph/social sharing metadata shall be supported.

### SEO-004
Structured data may be added where it provides genuine search value, especially for books, articles, travel/place content and personal identity.

### SEO-005
The site shall generate or expose a sitemap when appropriate.

## 6. Performance Requirements

### PERF-001
The site shall remain lightweight and avoid unnecessary client-side JavaScript.

### PERF-002
Images shall be appropriately sized and optimised for their display context.

### PERF-003
Static content should be generated at build time wherever possible.

### PERF-004
Third-party services shall not be required for basic page rendering.

### PERF-005
The homepage shall avoid loading a large photography collection.

## 7. Technical Requirements

### TECH-001
The project shall use Astro and TypeScript.

### TECH-002
Presentation components shall be reusable where repetition is meaningful.

### TECH-003
Content shall be separated from presentation where practical.

### TECH-004
The project shall build successfully using the documented package/build commands.

### TECH-005
The project shall be deployable from GitHub to the production hosting platform.

### TECH-006
No database, authentication system or CMS is required for V1.

### TECH-007
Travel trip/journey metadata shall use a structured, reusable format that can be copied and edited for new destinations.

### TECH-008
Travel detail pages shall use a single underlying rendering mechanism capable of handling both country-level international routes and journey-level India routes.

## 8. Maintainability Requirements

### MAINT-001
Adding a new book should not require editing multiple unrelated components.

### MAINT-002
Adding a new writing article should not require rebuilding page layout logic.

### MAINT-003
Adding a new travel country/trip/journey should use the established geography, common template and metadata model rather than require bespoke page construction.

### MAINT-004
Travel facts shall be maintainable independently from travel narrative/presentation where practical.

### MAINT-005
Documentation shall describe the intended architecture and operating model.

### MAINT-006
The backlog shall remain the authoritative list of planned work.

### MAINT-007
India and international travel shall not maintain separate implementations when the difference can be represented through shared travel data and routing.

## 9. V1 Acceptance Criteria

V1 is ready when:

- Primary site navigation is implemented and coherent.
- About, Books, Writing, Projects, Photography, Travel and Now have defined experiences.
- Published books are accurately represented.
- Writing supports real article pages rather than placeholder links.
- Travel supports Continent → Country classification, reusable trip metadata and the common travel template.
- The travel model can accommodate Indian journeys and international country/trip stories through one underlying travel mechanism.
- The travel model can accommodate detailed narrative, practical observations and journey records without redesign.
- Travel metadata is presented consistently across India and international stories.
- Photography is a lightweight gateway rather than a full photo archive.
- The homepage is not dominated by photographs or large image payloads.
- Responsive behaviour is acceptable on mobile and desktop.
- Accessibility and SEO fundamentals are implemented.
- No published section depends on empty placeholder links.
- Build and deployment are repeatable.
- Documentation and backlog accurately reflect the system.
