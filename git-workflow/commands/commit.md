---
name: commit
description: Create git commits with user approval and no Claude attribution
---

# Committing Work

## Overview

**Core principle:** Analyze changes → Plan commits → Execute.

## The Process
**IMPORTANT:** use skill `committing-work` to learn how to draft good commit messages and how to organize commits.

### Step 1: Think about what changed

1. Review the conversation history and understand what was accomplished
2. Run `git status` to see current changes
3. Run `git diff` to understand the modifications
4. Consider whether changes should be one commit or multiple logical commits

### Step 2: Plan your commit(s)

1. Identify which files belong together
2. Draft clear, descriptive commit messages
3. Use imperative mood in commit messages
4. Focus on why the changes were made, not just what

### Step 3: Present your plan to the user
> **IMPORTANT** this step can be skipped if the user explicitely allowed.

1. List the files you plan to add for each commit
2. Show the commit message(s) you'll use
3. Ask: "I plan to create [N] commit(s) with these changes. Shall I proceed?"

### Step 4: Execute planned commits
1. Use `git add` with specific files (never use `-A` or `.`)
- Create commits with your planned messages
- Show the result with `git log --oneline -n [number]`
