# Documentation Examples

Good/bad pairs for each document type. Each pair shows the **same content goal** so the contrast isolates the principle being illustrated.

## Contents

- [Architecture](#architecture)
- [Domain](#domain)
- [Patterns](#patterns)
- [Development](#development)
- [README](#readme)
- [Frontmatter](#frontmatter)
- [Common Mistakes Reference](#common-mistakes-reference)

## Architecture

### Incorrect

```markdown
## Overview

Uses Express.js v4.18.2 with TypeScript 5.0. Connects to PostgreSQL 15 via Prisma ORM 5.3.0.
Runs on Node.js 20. Webpack 5.88 bundles the frontend.
```

**Why it's wrong:** Lists versions (belongs in `package.json`), names implementation libraries, doesn't describe the system. Will rot the next time a dependency is upgraded.

### Correct

```markdown
## Overview

Web application managing user subscriptions. Handles authentication, subscription lifecycle, and payment processing via Stripe. Follows layered architecture with separation between HTTP handlers, business logic, and data access.

## Components

### API Layer
**Location:** `src/api/`
**Responsibility:** HTTP handling, validation, response formatting
**Interacts with:** Services layer
```

**Why it's right:** Describes what the system *does* and *how it's organized*. Stable across dependency upgrades. A reader can locate code from the architectural map.

## Domain

### Incorrect

```markdown
## Glossary

| Term | Definition |
|------|------------|
| API | Application Programming Interface |
| JWT | JSON Web Token |
| REST | Representational State Transfer |
```

**Why it's wrong:** Defines well-known technical acronyms that any developer already knows. Doesn't help an agent understand *this* domain.

### Correct

```markdown
## Glossary

| Term | Definition |
|------|------------|
| Subscription | Recurring agreement for periodic access to the service |
| Plan | Predefined subscription tier with pricing and feature set |
| Churn | When a subscriber cancels or fails to renew |
| Dunning | Process of recovering failed recurring payments |
```

**Why it's right:** Captures domain-specific vocabulary. An agent reading this knows what the business means by these words in code, commits, and tickets.

## Patterns

### Incorrect

```markdown
## Error Handling

We handle errors properly. See Go documentation for best practices.
```

**Why it's wrong:** No project-specific guidance, no examples, defers to external docs. Provides zero signal about *this* codebase's conventions.

### Correct

```markdown
## Error Handling

Errors wrapped with context at each layer. Example from `internal/service/user_service.go:45`:

\`\`\`go
user, err := s.repo.FindByID(ctx, id)
if err != nil {
    return nil, fmt.Errorf("get user %s: %w", id, err)
}
\`\`\`

**Guidelines:**

- Always wrap with `fmt.Errorf("operation: %w", err)`
- Include identifying information (IDs, paths) in the context string
- Never log + return; let the top of the stack decide
```

**Why it's right:** Shows the actual pattern, anchors it with a `file:line` reference, and states the rules concisely. New code can be checked against this with no ambiguity.

## Development

### Incorrect

```markdown
## Test

Run `go test ./...` to run tests.
```

**Why it's wrong:** Raw command instead of the build system. Breaks when test flags or coverage requirements change. No mention of subsets (unit, integration).

### Correct

```markdown
## Test

\`\`\`bash
make test               # All tests
make test-unit          # Unit tests only
make test-integration   # Integration tests
\`\`\`

### Running Specific Tests

\`\`\`bash
make test ARGS="-run TestUserService"
\`\`\`
```

**Why it's right:** Uses the Makefile interface — flag changes, coverage, race detection live in the Makefile and the doc keeps working. Shows useful variants.

## README

### Incorrect

```markdown
# MyProject

## Introduction

MyProject was created in 2019 to solve the problem of database migrations.
Originally developed by Company X using TypeScript 4.0 and inspired by Rails
migrations, it has evolved over the years to support PostgreSQL, MySQL, and SQLite.
```

**Why it's wrong:** History lesson before any value statement. A potential user has to read paragraphs to learn what the tool *does* for them.

### Correct

```markdown
# MyProject

Fast, type-safe database migrations for PostgreSQL.

## Summary

Makes database migrations simple and safe. Define schema changes in TypeScript;
MyProject handles SQL generation, tracking, and rollback.

## Quick Start

\`\`\`bash
myproject init
myproject create add_users_table
myproject migrate
\`\`\`

Your database now has a `users` table.
```

**Why it's right:** Tagline → value → working example. A user knows in ten seconds whether this solves their problem.

## Frontmatter

### Incorrect

```markdown
---
scope:
  paths:
    - src/api/**
last_updated: 2025-01-15
---

# API
```

**Why it's wrong:** Plain YAML frontmatter renders verbatim on GitHub. Timestamp lacks time-of-day and timezone. Easy to misorder (`last_updated` before `scope`).

### Correct

```markdown
<!--
---
scope:
  paths:
    - src/api/**
  summary: "API layer architecture"
last_updated: 2025-01-15T10:30:00Z
---
-->

# API
```

**Why it's right:** Wrapped in HTML comment so GitHub hides it. ISO 8601 UTC timestamp. Includes `summary` for tooling and reviewers.

## Common Mistakes Reference

| Mistake | Problem | Fix |
|---------|---------|-----|
| Listing every file | Needs constant updates | Describe patterns and key directories |
| Version numbers in architecture | Changes frequently | Put in `package.json` / `go.mod` |
| Generic advice ("handle errors properly") | Not actionable | Show *your* patterns with `file:line` |
| No file references | Reader can't find the code | Include `file:line` anchors |
| Raw commands (`go test ./...`) | Breaks when build evolves | Use `make`/`npm` interfaces |
| Plain YAML frontmatter | Renders on GitHub | Wrap in `<!-- ... -->` |
| Local-time timestamps | Ambiguous, hard to compare | ISO 8601 UTC (`Z` suffix) |
| `domain.md` for utility libs | Documents what doesn't exist | Skip the file entirely |
