#!/usr/bin/env python3
"""Build the VTR Press travelogue manuscript from the travel content tree.

Travel Markdown files remain the canonical story sources. Their companion
YAML files provide metadata used for grouping and sorting.

Book-level editorial content lives in publishing/travelogue-frontmatter.md.
The generated manuscript and VTR Press image copies are local-only.
"""

from __future__ import annotations

import re
import shutil
import sys
import tempfile
from pathlib import Path

try:
    import yaml
except ImportError:
    print("PyYAML is required. Install it with: python -m pip install pyyaml", file=sys.stderr)
    sys.exit(1)


ROOT = Path(__file__).resolve().parents[1]
TRAVEL_ROOT = ROOT / "src" / "content" / "travel"
FRONT_MATTER = ROOT / "publishing" / "travelogue-frontmatter.md"
MANUSCRIPT = ROOT / "manuscript.md"
BOOK_IMAGE_ROOT = ROOT / "assets" / "image"

BOOK_FRONT_MATTER = """<!--

Generated from:

manuscript.md

This file is the publishing source.

Only make formatting changes required by the publisher.

Editorial changes belong in the reading draft.

-->

---

# ------------------------------------------------------------------
# Book Identity
# ------------------------------------------------------------------

title: Travelogue
subtitle:
author: V.T.R. Ravi Kumar
type: book

# ------------------------------------------------------------------
# Publication
# ------------------------------------------------------------------

edition: Reading Draft
version: v1.0
copyright_year: 2026

# ------------------------------------------------------------------
# Layout
# ------------------------------------------------------------------

paper: A5
language: en

---"""


class BuildError(Exception):
    pass


def clean_heading(text: str) -> str:
    return text.strip().rstrip("#").strip()


def load_story(md_path: Path) -> dict:
    yaml_path = md_path.with_suffix(".yaml")
    if not yaml_path.exists():
        raise BuildError(f"Missing YAML metadata: {yaml_path.relative_to(ROOT)}")

    try:
        metadata = yaml.safe_load(yaml_path.read_text(encoding="utf-8")) or {}
    except yaml.YAMLError as exc:
        raise BuildError(f"Invalid YAML in {yaml_path.relative_to(ROOT)}: {exc}") from exc

    if not isinstance(metadata, dict):
        raise BuildError(f"YAML must contain a mapping: {yaml_path.relative_to(ROOT)}")

    continent = str(metadata.get("continent") or "").strip()
    region = str(metadata.get("region") or "").strip()
    country = str(metadata.get("country") or "").strip()
    title = str(metadata.get("title") or "").strip()
    banner = str(metadata.get("banner") or "").strip()

    nested_metadata = metadata.get("metadata") or {}
    story_title = ""
    if isinstance(nested_metadata, dict):
        story_title = str(nested_metadata.get("story_title") or "").strip()

    chapter_title = story_title or title or country or md_path.stem.replace("-", " ").title()

    if not continent:
        raise BuildError(f"Missing 'continent' in {yaml_path.relative_to(ROOT)}")
    if not chapter_title:
        raise BuildError(f"Missing story title in {yaml_path.relative_to(ROOT)}")

    return {
        "md_path": md_path,
        "continent": continent,
        "region": region,
        "country": country,
        "title": chapter_title,
        "banner": banner,
    }


def strip_frontmatter(text: str) -> str:
    if not text.startswith("---"):
        return text
    match = re.match(r"\A---\s*\n.*?\n---\s*\n", text, flags=re.DOTALL)
    return text[match.end():] if match else text


def strip_first_h1(text: str) -> str:
    lines = text.splitlines()
    for index, line in enumerate(lines):
        if re.match(r"^#\s+", line):
            del lines[index]
            while index < len(lines) and not lines[index].strip():
                del lines[index]
            break
    return "\n".join(lines).strip()


def convert_internal_headings(text: str) -> str:
    converted = []
    for line in text.splitlines():
        match = re.match(r"^(#{2,3})(\s+.*)$", line)
        if match:
            converted.append(f"#### {clean_heading(match.group(2))}")
        else:
            converted.append(line)
    return "\n".join(converted).strip()


def prepare_story(story: dict) -> str:
    text = story["md_path"].read_text(encoding="utf-8")
    return convert_internal_headings(strip_first_h1(strip_frontmatter(text)))


def discover_stories() -> list[dict]:
    stories = [load_story(path) for path in sorted(TRAVEL_ROOT.rglob("*.md"))]
    if not stories:
        raise BuildError(f"No travel Markdown files found under {TRAVEL_ROOT}")
    return stories


def sort_key(value: str) -> tuple[int, str]:
    value = value.strip()
    return (0 if value else 1, value.casefold())


def prepare_book_images(stories: list[dict]) -> dict[Path, str]:
    """Copy story banners into the local VTR Press image directory.

    Returns a mapping from story metadata identity to a relative Markdown image
    reference. Missing banners produce warnings rather than failing the build.
    """
    BOOK_IMAGE_ROOT.mkdir(parents=True, exist_ok=True)

    # Remove only previously generated book images. Never touch assets/book_cover.png.
    for path in BOOK_IMAGE_ROOT.iterdir():
        if path.is_file() or path.is_symlink():
            path.unlink()
        elif path.is_dir():
            shutil.rmtree(path)

    image_refs: dict[Path, str] = {}
    for story in stories:
        banner = story["banner"]
        if not banner:
            print(f"WARNING: No banner specified for {story['title']}", file=sys.stderr)
            continue

        # YAML stores website paths such as /images/travel/italy.jpg.
        if banner.startswith("/"):
            source = ROOT / "public" / banner.lstrip("/")
        else:
            source = ROOT / banner

        if not source.exists() or not source.is_file():
            print(
                f"WARNING: Banner not found for {story['title']}: {banner}",
                file=sys.stderr,
            )
            continue

        destination = BOOK_IMAGE_ROOT / source.name
        shutil.copy2(source, destination)
        image_refs[story["md_path"]] = f"assets/image/{destination.name}"

    return image_refs


def build_travel_section(stories: list[dict], image_refs: dict[Path, str]) -> str:
    grouped: dict[str, list[dict]] = {}
    for story in stories:
        grouped.setdefault(story["continent"], []).append(story)

    sections: list[str] = []
    for number, continent in enumerate(sorted(grouped, key=str.casefold), start=1):
        sections.append(f"## {roman(number)} — {continent}")
        continent_stories = sorted(
            grouped[continent],
            key=lambda story: (
                sort_key(story["region"]),
                story["country"].casefold(),
                story["title"].casefold(),
            ),
        )
        for story in continent_stories:
            sections.append(f"### {story['title']}")
            image_ref = image_refs.get(story["md_path"])
            if image_ref:
                sections.append(f"![{story['title']}]({image_ref})")
            body = prepare_story(story)
            if body:
                sections.append(body)

    return "\n\n".join(sections).rstrip() + "\n"


def roman(number: int) -> str:
    values = ((1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
              (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
              (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I"))
    result = []
    for value, numeral in values:
        while number >= value:
            result.append(numeral)
            number -= value
    return "".join(result)


def read_front_matter() -> str:
    if not FRONT_MATTER.exists():
        raise BuildError(f"Editable front matter not found: {FRONT_MATTER.relative_to(ROOT)}")

    text = FRONT_MATTER.read_text(encoding="utf-8").strip()
    first_line = text.splitlines()[0].strip()

    if first_line != "# Travelogue":
        raise BuildError("travelogue-frontmatter.md must begin with '# Travelogue'")
    if not re.search(r"^##\s+Prologue\s*$", text, flags=re.MULTILINE):
        raise BuildError("travelogue-frontmatter.md must contain '## Prologue'")
    return text


def build_book_header(front_matter: str) -> str:
    return f"{BOOK_FRONT_MATTER}\n\n{front_matter}"


def replace_generated_content(template: str, generated: str) -> str:
    lines = template.splitlines()
    start = next(
        (i for i, line in enumerate(lines) if re.match(r"^##\s+[IVXLCDM]+\s+—\s+", line)),
        None,
    )
    end = next((i for i, line in enumerate(lines) if re.match(r"^##\s+Epilogue\s*$", line)), None)

    if start is None or end is None or start >= end:
        raise BuildError(
            "manuscript.md must contain generated continent headings followed by '## Epilogue'."
        )

    suffix = "\n".join(lines[end:]).lstrip()
    front_matter = read_front_matter()
    return f"{build_book_header(front_matter)}\n\n{generated.rstrip()}\n\n{suffix}\n"


def write_atomically(path: Path, content: str) -> None:
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=path.parent, delete=False) as tmp:
        tmp.write(content)
        tmp_path = Path(tmp.name)
    tmp_path.replace(path)


def main() -> int:
    if not TRAVEL_ROOT.exists():
        raise BuildError(f"Travel content directory not found: {TRAVEL_ROOT}")
    if not MANUSCRIPT.exists():
        raise BuildError(f"Manuscript template not found: {MANUSCRIPT}")

    stories = discover_stories()
    image_refs = prepare_book_images(stories)
    template = MANUSCRIPT.read_text(encoding="utf-8")
    generated = build_travel_section(stories, image_refs)
    result = replace_generated_content(template, generated)
    write_atomically(MANUSCRIPT, result)

    continents = sorted(set(s["continent"] for s in stories), key=str.casefold)
    print(f"Built {MANUSCRIPT.relative_to(ROOT)}")
    print(f"Copied {len(image_refs)} travel banner images to {BOOK_IMAGE_ROOT.relative_to(ROOT)}")
    print(f"Discovered {len(stories)} travel stories in {len(continents)} continents:")
    for continent in continents:
        print(f"  {continent}: {sum(1 for s in stories if s['continent'] == continent)}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except BuildError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
