#!/usr/bin/env python3
"""
publish.py — Publish an Obsidian note to Doctor Talos

Usage:
  ./publish.py path/to/note.md            # publish and push
  ./publish.py path/to/note.md --dry-run  # preview only
  ./publish.py path/to/note.md --no-push  # commit but don't push

The note must have:
  - YAML front matter with at least a title
  - draft: false  (the script refuses to publish drafts)
  - form: <type>  (determines where it goes — see below)

Forms:
  dispatch        → content/posts/
  poem            → content/works/
  short story     → content/works/
  serial chapter  → content/works/<serial>/  (requires serial: <slug>)

The script assigns the next sequence number, sets dateDisplay,
converts poem line breaks for Hugo, then commits and pushes.
"""

import argparse
import os
import re
import subprocess
import sys
from datetime import date, datetime
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("Error: PyYAML required. Run: pip3 install pyyaml")

SITE = Path(__file__).parent.resolve()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_]+", "-", s.strip())
    return re.sub(r"-+", "-", s)


def next_seq(directory: Path) -> int:
    nums = []
    for f in directory.glob("*.md"):
        if f.name == "_index.md":
            continue
        m = re.match(r"^(\d+)", f.name)
        if m:
            nums.append(int(m.group(1)))
    return max(nums, default=0) + 1


def fmt_date(d) -> str:
    if isinstance(d, datetime):
        return d.strftime("%Y-%m-%dT%H:%M:%S")
    if isinstance(d, date):
        return f"{d}T00:00:00"
    if d:
        return str(d)
    return datetime.now().strftime("%Y-%m-%dT%H:%M:%S")


def parse_file(path: Path):
    text = path.read_text(encoding="utf-8")
    m = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n?(.*)", text, re.DOTALL)
    if not m:
        sys.exit(f"Error: no YAML front matter found in {path.name}")
    fm = yaml.safe_load(m.group(1)) or {}
    body = m.group(2).lstrip("\n")
    return fm, body


def poem_linebreaks(body: str) -> str:
    """Add two trailing spaces to each line within stanzas so Hugo renders breaks."""
    paragraphs = re.split(r"\n{2,}", body.strip())
    result = []
    for para in paragraphs:
        lines = para.splitlines()
        if len(lines) > 1:
            lines = [l.rstrip() + "  " for l in lines[:-1]] + [lines[-1].rstrip()]
        result.append("\n".join(lines))
    return "\n\n".join(result) + "\n"


def build_frontmatter(**fields) -> str:
    lines = ["---"]
    for k, v in fields.items():
        if v is None:
            continue
        if isinstance(v, bool):
            lines.append(f"{k}: {str(v).lower()}")
        elif isinstance(v, int):
            lines.append(f"{k}: {v}")
        elif isinstance(v, (datetime, date)):
            lines.append(f"{k}: {fmt_date(v)}")
        else:
            lines.append(f'{k}: "{v}"')
    lines.append("---")
    return "\n".join(lines) + "\n"


def run(*cmd):
    subprocess.run(cmd, check=True, cwd=SITE)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description="Publish an Obsidian note to Doctor Talos")
    ap.add_argument("file", help="Path to Obsidian markdown file")
    ap.add_argument("--dry-run", action="store_true", help="Preview without writing files")
    ap.add_argument("--no-push", action="store_true", help="Commit but do not push")
    args = ap.parse_args()

    src = Path(args.file).expanduser().resolve()
    if not src.exists():
        sys.exit(f"Error: file not found: {src}")

    fm, body = parse_file(src)

    # Guard: refuse drafts
    if fm.get("draft", True):
        title = fm.get("title", src.stem)
        sys.exit(f"'{title}' is draft: true — set draft: false before publishing.")

    title  = str(fm.get("title", src.stem)).strip()
    form   = str(fm.get("form", "dispatch")).lower().strip()
    dt_raw = fm.get("date")
    date_str = fmt_date(dt_raw)

    # dateDisplay helpers
    def display_dispatch():
        if fm.get("dateDisplay"):
            return fm["dateDisplay"]
        if isinstance(dt_raw, datetime):
            return dt_raw.strftime("%Y.%m.%d // %H:%M UTC")
        return datetime.now().strftime("%Y.%m.%d // %H:%M UTC")

    def display_works():
        if fm.get("dateDisplay"):
            return fm["dateDisplay"]
        if isinstance(dt_raw, (datetime, date)):
            d = dt_raw.date() if isinstance(dt_raw, datetime) else dt_raw
            return d.strftime("%Y.%m.%d")
        return datetime.now().strftime("%Y.%m.%d")

    # --- Route by form ---

    if form == "dispatch":
        dest_dir = SITE / "content" / "posts"
        seq  = next_seq(dest_dir)
        slug = f"{seq:03d}-{slugify(title)}"
        fm_out = build_frontmatter(
            title=title,
            subtitle=fm.get("subtitle", ""),
            slug=slug,
            date=date_str,
            dateDisplay=display_dispatch(),
            draft=False,
        )
        dest     = dest_dir / f"{slug}.md"
        body_out = body

    elif form == "poem":
        dest_dir = SITE / "content" / "works"
        seq  = next_seq(dest_dir)
        slug = f"{seq:03d}-{slugify(title)}"
        fm_out = build_frontmatter(
            title=title,
            form="poem",
            date=date_str,
            dateDisplay=display_works(),
            draft=False,
        )
        dest     = dest_dir / f"{slug}.md"
        body_out = poem_linebreaks(body)

    elif form in ("short story", "short-story"):
        dest_dir = SITE / "content" / "works"
        seq  = next_seq(dest_dir)
        slug = f"{seq:03d}-{slugify(title)}"
        fm_out = build_frontmatter(
            title=title,
            form="short story",
            date=date_str,
            dateDisplay=display_works(),
            draft=False,
        )
        dest     = dest_dir / f"{slug}.md"
        body_out = body

    elif form in ("serial chapter", "serial-chapter"):
        serial = str(fm.get("serial", "")).strip()
        if not serial:
            sys.exit("Error: 'serial' field is required for serial chapters.")
        dest_dir = SITE / "content" / "works" / serial
        if not dest_dir.exists():
            sys.exit(
                f"Error: serial directory not found: content/works/{serial}/\n"
                f"Create the serial landing page first."
            )
        seq  = next_seq(dest_dir)
        slug = f"{seq:03d}-{slugify(title)}"
        fm_out = build_frontmatter(
            title=title,
            chapter=seq,
            date=date_str,
            dateDisplay=display_works(),
            layout="serial-chapter",
            draft=False,
        )
        dest     = dest_dir / f"{slug}.md"
        body_out = body

    else:
        sys.exit(
            f"Unknown form: '{form}'\n"
            f"Valid values: dispatch, poem, short story, serial chapter"
        )

    rel = dest.relative_to(SITE)

    print(f"  title : {title}")
    print(f"  form  : {form}")
    print(f"  dest  : {rel}")

    if args.dry_run:
        print("\n[dry run — nothing written]")
        return

    if dest.exists():
        sys.exit(f"Error: {rel} already exists.")

    dest.write_text(fm_out + "\n" + body_out, encoding="utf-8")
    print("  written")

    run("git", "add", str(rel))
    run("git", "commit", "-m",
        f"Add {form}: {title}\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>")

    if not args.no_push:
        run("git", "push")
        print("  pushed — Cloudflare building")
    else:
        print("  committed (not pushed)")


if __name__ == "__main__":
    main()
