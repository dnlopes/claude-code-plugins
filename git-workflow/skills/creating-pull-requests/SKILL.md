---
name: creating-pull-requests
description: Use this skill before creating pull requests
---

# Committing Work

## Overview

**Announce at start:** "🟢 I'm using the creating-pull-requests skill to complete this work."

## Key Principles

- Pull-request titles must follow all the commit message rules as described in skill `committing-work`
- Use GitHub CLI to create pull-requests:
```bash
gh pr create --base main --head <branch> --title "<pr-title>" --body "<pr-body>"
```

### Examples

Good pull request tiles:
- ✨ feat: add user authentication system
- 🐛 fix: resolve memory leak in rendering process
- 📝 docs: update API documentation with new endpoints
- ♻️ refactor: simplify error handling logic in parser
- 🚨 fix: resolve linter warnings in component files
- 🧑‍💻 chore: improve developer tooling setup process
- 👔 feat: implement business logic for transaction validation
- 🩹 fix: address minor styling inconsistency in header
- 🚑️ fix: patch critical security vulnerability in auth flow
- 🎨 style: reorganize component structure for better readability
- 🔥 fix: remove deprecated legacy code
- 🦺 feat: add input validation for user registration form
- 💚 fix: resolve failing CI pipeline tests
- 📈 feat: implement analytics tracking for user engagement
- 🔒️ fix: strengthen authentication password requirements
- ♿️ feat: improve form accessibility for screen readers
