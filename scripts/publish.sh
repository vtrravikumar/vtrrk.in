#!/bin/bash

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SOURCE="/Volumes/photo/vtrrk-photography"
VENV="$ROOT/.venv-photo"

# Cloudflare Pages has a 20,000-file limit. Keep this as a visible capacity
# check so photography growth is caught before it becomes a deployment issue.
FILE_LIMIT=20000
WARNING_THRESHOLD=80

# Keep the publisher safe: never start a publish while local main and
# origin/main are out of sync. This prevents processing/committing a large
# photography change that cannot subsequently be pushed cleanly.
if [ "$(git branch --show-current)" != "main" ]; then
    echo "ERROR: Photography publishing must be run from the main branch."
    echo "Current branch: $(git branch --show-current)"
    exit 1
fi

if git status --porcelain | grep -qv "^...public/photography/"; then
    echo "ERROR: Working tree is not clean."
    echo "Commit or stash existing changes outside public/photography before publishing."
    git status --short
    exit 1
fi

echo "Checking GitHub synchronization..."
git fetch origin

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo
echo "ERROR: Local main is not synchronized with origin/main."
    echo
    echo "Local : $LOCAL"
    echo "Remote: $REMOTE"
    echo
    if git merge-base --is-ancestor "$REMOTE" "$LOCAL"; then
        echo "Your local branch is ahead of GitHub."
    elif git merge-base --is-ancestor "$LOCAL" "$REMOTE"; then
        echo "GitHub is ahead of your local branch."
    else
        echo "Local and GitHub histories have diverged."
    fi
    echo
    echo "No photography processing was started."
    echo "Synchronize the repository first, then run this script again."
    echo
    echo "Suggested commands:"
    echo "    git fetch origin"
    echo "    git rebase origin/main"
    echo
    exit 1
fi

if [ ! -d "$SOURCE" ]; then
    echo "Photography source is not available: $SOURCE"
    echo "Connect the NAS volume and try again."
    exit 1
fi

echo "VTRRK photography publisher"
echo "Repository: $ROOT"
echo "Source: $SOURCE"
echo

if [ ! -d "$VENV" ]; then
    echo "Creating photography Python environment..."
    python3 -m venv "$VENV"
fi

source "$VENV/bin/activate"

# Pillow handles the image processing; pillow-heif adds native HEIC/HEIF
# support so Apple/iPhone originals can be published without conversion.
python -m pip install --disable-pip-version-check -r <(printf 'Pillow>=11,<13\npillow-heif>=1.1,<2\n')

echo
echo "Publishing photography..."
python scripts/publish.py
echo

PHOTO_COUNT=$(find public/photography -type f \( -name '*.avif' -o -name '*.webp' \) | wc -l | tr -d ' ')
FILE_COUNT=$(find public/photography -type f | wc -l | tr -d ' ')
USAGE_PERCENT=$(awk -v count="$FILE_COUNT" -v limit="$FILE_LIMIT" 'BEGIN { printf "%.1f", (count / limit) * 100 }')

# A soft warning keeps the publisher successful while making capacity visible
# once the published photography approaches the Cloudflare Pages file limit.
if [ "$FILE_COUNT" -ge $((FILE_LIMIT * WARNING_THRESHOLD / 100)) ]; then
    CAPACITY_STATUS="⚠ Soft warning: approaching Cloudflare Pages file limit."
else
    CAPACITY_STATUS="✓ Within Cloudflare Pages limits."
fi

echo "Photography storage:"
echo "  Photographs : $PHOTO_COUNT"
echo "  Files       : $FILE_COUNT"
echo "  File limit  : $FILE_LIMIT"
echo "  Usage       : ${USAGE_PERCENT}%"
echo ""
echo "  $CAPACITY_STATUS"
echo

if [ -n "$(git status --porcelain -- public/photography)" ]; then
    echo "Committing published photography..."
    git add public/photography
    git commit -m "Publish photography"

    # GitHub may have changed while the photography was being processed.
    # Fetch again and only push if our new commit is directly on top of the
    # remote main. This avoids a surprise non-fast-forward push failure.
    echo "Checking GitHub again before push..."
    git fetch origin

    LOCAL_AFTER_COMMIT=$(git rev-parse HEAD)
    REMOTE_AFTER_COMMIT=$(git rev-parse origin/main)
    PARENT_AFTER_COMMIT=$(git rev-parse HEAD^)

    if [ "$PARENT_AFTER_COMMIT" != "$REMOTE_AFTER_COMMIT" ]; then
        echo
        echo "ERROR: GitHub changed while photography was being published."
        echo
        echo "Your photography commit is safe locally: $LOCAL_AFTER_COMMIT"
        echo "GitHub is now at: $REMOTE_AFTER_COMMIT"
        echo
        echo "The commit was NOT pushed. Synchronize first, then push/rebase"
        echo "the photography commit as appropriate."
        exit 1
    fi

    echo "Pushing published photography..."
    git push origin main
else
    echo "No photography changes to commit."
fi

echo
echo "Done."
