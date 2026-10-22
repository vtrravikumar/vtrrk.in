# Publishing a Writing Article

This guide takes an article from an idea to a live page on https://vtrrk.in. The article CLI handles repetitive publishing work so you can concentrate on writing.

## 1. Open the website repository

Open Terminal and run:

    cd ~/LocalRepos/vtrrk.in

Use Node.js 22.12.0 or newer. If this is a fresh checkout, install dependencies once:

    npm install

## 2. Create a private draft

For a new article, run this command with your title:

    npm run article:new -- --title "A considered title"

The command creates a Markdown draft in .local/writing-drafts/, using a filename derived from the title. This folder is Git-ignored, so a draft is not published just because you save it.

To start from an existing Markdown file instead:

    npm run article:new -- --source ./article.md

You can add a banner while creating the draft:

    npm run article:new -- --title "A considered title" --banner ./banner.jpg --alt "Describe what readers can see"

The image must be a valid supported image file and no larger than 10 MB. Use meaningful alt text. The command copies the image into the private draft assets.

## 3. Write and edit

Open the generated .md file in your preferred text editor. Its path will look like:

    .local/writing-drafts/a-considered-title.md

The file begins with YAML frontmatter between lines containing three hyphens. The CLI supplies defaults for the title, description, date and article type; review them and change the description if needed.

- title: article headline.
- description: short summary used for search and social previews.
- date: publication date.
- type: for example, Essay or Review.
- tags: optional list of tags.
- heroImage and heroImageAlt: optional banner and its accessible description.
- shareText: optional text for the X sharing link.
- glossaryTerms: approved glossary slugs only.

Write the article body below the closing frontmatter delimiter using Markdown headings, paragraphs, lists and links. Relative local image links are supported; the publishing tool checks and copies supported images into public assets. Give informative inline images alt text, for example:

    ![A street scene in Varanasi](./varanasi.jpg)

If you do not supply a banner, the shared banner at /images/travel/default.jpg is used.

## 4. Check the draft

Replace the example filename with your actual draft:

    npm run article:check -- .local/writing-drafts/a-considered-title.md

Fix every reported error before proceeding. Read warnings too; some describe defaults that will be applied during publication. The check can suggest glossary terms, but suggestions are not public automatically.

## 5. Preview the article locally

    npm run article:preview -- .local/writing-drafts/a-considered-title.md

Open the local URL printed by the command and review the layout, headings, links and images. The preview is marked noindex and excluded from production routes. Stop its background preview server when finished:

    npx astro dev stop

## 6. Publish when ready

Publication changes the public website, so do this only after reviewing the article and preview.

    npm run article:publish -- .local/writing-drafts/a-considered-title.md

The publisher validates the draft, asks which suggested glossary terms to approve and requests a definition for any new public glossary term. It then builds and tests the site, shows the proposed article and asset changes, and asks for explicit confirmation before committing and pushing.

For safety, publication requires a clean, synchronized main branch tracking origin/main. If a check fails, stop and resolve the reported issue; do not bypass the guard or stage unrelated changes.

## 7. Verify publication

The publisher attempts to verify the live article and banner. Also open the reported article URL and confirm:

- the article loads and formatting looks right;
- the banner and inline images load;
- the title, summary and social preview metadata look sensible;
- the article appears on the Writing index.

The URL normally has this shape:

    https://vtrrk.in/writing/a-considered-title/

A successful Git push starts the site's configured deployment, but deployment may take time. If the live page has not updated yet, check deployment status and try again after it completes.

## Useful commands

| Purpose | Command |
| --- | --- |
| Create a draft | npm run article:new -- --title "Your title" |
| List articles and local drafts | npm run article:list |
| Validate a draft | npm run article:check -- .local/writing-drafts/your-slug.md |
| Preview a draft | npm run article:preview -- .local/writing-drafts/your-slug.md |
| Publish a reviewed draft | npm run article:publish -- .local/writing-drafts/your-slug.md |
| Run tests | npm test |
| Build the site | npm run build |

## Troubleshooting

- The draft command says the slug already exists: choose a distinct title or inspect the existing article; the tool will not overwrite it.
- An image is rejected: check that the file exists, is a supported image format, has a matching extension and is at most 10 MB.
- A glossary suggestion looks wrong: do not approve it. Only approve terms you want public, and give each new term a meaningful definition.
- The publisher says the working tree is not clean: stop. Inspect git status and preserve or resolve existing changes before retrying.
- The publisher says main is out of sync: synchronize your checkout with GitHub before retrying; do not force-push.
- A publish fails or is interrupted: inspect git status and the command's final output before retrying. Keep the private draft and generated files until you understand the state.

Keep the draft private until the publish command reaches its explicit confirmation step.