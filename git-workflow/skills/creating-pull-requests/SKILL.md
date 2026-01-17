---
name: creating-pull-requests
description: Use when creating pull requests, writing PR titles, or preparing branches for review. Provides Angular conventional commit format for PR titles, GitHub CLI commands, and guidelines for breaking change notation.
---

# Creating Pull Requests

## Overview

PR titles follow the same Angular conventional commit format as commits: `<type>(<scope>): <description>`. Use GitHub CLI (`gh`) for PR creation. Always write in English.

**REQUIRED:** Load skill `committing-work` for commit type reference and format details.

## Quick Reference

```bash
# Create PR with GitHub CLI
gh pr create --base main --head <branch> --title "<pr-title>" --body "<pr-body>"

# Create PR interactively
gh pr create

# Create draft PR
gh pr create --draft
```

## PR Title Format

Same as commit messages: `<type>(<scope>): <description>`

- **Breaking changes**: Add **!** after type/scope (e.g., **feat!: remove deprecated API**)
- **Language**: Always English
- **Length**: Under 72 characters

## PR Body Template

```markdown
## Summary
Brief description of changes and motivation.

## Changes
- Change 1
- Change 2

## Testing
How the changes were tested.

## Breaking Changes (if applicable)
Description of breaking changes and migration path.
```

## Examples

**Good PR titles:**
- `feat: add user authentication system`
- `fix: resolve memory leak in rendering process`
- `docs: update API documentation with new endpoints`
- `feat(auth): implement transaction validation`
- `fix!: patch critical security vulnerability`

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Vague title: "Updates" | Specific: `feat: add user search functionality` |
| Past tense: "Fixed bug" | Imperative: `fix: resolve null pointer exception` |
| No type prefix | Always include type: `docs: add setup guide` |
| Non-English title | Always use English |
