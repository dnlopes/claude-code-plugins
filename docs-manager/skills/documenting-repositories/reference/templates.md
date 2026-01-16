# Document Templates

Templates for all document types. Each uses **Core + Optional** structure.

## Contents

- [AGENTS.md (Root)](#agentsmd-root)
- [AGENTS.md (Module)](#agentsmd-module)
- [CLAUDE.md](#claudemd)
- [docs/architecture.md](#docsarchitecturemd)
- [docs/domain.md](#docsdomainmd)
- [docs/patterns.md](#docspatternsmd)
- [docs/development.md](#docsdevelopmentmd)
- [README.md](#readmemd)

## AGENTS.md (Root)

```markdown
---
last_updated: <ISO_TIMESTAMP>
---

# <Project Name>

<1-2 sentence description>

## Quick Start

\`\`\`bash
# Build
<build command>

# Test
<test command>

# Run
<run command>
\`\`\`

## Principles

These rules MUST be followed:

1. **<Principle Name>**: <Actionable guidance>
2. **<Principle Name>**: <Actionable guidance>

## Documentation

@docs/architecture.md
@docs/domain.md
@docs/patterns.md
@docs/development.md

- [Architecture](docs/architecture.md) - System design and components
- [Domain](docs/domain.md) - Business concepts and terminology
- [Patterns](docs/patterns.md) - Code conventions and examples
- [Development](docs/development.md) - Build, test, and development

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `<dir>` | <purpose> |
```

### Guidelines
- Principles must be actionable ("do X" not "X exists")
- 3-7 principles maximum
- Quick Start uses build system interfaces
- Dual-format doc references (@ and markdown links)

## AGENTS.md (Module)

For complex modules with co-located documentation:

```markdown
---
scope:
  paths:
    - <module-path>/**
  summary: "<Module name> technical documentation"
last_updated: <ISO_TIMESTAMP>
---

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

### When to Create Module Docs
- Has non-obvious internal architecture
- Contains business-critical logic
- Multiple interacting components
- Takes significant time to understand from code

## CLAUDE.md

Single line file:

```markdown
@AGENTS.md
```

For modules: `@AGENTS.md` (points to module's AGENTS.md)

## docs/architecture.md

### Required Sections

```markdown
---
scope:
  paths:
    - <structural directories>
  summary: "System architecture and component relationships"
last_updated: <ISO_TIMESTAMP>
---

# Architecture

## Overview

<2-3 sentences: what does it do, what architectural style>

## Components

### <Component Name>
**Location:** `<path>`
**Responsibility:** <what it does>
**Interacts with:** <other components>
```

### Optional Sections

**Data Flow** - Include when non-trivial flow exists
```markdown
## Data Flow

\`\`\`
[Entry] → [Component A] → [Component B] → [Output]
\`\`\`
```

**External Dependencies** - Include when external integrations exist
```markdown
## External Dependencies

| Dependency | Purpose | Integration Point |
|------------|---------|-------------------|
| <name> | <why> | `<path>` |
```

## docs/domain.md

### Required Sections

```markdown
---
scope:
  paths:
    - <domain/model directories>
  summary: "Business domain concepts and terminology"
last_updated: <ISO_TIMESTAMP>
---

# Domain

## Glossary

| Term | Definition |
|------|------------|
| <domain term> | <business definition> |
```

### Optional Sections

**Core Entities** - Include when domain model exists
**Business Rules** - Include when business constraints exist

**Note:** For utility libraries or technical projects, this may be minimal or skipped.

## docs/patterns.md

### Required Sections

```markdown
---
scope:
  paths:
    - <representative files>
  summary: "Code patterns and conventions"
last_updated: <ISO_TIMESTAMP>
---

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

### Optional Sections

**Error Handling** - Include when consistent pattern exists
**Testing Patterns** - Include when tests follow consistent approach
**Common Patterns** - Include when repeating patterns exist

Include file:line references for examples.

## docs/development.md

**Audience:** Human developers

### Required Sections

```markdown
---
scope:
  paths:
    - Makefile
    - package.json
    - docker-compose.yml
  summary: "Build, test, and development workflow"
last_updated: <ISO_TIMESTAMP>
---

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

### Optional Sections

**Environment Variables** - Include when env vars used
**Common Tasks** - Include when helpful shortcuts exist
**Deployment** - Include when deployment process exists
**Contributing** - Include when accepting contributions

## README.md

**Audience:** Users (human-focused)

### Required Sections

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

<One sentence tagline>

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

- [Architecture](docs/architecture.md) - System design
- [Domain](docs/domain.md) - Concepts and terminology
- [Patterns](docs/patterns.md) - Code conventions
- [Development](docs/development.md) - Contributing and setup
```

### Optional Sections

**Features** - Include when multiple user-visible capabilities
**Usage** - Include when Quick Start isn't enough
**Contributing** - Include when accepting contributions

### What NOT to Include
- Development setup (goes in docs/development.md)
- Architecture details (goes in docs/architecture.md)
- All environment variables (goes in docs/development.md)
