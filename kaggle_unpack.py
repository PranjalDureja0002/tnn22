#!/usr/bin/env python3
"""
Restore Next.js dynamic-route folders after a Kaggle / zip round-trip.

Walks `frontend/` and renames every `id` folder whose parent is named
`engagements` back to `[id]`. Cross-platform — works on Windows, Linux,
macOS, Kaggle notebooks, anything with Python 3.7+.

Run from the project root:

    python kaggle_unpack.py

Or place this script next to the project root and run it from anywhere.
"""
from __future__ import annotations

import sys
from pathlib import Path


def find_frontend() -> Path | None:
    """Locate the frontend/ folder, regardless of where this script was invoked."""
    candidates = [
        Path.cwd() / "frontend",
        Path(__file__).resolve().parent / "frontend",
    ]
    for c in candidates:
        if c.is_dir():
            return c
    return None


def main() -> int:
    frontend = find_frontend()
    if frontend is None:
        print("frontend/ not found. Run from the project root.")
        return 1

    print(f"Scanning: {frontend}")

    # Find every `id` directory whose parent directory is named `engagements`.
    candidates = [
        p for p in frontend.rglob("id")
        if p.is_dir() and p.parent.name == "engagements"
    ]

    if not candidates:
        print("Nothing to rename.")
        return 0

    # Rename deepest paths first so a parent rename never invalidates a child.
    candidates.sort(key=lambda p: len(p.parts), reverse=True)

    renamed = 0
    skipped = 0
    for src in candidates:
        target = src.parent / "[id]"
        if target.exists():
            print(f"  skipped : {target}  (already exists)")
            skipped += 1
            continue
        src.rename(target)
        print(f"  renamed : {src.relative_to(frontend).as_posix()}  ->  [id]")
        renamed += 1

    # Optional cleanup of the old manifest if it exists from earlier runs.
    legacy_manifest = frontend / ".bracket_rename_manifest.json"
    if legacy_manifest.exists():
        legacy_manifest.unlink()
        print(f"  cleaned : .bracket_rename_manifest.json (no longer needed)")

    print()
    print(f"Done. Renamed {renamed} folder(s)." + (f"  Skipped {skipped}." if skipped else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
