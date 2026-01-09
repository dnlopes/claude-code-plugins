---
name: documentation-standards
description: Standards for Claude-optimized repository documentation. Use when creating or updating documentation to ensure correct format, abstraction level, and front-matter.
---

# Documentation Standards

## Core Philosophy

**Documentation exists to provide useful context, not to mirror the codebase.**

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

---

## Audience Split

Documentation serves two distinct audiences. Understanding this split is critical for generating useful content.

### Human-Focused Documentation

**Documents:** README.md, docs/development.md

**Audience:** Humans reading on GitHub
- README: Users of what the repository provides
- development.md: Developers who want to contribute

**Characteristics:**
- Practical, action-oriented language
- Welcoming tone
- Focus on "how do I..." questions
- Concrete examples that work
- No jargon about "Claude-optimized"

### Claude-Optimized Documentation

**Documents:** CLAUDE.md, docs/architecture.md, docs/domain.md, docs/patterns.md

**Audience:** Claude (AI context for understanding the codebase)

**Characteristics:**
- Patterns and concepts over implementation details
- Right abstraction level for stability
- Focused on developer guidance (for CLAUDE.md principles)
- Structured for efficient context consumption

---

## Document Types

### README.md (Root)
**Purpose:** Public-facing entry point for users of the repository's output.

**Audience:** Users (human-focused)

**Should contain:**
- Project summary and tagline
- Key features (user-visible capabilities)
- Installation instructions
- Quick start guide with examples
- Usage examples for common scenarios
- Documentation index linking to docs/
- Brief contributing guidelines

**Should NOT contain:**
- Detailed development setup (goes in docs/development.md)
- Architecture explanations (goes in docs/architecture.md)
- Domain concepts (goes in docs/domain.md)
- Code patterns (goes in docs/patterns.md)

### CLAUDE.md (Root)
**Purpose:** Entry point for Claude. Quick orientation + actionable principles.

**Audience:** Claude (AI-optimized)

**Should contain:**
- 1-2 sentence project description
- Quick start commands (build, test, run) - using build system interfaces
- Principles/invariants that developers MUST follow
- `@` imports for docs/ files (e.g., `@docs/architecture.md`)

**Principles must be:**
- Actionable - tells developers what to DO
- Invariants - must be maintained
- Consequential - violating them causes problems

**Should NOT contain:**
- Observations about infrastructure ("releases are automated")
- Tech stack descriptions ("we use TypeScript")
- Detailed architecture (goes in architecture.md)
- Code examples (goes in patterns.md)

### docs/architecture.md
**Purpose:** System design and component relationships.

**Audience:** Claude (AI-optimized)

**Required sections:**
- Overview (2-3 sentences, high-level)
- Components (with Location, Responsibility, Interactions)

**Optional sections (include when applicable):**
- Data Flow (when non-trivial)
- External Dependencies (when external integrations exist)
- Key Architectural Decisions (when evident)

**Scope paths:** Root directories, main entry points, core modules.

### docs/domain.md
**Purpose:** Business concepts and terminology.

**Audience:** Claude (AI-optimized)

**Required sections:**
- Glossary (domain-specific terms, not technical terms)

**Optional sections (include when applicable):**
- Core Entities (when domain model exists)
- Business Rules (when business constraints exist)
- Domain Patterns (when complex domain logic exists)

**Note:** For utility libraries or purely technical projects, this document may be minimal or skipped entirely.

**Scope paths:** Domain models, entities, business logic directories.

### docs/patterns.md
**Purpose:** Code conventions with illustrative examples.

**Audience:** Claude (AI-optimized)

**Required sections:**
- Project Structure (directory layout with conventions)
- Naming Conventions (files, functions, types)

**Optional sections (include when applicable):**
- Error Handling (when consistent pattern exists)
- Testing Patterns (when tests exist with consistent approach)
- Common Patterns (when repeating patterns observed)

**Scope paths:** Representative files that demonstrate patterns.

### docs/development.md
**Purpose:** How to work with the codebase.

**Audience:** Human developers (human-focused)

**Required sections:**
- Prerequisites (with versions)
- Setup (step-by-step)
- Build (using build system interfaces)
- Test (using build system interfaces)
- Run Locally

**Optional sections (include when applicable):**
- Environment Variables (when env vars are used)
- Common Tasks (when helpful shortcuts exist)
- Deployment (when deployment process exists)
- Contributing (when repo accepts contributions)

**Scope paths:** Build files (Makefile, package.json), config files, CI/CD configs.

### docs/modules/[name].md (Optional)
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

---

## Build System Priority

**Commands documented must use the project's build system interfaces.**

| If project has... | Document this | NOT this |
|-------------------|---------------|----------|
| Makefile | `make test` | `go test ./...` |
| package.json scripts | `npm test` | `jest` |
| docker-compose.yml | `docker-compose up` | `docker run ...` |
| Taskfile.yml | `task test` | raw commands |

The build system IS the interface. Raw commands are implementation details that can change.

---

## Core + Optional Structure

All documents use a **Core + Optional** structure:

- **Required sections** - Always include these
- **Optional sections** - Include only when the trigger condition is met
- **Skip guidance** - When to omit optional sections

**Important:** Do NOT include optional sections just because they exist in the template. Empty or generic content is worse than missing sections.

---

## Reference Documentation

- [Front-matter Specification](reference/frontmatter-spec.md) - Staleness tracking format
- [Document Templates](reference/document-templates.md) - Core + Optional templates for each doc type
- [README Template](reference/readme-template.md) - README-specific structure and guidelines

### Good/Bad Examples
- [Principles Examples](reference/principles-examples.md) - What makes a good principle
- [Architecture Examples](reference/architecture-examples.md) - Architecture content guidelines
- [Domain Examples](reference/domain-examples.md) - Domain documentation guidelines
- [Patterns Examples](reference/patterns-examples.md) - Code patterns documentation
- [Development Examples](reference/development-examples.md) - Development docs guidelines
- [README Examples](reference/readme-examples.md) - User-facing documentation guidelines
