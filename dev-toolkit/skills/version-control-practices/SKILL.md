---
name: version-control-practices
description: Use this skill when working with git repositories. It provides standards for commits, branching, and handling uncommitted changes.
---

# Version Control Practices

Standards for working with git repositories, including branching, commits, and handling changes.

## Before Starting Work

### Check Repository State

- If the project isn't in a git repo, STOP and ask permission to initialize one
- Check for uncommitted changes or untracked files when starting work
- Suggest committing existing work first before starting new work

### Branching

- When starting work without a clear branch for the current task, create a WIP branch
- Keep branches focused on a single task or feature

## Committing

### Frequency

- Track ALL non-trivial changes in git
- Commit frequently throughout the development process, even if high-level tasks are not yet done
- Don't wait until a feature is complete to commit - commit incremental progress

### Staging Changes

- NEVER use `git add -A` unless you've just done a `git status`
- Review what you're adding to avoid committing unintended files
- Don't add random test files, temporary files, or generated artifacts to the repo

## Pre-Commit Hooks

### Rules

- NEVER skip, evade, or disable a pre-commit hook
- If a hook fails, fix the underlying issue rather than bypassing the hook
- Hooks exist to maintain code quality - respect them

### Common Hook Failures

| Hook | Fix |
|------|-----|
| Linting | Fix the lint errors in your code |
| Type checking | Resolve type errors |
| Tests | Fix failing tests |
| Formatting | Run the formatter |

## What NOT to Commit

- Secrets, API keys, credentials
- `.env` files with real values
- Build artifacts and generated files
- IDE-specific configuration (unless team-shared)
- Temporary test files or debug code
