#!/usr/bin/env python3
"""Publish curated photography from the local NAS into vtrrk.in.

The NAS is the source of truth. This script reads originals from:
    /Volumes/photo/vtrrk-photography

It writes only web-ready derivatives and catalog.json into:
    public/photography/

The publication is built transactionally in a temporary directory. If any
source image fails, the existing website photography remains untouched.
"""

from __future__ import annotations

import hashlib
import json
import re
import shutil
import tempfile
from pathlib import Path

from PIL import Image, ImageOps
import pillow_heif

SOURCE = Path("/Volumes/photo/vtrrk-photography")
OUTPUT = Path("public/photography")
SUPPORTED = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".tif", ".tiff", ".webp"}
CATEGORIES = {"countries", "portraits", "landscapes", "model", "street", "abstract"}
SKIP_DIRECTORIES = {".git", "published", "catalog", "scripts", ".venv", ".venv-photo"}
WEB_MAX = 2400
THUMB_MAX = 600

# Register HEIC/HEIF support with Pillow so iPhone/Apple photos can be
# processed directly from the NAS without modifying the originals.
pillow_heif.register_heif_opener()


def slug(value: str) -> str:
    value = value.strip().lower().replace("_", "-")
    return re.sub(r"[^a-z0-9]+", "-", value).strip("-")


def image_id(relative: Path, category: str) -> str:
    id_path = relative.relative_to(category) if category == "countries" else relative
    digest = hashlib.sha1(id_path.as_posix().encode("utf-8")).hexdigest()[:10]
    parts = [slug(part) for part in id_path.parts[:-1]]
    prefix = "-".join(parts + [slug(id_path.stem)])
    return f"{prefix}-{digest}"


def save_derivative(source: Path, destination: Path, max_size: int) -> str:
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        destination.parent.mkdir(parents=True, exist_ok=True)

        avif_path = destination.with_suffix(".avif")
        try:
            image.save(avif_path, format="AVIF", quality=65, speed=6)
            return avif_path.suffix
        except (KeyError, OSError):
            webp_path = destination.with_suffix(".webp")
            image.save(webp_path, format="WEBP", quality=82, method=6)
            return webp_path.suffix


def main() -> None:
    if not SOURCE.is_dir():
        raise SystemExit(
            "Photography source is not available. "
            f"Connect the NAS volume and make sure {SOURCE} exists."
        )

    with tempfile.TemporaryDirectory(prefix="vtrrk-photography-") as temp_dir:
        temp_root = Path(temp_dir)
        temp_output = temp_root / "photography"
        temp_output.mkdir(parents=True, exist_ok=True)
        entries: list[dict[str, object]] = []

        for photo in sorted(SOURCE.rglob("*")):
            if not photo.is_file() or photo.suffix.lower() not in SUPPORTED:
                continue

            relative = photo.relative_to(SOURCE)
            if any(part in SKIP_DIRECTORIES for part in relative.parts):
                continue
            if not relative.parts or relative.parts[0] not in CATEGORIES:
                print(f"Skipping {relative}: expected a supported category folder")
                continue

            category = relative.parts[0]
            parts = relative.parts

            if category == "countries":
                if len(parts) < 4:
                    print(f"Skipping {relative}: expected countries/<country>/<place>/<photo>")
                    continue
                country, place = parts[1], parts[2]
                model = ""
                target_base = temp_output / "countries" / slug(country) / slug(place) / slug(photo.stem)
            elif category == "model":
                if len(parts) < 3:
                    print(f"Skipping {relative}: expected model/<model>/<photo>")
                    continue
                model = parts[1]
                country = ""
                place = ""
                target_base = temp_output / "model" / slug(model) / slug(photo.stem)
            else:
                if len(parts) != 2:
                    print(f"Skipping {relative}: expected {category}/<photo>")
                    continue
                country = ""
                place = ""
                model = ""
                target_base = temp_output / category / slug(photo.stem)

            extension = save_derivative(photo, target_base, WEB_MAX)
            thumb_extension = save_derivative(
                photo, target_base.with_name(target_base.name + "-thumb"), THUMB_MAX
            )

            published_file = target_base.with_suffix(extension).relative_to(temp_output).as_posix()
            thumbnail_file = (
                target_base.with_name(target_base.name + "-thumb")
                .with_suffix(thumb_extension)
                .relative_to(temp_output)
                .as_posix()
            )

            with Image.open(photo) as image:
                width, height = ImageOps.exif_transpose(image).size

            entries.append(
                {
                    "id": image_id(relative, category),
                    "file": published_file,
                    "thumbnail": thumbnail_file,
                    "country": slug(country),
                    "place": place,
                    "model": model,
                    "title": photo.stem,
                    "width": width,
                    "height": height,
                    "categories": [category],
                    "published": True,
                }
            )

        catalog_path = temp_output / "catalog.json"
        catalog_path.write_text(json.dumps(entries, indent=2) + "\n", encoding="utf-8")

        if OUTPUT.exists():
            if not OUTPUT.is_dir():
                raise SystemExit(f"Output path is not a directory: {OUTPUT}")
            shutil.rmtree(OUTPUT)
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(temp_output), str(OUTPUT))

    print(f"Published {len(entries)} photograph(s) to {OUTPUT}.")


if __name__ == "__main__":
    main()
