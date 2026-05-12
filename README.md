<!--
---
scope:
  paths:
    - .claude-plugin/marketplace.json
    - "*/.claude-plugin/plugin.json"
    - "*/commands/*.md"
    - docs/*.md
  summary: "Repository overview, plugin catalog, and quick start guide"
last_updated: 2026-01-26T00:00:00Z
---
-->

# Claude Code Plugins

A marketplace of production-ready plugins extending Claude Code CLI with specialized agents for code review, documentation, git workflows, UI development, and architectural governance.

## Features

- **Documentation Management** - AI-optimized docs with git-based staleness tracking
- **Git Workflows** - Structured commits and PRs with Angular convention
- **Architectural Governance** - Tenet management with evidence tracking and CI/CD integration
- **Code Review** - Multi-agent review (bug hunting, security, quality, tests, contracts, history)
- **UI Development** - Headless browser automation and shadcn/ui integration

## Plugins

| Plugin | Version | Purpose |
|--------|---------|---------|
| `docs-manager` | 4.3.0 | Documentation generation with staleness tracking |
| `git-workflow` | 3.0.2 | Commit and PR workflows with Angular convention |
| `governor` | 3.1.0 | Architectural tenet management and verification |
| `review-toolkit` | 4.0.0 | Multi-agent code review |
| `ui-dev` | 2.1.0 | UI development with browser automation and shadcn/ui |

## Installation

Clone this repository to your Claude Code plugins directory:

```bash
git clone <repository-url> ~/.claude/plugins/claude-code-plugins
```

No build step required. Plugins auto-discover via `marketplace.json`.

## Usage

```bash
# Generate repository documentation
/docs-manager:onboard

# Create git commits with Angular convention
/git-workflow:commit

# Discover and create architectural tenets
/governor:setup

# Multi-agent pull request review
/review-toolkit:review-pr
```

## Project Structure

```
claude-code-plugins/
├── .claude-plugin/
│   └── marketplace.json      # Registry of all plugins
├── <plugin>/
│   ├── .claude-plugin/
│   │   └── plugin.json       # Plugin metadata
│   ├── commands/             # Workflow orchestrators
│   ├── skills/               # Declarative knowledge
│   └── agents/               # Autonomous workers
├── docs/                     # Repository documentation
└── .github/workflows/        # CI/CD pipelines
```

## Documentation

- [Architecture](docs/architecture.md) - System design and components
- [Patterns](docs/patterns.md) - Code conventions and examples
- [Development](docs/development.md) - Build, test, and development

## Contributing

1. PR titles must follow conventional commit format: `<type>(<scope>): <description>`
2. Version numbers must be consistent between `marketplace.json` and `plugin.json`
3. All files must include required frontmatter (see [Development](docs/development.md))

See [Development](docs/development.md) for detailed contribution guidelines.
