---
last_updated: 2025-12-06T02:02:02Z
---

# cloud-code-plugins

A collection of Claude Code plugins that enhance development workflows through specialized commands, agents, skills, and MCP integrations.

## Quick Start

```bash
# Install a plugin
claude plugins add dnlopes/cloud-code-plugins/dev-toolkit

# Use a command
/dev-toolkit:create-plan
```

## Principles

These rules MUST be followed when working on this codebase:

1. **Agents Must Have Focused Responsibilities**: Each agent should have a single specialized purpose with explicitly declared tool access in the front-matter. Avoid agents that try to do everything.

2. **Plugin Structure Must Follow Convention**: Each plugin must have `.claude-plugin/plugin.json` for metadata, a `README.md` for users, and organized directories for commands/, agents/, skills/, or hooks/ as needed.

## Documentation

@docs/architecture.md
@docs/domain.md
@docs/patterns.md
@docs/development.md

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `dev-toolkit/` | Planning, research, implementation, and code review |
| `git-workflow/` | Conventional commits and PR management |
| `docs-manager/` | Repository onboarding and documentation maintenance |
| `reviewer-toolkit/` | Multi-perspective code review |
| `mcp-*/` | MCP server integrations |
