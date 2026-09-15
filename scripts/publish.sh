#!/bin/bash

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SOURCE="/Volumes/photo/vtrrk-photography"
VENV="$ROOT/.venv-photo"

# Keep the publisher safe: never start a publish while local main and
# origin/main are out of sync. This prevents processing/committing a large
# photography change that cannot subsequently be pushed cleanly.
if [ "$(git branch --show-current)" != "main" ]; then
    echo "ERROR: Photography publishing must be run from the main branch."
    echo "Current branch: $(git branch --show-current)"
    exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
    echo "ERROR: Working tree is not clean."
    echo "Commit or stash existing changes before publishing photography."
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

python -m pip install -r <(printf 'Pillow>=11,<13\n')

echo
echo "Publishing photography..."
python scripts/publish.py

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
