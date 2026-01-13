---
name: documentation-standards
description: Standards for agent-optimized repository documentation. Use when creating or updating documentation to ensure correct format, abstraction level, and front-matter.
---

# Documentation Standards

## Core Philosophy

**Documentation exists to provide useful context, not to mirror the codebase.**

### The Right Abstraction Level

Documentation captures **patterns, concepts, and architecture** - not implementation details.

**Key principle:** If a document needs frequent updates, it's too detailed.

| Too Detailed (Avoid) | Right Level (Target) |
|---------------------|---------------------|
| Lists every function | Explains module purpose and key abstractions |
| Documents every parameter | Explains API design patterns |
| Copies code verbatim | Shows illustrative examples |

## Audience Split

### Human-Focused Documentation

**Documents:** README.md, docs/development.md

**Audience:** Humans reading on GitHub
- README: Users of the repository's output
- development.md: Developers who contribute

**Characteristics:**
- Practical, action-oriented language
- Welcoming tone
- Concrete working examples

### Agent-Optimized Documentation

**Documents:** AGENTS.md, docs/architecture.md, docs/domain.md, docs/patterns.md

**Audience:** AI agents understanding the codebase

**Characteristics:**
- Patterns over implementation details
- Stable abstraction level
- Structured for context consumption

## Output Structure

```
repo/
├── AGENTS.md              # Main agent docs (principles, quick start)
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

### AGENTS.md Format

Uses dual-format references for compatibility:

```markdown
## Documentation

@docs/architecture.md
@docs/domain.md
@docs/patterns.md
@docs/development.md

- [Architecture](docs/architecture.md) - System design
- [Domain](docs/domain.md) - Business concepts
- [Patterns](docs/patterns.md) - Code conventions
- [Development](docs/development.md) - Build/test/run
```

### CLAUDE.md Format

Single line:
```markdown
@AGENTS.md
```

## Build System Priority

**Commands must use the project's build system interfaces.**

| If project has... | Document this | NOT this |
|-------------------|---------------|----------|
| Makefile | `make test` | `go test ./...` |
| package.json | `npm test` | `jest` |
| docker-compose | `docker-compose up` | `docker run ...` |

## Reference Documentation

- [Front-matter Specification](reference/frontmatter-spec.md) - Staleness tracking format
- [Templates](reference/templates.md) - Document templates
- [Examples](reference/examples.md) - Good/bad examples
