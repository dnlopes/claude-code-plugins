---
last_updated: 2026-01-13T23:12:02Z
---

# Claude Code Plugins

A collection of production-ready Claude Code plugins providing specialized agents for development workflows, code review, documentation management, and UI development.

## Quick Start

```bash
# No build required - plugins are markdown-based configuration
# Clone to your Claude Code plugins directory and they auto-discover via marketplace.json
```

## Principles

These rules MUST be followed:

1. **Document agent constraints in frontmatter**: Agent markdown files must declare name, description, allowed tools, and model in YAML frontmatter

2. **Separate agent-optimized from human-facing documentation**: AGENTS.md and docs/*.md for AI consumption; README.md for humans

3. **Bump plugin version on every change**: Always increment the version when modifying a plugin

4. **Version plugins independently**: Each plugin maintains its own version; update both `<plugin>/.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`

## Documentation

@docs/architecture.md
@docs/domain.md
@docs/patterns.md
@docs/development.md

- [Architecture](docs/architecture.md) - System design and components
- [Domain](docs/domain.md) - Plugin concepts and terminology
- [Patterns](docs/patterns.md) - Code conventions and examples
- [Development](docs/development.md) - Build, test, and development

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `dev-toolkit/` | Codebase analysis, research, and development pattern agents |
| `docs-manager/` | AI-optimized documentation with git-based staleness tracking |
| `git-workflow/` | Structured commits and PR creation |
| `review-toolkit/` | Multi-agent code review with confidence scoring |
| `ui-dev/` | Frontend design, browser automation, and shadcn/ui MCP server |
| `governor/` | Project tenets management with validation |
