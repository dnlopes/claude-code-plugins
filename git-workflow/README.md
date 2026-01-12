# git-workflow

Git operations with best practices enforcement.

## Purpose

Streamlines version control workflows by providing commands and skills for creating well-structured commits and pull requests.

## Features

### Commands

- `/git-workflow:commit` - Create git commits with user approval and proper message formatting

### Skills

- **committing-work** - Guidelines for drafting good commit messages and organizing commits
- **creating-pull-requests** - Best practices for creating comprehensive pull requests

## Installation

```bash
claude plugins add dnlopes/cloud-code-plugins/git-workflow
```

## Quick Example

```bash
# Create a commit with proper formatting
/git-workflow:commit
```

## How It Works

The commit command:
1. Analyzes your changes with `git status` and `git diff`
2. Drafts clear, descriptive commit messages
3. Presents a plan for your approval
4. Executes the commits
