#!/usr/bin/env bash
# Find all tracked documentation files in the current repository.
#
# A document is tracked when its first line is `<!--` AND the HTML-wrapped
# frontmatter block contains a `last_updated:` field.
#
# Output: one absolute-or-relative path per line, sorted.
#
# Usage:
#   ./find-tracked-docs.sh          # all tracked docs
#   ./find-tracked-docs.sh path/    # tracked docs under path/

set -euo pipefail

search_root="${1:-.}"

find "$search_root" -name "*.md" -type f \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*" \
  ! -path "*/vendor/*" \
  ! -path "*/.claude/*" \
  -print0 2>/dev/null \
  | while IFS= read -r -d '' f; do
      first_line=$(head -1 "$f" 2>/dev/null || true)
      if [ "$first_line" = "<!--" ]; then
        if head -20 "$f" 2>/dev/null | grep -q "^last_updated:"; then
          printf '%s\n' "$f"
        fi
      fi
    done \
  | sort
