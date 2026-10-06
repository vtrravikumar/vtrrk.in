# vtrrk.in

The personal website of **V.T.R. Ravi Kumar** — bringing together writing, travel, photography, books, and personal projects in one place.

**Live site:** https://vtrrk.in

## About

`vtrrk.in` is the source repository for Ravi Kumar's personal website. It is intended to be more than a static portfolio: it is the public home for a growing body of work across photography, travel writing, books, and engineering projects.

The site is designed so that individual projects can evolve independently while sharing a consistent personal identity and presentation.

## What lives here

The website currently brings together:

- **Photography** — a curated collection of photographs organised initially by country and place, with room to expand into categories such as people, street, landscape, models, and abstract work.
- **Travel** — travel stories and the associated travelogue material.
- **Books** — information and supporting material for Ravi's published and developing books.
- **Writing** — essays, notes, and other personal writing.
- **Projects** — selected engineering and personal projects.
- **Vichar** — a human-controlled AI writing companion for turning ideas into concise posts.

## Repository architecture

The repository is an **Astro** website with supporting publishing and server-side functionality.

```text
vtrrk.in/
├── src/                 # Website pages, layouts and components
├── public/              # Public static assets
├── assets/              # Site assets
├── functions/           # Server-side / platform functions
├── publishing/          # Publishing-related workflows and data
├── docs/                # Project documentation
├── scripts/             # Development and publishing utilities
├── README.md            # This document
├── SITE.md              # Site structure and content notes
└── backlog.md           # Development backlog
```

The exact structure evolves as the site develops; the documentation files in the repository are the authoritative reference for implementation-specific decisions.

## Photography

Photography is deliberately separated from the main website source.

The curated, web-ready photography collection is maintained in the companion repository:

**vtrrk-photography** — https://github.com/vtrravikumar/vtrrk-photography

The master archive of original high-resolution photographs remains outside GitHub. Only the photographs selected for web publication and the metadata required to present them belong in the publishing workflow.

The intended model is:

```text
Master photo archive
        ↓
Curate photographs
        ↓
vtrrk-photography
        ↓
Generate catalog / web assets
        ↓
vtrrk.in
        ↓
Public photography portfolio
```

This keeps the website repository manageable even though the underlying photography archive is very large.

## Books and publishing

Book production is handled separately through **VTR Press**:

https://github.com/vtrravikumar/vtr-press

VTR Press provides the publishing pipeline for structured Markdown manuscripts and supports outputs such as PDF and EPUB. The website may publish selected book information and supporting material, but the manuscript and publishing engine remain separate concerns.

## Development

Install the Node.js dependencies:

```bash
npm install
```

Run the site locally:

```bash
npm run dev
```

Build the production site:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The repository includes an `.nvmrc` file to identify the intended Node.js environment.

## Content and source-of-truth principles

The project follows a few important rules:

1. **Content should remain independent of presentation.**
2. **Large master archives should not be copied into the website repository.**
3. **Generated files should not be treated as primary source material.**
4. **Private inventories, credentials, and environment configuration must remain outside the public repository.**
5. **Reusable publishing workflows should live in their appropriate project rather than being duplicated unnecessarily in the website.**

## Security

This is a public repository. Do not commit:

- API keys or access tokens
- passwords or credentials
- `.env` files or production secrets
- private download-code inventories
- private personal data
- uncurated master photography archives

Local and private configuration is excluded through `.gitignore` where appropriate.

If a secret is ever committed accidentally, removing it from the latest version is not sufficient; the credential should be revoked/rotated and the Git history should be reviewed.

## Project status

`vtrrk.in` is an actively evolving personal website. The architecture is intentionally being developed incrementally as new sections and publishing workflows are added.

Current areas of development include:

- expansion of the photography portfolio;
- scalable, paginated photography presentation;
- integration of curated photography metadata;
- continued refinement of travel and book content;
- improvements to the publishing workflow;
- documentation and maintenance of the site's underlying architecture.

## Related repositories

- **vtrrk-photography** — curated photography publishing source
- **vtr-press** — book and technical-document publishing engine
- **HomeLab-Engineering** — working repository for the HomeLab book/project

## Philosophy

The website is a living record of the things Ravi Kumar chooses to build, write, photograph, and publish.

The goal is not to create a technology showcase for its own sake, but a durable personal archive that can grow with the work.

---

© V.T.R. Ravi Kumar


## Vichar

Vichar — By VTRRK is available at https://vtrrk.in/vichar/. It generates concise, personalized drafts for review and manual publication on X. The website integration is documented in `docs/VICHAR.md`; the backend/product implementation is maintained separately in the Vichar/TweetPilot repository.
