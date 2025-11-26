# dev-toolkit

Complete development lifecycle toolkit for planning, research, implementation, and codebase analysis.

## Purpose

Provides end-to-end development workflow support through specialized agents, interactive planning commands, and language-specific best practices.

## Features

### Commands

- `/dev-toolkit:create-plan` - Create detailed implementation plans through interactive research and collaboration
- `/dev-toolkit:implement-plan` - Execute approved technical plans phase by phase with verification
- `/dev-toolkit:research-codebase` - Conduct comprehensive codebase research using parallel agents

### Agents

- **codebase-locator** - Locates files, directories, and components relevant to a feature or task
- **codebase-analyzer** - Analyzes codebase implementation details
- **codebase-pattern-finder** - Finds similar implementations and usage patterns
- **web-search-researcher** - Researches modern best practices and solutions via web search

### Skills

- **golang-dev-guidelines** - Go development best practices, proverbs, and testing standards
- **software-architecture** - Quality-focused software architecture principles

## Installation

```bash
claude-code plugins install /path/to/cloud-code-plugins/dev-toolkit
```

## Quick Example

```bash
# Create an implementation plan for a new feature
/dev-toolkit:create-plan

# Research how authentication is implemented
/dev-toolkit:research-codebase "How does user authentication work?"

# Execute an approved plan
/dev-toolkit:implement-plan docs/plans/2025-11-26-add-auth.md
```

## Agent Usage

Agents are invoked automatically by commands, but can also be used directly via the Task tool when you need focused, specialized research or analysis.
