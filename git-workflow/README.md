---
scope:
  paths:
    - git-workflow/**
  summary: "Plugin overview and usage guide"
last_updated: 2026-01-26T01:19:17Z
---

# Git-Workflow Plugin

Git and GitHub workflow commands for commits and pull requests.

## Goals

The git-workflow plugin provides structured, user-centric commands for managing Git commits and GitHub pull requests. It emphasizes:

- **User approval workflows** before any destructive actions
- **Angular conventional commit** format for consistency
- **Atomic commits** with individual file staging
- **Clear PR documentation** with structured templates

## Commands

| Command | Description |
|---------|-------------|
| `/git-workflow:commit` | Create git commits with user approval and no Claude attribution. Stages files individually (never `-A` or `.`) |
| `/git-workflow:create-pr` | Create a pull request with proper title, description, and user approval using GitHub CLI |

## Skills

| Skill | Description |
|-------|-------------|
| `committing-work` | Angular conventional commit format guidelines, atomic commit principles, and strategies for splitting multi-concern changes |
| `creating-pull-requests` | PR title format (Angular convention), GitHub CLI commands, and PR body templates |

## Agents

None. All workflow logic is orchestrated through commands, with skills providing declarative knowledge.

## Workflows

### Creating Commits

1. Run `/commit` or request a commit
2. Command analyzes staged and unstaged changes
3. Drafts one or more commits based on logical grouping
4. Presents plan for user approval
5. Stages files individually and creates commits
6. Shows final commit log

### Creating Pull Requests

1. Run `/create-pr` or request a PR
2. Command analyzes current branch and commits
3. Drafts PR with Angular-formatted title and structured body
4. Presents draft for user approval
5. Pushes branch if needed and creates PR
6. Returns PR URL

### Commit Message Format

```
<type>(<scope>): <description>
```

**Types:** feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

## Version

3.0.2
