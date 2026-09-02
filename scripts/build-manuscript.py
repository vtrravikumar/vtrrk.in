#!/usr/bin/env python3
"""Build the VTR Press travelogue manuscript from the travel content tree.

The travel Markdown files remain the canonical story sources. Their companion
YAML files provide the book metadata used for grouping and sorting.

The generated manuscript is intentionally local-only; add manuscript.md to
.gitignore so rebuilding it never causes a website deployment.
"""

from __future__ import annotations

import re
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
MANUSCRIPT = ROOT / "manuscript.md"


class BuildError(Exception):
    pass


# VTR Press publishing metadata. These values belong to the book-level
# manuscript rather than to individual travel stories.
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

DEFAULT_STATIC_SECTIONS = {
    "Copyright": """First Edition — 2026

Copyright © 2026 V.T.R. Ravi Kumar

All rights reserved.

No part of this publication may be reproduced, stored in a retrieval system, or transmitted in any form or by any means, electronic, mechanical, photocopying, recording, or otherwise, without the prior written permission of the publisher, except for brief quotations used in reviews or scholarly works.

ISBN:""",
    "Dedication": """For my father,

whose faith in me

began long before mine did.""",
    "Thirukkural": """குறள்

:::verse

உள்ளியது எய்தல் எளிதுமன் மற்றுந்தான்

உள்ளியது உள்ளப் பெறின்.

:::

:::verse

What one has firmly resolved is easy to attain,

if the mind remains steadfast upon that purpose.

:::

— திருவள்ளுவர் (Thiruvalluvar)""",
    "Prologue": """I have never been very good at saying no to travel.

Sometimes the reason was a birthday. Sometimes New Year. Sometimes a colleague sent an email asking if I wanted to join a trip. Sometimes a visa was easy to obtain. Sometimes the plan was simply to get into the car and see where the road went.

Looking back, there was no single philosophy behind all these journeys. I travelled because I was curious. I wanted to see places I had never seen, photograph them, understand how they felt, and sometimes simply get away from the familiar.

The photographs are important, but they are not the whole story. What stays with me are the decisions made along the way: sleeping in a Tata Sumo because an Army checkpoint stopped us, changing hotels because the first one was in the wrong place, buying a train ticket at the last moment, discovering a waterfall through sugarcane plantations, losing a tripod from an auto-rickshaw, or taking a flight because a road trip had become impossible.

Travel also taught me that uncertainty is not always something to eliminate. Sometimes it is the thing that makes a journey interesting.

These are some of those journeys.""",
}


STATIC_SECTION_ORDER = ("Copyright", "Dedication", "Thirukkural", "Prologue")


def clean_heading(text: str) -> str:
    """Normalize a heading enough for use as a Markdown heading."""
    return text.strip().rstrip("#").strip()


def load_story(md_path: Path) -> dict:
    """Load one travel story and its companion YAML metadata."""
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
    }


def strip_frontmatter(text: str) -> str:
    """Remove YAML frontmatter if a source Markdown file contains it."""
    if not text.startswith("---"):
        return text

    match = re.match(r"\A---\s*\n.*?\n---\s*\n", text, flags=re.DOTALL)
    return text[match.end():] if match else text


def strip_first_h1(text: str) -> str:
    """Remove the source file's first H1; the YAML title becomes the chapter title."""
    lines = text.splitlines()
    for index, line in enumerate(lines):
        if re.match(r"^#\s+", line):
            del lines[index]
            while index < len(lines) and not lines[index].strip():
                del lines[index]
            break
    return "\n".join(lines).strip()


def convert_internal_headings(text: str) -> str:
    """Move source ##/### headings down to book scene level (####)."""
    converted = []
    for line in text.splitlines():
        match = re.match(r"^(#{2,3})(\s+.*)$", line)
        if match:
            heading = clean_heading(match.group(2))
            converted.append(f"#### {heading}")
        else:
            converted.append(line)
    return "\n".join(converted).strip()


def prepare_story(story: dict) -> str:
    text = story["md_path"].read_text(encoding="utf-8")
    text = strip_frontmatter(text)
    text = strip_first_h1(text)
    text = convert_internal_headings(text)
    return text


def discover_stories() -> list[dict]:
    stories = []
    for md_path in sorted(TRAVEL_ROOT.rglob("*.md")):
        stories.append(load_story(md_path))
    if not stories:
        raise BuildError(f"No travel Markdown files found under {TRAVEL_ROOT}")
    return stories


def sort_key(value: str) -> tuple[int, str]:
    """Sort named regions before empty/null regions, then alphabetically."""
    value = value.strip()
    return (0 if value else 1, value.casefold())


def build_travel_section(stories: list[dict]) -> str:
    grouped: dict[str, list[dict]] = {}
    for story in stories:
        grouped.setdefault(story["continent"], []).append(story)

    continents = sorted(grouped, key=str.casefold)
    sections: list[str] = []

    for number, continent in enumerate(continents, start=1):
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


def extract_static_sections(template: str) -> dict[str, str]:
    """Extract known book-level sections from the current manuscript.

    Existing local editorial text wins over defaults, so rebuilding the
    manuscript does not overwrite later edits to these sections.
    """
    lines = template.splitlines()
    sections: dict[str, str] = {}

    for index, line in enumerate(lines):
        match = re.match(r"^##\s+(.+?)\s*$", line)
        if not match:
            continue

        heading = clean_heading(match.group(1))
        if heading not in STATIC_SECTION_ORDER:
            continue

        body_lines = []
        for body_line in lines[index + 1:]:
            if re.match(r"^##\s+", body_line) or re.match(r"^##\s+[IVXLCDM]+\s+—\s+", body_line):
                break
            body_lines.append(body_line)

        body = "\n".join(body_lines).strip()
        if body:
            sections[heading] = body

    return sections


def build_book_header(template: str) -> str:
    """Build the VTR Press metadata and book-level front matter in order."""
    existing = extract_static_sections(template)
    parts = [BOOK_FRONT_MATTER, "# Travelogue"]

    for heading in STATIC_SECTION_ORDER:
        body = existing.get(heading, DEFAULT_STATIC_SECTIONS[heading])
        parts.append(f"## {heading}\n\n{body}")

    return "\n\n".join(parts)


def replace_travel_section(template: str, generated: str) -> str:
    """Replace the generated travel portion while preserving the epilogue onward."""
    lines = template.splitlines()

    start = next(
        (i for i, line in enumerate(lines) if re.match(r"^##?\s+Part\s+[IVXLCDM]+\s+—\s+", line)),
        None,
    )

    if start is None:
        start = next(
            (i for i, line in enumerate(lines) if re.match(r"^##\s+[IVXLCDM]+\s+—\s+", line)),
            None,
        )

    end = next((i for i, line in enumerate(lines) if re.match(r"^##\s+Epilogue\s*$", line)), None)

    if start is None or end is None or start >= end:
        raise BuildError(
            "manuscript.md must contain a generated travel section followed by '## Epilogue'. "
            "The first existing Part/continent heading is used as the replacement start."
        )

    header = build_book_header(template)
    suffix = "\n".join(lines[end:]).lstrip()
    return f"{header}\n\n{generated.rstrip()}\n\n{suffix}\n"


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
    template = MANUSCRIPT.read_text(encoding="utf-8")
    generated = build_travel_section(stories)
    result = replace_travel_section(template, generated)
    write_atomically(MANUSCRIPT, result)

    print(f"Built {MANUSCRIPT.relative_to(ROOT)}")
    print(f"Discovered {len(stories)} travel stories in {len(set(s['continent'] for s in stories))} continents:")
    for continent in sorted(set(s["continent"] for s in stories), key=str.casefold):
        count = sum(1 for s in stories if s["continent"] == continent)
        print(f"  {continent}: {count}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except BuildError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
