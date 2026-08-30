# vtrrk.in — Requirements

## 1. Functional Requirements

### FR-001 — Personal identity
The site shall clearly establish V.T.R. Ravi Kumar as the person behind the site.

### FR-002 — Primary navigation
The site shall provide clear navigation to the primary content areas: About, Now, Books, Writing, Projects, Photography, and Travel & Rides.

### FR-003 — Homepage
The homepage shall provide an editorial overview of Ravi and selected current work/content.

### FR-004 — About
The site shall support a narrative About page describing Ravi beyond a conventional résumé.

### FR-005 — Books
The site shall support first-class presentation of published books, including cover, description and relevant external purchase/read links.

### FR-006 — Writing
The site shall support a browsable collection of articles and individual article pages.

### FR-007 — Writing metadata
Articles shall support title, date, description, content, canonical URL and optional imagery/tags.

### FR-008 — Projects
The site shall support individual project descriptions and links, with project status/content able to evolve independently.

### FR-009 — Photography
The site shall provide a dedicated photography destination and support high-quality imagery.

### FR-010 — Travelogue
The site shall provide a dedicated Travel & Rides destination documenting Ravi's travel experiences.

### FR-011 — Travel places
The travelogue shall support individual pages/entries for countries or places visited.

### FR-012 — Travel narrative
Travel entries shall support personal narrative, visit period, trip context, observations and photography.

### FR-013 — Travel discovery
Users shall be able to browse or discover travel entries by place and, where useful, trip/year/category.

### FR-014 — Related content
Travel, writing, books, photography and projects should be linkable to related content where meaningful.

### FR-015 — Now
The current-focus content shall be independently maintainable and easy to update.

### FR-016 — External links
The site shall support links to relevant external platforms without depending on those platforms for core site functionality.

### FR-017 — Contact
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

### CR-005 — Image ownership
Where photography is hosted locally, image references and metadata shall be maintainable without depending on a third-party platform.

## 3. UX Requirements

### UX-001 — Responsive
The site shall work across desktop, tablet and mobile screen sizes.

### UX-002 — Clear hierarchy
Content hierarchy shall remain understandable without excessive visual decoration.

### UX-003 — Readability
Long-form pages shall provide comfortable typography, line length, spacing and navigation.

### UX-004 — Image presentation
Photography and travel imagery shall receive sufficient size and whitespace to remain visually meaningful.

### UX-005 — Navigation consistency
Header/footer behaviour shall remain consistent across pages.

### UX-006 — No unnecessary interaction
Animations and interactive elements shall be used only where they improve comprehension or navigation.

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
Structured data may be added where it provides genuine search value, especially for books, articles and personal identity.

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

## 8. Maintainability Requirements

### MAINT-001
Adding a new book should not require editing multiple unrelated components.

### MAINT-002
Adding a new writing article should not require rebuilding page layout logic.

### MAINT-003
Adding a new travelogue entry should not require redesigning the travel section.

### MAINT-004
Documentation shall describe the intended architecture and operating model.

### MAINT-005
The backlog shall remain the authoritative list of planned work.

## 9. V1 Acceptance Criteria

V1 is ready when:

- Primary site navigation is implemented and coherent.
- About, Books, Writing, Projects, Photography, Travel & Rides and Now have defined experiences.
- Published books are accurately represented.
- Writing supports real article pages rather than placeholder links.
- Travel supports a scalable travelogue model and at least the initial content structure.
- Responsive behaviour is acceptable on mobile and desktop.
- Accessibility and SEO fundamentals are implemented.
- No published section depends on empty placeholder links.
- Build and deployment are repeatable.
- Documentation and backlog accurately reflect the system.
