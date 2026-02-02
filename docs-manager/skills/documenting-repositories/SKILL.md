---
name: documenting-repositories
description: Standards for agent-optimized repository documentation. Use when creating or updating documentation to ensure correct format, abstraction level, and front-matter. Covers AGENTS.md, CLAUDE.md, docs/*.md structure with staleness tracking. Also use when documentation seems too detailed or needs frequent updates.
user-invocable: false
---

# Documentation Standards

## Core Philosophy

**Documentation provides context, not implementation details.**

If a document needs frequent updates, it's documenting at the wrong level.

| Avoid | Target |
|-------|--------|
| Lists every function | Module purpose and key abstractions |
| Documents every parameter | API design patterns |
| Copies code verbatim | Illustrative examples |

## Audience Split

| Type | Documents | Audience |
|------|-----------|----------|
| Human-focused | README.md, docs/development.md | Users, contributors |
| Agent-optimized | AGENTS.md, docs/architecture.md, docs/domain.md, docs/patterns.md | AI agents |

## Output Structure

```
repo/
├── AGENTS.md              # Main agent docs (quick start, key directories)
├── CLAUDE.md              # Single line: @AGENTS.md
├── README.md              # User-facing (optional tracking)
├── docs/
│   ├── architecture.md    # System design
│   ├── domain.md          # Business concepts
│   ├── patterns.md        # Code conventions
│   └── development.md     # Build/test/run
└── src/
    └── <complex-module>/
        ├── AGENTS.md      # Module-specific docs
        └── CLAUDE.md      # @AGENTS.md
```

## Build System Priority

**Commands must use the project's build system interfaces.**

| If project has... | Document this | NOT this |
|-------------------|---------------|----------|
| Makefile | `make test` | `go test ./...` |
| package.json | `npm test` | `jest` |
| docker-compose | `docker-compose up` | `docker run ...` |

## AGENTS.md Format

Uses dual-format references for compatibility:

```markdown
@docs/architecture.md

- [Architecture](docs/architecture.md) - System design
```

## CLAUDE.md Format

Single line only:
```markdown
@AGENTS.md
```

## Reference Documentation

For detailed specifications:
- [Front-matter Specification](reference/frontmatter-spec.md) - Staleness tracking format
- [Templates](reference/templates.md) - Document templates
- [Examples](reference/examples.md) - Good/bad examples
