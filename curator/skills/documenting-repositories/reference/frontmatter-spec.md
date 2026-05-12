# Frontmatter Specification

Every tracked document uses **HTML-comment-wrapped YAML frontmatter**. This keeps the frontmatter hidden when the document is rendered on GitHub or any other markdown viewer while remaining parseable by `curator` scripts and readable by Claude.

## Contents

- [Format](#format)
- [Field Definitions](#field-definitions)
  - [scope.paths](#scopepaths)
  - [scope.summary](#scopesummary)
  - [last_updated](#last_updated)
- [Document-Type Rules](#document-type-rules)
- [Validation Rules](#validation-rules)
- [Parsing](#parsing)

## Format

```markdown
<!--
---
scope:
  paths:
    - path/to/directory/**
    - path/to/file.ts
  summary: "Brief description of coverage"
last_updated: 2025-01-15T10:30:00Z
---
-->

# Title

...
```

**Rules:**

1. First line of the file MUST be `<!--`
2. Frontmatter delimiters (`---`) live INSIDE the HTML comment
3. Closing `-->` MUST appear before any document content
4. Blank line between `-->` and the first heading is recommended

## Field Definitions

### scope.paths

**Type:** Array of glob patterns
**Purpose:** Files/directories this document covers — used for staleness detection.

Staleness is computed by:

```bash
git log --since="<last_updated>" --name-only -- <paths>
```

**Examples:**

```yaml
# Architecture — structural directories
paths:
  - src/core/**
  - src/api/**

# Development — build/config files
paths:
  - Makefile
  - package.json
  - docker-compose.yml
```

### scope.summary

**Type:** String
**Purpose:** One sentence describing the coverage area. Helps reviewers and tooling without re-reading the body.

### last_updated

**Type:** ISO 8601 UTC timestamp (e.g., `2025-01-15T10:30:00Z`)
**Purpose:** When the document was last reviewed/updated.

**Why timestamps over commit hashes:**

- Survive `git squash --merge` (hashes become orphaned)
- Work with feature-branch → squash-merge workflows
- Human-readable

## Document-Type Rules

| Document | Frontmatter? | `scope.paths` required? | Notes |
|----------|--------------|--------------------------|-------|
| `AGENTS.md` (root) | Yes | No | Tracks whole repo; `scope` omitted |
| `AGENTS.md` (module) | Yes | Yes | `paths` covers the module subtree |
| `CLAUDE.md` | **No** | N/A | Single line `@AGENTS.md` only |
| `README.md` | Yes | Yes | Same wrapped format as other docs |
| `docs/*.md` | Yes | Yes | `paths` covers the docs scope |

Root `AGENTS.md` example (no `scope`):

```markdown
<!--
---
last_updated: 2025-01-15T10:30:00Z
---
-->

# Project Name
...
```

## Validation Rules

1. **Wrapped format only.** First line must be `<!--`; plain YAML frontmatter is not supported.
2. **`last_updated` is required** on every tracked document.
3. **`last_updated` must be ISO 8601 UTC** (ends in `Z`).
4. **`scope.paths` (when present)** must be an array of strings; each pattern should match at least one existing file.
5. **`scope.summary` (when present)** must be a single-line string.
6. **No additional top-level fields** beyond `scope` and `last_updated`.

## Parsing

The plugin's `scripts/find-tracked-docs.sh` identifies tracked documents by checking that the first line is `<!--` and that the first 20 lines contain a `last_updated:` field. Anything else is ignored.
