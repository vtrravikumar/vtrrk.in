#!/bin/bash

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SOURCE="/Volumes/photo/vtrrk-photography"
VENV="$ROOT/.venv-photo"

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
    git push origin main
else
    echo "No photography changes to commit."
fi

echo
echo "Done."
