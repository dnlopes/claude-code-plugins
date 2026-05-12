---
name: documenting-repositories
description: Shared reference loaded by other docs-manager skills (onboarding-repository, adding-documentation, updating-documentation, validating-documentation) when generating or updating repository documentation — provides format standards, abstraction-level rules, HTML-wrapped frontmatter spec, and staleness-tracking conventions for AGENTS.md, CLAUDE.md, README.md, and docs/*.md.
user-invocable: false
---

# Documentation Standards

## Critical Guidelines

- **You MUST document durable knowledge only** — intent, invariants, boundaries, gotchas, domain concepts. Never document what an agent can rediscover in seconds with `grep` or `ls`.
- **You MUST NOT include line numbers** in any reference (`file.go:45` rots on every edit). Reference files by path and code by exported symbol name.
- **You MUST NOT include illustrative code snippets** that show what reading the referenced file would already show. Describe the pattern in prose; let the code speak for itself.
- **You MUST use build-system commands** — `make test`, `npm test`, `docker-compose up` — never raw tool invocations (`go test ./...`, `jest`, `docker run ...`). Build-command snippets are the one allowed form of code in docs.
- **You MUST wrap frontmatter in HTML comments** so it stays hidden when rendered on GitHub.
- **You MUST use ISO 8601 UTC timestamps** for `last_updated` (e.g., `2025-01-15T10:30:00Z`).
- **You MUST include `scope.paths` in every tracked doc** except root `AGENTS.md` (which tracks the whole repo) and `CLAUDE.md` (which has no frontmatter).

## Core Philosophy

**Documentation provides the context an agent cannot derive from the code itself.** If a fact can be answered by a `grep`, an `ls`, or by opening the file, it does not belong in docs. If a fact changes on every refactor, it does not belong in docs.

**The single test:** *Would removing this sentence make an agent meaningfully slower or more likely to be wrong?* If no, delete it.

### What to Capture (durable, non-derivable)

| Capture | Why it belongs in docs |
|---------|------------------------|
| **Intent** — why the system/module exists, what problem it solves | Not visible in code; vanishes from commit history over time |
| **Invariants** — rules that must always hold (contracts, constraints) | Often enforced implicitly; an agent breaking them won't see why |
| **Boundaries** — where one concern ends and another begins; who owns what | Easy to violate without an explicit map |
| **Gotchas** — non-obvious behavior, surprising consequences, known traps | Pure non-derivable knowledge; the highest-value entries |
| **Decision criteria** — when to use pattern A vs pattern B | Codifies tribal knowledge that would otherwise be re-debated |
| **Domain concepts** — business vocabulary used in tickets, commits, conversations | Maps real-world language to code identifiers |
| **Architectural relationships** — how high-level pieces compose | The shape of the system, not its parts |

### What to Avoid (derivable or volatile)

| Avoid | Why it's wrong |
|-------|---------------|
| Function / method / parameter / field listings | Trivially derivable via `grep` or by reading the file; rots on every refactor |
| Line numbers (`file.go:45`) | Rot on every edit, even unrelated ones |
| Illustrative code snippets | Duplicate the code; rot when the original changes |
| Version numbers of dependencies | Live authoritatively in `package.json` / `go.mod` / `Cargo.toml` |
| Setup / install steps already in a `Makefile` | Duplicate the build system; drift the moment it changes |
| Full dependency lists | Live in manifest files |
| Step-by-step procedures that mirror the code | Describe the code's structure instead of why |
| Historical narratives ("we used to use X, now we use Y") | Live in `git log`; pure noise for agents |

### Stable References

When a doc needs to point at code, use stable anchors only:

| Anchor | Stability | Use |
|--------|-----------|-----|
| `internal/auth/` (directory) | Survives most refactors | Locating a subsystem |
| `internal/auth/middleware.go` (file path) | Survives renames within a file | Pointing at a concrete unit |
| `RequireAuth` (exported symbol) | Greppable; survives file moves | Pointing at an entry point or contract |
| `file.go:45` (line number) | **Forbidden** — rots on every edit | Never |

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

**Good** — captures intent, invariants, and a gotcha. No line numbers, no code snippets, no function lists:

```markdown
## Error Handling

Every layer wraps errors with operation context before returning. The top of the
call stack decides whether to log; intermediate layers never log-and-return (this
causes duplicate log entries and obscures the originating context).

Service-layer files live under `internal/service/`. Wrapping uses the standard
library's error-wrapping idiom; do not introduce a custom error type for this.

**Gotcha:** Errors crossing the API boundary are flattened to user-safe messages
in `internal/api/errors`. Do not surface wrapped internal errors directly to
clients — they leak file paths and IDs.
```

**Bad** — derivable, will rot, and adds no signal an agent couldn't get from the code:

```markdown
## Error Handling

The `getUserById` function on line 47 of `user_service.go` calls `repo.FindByID`
and if it returns an error, wraps it with `fmt.Errorf` and the user ID. The
`getOrderById` function on line 89 does the same. The `getInvoiceById` function
on line 134 follows the same pattern...
```

The good example tells an agent something it could not learn by reading the code. The bad example restates what is already there, and breaks on every edit.

More good/bad pairs in [examples](reference/examples.md).

## Reference Documentation

- [Frontmatter spec](reference/frontmatter-spec.md) — fields, validation, parsing
- [Templates](reference/templates.md) — per-document-type templates (sole source)
- [Examples](reference/examples.md) — good/bad patterns by document type
