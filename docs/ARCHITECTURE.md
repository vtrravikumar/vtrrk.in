# vtrrk.in — Architecture

## 1. Architectural Intent

The architecture should keep vtrrk.in simple, fast, portable and easy for one person to maintain.

The site is primarily a content-driven static website. It should avoid introducing infrastructure merely because it is technically possible.

## 2. Stack

- Astro for site generation and page composition.
- TypeScript for structured content and application logic.
- CSS for presentation.
- Markdown/content files for long-form publishing.
- Git/GitHub for source control and content ownership.
- Cloudflare Pages for deployment.

## 3. High-Level Model

```text
Owned Content
    |
    +-- Books
    +-- Writing
    +-- Projects
    +-- Travel
    +-- Photography
    +-- Now
    +-- Site/About
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
│   ├── layouts/
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

The exact directory structure may evolve as content collections and routes are added.

## 5. Content Architecture

Content should be modelled independently from visual components.

Current structured content is already separated into TypeScript modules for books, projects, site identity and writing. This pattern should be retained where it remains appropriate.

As long-form content grows, Markdown-based content collections are preferred for articles and travelogue entries because they are portable, version-controlled and easy to edit.

## 6. Proposed Content Types

### Site

Global identity, navigation, metadata, external links and current positioning.

### Book

- title
- subtitle
- description
- cover
- publication status
- publication date where relevant
- purchase/read links
- related content

### Writing

- title
- slug
- date
- description/dek
- body
- hero image where useful
- tags/categories where useful
- related content

### Project

- title
- slug
- short description
- longer description
- status
- links
- optional imagery
- related writing

### Travel

Travel should be modelled so that a trip can contain one or more places and a place can have its own durable story.

Potential fields:

- title
- slug
- country
- place
- region where useful
- visit date/period
- trip identifier where useful
- introduction
- narrative/body
- highlights
- observations
- practical notes
- photography
- related rides
- related writing

The model should not force every travel entry to contain every field. Personal storytelling takes precedence over form completeness.

### Photography

Photography may initially reference external collections, but the model should permit locally owned galleries/collections later.

## 7. Routing

The site should use clean, human-readable canonical URLs.

Illustrative target routes:

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
/photography/
/travel/
/travel/<slug>/
/contact/
/elsewhere/
```

Final route naming should be confirmed before implementation.

## 8. Rendering Strategy

Prefer static generation for public content.

Client-side JavaScript should be introduced only when a feature genuinely needs it.

The default page should remain usable with minimal or no client-side scripting.

## 9. Components

Reusable components should be introduced around genuine repeated patterns, for example:

- Header.
- Footer.
- Book card/presentation.
- Project summary.
- Writing preview.
- Travel preview.
- Image/gallery presentation.
- Metadata/SEO helpers.

Avoid turning every visual fragment into a component merely for abstraction.

## 10. Images

Images are important to the identity of the site.

Local images should live under `public/images/` or an appropriate Astro-managed asset structure depending on the final image pipeline.

Image handling should consider:

- responsive sizing
- compression
- appropriate formats
- meaningful alt text
- loading behaviour
- visual quality

Travel and photography pages may require a stronger image pipeline than the initial homepage.

## 11. SEO Architecture

A shared layout should provide consistent metadata foundations.

Page-level content should provide titles, descriptions and canonical URLs.

Specialised metadata/structured data can be added for books, articles, places and personal identity where useful.

## 12. Deployment Architecture

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

## 13. External Dependencies

The architecture should minimise runtime dependence on external services.

External links are acceptable for distribution and references. Core site content should remain available even if an external platform changes or disappears.

## 14. Future Architecture

Potential future additions include:

- richer image management
- search
- map-based travel discovery
- RSS/Atom feed
- newsletter
- CMS
- analytics
- more advanced structured data

None should be introduced until there is a demonstrated need.

## 15. Architectural Principles

1. Static first.
2. Content owned by the repository.
3. Minimal JavaScript.
4. Reusable components where useful.
5. Human-readable URLs.
6. Images treated as first-class content.
7. No backend without a real requirement.
8. Prefer simple solutions that can be maintained for years.
