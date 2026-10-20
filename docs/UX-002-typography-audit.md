# UX-002 — Site-wide typography audit

- Repository: `vtrravikumar/vtrrk.in`
- Audited baseline: `main` at the time of review, 20 October 2026
- Audit method: read-only source inspection; no code changes made during the audit
- Status: implementation and required verification complete; UX-002 Done; uncovered content-type limitations are documented below

## Summary

Typography is mostly defined in page-scoped Astro `<style>` blocks. The shared layer in `src/styles/global.css` sets a system font stack and global `h1`/`h2` rules, but does not establish a body font size or line-height baseline. The font stack includes “Plus Jakarta Sans” without loading it, so the actual face depends on fonts available on the visitor's system.

The highest-priority finding is a CSS cascade conflict: the global `h1` rule uses `!important`, overriding ordinary page-level `h1` declarations. The homepage and Vichar use their own important declarations to regain control. The source conflict is confirmed; the exact computed appearance and any clipping or wrapping issues require browser inspection.

## Findings

| Severity | Location | Finding | Recommended treatment |
| --- | --- | --- | --- |
| High | `src/styles/global.css` global `h1`; page-level `h1` selectors | Global `font-size: clamp(2.5rem, 5vw, 4rem) !important` overrides ordinary page declarations. Page declarations request sizes ranging approximately from `clamp(2.8rem, 6vw, 4.5rem)` to `clamp(3.5rem, 8vw, 7rem)`; the homepage and Vichar add their own important rules. | Introduce semantic typography roles and migrate in stages. Do not simply remove `!important` without checking current computed sizes and layouts. |
| Medium | `src/styles/global.css` body; page paragraph/content selectors | There is no shared body font-size or line-height. Introductory copy commonly uses 1.05–1.2rem and line-height 1.55–1.75; long-form paragraphs commonly use 1.03–1.08rem and line-height 1.8–1.85. About content uses 1.25rem/1.8. Other paragraphs may inherit browser defaults. | Set a body baseline near 1rem with a readable line-height, while retaining separate intro and long-form roles. |
| Medium | Page label, metadata and record selectors | Small labels range roughly from 0.68–0.85rem, with weights 600–800 and tracking 0.08–0.14em. Examples include travel metadata at 0.7rem, Vichar timestamps at 0.68rem and page labels around 0.78rem. | Define shared small-text and label roles. Preserve compact status labels and timestamps where density is intentional. |
| Medium | Global `h2` and local heading selectors | Global `h2` uses a 1.75–2.5rem clamp, while local roles range from compact 1.08–1.25rem headings to 3.5–4rem section/book headings. | Map headings to semantic roles such as section, card and compact-panel heading; do not force identical visual sizes based on the HTML tag alone. |
| Low | Page `h3` selectors; no shared lower-heading scale | Observed `h3` examples range from 0.9rem to 1.45rem, with no shared h3–h6 rules. No h4–h6 markup was found in the audited source. | Add a modest shared lower-heading baseline and preserve component-specific sizes where they support hierarchy. |
| Medium | `src/components/Header.astro`, `src/components/Footer.astro` | Header brand is 0.82rem, navigation 0.78rem, and footer text 0.85rem. At the 800px breakpoint the header stacks and nav spacing shrinks, but font sizes remain unchanged. | Consider a navigation role around 0.875rem; verify wrapping at narrow widths and browser zoom before changing it. |
| Medium | Photography landing/category/country pages and `src/pages/travel/[...slug].astro` | Some image-overlay headings request up to 7rem, while the global important h1 rule caps ordinary page h1 styling at 4rem. Travel detail headings use a different clamp and mobile treatment. | Treat image-overlay/display typography separately from page headings; verify wrapping and contrast on mobile. |
| Low | Repeated page-scoped style blocks | Similar heading and label styles are repeated across About, Now, Projects, Contact, Elsewhere, Writing, Travel and Photography, with small differences in size, line-height and tracking. | Consolidate incrementally after identifying which components share the same visual role. |

## Inventory snapshot

- **h1:** Global clamp `clamp(2.5rem, 5vw, 4rem) !important`. Page declarations commonly request 3–7rem, line-height 0.9–1.02 and tracking around -0.04em to -0.06em. The homepage intentionally uses a 4.2–8.5rem split-name hero with -0.075em tracking; Vichar has its own important clamp.
- **h2:** Global 1.75–2.5rem clamp; local roles range from compact 1.08–1.25rem headings to 3.5–4rem section headings.
- **h3:** No shared scale; examples range from 0.9–2rem.
- **h4–h6:** No rules or markup found in the audited source.
- **Body and long-form:** No shared base size/line-height. Editorial text is generally 1.03–1.08rem with 1.8–1.85 line-height and a 720px text measure in Writing/Travel story bodies.
- **Intro copy:** Commonly 1.05–1.2rem with 1.55–1.75 line-height; homepage intro uses a responsive 1.2–1.75rem size and 1.42 line-height.
- **Captions and metadata:** Photography captions around 0.85rem; article metadata around 0.78rem; travel record labels around 0.7rem.
- **Navigation and footer:** 0.78rem navigation, 0.82rem brand and 0.85rem footer text.
- **Controls:** Vichar controls use `font: inherit`; labels are around 0.75rem and helper text can be 0.67rem. Travelogue controls also inherit and use uppercase tracking.
- **Line length and tracking:** Long-form measures are generally 720px; intro measures are approximately 600–700px. Negative tracking is used for display text and positive tracking for labels.

## Proposed typography roles

These values are a starting proposal for review, not yet implemented.

| Role | Proposed size / line-height |
| --- | --- |
| Display heading | `clamp(3.25rem, 8vw, 7rem)` |
| Page heading | `clamp(2.5rem, 5.5vw, 4.5rem)` |
| Section heading | `clamp(1.75rem, 3.5vw, 2.75rem)` |
| Subsection/card heading | 1.125–1.5rem |
| Body | 1rem / 1.65 |
| Long-form body | 1.0625rem / 1.8 |
| Intro copy | `clamp(1.125rem, 1.5vw, 1.25rem)` / 1.6–1.7 |
| Small text/captions | 0.875rem |
| Labels | 0.75rem, medium/semi-bold, positive tracking |
| Navigation | 0.875rem |
| Controls | 1rem, consistently inherited |

## Intentional exceptions to preserve

- **Homepage display:** The split-name hero, oversized scale, tight tracking and short line-height are intentional brand treatment.
- **Vichar:** Product branding, Sanskrit text, tagline, compact controls and trust content have a distinct UI scale. Keep it role-based rather than forcing editorial page values onto it.
- **Book covers:** Cover lettering is part of the artwork and is not live page typography.
- **Photography and Travel:** Large labels over images, travel banner titles, tag-cloud variation and photo captions support the visual presentation. Keep overlay and metadata roles separate from prose roles.
- **Long-form articles:** Preserve the relationship between article imagery and the 720px copy measure.

## Staged implementation and verification

1. Add shared semantic typography role tokens and a body baseline without initially changing page-specific values.
2. Migrate standard page headings first, removing reliance on the global h1 `!important` only as part of that migration.
3. Migrate labels, metadata, navigation and controls in separate batches. Keep Vichar and image-overlay roles explicit.
4. Verify mobile widths, especially 430–700px and the 320px minimum viewport. Check long photography place names, book titles and article headlines.
5. Check long-form readability and text measure, browser zoom/reflow, nav wrapping, form controls, and captions.
6. Run route regression checks across homepage, Vichar, Books, Writing, Travel, Photography and supporting pages; compare desktop and mobile layouts.

## Limitations

This audit confirms source declarations and CSS cascade behaviour. It does not confirm visual clipping, awkward wrapping, or readability in a rendered browser. Those require viewport-based inspection. No files were changed during the read-only audit.


## Agreed direction and implementation scope (20 October 2026)

Ravi's decisions for UX-002:

- **Font strategy:** Keep the system font stack. Do not add or download a web font as part of this task. The existing unused “Plus Jakarta Sans” entry should be reviewed and either removed or clearly documented if it is not actually loaded; do not introduce a font asset.
- **Approach:** Use a balanced, shared semantic typography system. Establish consistent body defaults and shared visual roles, migrate ordinary page typography in focused batches, and preserve intentional display styles.
- **Scope state:** The direction is agreed. The implementation scope below is prepared for review; no implementation code has been changed as part of this planning update.

### Proposed implementation scope for approval

1. **Shared foundation:** Review src/styles/global.css and define a small set of CSS custom properties and/or semantic utility roles for display, page, section and card headings; body, intro and long-form copy; small text/captions; labels; navigation; and controls. Use the existing system font stack.
2. **Body baseline:** Introduce a consistent body font-size and line-height baseline, with explicit long-form and intro roles. Keep the established 720px long-form text measure unless browser review demonstrates a specific problem.
3. **Heading cascade:** Resolve the global h1 !important conflict as part of a deliberate migration, not as an isolated deletion. Standard page headings should use the page-heading role; large section headings and image overlays should use explicit display roles rather than depending on the HTML tag alone.
4. **Focused migration:** Update ordinary page headings and repeated typography patterns across the site in small, reviewable batches. Then handle labels/metadata, navigation, captions and controls. Avoid blanket rules that force every instance of an HTML heading tag to look the same.
5. **Preserved exceptions:** Keep the homepage split-name hero and its tight display styling; Vichar's distinct product/Sanskrit typography and compact UI; book-cover artwork; Photography and Travel image-overlay titles, tag-cloud variation and photo captions; and the long-form image/text-measure relationship.
6. **Validation:** Run repository tests and the production build; check whitespace/diff quality and route coverage. Inspect desktop and narrow viewports (including 320px and 430–700px), long place/book/article titles, navigation wrapping, controls/captions, browser zoom/reflow and long-form readability. Automated build success alone is not visual verification.
7. **Out of scope:** No redesign, new font, typography-only content edits, Vichar feature changes, image/artwork changes, or unrelated refactoring. Do not mark UX-002 Done until implementation checks and the required visual review are recorded.

### Proposed execution sequence

- **Pass A — Foundation:** Add the shared tokens/roles and body baseline while preserving current page-specific appearance wherever possible.
- **Pass B — Standard headings:** Migrate standard page headings and remove the conflicting global h1 !important behaviour only when the relevant pages have explicit roles.
- **Pass C — Supporting text:** Consolidate repeated intro, long-form, label/metadata, navigation, caption and control styles where the visual role genuinely matches.
- **Pass D — Regression review:** Build/test, inspect the diff and routes, then perform viewport-based visual checks and adjust only demonstrated regressions.

The exact token values are a starting point based on the proposed scale above and should be confirmed against the current source and rendered layouts during implementation. This scope is a proposal for review, not authorization to begin coding.

## Implementation record (20 October 2026)

Implementation was made on `main` after synchronization to `5d719da525a6d1a608e54814c1fee184702ca229`. The implementation and required verification are complete; UX-002 is **Done**. The remaining coverage limitations are recorded below and do not imply that every content variation or every page's keyboard sequence was tested.

### Changes

- Added documented CSS custom properties and semantic classes for display, page, section, card, body, intro, long-form, small text, labels, metadata, navigation and controls in `src/styles/global.css`.
- Set the body baseline to `1rem` and `1.65` line-height. Kept the system font stack and removed its unused “Plus Jakarta Sans” entry; no font was added.
- Assigned explicit page-heading roles to standard page h1s and explicit editorial/travel roles to dynamic photography and travel headings. Preserved locally defined line-height, tracking, responsive layouts, cover artwork and crops.
- Removed the global `h1 !important` rule after migrating all Astro h1s and the Travel Markdown h1s. The homepage and Vichar main heading retain their existing important, page-specific display rules. Photo-detail h1s retain `.sr-only`.
- Kept navigation at its existing `.78rem` size through a semantic role; the proposed `.875rem` increase was not adopted without visual evidence. Footer typography and compact labels remain page/component-specific.
- In `src/pages/travel/[...slug].astro`, replaced the hidden story-content Markdown h1 treatment with a distinct `1.75rem` story heading. Both the template title and Markdown heading remain, as approved. Their duplicate h1 semantics are an existing separate issue and were not changed here.

### Automated/source verification

- `npm run build`: **passed**, producing 479 static pages in the latest build.
- A read-only parser run on the earlier 476-page build inspected generated `index.html` pages and classified 501 h1 elements by their actual markup role: 19 `type-page-heading`, 40 `type-editorial-heading`, 26 `type-travel-heading`, 388 visually hidden photo-detail h1s, 1 homepage display exception, 1 Vichar display exception, and 26 Travel Markdown headings governed by `.story :global(h1)`. It found zero unclassified headings. This checks rendered class/route markup against the corresponding source role selectors; it does not prove computed visual output for every page or breakpoint. The 26 story headings are classless but receive explicit size, line-height and tracking from the story selector; they coexist with a template h1, preserving the existing duplicate-h1 semantic structure without relying on browser heading-size defaults. The latest build generated 479 pages; this parser count is from the earlier build and was not rerun against the latest output.
- Confirmed representative generated paths for homepage, About, Books index/details/Travelogue, Writing index, Travel landing/India/story, Photography landing/place/photo detail, Projects, Vichar and Vichar privacy.
- Two separate pre-existing routing fixes were included in the same working tree: `src/content.config.ts` now uses the repository's Astro glob loader for the writing collection, generating all three writing detail routes; `src/pages/books/[slug].astro` excludes the `travelogue` slug so the dedicated `/books/travelogue/` route is its sole owner. The earlier missing-collection and Travelogue route-conflict warnings are resolved.
- `git diff --check`: **passed**.
- No test or lint script is defined in `package.json`; no `.github/workflows` directory is present on this branch.

The latest build generated the three writing detail routes and the dedicated Travelogue route without the prior collection and route-conflict warnings. Those routing changes are independent fixes for pre-existing issues, not typography changes. The latest build count and resolved-route results supersede the earlier 476-page build and warning report above.

### Browser verification record (partial)

Browser inspection of the built site used the browser's default light color scheme (confirmed by `matchMedia`). The default desktop viewport was 1280px; required responsive widths were checked explicitly at 320px, 430px, 600px, 700px and 800px:

- Homepage at desktop and 320px: split-name hero remains oversized; header links wrap into two rows on the narrow view; the 320px document has no horizontal overflow.
- About long title at 320px, 430px, 600px, 700px and 800px: title wraps to three lines at 320px and two at 430–700px; no document overflow. Footer stacks below 600px and returns to a horizontal layout at 700px and 800px. Header links wrap at 320px/430px and fit on one row at 600px and above in the inspected pages.
- `/books/` at 320px and 800px, and Engineering Home, Gen Z, and The White Envelope detail pages at 430px: headings and cover layouts fit; cover images had the expected alt text; The White Envelope retains its `cover-crop` class. On the list page at 320px the below-the-fold lazy images had not loaded yet; at 800px the White Envelope image was loaded. `/books/travelogue/` at 430px and 600px: controls render at 16px; no overflow.
- `/travel/` at 430px: tag cloud retains varied sizes and rotations, including the long “Arul Migu Navashakti Vinayagar Temple” tag; no overflow. `/travel/india/` at 700px shows image banners with adjacent card titles. `/travel/india/varanasi/` at 320px and `/travel/united-kingdom/` at 320px show both the template and story headings, with the story heading at 28px; both fit without horizontal overflow.
- `/photography/countries/india/` at 430px (screenshot confirmed image-card title overlay) and 800px (heading and document width): no overflow. `/photography/photo/india-varanasi-5dm-8309-349b37d525/` at 430px: photo and caption render, with the caption at 13.6px and 22.44px line-height.
- `/vichar/` at 320px and 700px: distinct product/Sanskrit heading, compact controls and form layout render; `/vichar/privacy/` at 430px uses the page-heading role. `/contact/` at 320px fits.
- Long-form Writing: `/writing/recovery-is-an-engineering-skill/` was inspected at 1280px, 800px and 430px. Paragraphs use the shared `type-longform` role, measured at 17px font size / 30.6px line-height. The content measure is 720px at desktop/tablet and 398px at 430px; the page remained readable without horizontal overflow or an observed layout regression. The three available writing samples contain no in-body images, lists, blockquotes, links or headings, so those article styles and image/text relationships were not exercised by this check.
- Keyboard focus: homepage Tab traversal covered the skip link, brand, navigation, page links, book links and footer links; the skip link showed its visible focus outline, Enter activated it, and Enter on Books navigated successfully. Shift+Tab returned through footer links. On Vichar, keyboard traversal reached the topic selector, location field, recent-news checkbox, Create ideas button and footer links. Space toggled the checkbox on and back off; the generation button was not activated. No trap was found in the controls actually traversed. Full keyboard traversal across every page was not completed.

**Overflow recheck:** `/vichar/` measured 341px document width at 320px and 721px at 700px. In both cases `.hero::before` has `inset: 0 -32px`, its parent overflows by 32px, and the document extends 21px beyond the viewport. These values match the earlier browser report. The Vichar page file is unchanged; the only Vichar-relevant global change is the approved body baseline/removal of global h1 sizing, neither of which changes the decorative pseudo-element inset or parent width. This is an existing overflow, not a demonstrated UX-002 regression, and it was left untouched.

### Final user-confirmed visual verification

After the earlier browser session, the user confirmed that representative site pages were checked in Chrome at actual 200% zoom and appeared correct, with no apparent clipping, overlap or horizontal scrolling. The user also confirmed that dark-mode visual verification passed and keyboard navigation looked good, including the previously traversed homepage navigation and Vichar form controls. These are user-reported visual results; the earlier browser automation could not change zoom or emulate dark mode, so it did not produce independent measurements for those checks. The exact inventory of pages inspected at 200% and in dark mode was not supplied, and this record does not imply every route was individually tested in those states.

**Coverage limitations:** Full keyboard traversal across every page was not completed. The article check did not exercise images, lists, blockquotes, links or in-body headings because those elements are absent from the available writing samples. These content-specific styles remain unverified on article examples. The previously documented responsive browser inspections and long-form measurements remain source/browser observations for the routes and widths listed above. Navigation remains at `.78rem`; the proposed `.875rem` increase was not adopted.

UX-002 is marked **Done** based on the implemented shared typography system, successful build and route checks, responsive and long-form browser checks, and the user's final confirmation of 200% zoom, dark mode and keyboard behavior. This closure records the agreed verification scope; it does not claim exhaustive coverage of every route, keyboard path or possible article content type.

The final `npm run build` passed with 479 generated pages; the two earlier routing warnings are resolved. `git diff --check` passed. No commit, push or deployment was made.
