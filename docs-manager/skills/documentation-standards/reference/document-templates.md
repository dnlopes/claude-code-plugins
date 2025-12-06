# Document Templates

Templates for each document type. Each template uses a **Core + Optional** structure - required sections that always appear, and optional sections with clear triggers for when to include them.

## Template Structure

Each template below specifies:
- **Required sections** - Always include these
- **Optional sections** - Include when the trigger condition is met
- **Skip guidance** - When to omit optional sections

**Important:** Do NOT include optional sections just because they exist in the template. Empty or generic content is worse than missing sections. If you can't provide meaningful content for an optional section, skip it.

---

## CLAUDE.md Template

```markdown
---
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

1. **<Principle Name>**: <Actionable guidance for developers>
2. **<Principle Name>**: <Actionable guidance for developers>
3. **<Principle Name>**: <Actionable guidance for developers>

## Documentation

@docs/architecture.md
@docs/domain.md
@docs/patterns.md
@docs/development.md

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `<dir>` | <purpose> |
| `<dir>` | <purpose> |
```

### CLAUDE.md Guidelines
- **Principles must be actionable** - Each principle tells developers what to DO
- **3-7 principles max** - If everything is a principle, nothing is
- **Quick Start uses build system** - Use `make test` not `go test ./...`
- **@ imports** - These cause Claude Code to auto-load docs at session start

---

## architecture.md Template

### Required Sections

```markdown
---
scope:
  paths:
    - <paths covering architectural files>
  summary: "System architecture and component relationships"
last_review_date: <ISO_TIMESTAMP>
last_updated: <ISO_TIMESTAMP>
---

# Architecture

## Overview

<2-3 sentences describing the system at the highest level. What does it do? What architectural style does it follow?>

## Components

### <Component Name>
**Location:** `<path>`
**Responsibility:** <what it does>
**Interacts with:** <other components>

<Brief description if needed>

### <Component Name>
...
```

### Optional Sections

#### Data Flow
**Include when:** System has non-trivial data flow between components

```markdown
## Data Flow

<Describe how data moves through the system. ASCII diagram recommended.>

\`\`\`
[Entry Point] → [Component A] → [Component B] → [Output]
                     ↓
              [Component C]
\`\`\`
```

**Skip when:** Simple CRUD app with straightforward request/response

#### External Dependencies
**Include when:** System integrates with external services

```markdown
## External Dependencies

| Dependency | Purpose | Integration Point |
|------------|---------|-------------------|
| <name> | <why needed> | `<where integrated>` |

### <Dependency Name>
<Brief description of integration>
```

**Skip when:** No external service integrations

#### Key Architectural Decisions
**Include when:** Significant decisions are documented or clearly evident from code

```markdown
## Key Architectural Decisions

### <Decision Title>
**Context:** <why this decision was needed>
**Decision:** <what was decided>
**Consequences:** <implications>
```

**Skip when:** No significant architectural decisions to document

---

## domain.md Template

### Required Sections

```markdown
---
scope:
  paths:
    - <paths covering domain/model files>
  summary: "Business domain concepts and terminology"
last_review_date: <ISO_TIMESTAMP>
last_updated: <ISO_TIMESTAMP>
---

# Domain

## Glossary

| Term | Definition |
|------|------------|
| <domain term> | <definition in business context> |
| <domain term> | <definition> |
```

### Optional Sections

#### Core Entities
**Include when:** Project has a domain model with entities

```markdown
## Core Entities

### <Entity Name>
**Purpose:** <what it represents in business terms>
**Key attributes:**
- `<attribute>`: <business meaning>
- `<attribute>`: <business meaning>

**Relationships:**
- Has many <other entity>
- Belongs to <other entity>
```

**Skip when:** Technical library, utility, or project without domain model

#### Business Rules
**Include when:** Business constraints exist

```markdown
## Business Rules

1. **<Rule Name>**: <description of invariant or constraint>
2. **<Rule Name>**: <description>
```

**Skip when:** No business logic constraints

#### Domain Patterns
**Include when:** Domain-specific patterns exist (state machines, workflows)

```markdown
## Domain Patterns

### <Pattern Name>
<Description with diagram if helpful>
```

**Skip when:** No complex domain logic

### When to Skip domain.md Entirely

For utility libraries, infrastructure tools, or purely technical projects, domain.md may not be needed. If your glossary would only contain technical terms (not business terms), consider skipping this document.

---

## patterns.md Template

### Required Sections

```markdown
---
scope:
  paths:
    - <paths covering representative files>
  summary: "Code patterns and conventions with examples"
last_review_date: <ISO_TIMESTAMP>
last_updated: <ISO_TIMESTAMP>
---

# Patterns

## Project Structure

\`\`\`
<project>/
├── <dir>/          # <purpose>
├── <dir>/          # <purpose>
└── <dir>/          # <purpose>
\`\`\`

### Conventions
- <convention about structure>
- <convention about file placement>

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | <convention> | `<example>` |
| Functions | <convention> | `<example>` |
| Types/Classes | <convention> | `<example>` |
```

### Optional Sections

#### Error Handling
**Include when:** Consistent error handling pattern exists

```markdown
## Error Handling

<1 paragraph describing the approach>

\`\`\`<language>
// Example from <file:line>
<code example>
\`\`\`

### Guidelines
- <guideline>
- <guideline>
```

**Skip when:** Standard language idioms with no project-specific patterns

#### Testing Patterns
**Include when:** Tests exist with consistent approach

```markdown
## Testing Patterns

<1 paragraph describing the approach>

\`\`\`<language>
// Example from <file:line>
<code example>
\`\`\`

### Guidelines
- <guideline>
- <guideline>
```

**Skip when:** No tests or no consistent testing pattern

#### Common Patterns
**Include when:** Repeating patterns exist throughout codebase

```markdown
## Common Patterns

### <Pattern Name>
<When to use this pattern>

\`\`\`<language>
// Example from <file:line>
<code example>
\`\`\`
```

**Skip when:** No significant repeating patterns beyond standard idioms

---

## development.md Template

**Audience:** Human developers (this is human-focused documentation)

### Required Sections

```markdown
---
scope:
  paths:
    - <paths covering build/config files>
  summary: "Build, test, and development workflow"
last_review_date: <ISO_TIMESTAMP>
last_updated: <ISO_TIMESTAMP>
---

# Development

## Prerequisites

- <requirement with version>
- <requirement with version>

## Setup

\`\`\`bash
<setup commands with explanations>
\`\`\`

## Build

\`\`\`bash
<build command>        # <what it does>
\`\`\`

## Test

\`\`\`bash
<test command>         # <what it does>
\`\`\`

## Run Locally

\`\`\`bash
<run command>
\`\`\`
```

### Optional Sections

#### Environment Variables
**Include when:** Environment variables are used

```markdown
## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `<VAR>` | Yes/No | <default> | <description> |
```

**Skip when:** No environment variables

#### Common Tasks
**Include when:** Helpful shortcuts or workflows exist

```markdown
## Common Tasks

### <Task Name>
\`\`\`bash
<commands>
\`\`\`
```

**Skip when:** No tasks beyond build/test/run

#### Deployment
**Include when:** Deployment process exists

```markdown
## Deployment

<Brief overview of deployment process>
```

**Skip when:** Library, CLI tool, or no deployment process

#### Contributing
**Include when:** Repository accepts contributions

```markdown
## Contributing

### Code Style
<Brief guidelines>

### Pull Request Process
1. <step>
2. <step>
```

**Skip when:** Internal project not accepting contributions

---

## modules/[name].md Template (Rare)

**Only create when:** Module has non-obvious behavior, is frequently modified, or has complex internal architecture that can't be adequately covered in architecture.md.

Most repositories do NOT need module docs.

```markdown
---
scope:
  paths:
    - <module paths>
  summary: "<Module name> internals and key abstractions"
last_review_date: <ISO_TIMESTAMP>
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

## Usage Examples

\`\`\`<language>
// Common usage pattern
<example>
\`\`\`

## Gotchas

- <Non-obvious behavior>
- <Common mistake to avoid>
```

---

## General Guidelines

### Commands Must Use Build System

If the project has a Makefile, package.json scripts, or similar:
- **Right:** `make test`, `npm test`, `docker-compose up`
- **Wrong:** `go test ./...`, `jest`, `docker run ...`

The build system IS the interface. Raw commands are implementation details.

### Skip Generic Content

**Wrong:** Including a section with generic or obvious content just because the template has it

**Right:** Skip sections that would only contain filler. Empty sections are worse than missing sections.

### One Good Example Per Pattern

**Wrong:** Listing every instance of a pattern

**Right:** One representative example with file:line reference

### Stable Over Time

If content would need frequent updates, it's too detailed. Document patterns and concepts, not implementation details.
