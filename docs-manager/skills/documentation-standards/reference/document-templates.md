# Document Templates

Templates for each document type in docs/claude/.

## CLAUDE.md Template

```markdown
---
last_commit: <COMMIT_SHA>
last_updated: <ISO_TIMESTAMP>
---

# <Project Name>

<1-2 sentence description of what this project does>

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

These rules MUST be followed when working on this codebase:

1. **<Principle Name>**: <Description>
2. **<Principle Name>**: <Description>
3. **<Principle Name>**: <Description>

## Documentation

@docs/claude/architecture.md
@docs/claude/domain.md
@docs/claude/patterns.md
@docs/claude/development.md

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `<dir>` | <purpose> |
| `<dir>` | <purpose> |
```

## architecture.md Template

```markdown
---
scope:
  paths:
    - <paths>
  summary: "System architecture and component relationships"
last_commit: <COMMIT_SHA>
last_updated: <ISO_TIMESTAMP>
---

# Architecture

## Overview

<2-3 sentences describing the system at the highest level>

## Components

### <Component Name>
**Location:** `<path>`
**Responsibility:** <what it does>
**Interacts with:** <other components>

### <Component Name>
...

## Data Flow

<Describe how data moves through the system. Can use text or ASCII diagram>

```
[Entry Point] → [Component A] → [Component B] → [Output]
                     ↓
              [Component C]
```

## External Dependencies

| Dependency | Purpose | Integration Point |
|------------|---------|-------------------|
| <name> | <why needed> | `<where integrated>` |

## Key Architectural Decisions

### <Decision Title>
**Context:** <why this decision was needed>
**Decision:** <what was decided>
**Consequences:** <implications>
```

## domain.md Template

```markdown
---
scope:
  paths:
    - <paths>
  summary: "Business domain concepts and terminology"
last_commit: <COMMIT_SHA>
last_updated: <ISO_TIMESTAMP>
---

# Domain

## Glossary

| Term | Definition |
|------|------------|
| <term> | <definition> |
| <term> | <definition> |

## Core Entities

### <Entity Name>
**Purpose:** <what it represents>
**Key attributes:**
- `<attribute>`: <meaning>
- `<attribute>`: <meaning>

**Relationships:**
- Has many <other entity>
- Belongs to <other entity>

### <Entity Name>
...

## Business Rules

1. **<Rule Name>**: <description of invariant or constraint>
2. **<Rule Name>**: <description>

## Domain Patterns

<Any domain-specific patterns like state machines, workflows, etc.>
```

## patterns.md Template

```markdown
---
scope:
  paths:
    - <paths>
  summary: "Code patterns and conventions with examples"
last_commit: <COMMIT_SHA>
last_updated: <ISO_TIMESTAMP>
---

# Patterns

## Project Structure

```
<project>/
├── <dir>/          # <purpose>
├── <dir>/          # <purpose>
└── <dir>/          # <purpose>
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | <convention> | `<example>` |
| Functions | <convention> | `<example>` |
| Types/Classes | <convention> | `<example>` |

## Error Handling

<1 paragraph describing the approach>

\`\`\`<language>
// Example from <file:line>
<code example>
\`\`\`

## Testing Patterns

<1 paragraph describing the approach>

\`\`\`<language>
// Example from <file:line>
<code example>
\`\`\`

## Common Patterns

### <Pattern Name>
<When to use this pattern>

\`\`\`<language>
// Example from <file:line>
<code example>
\`\`\`

### <Pattern Name>
...
```

## development.md Template

```markdown
---
scope:
  paths:
    - <paths>
  summary: "Build, test, and development workflow"
last_commit: <COMMIT_SHA>
last_updated: <ISO_TIMESTAMP>
---

# Development

## Prerequisites

- <requirement with version>
- <requirement with version>

## Setup

\`\`\`bash
<setup commands>
\`\`\`

## Build

\`\`\`bash
<build command>        # <what it does>
<build command>        # <what it does>
\`\`\`

## Test

\`\`\`bash
<test command>         # <what it does>
<test command>         # <what it does>
\`\`\`

## Run Locally

\`\`\`bash
<run command>
\`\`\`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `<VAR>` | Yes/No | <description> |

## Common Tasks

### <Task Name>
\`\`\`bash
<commands>
\`\`\`

## Deployment

<Brief overview of deployment process>
```

## modules/[name].md Template

```markdown
---
scope:
  paths:
    - <module paths>
  summary: "<Module name> internals and key abstractions"
last_commit: <COMMIT_SHA>
last_updated: <ISO_TIMESTAMP>
---

# <Module Name>

## Purpose

<Why this module exists and what problem it solves>

## Key Abstractions

### <Abstraction Name>
**What:** <description>
**Why:** <rationale>
**Where:** `<file path>`

## Internal Architecture

<How the module is organized internally>

## Public Interface

<Key exports/APIs that other modules use>

## Usage Examples

\`\`\`<language>
// Common usage pattern
<example>
\`\`\`

## Gotchas

- <Non-obvious behavior or constraint>
- <Common mistake to avoid>
```
