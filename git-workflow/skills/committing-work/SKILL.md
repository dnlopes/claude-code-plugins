---
name: committing-work
description: Use this skill before committing changes on the repository.
---

# Committing Work

## Overview

**Announce at start:** "🟢 I'm using the committing-work skill to complete this work."

## Key Principles

- **Commit message**: commit messages must be constructed based on the changes detected
- **Atomic commits**: Each commit should contain related changes that serve a single purpose
- **Split large changes**: If changes touch multiple concerns, split them into separate commits
- **Conventional commit format**: Use the Angular convention format `<type>(<scope>): <description>`:
  - `<scope>` section is optional and indicates the affected module/component
  - `<type>` section is one of:
    - `feat`: A new feature
    - `fix`: A bug fix
    - `docs`: Documentation changes
    - `style`: Code style changes (formatting, whitespace, etc) - not CSS changes
    - `refactor`: Code changes that neither fix bugs nor add features
    - `perf`: Performance improvements
    - `test`: Adding or fixing tests
    - `build`: Changes to build system or external dependencies
    - `ci`: Changes to CI configuration files and scripts
    - `chore`: Other changes that don't modify src or test files
    - `revert`: Reverts a previous commit
- **Present tense, imperative mood**: Write commit messages as commands (e.g., "add feature" not "added feature")
- **Ignore not relevant changes**: Changed files unrelated to the work done should be ignored (e.g., temporary files). If unsure, ask the user for guidance.
- **Concise first line**: Keep the first line under 72 characters
- **Breaking changes**: Add `!` after type/scope for breaking changes (e.g., `feat!: remove deprecated API`) or include `BREAKING CHANGE:` in the footer

### Guidelines for Splitting Commits

When analyzing the diff, consider splitting commits based on these criteria:

1. **Different concerns**: Changes to unrelated parts of the codebase
2. **Different types of changes**: Mixing features, fixes, refactoring, etc.
3. **File patterns**: Changes to different types of files (e.g., source code vs documentation)
4. **Logical grouping**: Changes that would be easier to understand or review separately
6. **Size**: Very large changes that would be clearer if broken down

### Examples

Good commit messages:
- feat: add user authentication system
- fix: resolve memory leak in rendering process
- docs: update API documentation with new endpoints
- refactor: simplify error handling logic in parser
- fix: resolve linter warnings in component files
- chore: improve developer tooling setup process
- feat(auth): implement business logic for transaction validation
- fix(ui): address minor styling inconsistency in header
- fix!: patch critical security vulnerability in auth flow
- style: reorganize component structure for better readability
- fix: remove deprecated legacy code
- feat(forms): add input validation for user registration form
- ci: resolve failing CI pipeline tests
- feat(analytics): implement analytics tracking for user engagement
- fix(security): strengthen authentication password requirements
- feat(a11y): improve form accessibility for screen readers

Example of splitting commits:
- First commit: feat(types): add new solc version type definitions
- Second commit: docs: update documentation for new solc versions
- Third commit: build: update package.json dependencies
- Fourth commit: feat(types): add type definitions for new API endpoints
- Fifth commit: feat(workers): improve concurrency handling in worker threads
- Sixth commit: fix: resolve linting issues in new code
- Seventh commit: test: add unit tests for new solc version features
- Eighth commit: fix(deps): update dependencies with security vulnerabilities
