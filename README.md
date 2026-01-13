<!--
---
scope:
  paths:
    - README.md
    - "*/README.md"
    - "*/.claude-plugin/plugin.json"
  summary: "User-facing documentation for installation, usage, and quick start"
last_review_date: 2025-12-06T02:02:02Z
last_updated: 2025-12-06T02:02:02Z
---
-->

# cloud-code-plugins

A collection of Claude Code plugins for enhanced development workflows.

## Summary

This repository provides plugins that extend Claude Code with specialized capabilities for the entire development lifecycle. From planning and research through implementation, documentation, and code review - these plugins transform Claude Code into a comprehensive development environment.

## Plugins

| Plugin | Description |
|--------|-------------|
| [dev-toolkit](dev-toolkit/) | Planning, research, implementation, and code review workflows |
| [git-workflow](git-workflow/) | Conventional commits and PR management |
| [docs-manager](docs-manager/) | Repository documentation generation and maintenance |
| [review-toolkit](review-toolkit/) | Multi-perspective code review with specialized agents |
| [mcp-shadcn](mcp-shadcn/) | shadcn/ui component documentation |

## Installation

Install individual plugins using the Claude Code CLI:

```bash
# From GitHub
claude plugins add dnlopes/cloud-code-plugins/dev-toolkit
claude plugins add dnlopes/cloud-code-plugins/git-workflow
claude plugins add dnlopes/cloud-code-plugins/docs-manager

# From local path
claude plugins add /path/to/cloud-code-plugins/plugin-name
```

**Requirements:**
- Claude Code CLI installed
- For git-workflow: GitHub CLI (`gh`)

## Quick Start

### Create an Implementation Plan

```bash
claude plugins add dnlopes/cloud-code-plugins/dev-toolkit
```

Then in Claude Code:
```
/dev-toolkit:create-plan
```

### Generate Repository Documentation

```bash
claude plugins add dnlopes/cloud-code-plugins/docs-manager
```

Then in Claude Code:
```
/docs-manager:onboard
```

### Create a Conventional Commit

```bash
claude plugins add dnlopes/cloud-code-plugins/git-workflow
```

Then in Claude Code:
```
/git-workflow:commit
```

## Features

- **Development Planning** - Create detailed implementation plans with thorough codebase research
- **Documentation Management** - Generate and maintain CLAUDE.md, README, and docs/ with git-based staleness tracking
- **Code Review** - Multi-perspective review covering security, bugs, tests, and historical context
- **Git Automation** - Conventional commit enforcement and comprehensive PR creation
- **UI Components** - Access shadcn/ui component documentation via MCP

## Documentation

Detailed documentation is available in `docs/`:

- [Architecture](docs/architecture.md) - System design and component relationships
- [Domain](docs/domain.md) - Concepts and terminology
- [Patterns](docs/patterns.md) - Code conventions and examples
- [Development](docs/development.md) - Contributing and development setup

## Contributing

Contributions are welcome! See [docs/development.md](docs/development.md) for setup instructions.

1. Fork the repository
2. Create a feature branch
3. Follow conventional commit format for commits and PR titles
4. Submit a pull request
