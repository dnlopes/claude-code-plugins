---
name: creating-pull-requests
description: Use this skill before creating pull requests
---

# Committing Work

## Overview

**Announce at start:** "🟢 I'm using the creating-pull-requests skill to complete this work."

## Key Principles

- Pull-request titles must follow all the commit message rules as described in skill `committing-work`
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
- **Language**: Always use English for PR titles and descriptions
- **Breaking changes**: Add `!` after type/scope for breaking changes, for example `feat!: remove deprecated API`
- Use GitHub CLI to create pull-requests:
```bash
gh pr create --base main --head <branch> --title "<pr-title>" --body "<pr-body>"
```

### Examples

Good pull request titles:
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
