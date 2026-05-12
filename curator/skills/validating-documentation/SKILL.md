---
name: validating-documentation
description: Use when checking documentation system integrity — validates HTML-wrapped frontmatter, scope paths, cross-references, CLAUDE.md content, and detects orphaned or legacy-format docs. Supports --fix for safe automatic corrections.
---

# Validating Documentation

Check the documentation system for structural issues and optionally apply safe fixes.

## Critical Guidelines

- **You MUST load the `curator:documenting-repositories` skill first** for the frontmatter spec and document-type rules.
- **You MUST create TodoWrite todos for each step in the Workflow section** — one todo per Step, marked `in_progress` on entry and `completed` on exit. Multi-step workflows silently skip steps without explicit tracking.
- **You MUST be non-destructive by default** — report only, unless the user invoked with `--fix` or explicitly confirms a fix.
- **You MUST NOT delete user content** under any circumstance. Fixes are limited to frontmatter normalization and `CLAUDE.md` content replacement.
- **You MUST distinguish between critical issues and warnings** — orphans and stale scope paths are warnings; missing required fields are critical.
- **You MUST surface legacy unwrapped frontmatter** as a fixable issue — the canonical format is HTML-wrapped.

## When to Use

- **Use this skill** after onboarding, after manual edits to docs, before committing, or when something seems off with staleness tracking.
- **Use `updating-documentation`** for content-staleness checks (different concern — that one looks at *what's documented* vs the code; this one looks at *how it's documented*).

## Invocation

User invokes via `/curator:validating-documentation [--fix]`.

- `--fix` — apply auto-fixable corrections; still asks for confirmation on non-trivial fixes (orphan linking, legacy migration)

## Workflow

### Step 0 — Pre-flight

Inventory all markdown files that look like documentation candidates:

```bash
find . -name "*.md" -type f \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*" \
  ! -path "*/vendor/*" \
  ! -path "*/.claude/*" \
  2>/dev/null
```

For each candidate, classify into one of:

| Class | Detection |
|-------|-----------|
| **Tracked** | First line is `<!--` AND frontmatter contains `last_updated:` |
| **Legacy unwrapped** | First line is `---` AND has YAML frontmatter with `last_updated:` |
| **CLAUDE.md** | Filename is `CLAUDE.md` (no frontmatter expected) |
| **Untracked** | Has neither — not a curator doc, ignored |

Use the script for the canonical tracked list:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/find-tracked-docs.sh"
```

### Step 1 — Validation Checks

Run all checks below. For each, accumulate findings into one of three buckets: **Critical**, **Warning**, **Fixable**.

#### Check 1 — Frontmatter format

For each tracked document:

| Check | Pass | Fail bucket |
|-------|------|-------------|
| First line is `<!--` | Continue | **Fixable** (legacy unwrapped) |
| Closing `-->` appears before content | Continue | **Critical** (malformed wrapper) |
| YAML inside parses without error | Continue | **Critical** (invalid YAML) |
| `last_updated` field present | Continue | **Critical** (untracked) |
| `last_updated` is ISO 8601 UTC | Continue | **Fixable** (normalize timestamp) |
| `scope.paths` is an array of strings (if present) | Continue | **Critical** (wrong type) |
| `scope.summary` is a string (if present) | Continue | **Warning** (recommended) |

#### Check 2 — Scope path validity

For each `scope.paths` entry in every tracked doc, test that at least one file matches:

```bash
# For each pattern, check it resolves
# (glob expansion via shell; or find with -path for ** patterns)
```

| Result | Bucket |
|--------|--------|
| At least one file matches | Pass |
| No matches | **Warning** (scope may be stale) |

#### Check 3 — Cross-reference validity

For each `AGENTS.md` (root and module), extract references:

```bash
grep -E '^@(docs/|AGENTS\.md|[^[:space:]]+\.md)' AGENTS.md
grep -E '\[.*\]\((docs/[^)]+\.md|[^)]+/AGENTS\.md)\)' AGENTS.md
```

For each reference, verify the target file exists.

| Result | Bucket |
|--------|--------|
| Target exists | Pass |
| Target missing | **Critical** (broken reference) |

#### Check 4 — CLAUDE.md content

For each `CLAUDE.md` found anywhere in the repo:

```bash
cat <path>/CLAUDE.md
ls <path>/AGENTS.md
```

| Condition | Bucket |
|-----------|--------|
| Contains exactly `@AGENTS.md` and sibling `AGENTS.md` exists | Pass |
| Contains other content | **Fixable** (replace with `@AGENTS.md`) |
| Sibling `AGENTS.md` missing | **Critical** (broken redirect) |

#### Check 5 — Orphan detection

For each tracked document that is NOT itself an `AGENTS.md`:

```bash
# Find references to this doc from the nearest AGENTS.md
grep -l "<doc-path>" AGENTS.md */AGENTS.md 2>/dev/null
```

| Result | Bucket |
|--------|--------|
| Referenced from at least one `AGENTS.md` | Pass |
| Not referenced from any `AGENTS.md` | **Warning** (orphan — may be intentional for ad-hoc docs) |

#### Check 6 — Legacy unwrapped detection

For each candidate file in the **Legacy unwrapped** class from Step 0:

| Bucket |
|--------|
| **Fixable** (migrate to HTML-wrapped format) |

### Step 2 — Report

Compile the findings into a clear report:

```markdown
## Validation Report

### Summary
| Check | Passed | Failed | Warnings |
|-------|--------|--------|----------|
| Frontmatter format | <n> | <n> | <n> |
| Scope paths | <n> | <n> | <n> |
| Cross-references | <n> | <n> | <n> |
| CLAUDE.md | <n> | <n> | <n> |
| Orphans | <n> | <n> | <n> |
| Legacy format | — | — | <n> |

### Critical Issues (must fix)
- `<file>`: <issue> — <impact>

### Warnings (should review)
- `<file>`: <issue>

### Auto-fixable
- `<file>`: <what would be fixed>
```

If no `--fix` flag and there are fixable items, suggest:

```markdown
Re-run with `--fix` to apply automatic corrections.
```

### Step 3 — Fix Mode

**Only runs if the user invoked with `--fix`.**

For each fixable issue, apply the fix:

| Issue | Auto-fix | Asks first? |
|-------|----------|-------------|
| Legacy unwrapped frontmatter | Wrap existing `---...---` block in `<!--` / `-->`; preserve all field content | No (mechanical) |
| Missing `last_updated` | Insert with current ISO 8601 UTC timestamp | No (mechanical) |
| Invalid timestamp format | Normalize to ISO 8601 UTC (parse common formats: `YYYY-MM-DD`, RFC 3339, etc.) | No (mechanical) |
| `CLAUDE.md` wrong content | Replace file with `@AGENTS.md` | **Yes** — show diff first |
| `CLAUDE.md` missing sibling `AGENTS.md` | Skipped — surface in Critical | N/A |
| Orphaned tracked doc | Offer to add reference to nearest `AGENTS.md` | **Yes** — show proposed insertion |

**Never auto-fixable** (surface only):

| Issue | Reason |
|-------|--------|
| Invalid YAML syntax | Requires manual edit; structural ambiguity |
| Scope paths matching nothing | Requires understanding intent — may be a typo or may be future-facing |
| Broken cross-reference | Could mean delete the reference OR create the target — user must decide |
| Missing root `AGENTS.md` | Suggest `/curator:onboarding-repository` |

Generate one shared timestamp for any new `last_updated` insertions:

```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

### Step 4 — Summary

```markdown
## Validation Complete

**Status:** All passed / <n> issues found / <n> issues fixed

### Fixed
- `<file>`: <what was fixed>

### Remaining Issues
- `<file>`: <issue requiring manual fix>

### Next Steps
1. Address remaining issues manually
2. Re-run `/curator:validating-documentation` to confirm
3. Commit the fixes
```

## Edge Cases

| Scenario | Approach |
|----------|----------|
| Legacy unwrapped doc has invalid YAML inside | Mark Critical; do NOT auto-wrap (would propagate broken YAML) |
| Multiple `CLAUDE.md` files reference the same `AGENTS.md` (e.g., root vs subdir) | Treat each independently; both must point to their sibling |
| Orphan is intentionally orphaned (ad-hoc doc not in main flow) | Warning only; user declines link via `--fix` confirmation |
| Tracked doc has `scope.paths` but no `scope.summary` | Warning (recommended), not Critical |
| Doc has additional fields beyond `scope` and `last_updated` | Warning; specification allows only those two top-level fields |
| `--fix` finds zero fixable issues | Report and stop — no changes made |

## What NOT to Do

- Don't delete any user content
- Don't modify documents that have no fixable issues
- Don't auto-fix issues that require judgment (broken references, scope intent)
- Don't migrate legacy unwrapped docs that have invalid YAML — surface as Critical
- Don't re-validate after fixing in the same run — let the user re-invoke explicitly
