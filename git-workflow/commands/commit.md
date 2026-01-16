---
description: Create git commits with user approval and no Claude attribution
allowed-tools: Bash, Read, AskUserQuestion
---

# Commit Changes

**Core principle:** Analyze → Plan → Approve → Execute

## Step 1: Analyze Changes

```bash
git status
git diff --stat
git diff
```

Review conversation history to understand what was accomplished. Consider whether changes should be one commit or multiple logical commits.

## Step 2: Plan Commits

For each planned commit, determine:
1. Which files belong together (by concern/purpose)
2. The commit message following Angular convention: `<type>(<scope>): <description>`

**REQUIRED:** Use skill `committing-work` for commit type reference and format guidelines.

## Step 3: Request Approval

> **Skip this step ONLY if user explicitly pre-approved commits.**

Present the plan to the user:

```
I plan to create [N] commit(s):

1. `<type>(<scope>): <description>`
   Files: file1.ts, file2.ts

2. `<type>(<scope>): <description>`
   Files: file3.ts

Shall I proceed?
```

Wait for user approval before continuing.

## Step 4: Execute Commits

For each approved commit:

```bash
# Stage specific files (NEVER use -A or .)
git add path/to/file1.ts path/to/file2.ts

# Commit with message
git commit -m "<type>(<scope>): <description>"
```

After all commits:

```bash
git log --oneline -n [number_of_commits]
```

## Rules

- **NEVER** use `git add -A` or `git add .`
- **NEVER** skip user approval unless explicitly authorized
- **ALWAYS** stage files individually by path
- **ALWAYS** show commit log after execution
