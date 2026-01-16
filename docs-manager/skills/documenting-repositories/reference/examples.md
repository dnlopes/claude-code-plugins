# Documentation Examples

Good/bad examples for each document type.

## Contents

- [Principles](#principles)
  - [Good Principles](#good-principles)
  - [Bad Principles](#bad-principles)
  - [The Three-Question Test](#the-three-question-test)
- [Architecture](#architecture)
- [Domain](#domain)
- [Patterns](#patterns)
- [Development](#development)
- [README](#readme)
- [Common Mistakes](#common-mistakes)

## Principles

### Good Principles

```markdown
**Test-First Development**: Write tests before implementation. All new features must have failing tests first.
```
- Actionable: tells developers what to DO
- Invariant: must be maintained
- Consequential: violating causes problems

```markdown
**Repository Pattern**: All database access must go through repository interfaces. No direct queries in business logic.
```

### Bad Principles

```markdown
**Releases are automated**: release.yaml handles semantic versioning.
```
- Not actionable: describes infrastructure, not developer action
- Not guidance: developers don't do anything

```markdown
**TypeScript**: The codebase uses TypeScript.
```
- Not actionable: just states a fact
- Not guidance: obvious from the code

### The Three-Question Test

For each principle, ask:
1. Does this tell a developer what to DO?
2. Is this an invariant that must be maintained?
3. Would violating this cause problems?

All yes = principle. Otherwise = observation.

## Architecture

### Good Architecture

```markdown
## Overview

Web application managing user subscriptions. Handles authentication, subscription lifecycle, and payment processing via Stripe. Follows layered architecture with separation between HTTP handlers, business logic, and data access.

## Components

### API Layer
**Location:** `src/api/`
**Responsibility:** HTTP handling, validation, response formatting
**Interacts with:** Services layer
```
- Explains what system does
- Shows component relationships
- Stable over time

### Bad Architecture

```markdown
## Overview

Uses Express.js v4.18.2 with TypeScript 5.0. Connects to PostgreSQL 15 via Prisma ORM...
```
- Lists versions (belongs in package.json)
- Implementation details
- Doesn't explain design

## Domain

### Good Domain

```markdown
## Glossary

| Term | Definition |
|------|------------|
| Subscription | Recurring agreement for periodic access |
| Plan | Predefined subscription with pricing |
| Churn | When subscriber cancels or fails to renew |
```
- Domain-specific terms
- Business definitions

### Bad Domain

```markdown
## Glossary

| Term | Definition |
|------|------------|
| API | Application Programming Interface |
| JWT | JSON Web Token |
```
- Technical terms (not domain)
- Developers already know these

## Patterns

### Good Patterns

```markdown
## Error Handling

Errors wrapped with context at each layer.

\`\`\`go
// From internal/service/user_service.go:45
func (s *UserService) GetUser(ctx context.Context, id string) (*User, error) {
    user, err := s.repo.FindByID(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("get user %s: %w", id, err)
    }
    return user, nil
}
\`\`\`

### Guidelines
- Always wrap with `fmt.Errorf("operation: %w", err)`
- Include identifying information in context
```
- Real code from codebase
- File:line reference
- Clear guidelines

### Bad Patterns

```markdown
## Error Handling

We handle errors properly. See Go documentation for best practices.
```
- No project-specific guidance
- No examples
- Links elsewhere

## Development

### Good Development

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
- Uses build system (make)
- Multiple options
- Shows how to target specific tests

### Bad Development

```markdown
## Test

Run `go test ./...` to run tests.
```
- Raw command instead of build system
- No options
- Missing requirements

## README

### Good README

```markdown
# MyProject

Fast, type-safe database migrations for PostgreSQL.

## Summary

Makes database migrations simple and safe. Define schema changes in TypeScript, and MyProject handles SQL generation, tracking, and rollback.

## Quick Start

\`\`\`bash
myproject init
myproject create add_users_table
myproject migrate
\`\`\`

That's it! Your database now has a `users` table.
```
- Clear tagline
- Value proposition
- Working example with outcome

### Bad README

```markdown
# MyProject

## Introduction

MyProject was created to solve the problem of database migrations. Developed by Company X using TypeScript...
```
- No quick tagline
- Irrelevant history
- User has to read paragraph to understand

## Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Listing every file | Needs constant updates | Describe patterns |
| Version numbers in architecture | Changes frequently | Put in package.json |
| Generic advice | Not useful | Show YOUR patterns |
| No file references | Can't find context | Include file:line |
| Raw commands | Breaks when build changes | Use make/npm |
