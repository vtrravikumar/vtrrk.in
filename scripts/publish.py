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
import os
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

    print("Scanning photography source...")
    source_photos = [
        photo for photo in sorted(SOURCE.rglob("*"))
        if photo.is_file()
        and photo.suffix.lower() in SUPPORTED
        and not any(part in SKIP_DIRECTORIES for part in photo.relative_to(SOURCE).parts)
    ]
    print(f"Found {len(source_photos):,} source photograph(s).")
    print("Publishing derivatives...")

    existing_catalog = {}
    existing_catalog_path = OUTPUT / "catalog.json"
    if existing_catalog_path.is_file():
        try:
            existing_entries = json.loads(existing_catalog_path.read_text(encoding="utf-8"))
            existing_catalog = {
                entry["id"]: entry
                for entry in existing_entries
                if isinstance(entry, dict) and "id" in entry
            }
        except (json.JSONDecodeError, OSError):
            print("  Existing catalog could not be read; rebuilding published derivatives.")

    with tempfile.TemporaryDirectory(prefix="vtrrk-photography-") as temp_dir:
        temp_root = Path(temp_dir)
        temp_output = temp_root / "photography"
        temp_output.mkdir(parents=True, exist_ok=True)
        if OUTPUT.is_dir():
            for source_path in OUTPUT.rglob("*"):
                relative_path = source_path.relative_to(OUTPUT)
                target_path = temp_output / relative_path
                if source_path.is_dir():
                    target_path.mkdir(parents=True, exist_ok=True)
                elif source_path.is_file():
                    target_path.parent.mkdir(parents=True, exist_ok=True)
                    try:
                        os.link(source_path, target_path)
                    except OSError:
                        shutil.copy2(source_path, target_path)

        entries: list[dict[str, object]] = []
        current_ids: set[str] = set()
        skipped_count = 0
        regenerated_count = 0
        total_photos = len(source_photos)
        progress_step = max(1, total_photos // 20)

        for index, photo in enumerate(source_photos, start=1):

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

            entry_id = image_id(relative, category)
            source_stat = photo.stat()
            existing = existing_catalog.get(entry_id)
            can_reuse = (
                existing is not None
                and existing.get("source_size") == source_stat.st_size
                and existing.get("source_mtime_ns") == source_stat.st_mtime_ns
                and isinstance(existing.get("file"), str)
                and isinstance(existing.get("thumbnail"), str)
                and (OUTPUT / existing["file"]).is_file()
                and (OUTPUT / existing["thumbnail"]).is_file()
            )

            if can_reuse:
                entry = dict(existing)
                skipped_count += 1
            else:
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

                entry = {
                    "id": entry_id,
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
                    "source_size": source_stat.st_size,
                    "source_mtime_ns": source_stat.st_mtime_ns,
                }
                regenerated_count += 1

            current_ids.add(entry_id)
            entries.append(entry)

            if index == 1 or index % progress_step == 0 or index == total_photos:
                percent = (index / total_photos * 100) if total_photos else 100
                print(f"  Scanned {index:,} / {total_photos:,} ({percent:5.1f}%) — regenerated {regenerated_count:,}, reused {skipped_count:,}")

        for old_id, old_entry in existing_catalog.items():
            if old_id in current_ids:
                continue
            for key in ("file", "thumbnail"):
                old_file = old_entry.get(key)
                if isinstance(old_file, str):
                    stale_path = temp_output / old_file
                    if stale_path.is_file():
                        stale_path.unlink()

        catalog_path = temp_output / "catalog.json"
        catalog_path.write_text(json.dumps(entries, indent=2) + "\n", encoding="utf-8")

        if OUTPUT.exists():
            if not OUTPUT.is_dir():
                raise SystemExit(f"Output path is not a directory: {OUTPUT}")
            shutil.rmtree(OUTPUT)
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(temp_output), str(OUTPUT))

    print(f"Published {len(entries):,} photograph(s) to {OUTPUT}.")
    print(f"  Regenerated : {regenerated_count:,}")
    print(f"  Reused      : {skipped_count:,}")


if __name__ == "__main__":
    main()
