<!--
---
scope:
  paths:
    - README.md
    - .claude-plugin/marketplace.json
  summary: "Project overview and installation"
last_updated: 2026-08-21T00:00:00Z
---
-->

# claude-code-plugins

A personal marketplace of Claude Code plugins — self-contained bundles of skills, agents, and slash commands that extend Claude Code's capabilities for AI-assisted development workflows.

## Summary

This repository is both the plugin source and the marketplace registry it publishes from. Each plugin is an independently versioned, self-contained unit that Claude Code can install directly. Plugins extend Claude Code with purpose-built workflows for git, code review, documentation, UI development, backend development, and architectural governance.

## Installation

### Claude Code

Install a plugin from this marketplace by pointing Claude Code at this repo's marketplace registry:

```bash
# Add this marketplace to Claude Code
claude plugins marketplace add https://github.com/dnlopes/claude-code-plugins
```

Then install individual plugins:

```bash
claude plugins install curator
claude plugins install git-workflow
claude plugins install governor
```

### OpenCode

Skill-bearing plugins are also isolated OpenCode packages (skills, plus agents/commands when present). Clone once, then point OpenCode at the plugin directories you want:

```bash
git clone https://github.com/dnlopes/claude-code-plugins.git ~/src/claude-code-plugins
```

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "~/src/claude-code-plugins/git-workflow",
    "~/src/claude-code-plugins/governor",
    "~/src/claude-code-plugins/review-toolkit"
  ]
}
```

Restart OpenCode after editing config. Full details: [OpenCode](docs/opencode.md).

## Available Plugins

| Plugin | Description | OpenCode |
|--------|-------------|---------|
| `curator` | Repository documentation for AI agents, with git-based staleness tracking | skills + agents |
| `git-workflow` | Git and GitHub workflow commands for commits and pull requests | skills + commands |
| `governor` | Project tenets management via user-invocable skills: bootstrap, manage, and verify architectural constraints in AGENTS.md | skills + agents |
| `review-toolkit` | Multi-agent code review toolkit with specialized reviewers | skills + agents + commands |
| `ui-dev` | UI development toolkit with headless browser automation and shadcn/ui | skills |
| `backend-dev` | Backend development toolkit with database and API best practices | skills |
| `quartermaster` | Project management skills for tickets and triage | skills |
| `voice` | Communication guidelines and comment discipline | skills |
| `status-line` | Custom Claude Code status line showing context window usage, cost, and model | — |

## Documentation

- [Architecture](docs/architecture.md) — System design and component relationships
- [Patterns](docs/patterns.md) — Plugin conventions and invariants
- [Development](docs/development.md) — Contributing and release workflow
- [OpenCode](docs/opencode.md) — Isolated OpenCode plugin install (skills only)
