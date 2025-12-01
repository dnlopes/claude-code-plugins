---
name: documentation-standards
description: Standards for Claude-optimized repository documentation. Use when creating or updating docs/claude/ documentation to ensure correct format, abstraction level, and front-matter.
---

# Documentation Standards

## Core Philosophy

**Documentation exists to provide Claude with useful context, not to mirror the codebase.**

### The Right Abstraction Level

Documentation should capture **patterns, concepts, and architecture** - not implementation details.

**Key principle:** If a document needs frequent updates, it's probably too detailed.

| Too Detailed (Avoid) | Right Level (Target) |
|---------------------|---------------------|
| Lists every function in a module | Explains what the module does and its key abstractions |
| Documents every API parameter | Explains the API design patterns and when to use each endpoint |
| Copies code verbatim | Shows illustrative examples of common patterns |
| Tracks every config option | Explains configuration philosophy and key options |

### When Examples Are Appropriate

Include examples when they:
- Illustrate a pattern that repeats throughout the codebase
- Show non-obvious conventions
- Demonstrate idiomatic usage

Do NOT include examples that:
- Simply duplicate code that's easy to find
- Will become stale when implementation changes
- Cover edge cases rather than common patterns

## Document Types

### CLAUDE.md (Root)
**Purpose:** Entry point for Claude. Quick orientation + immutable principles.

**Should contain:**
- 1-2 sentence project description
- Quick start commands (build, test, run)
- Principles/invariants that MUST be followed
- `@` imports for docs/claude/ files (e.g., `@docs/claude/architecture.md`)

**Why `@` imports:** Claude Code automatically loads CLAUDE.md at session start. Using `@path/to/file` syntax causes Claude Code to also load those files, ensuring all documentation is available immediately without manual reading.

**Should NOT contain:**
- Detailed architecture (goes in architecture.md)
- Code examples (goes in patterns.md)
- Business domain explanations (goes in domain.md)

### docs/claude/architecture.md
**Purpose:** System design and component relationships.

**Should contain:**
- High-level system overview
- Major components and their responsibilities
- How components interact (data flow)
- External dependencies and integrations
- Key architectural decisions and their rationale

**Scope paths:** Typically root directories, main entry points, core modules.

### docs/claude/domain.md
**Purpose:** Business concepts and terminology.

**Should contain:**
- Glossary of domain terms
- Core business entities and their relationships
- Business rules and constraints
- Domain-specific patterns

**Scope paths:** Domain models, entities, business logic directories.

### docs/claude/patterns.md
**Purpose:** Code conventions with illustrative examples.

**Should contain:**
- Project structure conventions
- Naming conventions
- Error handling patterns (with 1 example)
- Testing patterns (with 1 example)
- Common patterns used throughout (with examples)

**Scope paths:** Representative files that demonstrate patterns.

### docs/claude/development.md
**Purpose:** How to work with the codebase.

**Should contain:**
- Build commands
- Test commands
- Local development setup
- Environment variables needed
- Deployment process overview

**Scope paths:** Build files (Makefile, package.json), config files, CI/CD configs.

### docs/claude/modules/[name].md (Optional)
**Purpose:** Deep-dive on complex modules that warrant separate documentation.

**Create only when:**
- Module has non-obvious behavior
- Module is frequently modified
- Module has complex internal architecture
- Understanding requires significant context

**Should NOT be created for:**
- Simple CRUD modules
- Utility/helper modules
- Modules with self-explanatory code

## Front-matter Specification

See: [reference/frontmatter-spec.md](reference/frontmatter-spec.md)

## Document Templates

See: [reference/document-templates.md](reference/document-templates.md)
