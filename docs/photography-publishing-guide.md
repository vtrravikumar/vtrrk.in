# Publishing Photography

This guide describes the existing photography publisher used by https://vtrrk.in. It reads selected originals from the mounted photography volume, creates web-ready images and a catalog, and publishes changes to the website repository.

**Important:** this workflow can commit and push changes to the public site. Review the source folders before running it.

## 1. What you need

- A Mac with the vtrrk.in repository at ~/LocalRepos/vtrrk.in.
- The photography NAS/volume mounted at /Volumes/photo.
- The curated source directory at /Volumes/photo/vtrrk-photography.
- A working Git checkout on main, synchronized with origin/main.

Open Terminal:

    cd ~/LocalRepos/vtrrk.in

## 2. Prepare and curate photographs

The publisher reads image files from the mounted source directory. It supports JPEG, PNG, HEIC/HEIF, TIFF and WebP originals. It does not modify originals; it writes web derivatives and a catalog under public/photography/.

The expected folder layout is:

| Photo type | Source folder layout |
| --- | --- |
| Country/place photographs | countries/<country>/<place>/<photo> |
| Portraits | portraits/<photo> |
| Landscapes | landscapes/<photo> |
| Model photography | model/<model>/<photo> |
| Street photography | street/<photo> |
| Abstract photography | abstract/<photo> |

For example, a photo from Rome would be placed under a country/place path such as countries/italy/rome/IMG_1234.jpg. Follow the existing folder naming conventions in your curated archive.

Only put photographs you intend to publish in the source collection. The publisher scans supported images recursively, skips certain internal folders, and ignores files that do not match the expected category layout. Do not place private originals or unrelated images in the curated publishing folders.

The site catalog derives its initial title from the filename. Use descriptive filenames when practical. This workflow does not ask you to write a caption or detailed alt description for each image.

## 3. Check the repository before publishing

Run:

    git status --short
    git branch --show-current
    git fetch origin
    git status -sb

The publisher itself enforces these safety checks:

- it must run on main;
- there must be no unrelated working-tree changes (existing changes under public/photography/ are allowed);
- local main must match origin/main;
- the photography source volume must be available.

If any check fails, stop and resolve it before retrying. Do not force-push or stage unrelated work to get past a check.

## 4. Run the photography publisher

Use the shell wrapper, not the Python script directly:

    ./scripts/publish.sh

The wrapper checks Git synchronization and the mounted source directory, creates a local Python virtual environment if needed, installs image-processing dependencies, and runs the publishing script.

The script creates optimized AVIF images (with WebP fallback where needed), thumbnails, and public/photography/catalog.json. It reuses existing derivatives when source file metadata indicates they are still current, and builds the new output in a temporary directory before replacing the published photography directory.

Review the output summary, including the number of photographs, generated/reused files and Cloudflare Pages file-limit usage.

## 5. What happens next

If there are changes under public/photography/, the wrapper stages only that directory, creates a commit named Publish photography, fetches GitHub again and checks that the new commit is directly on top of the current remote main. It then pushes to GitHub.

If there are no photography changes, it reports that there is nothing to commit. A push triggers the site's configured deployment. The wrapper does not perform the same live-page verification as the article publisher.

## 6. Verify the result

After the command completes:

1. Confirm the final output says Done.
2. Open https://vtrrk.in/photography/.
3. Visit the relevant category, country/place or photo page.
4. Confirm the expected image and thumbnail appear.

If GitHub changed during processing, the script may leave a safe local commit that was not pushed. Read the error carefully, inspect git status and the latest commits, and synchronize deliberately before taking further action.

## Troubleshooting

- Photography source is not available: mount the NAS volume and verify that /Volumes/photo/vtrrk-photography exists.
- A photo is skipped: check that it is inside a supported category folder and that the folder depth matches the table above.
- The script says the branch is not main or GitHub is out of sync: stop and synchronize the repository before retrying.
- The Python environment or image library fails to install: keep the error output and resolve the environment/network issue before retrying.
- The published gallery looks unchanged: verify that the script found your source photo, reported a change or regenerated derivative, and the deployment completed.

## Quick reference

    cd ~/LocalRepos/vtrrk.in
    git status -sb
    ./scripts/publish.sh

Run the final command only after curating the intended images and confirming that the NAS is mounted.