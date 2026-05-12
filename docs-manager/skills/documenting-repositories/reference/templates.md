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

<What this module does and why it exists>

## Key Abstractions

### <Abstraction Name>
**Purpose:** <what it represents>
**Location:** `<file path>`

## Architecture

<Internal structure if complex>

## Gotchas

- <Non-obvious behavior>
- <Common mistakes>

## Dependencies

- <Other module>: <how it's used>
```

**Create module AGENTS.md only when:**

- Internal architecture is non-obvious
- Contains business-critical logic
- Multiple interacting components
- Takes significant time to understand from code

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
**Location:** `<path>`
**Responsibility:** <what it does>
**Interacts with:** <other components>
```

**Optional sections** (include only when applicable):

- **Data Flow** — when non-trivial flow exists
- **External Dependencies** — when external integrations exist

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
├── <dir>/          # <purpose>
└── <dir>/          # <purpose>
\`\`\`

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | <convention> | `<example>` |
| Functions | <convention> | `<example>` |
```

**Optional sections:**

- **Error Handling** — when a consistent pattern exists
- **Testing Patterns** — when tests follow a consistent approach
- **Common Patterns** — when repeating patterns exist

Always include `file:line` references for pattern examples.

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

<What this document covers and why it exists>

## Overview

<High-level explanation>

## Key Concepts

### <Concept Name>
<Explanation>

## Usage

<How to use/interact with what's documented>

## Related

- <Links to related docs or code>
```

Ad-hoc documents MUST include `scope.paths`, `scope.summary`, and `last_updated` to be tracked.
