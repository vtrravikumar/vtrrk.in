# vtrrk.in — Product Specification

## 1. Purpose

vtrrk.in is the personal digital home of V.T.R. Ravi Kumar.

It should present the person first and his body of work second: engineering, books, writing, photography, travel, rides, and projects.

The site is intended to be personal, editorial, visual, calm, and durable rather than a conventional résumé, corporate portfolio, or social-media replacement.

## 2. Product Principles

- Person first; work second.
- Editorial rather than corporate.
- Personal rather than promotional.
- Visual rather than text-heavy.
- Simple rather than feature-heavy.
- Photography is part of the site's visual identity.
- Travel is a first-class expression of the person, not a generic travel-guide section.
- Rides are a related dimension of travel rather than a separate primary destination.
- Content should be owned and portable.
- The website is the canonical home; external platforms are distribution layers.
- The site should age well rather than depend on short-lived design trends.

## 3. Primary Audiences

The site should serve several overlapping audiences:

1. People who know Ravi and want to know what he is doing now.
2. Readers interested in his books and writing.
3. People interested in his engineering and technology work.
4. Fellow photographers, travellers, riders, and explorers.
5. People discovering Ravi through search or social platforms.
6. People who want a richer picture of his life and work than a résumé provides.

## 4. Information Architecture

Primary destinations:

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

Travel is a first-class primary destination. Rides are represented within or alongside travel content rather than as a separate primary navigation item.

The exact route structure may evolve, but every primary destination should have a clear canonical URL once implemented.

## 5. Homepage

The homepage is the editorial front door to the site.

It should provide:

- A concise personal introduction.
- A current Now section.
- Selected books.
- Selected projects.
- Selected writing.
- Photography presence.
- Travel presence, including riding where relevant.
- Links to relevant external platforms.

The homepage should create curiosity and provide clear paths deeper into the site without becoming a catalogue of everything Ravi has done.

## 6. About

The About experience should tell the story behind the person rather than reproduce a résumé.

It may include:

- Short biography.
- Engineering background.
- Transition across different interests and stages of life.
- Author identity.
- Photography, travel, and riding interests.
- Current perspective and what matters now.

The content should remain human and narrative.

## 7. Books

The site should treat Ravi's published books as first-class work.

Current published books:

- Engineering Home: Rediscovering the Engineer Beyond the Workplace
- Gen Z
- The White Envelope

Each book should eventually have a dedicated presentation containing, as appropriate:

- Cover.
- Title and subtitle.
- Description.
- Publication information.
- Purchase/read links.
- Relevant background or story.
- Optional reviews, excerpts, interviews, or related writing.

The site must not imply that unpublished or planned books are published.

## 8. Writing

Writing should become a first-class publishing area rather than a list of placeholder links.

The design should support essays, reflections, technical or engineering writing, book-related writing, and other long-form material.

Writing should be owned by the site and published from portable content formats such as Markdown unless a future requirement justifies another approach.

Each article should support:

- Title.
- Publication date.
- Short description/dek.
- Body content.
- Optional cover/hero image.
- Tags or categories where useful.
- Canonical URL.
- Appropriate metadata for sharing and search.

## 9. Projects

Projects should communicate what Ravi is building or exploring without turning the site into a software portfolio.

Current important projects include:

- Ride Together.
- VTR Press.
- HomeLab Engineering.

Project pages should explain the idea, motivation, current state, and relevant links. They should be able to evolve as projects evolve.

## 10. Photography

Photography is part of Ravi's identity and should be treated as a visual pillar of the site.

The site should eventually provide a meaningful photography experience rather than merely linking to an external profile.

The initial implementation may use external photography platforms, but the architecture should leave room for an owned gallery or curated collections later.

Photography should favour large, high-quality imagery and restrained presentation.

## 11. Travel

Travel is a first-class content area of vtrrk.in.

Ravi has travelled to roughly 20 countries over approximately the past 20 years. The site should document these experiences as an owned travelogue rather than merely presenting a list of destinations.

The current travel record identifies 20 countries as visited. The source list also contains additional status markers for destinations that are not part of the visited set. The original country/status record should be preserved as the source data for future travel content planning. fileciteturn22file0

### Travelogue goals

The travelogue should:

- Provide a visual overview of places visited.
- Give each significant place a meaningful, individual story/page.
- Capture Ravi's personal experience rather than generic tourist information.
- Combine narrative, photography, observations, practical details, and memorable moments where appropriate.
- Make it possible to discover travel by country/place and potentially by trip or year.
- Support future expansion without redesigning the information architecture.
- Preserve the distinction between places visited and places not visited.

### Travel content model

The travel experience should support a combination of:

1. **Country/place index** — a way to see where Ravi has travelled.
2. **Trips** — a way to group multiple places that formed part of one journey.
3. **Stories** — the actual personal narratives, which may be attached to a place, a trip, or both.

The visitor experience should therefore not reduce the travel history to a country checklist. The country/place view provides orientation; trips and stories provide the substance.

A place/travel entry may contain:

- Country.
- Place/city/region.
- Visited status.
- Date or period of visit.
- Trip context.
- Personal narrative.
- What stood out.
- Places or experiences worth remembering.
- Practical observations where useful.
- Photography.
- Related rides or routes where applicable.
- Links to related writing.

Not every entry needs every field. Personal storytelling takes precedence over form completeness.

### Travel and rides

Riding experiences should be represented as a related dimension of travel. A motorcycle journey may form a trip, a story, or a related element within a destination page.

The travel architecture must not assume that all travel is motorcycle travel.

### Travel status data

The supplied country list should ultimately become structured source data rather than being manually reproduced in page markup. The data should allow at least:

- country name
- region
- visited status
- optional visit years
- optional trip/story references
- optional photography references

Additional metadata can be added later without changing the basic model.

## 12. Now

Now is a deliberately current section describing what Ravi is focused on at the present time.

It should be easy to update without changing page structure or code unnecessarily.

It may reference active projects, writing, travel, photography, learning, or other current priorities.

## 13. External Presence

External platforms should be treated as extensions of the site rather than the canonical source of identity.

The site may link to platforms such as:

- X.
- Instagram.
- 500px.
- Amazon/book pages.
- GitHub.
- Other relevant platforms as needed.

External links should open safely where appropriate and should not make the site dependent on those platforms.

## 14. Contact

A simple contact path should exist when needed.

V1 should avoid a complex contact backend unless there is a clear requirement. An email or simple external contact mechanism is sufficient initially.

## 15. Visual Specification

The visual language should be:

- Quiet.
- Editorial.
- Modern.
- Personal.
- Photographic.
- Timeless.

Avoid:

- Corporate portfolio aesthetics.
- Generic developer portfolio layouts.
- Excessive card grids.
- Animated gradients.
- Stock imagery.
- Skill bars.
- Decorative animations without purpose.
- Feature clutter.

Photography should have enough visual space to breathe.

Typography, spacing, hierarchy, and image treatment should carry most of the design rather than decoration.

Travel pages should be particularly image-led while retaining strong narrative readability.

## 16. Content Model

Content should be separated from presentation wherever practical.

Initial content types:

- Site identity/settings.
- Books.
- Projects.
- Writing.
- Travel countries/places.
- Travel trips.
- Travel stories.
- Photography collections.
- Now entries.

Portable Markdown/TypeScript data is preferred initially. A CMS or database is not required for V1.

## 17. Technology

Target stack:

- Astro.
- TypeScript.
- CSS.
- Markdown/content files.
- Git/GitHub.
- Cloudflare Pages.

No database or CMS initially.

## 18. Deployment

Source repository:

`vtrravikumar/vtrrk.in`

Production domain:

`vtrrk.in`

Hosting target:

Cloudflare Pages.

The repository should remain the source of truth for site code and owned content.

## 19. V1 Boundaries

V1 should remain deliberately small and maintainable.

Not required initially:

- Authentication.
- Database.
- CMS.
- Comments.
- Newsletter infrastructure.
- E-commerce.
- Complex backend.
- Personalisation.
- User accounts.

These may be reconsidered only when a real use case emerges.

## 20. Quality Bar

Before V1 is considered complete, the site should be:

- Fully responsive.
- Accessible to a reasonable modern web standard.
- Fast on mobile and desktop.
- SEO-ready with sensible metadata and canonical URLs.
- Free of placeholder links/content in published sections.
- Visually coherent across all primary pages.
- Easy to update without unnecessary code changes.
- Deployable reproducibly from GitHub.
- Structured so future content can be added without redesigning the foundation.
