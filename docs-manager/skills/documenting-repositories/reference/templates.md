# Document Templates

Sole source of templates for every document type. Agents and workflow skills MUST read templates from this file rather than carrying their own copies.

All frontmatter blocks use the [HTML-comment-wrapped format](frontmatter-spec.md).

## Contents

- [AGENTS.md (root)](#agentsmd-root)
- [AGENTS.md (module)](#agentsmd-module)
- [CLAUDE.md](#claudemd)
- [docs/architecture.md](#docsarchitecturemd)
- [docs/domain.md](#docsdomainmd)
- [docs/patterns.md](#docspatternsmd)
- [docs/development.md](#docsdevelopmentmd)
- [README.md](#readmemd)
- [Ad-hoc document](#ad-hoc-document)

## AGENTS.md (root)

```markdown
<!--
---
last_updated: <ISO_TIMESTAMP>
---
-->

# <Project Name>

<1-2 sentence description>

## Quick Start

\`\`\`bash
# Build
<build-system command>

# Test
<build-system command>

# Run
<build-system command>
\`\`\`

## Documentation

@docs/architecture.md
@docs/domain.md
@docs/patterns.md
@docs/development.md

- [Architecture](docs/architecture.md) — System design and components
- [Domain](docs/domain.md) — Business concepts and terminology
- [Patterns](docs/patterns.md) — Code conventions and examples
- [Development](docs/development.md) — Build, test, and development

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `<dir>` | <purpose> |
```

**Notes:**

- Root `AGENTS.md` has no `scope` block — it tracks the whole repo.
- Quick Start uses build-system commands.
- Documentation section uses dual-format references (`@` import + markdown link).

## AGENTS.md (module)

For complex modules with co-located documentation:

```markdown
<!--
---
scope:
  paths:
    - <module-path>/**
  summary: "<Module name> technical documentation"
last_updated: <ISO_TIMESTAMP>
---
-->

# <Module Name>

<Why this module exists and what problem it solves. Intent, not behavior.>

## Responsibilities & Boundaries

<What this module owns. What it explicitly does NOT own. Where it hands off to
neighbours.>

## Key Abstractions

### <Abstraction Name>
**Represents:** <the concept, not the class signature>
**Lives in:** `<file path or directory — no line numbers>`
**Invariants:** <rules that must hold>

## Gotchas

- <Non-obvious behavior, surprising consequence, or known trap that an agent
  reading the code would not discover>

## Interactions

- <Module it depends on>: <the contract, not the call sites>
```

**Create module AGENTS.md only when:**

- Internal architecture is non-obvious
- Contains business-critical logic
- Multiple interacting components
- Takes significant time to understand from code

**Do NOT include in a module AGENTS.md:**

- Function / method / parameter listings (agents grep)
- Line numbers
- Code snippets that duplicate what reading the file would show
- Step-by-step walkthroughs of the implementation

## CLAUDE.md

Single line, no frontmatter:

```markdown
@AGENTS.md
```

Applies to both root and module `CLAUDE.md`.

## docs/architecture.md

```markdown
<!--
---
scope:
  paths:
    - <structural directories>
  summary: "System architecture and component relationships"
last_updated: <ISO_TIMESTAMP>
---
-->

# Architecture

## Overview

<2-3 sentences: what does it do, what architectural style>

## Components

### <Component Name>
**Lives in:** `<directory or file path — no line numbers>`
**Owns:** <the concern, the slice of behavior — not a function list>
**Interacts with:** <other components and the nature of the relationship>
```

**Optional sections** (include only when applicable):

- **Data Flow** — when the flow is non-trivial AND not visible from reading any single file
- **External Dependencies** — when external integrations carry semantics not obvious from the client library (e.g., "we treat 429s as success because…")
- **Invariants** — system-wide rules that span multiple components

**Do NOT include:**

- Lists of files in each directory (an `ls` answers this)
- Version numbers of frameworks or libraries

## docs/domain.md

```markdown
<!--
---
scope:
  paths:
    - <domain/model directories>
  summary: "Business domain concepts and terminology"
last_updated: <ISO_TIMESTAMP>
---
-->

# Domain

## Glossary

| Term | Definition |
|------|------------|
| <domain term> | <business definition> |
```

**Optional sections:**

- **Core Entities** — when a domain model exists
- **Business Rules** — when business constraints exist

**Skip `docs/domain.md` entirely** for utility libraries or purely technical projects with no business domain.

## docs/patterns.md

```markdown
<!--
---
scope:
  paths:
    - <representative files>
  summary: "Code patterns and conventions"
last_updated: <ISO_TIMESTAMP>
---
-->

# Patterns

## Project Structure

\`\`\`
<project>/
├── <dir>/          # <what concern lives here>
└── <dir>/          # <what concern lives here>
\`\`\`

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | <convention> | `<example>` |
| Functions | <convention> | `<example>` |
```

**Optional sections:**

- **Error Handling** — when a consistent pattern exists AND deviation would
  cause real problems (logs lost, errors leaked, semantics broken)
- **Testing Patterns** — when tests follow a project-specific approach that
  isn't obvious from a typical test file
- **Common Patterns** — repeating patterns that encode decisions, not boilerplate

**Pattern entries describe the rule and the reason, not the implementation.**
Reference the canonical example by file path or exported symbol — never by line
number, and never reproduce the code inline. An agent reading the pattern
should know *what to do and why*; they can open the file themselves to see *how*.

## docs/development.md

**Audience:** Human developers.

```markdown
<!--
---
scope:
  paths:
    - Makefile
    - package.json
    - docker-compose.yml
  summary: "Build, test, and development workflow"
last_updated: <ISO_TIMESTAMP>
---
-->

# Development

## Prerequisites

- <requirement with version>

## Setup

\`\`\`bash
<setup commands>
\`\`\`

## Build

\`\`\`bash
<build command>
\`\`\`

## Test

\`\`\`bash
<test command>
\`\`\`

## Run Locally

\`\`\`bash
<run command>
\`\`\`
```

**Optional sections:**

- **Environment Variables** — when env vars are used
- **Common Tasks** — when helpful shortcuts exist
- **Deployment** — when a deployment process exists
- **Contributing** — when accepting contributions

## README.md

**Audience:** End users (human-focused). Same HTML-wrapped frontmatter as other docs.

```markdown
<!--
---
scope:
  paths:
    - README.md
    - package.json
  summary: "Project overview and installation"
last_updated: <ISO_TIMESTAMP>
---
-->

# <Project Name>

<One-sentence tagline>

## Summary

<2-3 sentences: what it does, who it's for>

## Installation

\`\`\`bash
<install command>
\`\`\`

## Quick Start

\`\`\`bash
<minimal working example>
\`\`\`

## Documentation

- [Architecture](docs/architecture.md) — System design
- [Domain](docs/domain.md) — Concepts and terminology
- [Patterns](docs/patterns.md) — Code conventions
- [Development](docs/development.md) — Contributing and setup
```

**Optional sections:**

- **Features** — when there are multiple user-visible capabilities
- **Usage** — when Quick Start isn't enough
- **Contributing** — when accepting contributions

**What NOT to include in README.md:**

- Development setup → goes in `docs/development.md`
- Architecture details → goes in `docs/architecture.md`
- All environment variables → goes in `docs/development.md`

## Ad-hoc document

For focused documents created outside the standard set (e.g., via the `adding-documentation` skill):

```markdown
<!--
---
scope:
  paths:
    - <paths this document covers>
  summary: "<Brief description of what this documents>"
last_updated: <ISO_TIMESTAMP>
---
-->

# <Title>

<Why this document exists. What an agent would otherwise have to discover the
hard way.>

## Overview

<High-level explanation of intent, boundaries, and the shape of the thing.>

## Key Concepts

### <Concept Name>
<What it represents in this system. Invariants and gotchas. Not its
implementation.>

## Usage / Interaction

<The contract for working with this. When to use it, when not to. Decision
criteria, not call-site walkthroughs.>

## Related

- <Links to related docs or code by path / symbol — no line numbers>
```

**Ad-hoc documents MUST include `scope.paths`, `scope.summary`, and `last_updated`** to be tracked.

**Ad-hoc documents MUST NOT include:**

- Line numbers in any reference
- Code snippets that duplicate the linked code
- Function / parameter listings
- Version numbers or dependency lists
