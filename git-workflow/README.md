# git-workflow

Git operations and GitHub PR management with best practices enforcement.

## Purpose

Streamlines version control workflows by providing commands and skills for creating well-structured commits and pull requests.

## Features

### Commands

- `/git-workflow:commit` - Create git commits with user approval and proper message formatting
- `/git-workflow:create-pr` - Create a new branch, push to remote, and open a GitHub pull request

### Skills

- **committing-work** - Guidelines for drafting good commit messages and organizing commits
- **creating-pull-requests** - Best practices for creating comprehensive pull requests

## Installation

```bash
claude-code plugins install /path/to/cloud-code-plugins/git-workflow
```

## Quick Example

```bash
# Create a commit with proper formatting
/git-workflow:commit

# Create and push a branch, then open a PR
/git-workflow:create-pr
```

## How It Works

The commit command:
1. Analyzes your changes with `git status` and `git diff`
2. Drafts clear, descriptive commit messages
3. Presents a plan for your approval
4. Executes the commits

The create-pr command:
1. Reviews commit history since branching
2. Creates a comprehensive PR summary
3. Pushes changes and opens the PR via `gh`
