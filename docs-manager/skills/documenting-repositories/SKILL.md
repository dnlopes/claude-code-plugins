---
name: documenting-repositories
description: Shared reference loaded by other docs-manager skills (onboarding-repository, adding-documentation, updating-documentation, validating-documentation) when generating or updating repository documentation — provides format standards, abstraction-level rules, HTML-wrapped frontmatter spec, and staleness-tracking conventions for AGENTS.md, CLAUDE.md, README.md, and docs/*.md.
user-invocable: false
---

# Documentation Standards

## Critical Guidelines

- **You MUST document at the abstraction level** — purpose, architecture, patterns. Never list every function/parameter/file.
- **You MUST use build-system commands** — `make test`, `npm test`, `docker-compose up` — never raw tool invocations (`go test ./...`, `jest`, `docker run ...`).
- **You MUST wrap frontmatter in HTML comments** so it stays hidden when rendered on GitHub.
- **You MUST use ISO 8601 UTC timestamps** for `last_updated` (e.g., `2025-01-15T10:30:00Z`).
- **You MUST include `scope.paths` in every tracked doc** except root `AGENTS.md` (which tracks the whole repo) and `CLAUDE.md` (which has no frontmatter).

## Core Philosophy

**Documentation provides context, not implementation details.** If a document needs frequent updates, it's documenting at the wrong level.

| Avoid | Target |
|-------|--------|
| Lists every function | Module purpose and key abstractions |
| Documents every parameter | API design patterns |
| Copies code verbatim | Illustrative examples with `file:line` references |

## Audience Split

| Type | Documents | Audience |
|------|-----------|----------|
| Human-focused | `README.md`, `docs/development.md` | Users, contributors |
| Agent-optimized | `AGENTS.md`, `docs/architecture.md`, `docs/domain.md`, `docs/patterns.md` | AI agents |

## Output Structure

```
repo/
├── AGENTS.md              # Main agent docs (quick start, key directories)
├── CLAUDE.md              # Single line: @AGENTS.md
├── README.md              # User-facing (tracked via wrapped frontmatter)
├── docs/
│   ├── architecture.md    # System design
│   ├── domain.md          # Business concepts (skip for utility libs)
│   ├── patterns.md        # Code conventions
│   └── development.md     # Build/test/run
└── src/
    └── <complex-module>/
        ├── AGENTS.md      # Module-specific docs (only when warranted)
        └── CLAUDE.md      # @AGENTS.md
```

## Frontmatter Format

All tracked documents (except `CLAUDE.md`) use HTML-comment-wrapped YAML frontmatter:

```markdown
<!--
---
scope:
  paths:
    - src/api/**
  summary: "API layer architecture and request handling"
last_updated: 2025-01-15T10:30:00Z
---
-->

# Title

...
```

`CLAUDE.md` contains a single line — no frontmatter:

```markdown
@AGENTS.md
```

## AGENTS.md Reference Format

Uses **dual-format references** so both Claude (via `@` imports) and humans (via markdown links) can navigate:

```markdown
@docs/architecture.md

- [Architecture](docs/architecture.md) — System design
```

## Quick Example

**Good** — high abstraction, references real code:

```markdown
## Error Handling

Errors wrapped with context at each layer. See `internal/service/user_service.go:45`.

- Always wrap: `fmt.Errorf("operation: %w", err)`
- Include identifying information in context
```

**Bad** — implementation-level, will rot:

```markdown
## Error Handling

The `getUserById` function on line 47 of `user_service.go` calls `repo.FindByID`
and if it returns an error, wraps it with `fmt.Errorf` and the user ID...
```

More good/bad pairs in [examples](reference/examples.md).

## Reference Documentation

- [Frontmatter spec](reference/frontmatter-spec.md) — fields, validation, parsing
- [Templates](reference/templates.md) — per-document-type templates (sole source)
- [Examples](reference/examples.md) — good/bad patterns by document type
