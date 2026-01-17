---
name: committing-work
description: Use when creating git commits, staging changes, or writing commit messages. Provides Angular conventional commit format guidelines, atomic commit principles, and strategies for splitting multi-concern changes into logical commits.
---

# Committing Work

## Overview

Commits follow the Angular conventional commit format: `<type>(<scope>): <description>`. Each commit should be atomic (single purpose) and use imperative mood ("add feature" not "added feature").

## Quick Reference

| Type | Purpose |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (not CSS) |
| `refactor` | Code change without feature/fix |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `build` | Build system or dependencies |
| `ci` | CI configuration |
| `chore` | Other (no src/test changes) |
| `revert` | Reverts previous commit |

## Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

- **scope**: Optional, indicates affected module/component
- **description**: Imperative mood, under 72 characters
- **Breaking changes**: Add **!** after type/scope (e.g., **feat!: remove deprecated API**) or include **BREAKING CHANGE:** in footer

## Key Principles

1. **Atomic commits**: One commit = one logical change
2. **Imperative mood**: "add" not "added", "fix" not "fixed"
3. **Concise first line**: Under 72 characters
4. **Focus on why**: Explain the reason, not just the what
5. **Ignore irrelevant changes**: Skip temporary files or unrelated modifications

## When to Split Commits

Split when changes involve:
- **Different concerns**: Unrelated parts of the codebase
- **Different types**: Mixing features, fixes, refactoring
- **Different file patterns**: Source code vs documentation
- **Large scope**: Changes clearer when broken down

## Examples

**Good commit messages:**
- `feat: add user authentication system`
- `fix: resolve memory leak in rendering process`
- `docs: update API documentation with new endpoints`
- `refactor: simplify error handling logic in parser`
- `feat(auth): implement transaction validation`
- `fix!: patch critical security vulnerability in auth flow`

**Split commit sequence:**
1. `feat(types): add new solc version type definitions`
2. `docs: update documentation for new solc versions`
3. `build: update package.json dependencies`
4. `test: add unit tests for new solc version features`
