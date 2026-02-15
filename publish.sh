#!/bin/bash
# Publish script for Doctor Talos's Traveling Show
#
# Usage: ./publish.sh [commit message]
#
# Scans posts/ for JSON files, builds the manifest (posts/index.json),
# then commits and pushes everything.

set -e
cd "$(dirname "$0")"

# Build manifest: read each post JSON, extract slug and date, sort newest first
echo "Building post manifest..."

slugs=$(
  for f in posts/[0-9]*.json; do
    [ -f "$f" ] || continue
    # Extract date and slug from JSON
    date=$(python3 -c "import json,sys; print(json.load(open('$f'))['date'])")
    slug=$(python3 -c "import json,sys; print(json.load(open('$f'))['slug'])")
    echo "$date $slug"
  done | sort -r | awk '{print "  \"" $2 "\""}'
)

# Write index.json
printf '[\n%s\n]\n' "$(echo "$slugs" | paste -sd',' - | sed 's/,/,\n/g')" > posts/index.json

echo "Manifest written: posts/index.json"
cat posts/index.json

# Git add, commit, push
msg="${1:-Add new dispatch}"
git add posts/ js/blog.js
git status --short
echo ""
read -p "Commit and push with message: \"$msg\"? [y/N] " confirm
if [[ "$confirm" =~ ^[Yy]$ ]]; then
  git commit -m "$msg"
  git push origin main
  echo "Published!"
else
  echo "Aborted."
fi
