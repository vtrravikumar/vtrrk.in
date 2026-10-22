# Publishing a Travel Story or Destination

Travel publishing currently uses content files in the website repository. There is no dedicated travel publishing CLI like the Writing article CLI, and the photography publisher does not publish Travel content.

A Travel entry normally has two matching files: a YAML file containing structured trip metadata and a Markdown file containing the narrative. The public page is generated from these files when the site is built.

## 1. Open the repository

In Terminal:

    cd ~/LocalRepos/vtrrk.in

Use Node.js 22.12.0 or newer. Install dependencies if this is a fresh checkout:

    npm install

Before editing, check that the repository is in a known state:

    git status --short
    git branch --show-current

Do not mix a Travel publication with unrelated code or content changes.

## 2. Choose the correct content location

Travel files live under src/content/travel/.

- For an international destination, use the existing country folder and matching filenames. For example, the Italy entry uses src/content/travel/italy/italy.yaml and src/content/travel/italy/italy.md.
- For an Indian journey, use src/content/travel/india/<journey>/<journey>.yaml and the matching .md file. Existing examples include Varanasi and Amarnath.

If the destination already exists, edit its existing files instead of creating a duplicate. Check the URL and folder conventions before adding a new entry.

## 3. Edit the YAML metadata

The YAML file describes the destination and one or more visits. It begins with structured fields similar to this:

    title: Spiritual Varanasi
    country: India
    region: Uttar Pradesh
    continent: Asia
    status: visited
    content_status: draft
    banner: /images/travel/varanasi.jpg
    photography: []
    metadata: {}
    visits:
      - title: Photography and Dev Deepawali
        from: 2017-11-02
        to: 2017-11-05
        duration_days: 4
        travelled_with:
          - FSO photography group
        travel_type: flight
        solo: false
        origin: Sharjah, UAE
        route:
          - Sharjah
          - Varanasi
          - Sharjah
        places_visited:
          - Varanasi Ghats
          - Sarnath
        highlights:
          - Dev Deepawali and illuminated ghats
        flights: []
        accommodation: []
        transport:
          - walking
        stays: []
        occasion: Photography tour
        notes: A short factual note about this visit.

This is an illustrative example of the existing schema, not a requirement to fill every field. Use the actual facts for the trip and copy the structure from the closest existing destination file.

Important fields:

- title, country, region and continent identify the destination.
- content_status controls public visibility. Use draft while preparing the entry; use published only when it is ready to go live. If omitted, the schema defaults it to draft.
- banner points to an image under public/, commonly /images/travel/<name>.jpg.
- photography can contain labeled external links to relevant photographs.
- visits is a list, so the same destination can describe multiple trips. Include dates, companions, routes, places, highlights, transport, flights, accommodation and notes only where known and relevant.

Keep YAML indentation consistent (spaces, not tabs). Do not guess dates, flight details or other personal travel facts.

## 4. Write the narrative Markdown

Edit the matching .md file. Use Markdown headings and paragraphs to tell the story in your own voice. The page template handles the overall presentation and displays the narrative alongside relevant trip metadata.

A practical outline could be:

- Why the trip happened
- Arrival and first impressions
- Places and experiences
- Memorable moments or surprises
- What you would do differently
- Reflections after returning

This is an editorial aid, not a mandatory template. Let the actual trip determine the story. The Markdown filename and YAML filename must match, and both must be in the same destination folder.

## 5. Add or select a banner

Travel banners are stored under public/images/travel/. Prefer an existing appropriate banner when possible. If adding a new banner, ensure the path in the YAML points to the actual file.

The responsive-banner generator currently has a fixed list of known banner names. Do not assume it will automatically generate responsive variants for a new filename. If you need to change banner generation, review scripts/generate-travel-banners.mjs and its name list first.

## 6. Preview locally

Start the local development server:

    npm run dev

Open the local URL printed by Astro, then visit the expected Travel route. International destinations commonly use /travel/<country>/; Indian journeys commonly use /travel/india/<journey>/.

While content_status is draft, the entry is excluded from generated public Travel routes. To inspect it through the normal route, temporarily set it to published locally, preview, and then return it to draft before committing if it is not ready. Do not push a draft merely to preview it.

Stop the development server with Ctrl+C in its Terminal window.

## 7. Validate before publishing

There is no Travel-specific validation command today. Use the repository's existing checks:

    npm test
    npm run build
    git diff --check
    git status --short
    git diff -- src/content/travel/

Review the diff carefully. Confirm that the correct YAML and Markdown files changed, the dates and factual metadata are accurate, and any banner path exists. A successful build is important, but it does not prove the story reads well or every image looks right.

## 8. Publish the Travel entry

Only when the content is ready, set content_status: published in the YAML file.

Review the exact changed files, then stage only the intended Travel content and any new banner asset. For example, replace the paths below with your actual files:

    git add src/content/travel/italy/italy.yaml src/content/travel/italy/italy.md

If you added a banner, stage that specific file too. Check the staged changes before committing:

    git diff --cached --check
    git diff --cached --stat
    git diff --cached

When everything is correct:

    git commit -m "Publish travel story: Italy"
    git push origin main

These Git commands publish the commit to the repository and can trigger the site's configured deployment. They do not have the additional interactive safeguards built into article:publish or scripts/publish.sh. Ensure your branch is main, synchronized with GitHub, and contains no unrelated changes before you commit and push.

## 9. Verify the live page

After deployment finishes:

1. Open the destination's public URL.
2. Confirm the title, banner, story and trip details are correct.
3. Confirm links to photography work where provided.
4. Confirm the destination appears in the relevant Travel index and the Travel word cloud where applicable.

## Troubleshooting

- The page does not appear: check that content_status is published, the YAML is valid, and the files are in the expected path.
- The site build fails: inspect the build error and the last metadata or Markdown changes. Do not publish while the build is failing.
- The banner is missing: confirm the YAML path matches a file under public/. For responsive variants, check whether the banner name is included in scripts/generate-travel-banners.mjs.
- The route is unexpected: confirm the directory and filenames follow the existing international or India journey pattern.
- The story or metadata is not visible after pushing: wait for deployment to finish and check the deployed page again.

## Current limitation and improvement opportunity

Travel publishing is still more manual than article publishing: it requires editing paired YAML and Markdown files, and there is no dedicated Travel draft/preview/publish command. This guide documents the current process; it does not change that behaviour. A future usability improvement could add validation and safer publishing support without introducing a CMS or database.