#!/usr/bin/env python3
"""Manage a private Travelogue download-code inventory in D1 and YAML."""

import argparse
import hashlib
import secrets
import subprocess
import tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path

ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ234567"
DATABASE = "vtrrk-travelogue"
INVENTORY_PATH = Path(__file__).with_name("travelogue-codes.yaml")
UNUSED_EXPIRY = "9999-12-31 23:59:59"


def make_code():
    groups = ["".join(secrets.choice(ALPHABET) for _ in range(4)) for _ in range(4)]
    return "VTR-" + "-".join(groups)


def sha256(value):
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def normalize_twitter_id(value):
    value = value.strip().lstrip("@").lower()
    if not value:
        raise ValueError("Twitter/X ID cannot be empty")
    return value


def sql_quote(value):
    return "'" + value.replace("'", "''") + "'"


def run_d1(command=None, sql_file=None):
    cmd = ["npx", "wrangler", "d1", "execute", DATABASE, "--remote", "--yes"]
    if command:
        cmd += ["--command", command]
    elif sql_file:
        cmd += ["--file", str(sql_file)]
    else:
        raise ValueError("A D1 command or SQL file is required")

    return subprocess.run(cmd, cwd=Path(__file__).resolve().parents[1], check=True)


def read_inventory():
    if not INVENTORY_PATH.exists():
        return []

    entries = []
    current = None
    for raw_line in INVENTORY_PATH.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if line.startswith("- code: "):
            if current:
                entries.append(current)
            current = {"code": line[len("- code: "):].strip(), "status": "unused", "twitter_id": None}
        elif current and line.startswith("status: "):
            current["status"] = line[len("status: "):].strip()
        elif current and line.startswith("twitter_id:"):
            value = line.split(":", 1)[1].strip()
            current["twitter_id"] = value or None
    if current:
        entries.append(current)
    return entries


def write_inventory(entries):
    lines = ["# PRIVATE — do not commit this file.", "codes:"]
    for entry in entries:
        lines.append(f"  - code: {entry['code']}")
        lines.append(f"    status: {entry['status']}")
        lines.append(f"    twitter_id: {entry.get('twitter_id') or ''}")
    INVENTORY_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def generate_codes(count):
    existing = {entry["code"] for entry in read_inventory()}
    generated = []
    while len(generated) < count:
        code = make_code()
        if code not in existing:
            existing.add(code)
            generated.append(code)
    return generated


def seed_codes(count):
    if INVENTORY_PATH.exists():
        raise SystemExit(
            f"{INVENTORY_PATH} already exists. Use --replenish instead of --init."
        )

    codes = generate_codes(count)
    entries = [{"code": code, "status": "unused", "twitter_id": None} for code in codes]

    with tempfile.NamedTemporaryFile("w", suffix=".sql", delete=False, encoding="utf-8") as handle:
        sql_path = Path(handle.name)
        for code in codes:
            handle.write(
                "INSERT INTO download_codes "
                "(code_hash, expires_at, issued_at) VALUES "
                f"({sql_quote(sha256(code))}, {sql_quote(UNUSED_EXPIRY)}, NULL);\n"
            )

    try:
        run_d1(sql_file=sql_path)
    finally:
        sql_path.unlink(missing_ok=True)

    write_inventory(entries)
    print(f"Created {count} unused Travelogue codes.")
    print(f"Inventory: {INVENTORY_PATH}")
    print("The codes are stored in D1 and the plaintext inventory stays local/private.")


def replenish_codes(count):
    entries = read_inventory()
    codes = generate_codes(count)

    with tempfile.NamedTemporaryFile("w", suffix=".sql", delete=False, encoding="utf-8") as handle:
        sql_path = Path(handle.name)
        for code in codes:
            handle.write(
                "INSERT INTO download_codes "
                "(code_hash, expires_at, issued_at) VALUES "
                f"({sql_quote(sha256(code))}, {sql_quote(UNUSED_EXPIRY)}, NULL);\n"
            )

    try:
        run_d1(sql_file=sql_path)
    finally:
        sql_path.unlink(missing_ok=True)

    entries.extend({"code": code, "status": "unused", "twitter_id": None} for code in codes)
    write_inventory(entries)
    print(f"Added {count} unused Travelogue codes.")


def issue_code(twitter_id, days):
    twitter_id = normalize_twitter_id(twitter_id)
    entries = read_inventory()

    for entry in entries:
        existing_id = entry.get("twitter_id")
        if existing_id and normalize_twitter_id(existing_id) == twitter_id:
            print(f"This Twitter/X ID already has a Travelogue code: {entry['code']}")
            return

    entry = next((item for item in entries if item["status"] == "unused"), None)
    if entry is None:
        raise SystemExit("No unused Travelogue codes remain. Run with --replenish COUNT.")

    code = entry["code"]
    issued_at = datetime.now(timezone.utc)
    expires_at = issued_at + timedelta(days=days)
    issued_sql = issued_at.strftime("%Y-%m-%d %H:%M:%S")
    expires_sql = expires_at.strftime("%Y-%m-%d %H:%M:%S")

    command = (
        "UPDATE download_codes SET "
        f"issued_at = {sql_quote(issued_sql)}, "
        f"expires_at = {sql_quote(expires_sql)} "
        "WHERE code_hash = "
        f"{sql_quote(sha256(code))} "
        "AND issued_at IS NULL AND redeemed_at IS NULL;"
    )
    run_d1(command=command)

    entry["status"] = "used"
    entry["twitter_id"] = twitter_id
    write_inventory(entries)
    print(f"Twitter/X ID: {twitter_id}")
    print(f"Code:         {code}")
    print(f"Expires:      {expires_sql} UTC")
    print("Status:       used")


def main():
    parser = argparse.ArgumentParser(description="Manage the Travelogue download-code inventory.")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--init", type=int, metavar="COUNT", help="Create the initial code inventory")
    group.add_argument("--replenish", type=int, metavar="COUNT", help="Add more unused codes")
    parser.add_argument("--days", type=int, default=7, help="Days a code remains valid after issue (default: 7)")
    parser.add_argument("twitter_id", nargs="?", help="Twitter/X ID to issue a code to")
    args = parser.parse_args()

    if args.days < 1:
        parser.error("--days must be at least 1")

    if args.init is not None:
        if args.init < 1:
            parser.error("--init must be at least 1")
        if args.twitter_id:
            parser.error("twitter_id cannot be used with --init")
        seed_codes(args.init)
    elif args.replenish is not None:
        if args.replenish < 1:
            parser.error("--replenish must be at least 1")
        if args.twitter_id:
            parser.error("twitter_id cannot be used with --replenish")
        replenish_codes(args.replenish)
    else:
        if not args.twitter_id:
            parser.error("twitter_id is required when issuing a code")
        issue_code(args.twitter_id, args.days)


if __name__ == "__main__":
    main()
