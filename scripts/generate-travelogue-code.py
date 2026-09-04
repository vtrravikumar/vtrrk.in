#!/usr/bin/env python3
"""Generate a one-time Travelogue download code and its D1 INSERT statement."""

import argparse
import hashlib
import secrets
from datetime import datetime, timedelta, timezone

ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ234567"


def make_code():
    groups = ["".join(secrets.choice(ALPHABET) for _ in range(4)) for _ in range(4)]
    return "VTR-" + "-".join(groups)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--days", type=int, default=7, help="Days until the code expires (default: 7)")
    args = parser.parse_args()

    if args.days < 1:
        parser.error("--days must be at least 1")

    code = make_code()
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    expires_at = (datetime.now(timezone.utc) + timedelta(days=args.days)).strftime("%Y-%m-%d %H:%M:%S")

    print(f"Code:       {code}")
    print(f"Expires:    {expires_at} UTC")
    print()
    print("Run this SQL in the vtrrk-travelogue D1 database:")
    print()
    print(
        "INSERT INTO download_codes (code_hash, expires_at) "
        f"VALUES ('{code_hash}', '{expires_at}');"
    )


if __name__ == "__main__":
    main()
