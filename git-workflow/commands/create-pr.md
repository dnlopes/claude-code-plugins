---
description: Create a pull request with proper title, description, and user approval
allowed-tools: Bash, Read, AskUserQuestion
---

# Create Pull Request

**Core principle:** Analyze → Draft → Approve → Create

## Step 1: Analyze Branch State

```bash
# Check current branch and status
git branch --show-current
git status

# Check commits since base branch
git log --oneline main..HEAD

# Check if branch is pushed
git status -sb
```

Ensure all changes are committed before creating PR.

## Step 2: Draft PR Content

**REQUIRED:** Use skill `creating-pull-requests` for title format and body template.

Draft the PR:
1. **Title**: Angular convention format `<type>(<scope>): <description>`
2. **Body**: Include summary, changes, and testing sections

## Step 3: Request Approval

Present the draft to the user:

```
Pull Request Draft:

Title: <type>(<scope>): <description>

Body:
## Summary
[Brief description]

## Changes
- [Change 1]
- [Change 2]

## Testing
[How changes were tested]

Base: main
Head: [current-branch]

Shall I create this PR?
```

Wait for user approval before continuing.

## Step 4: Create Pull Request

```bash
# Push branch if needed
git push -u origin $(git branch --show-current)

# Create PR with GitHub CLI
gh pr create --base main --title "<pr-title>" --body "<pr-body>"
```

After creation, display the PR URL:

```bash
gh pr view --web
```

## Rules

- **NEVER** create PR without user approval
- **ALWAYS** ensure branch is pushed before creating PR
- **ALWAYS** use Angular convention for PR title
- **ALWAYS** include meaningful PR body with summary and changes
