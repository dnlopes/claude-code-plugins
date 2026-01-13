<!--
---
scope:
  paths:
    - README.md
    - .claude-plugin/marketplace.json
  summary: "Project overview and installation"
last_updated: 2026-01-13T23:12:02Z
---
-->

# Claude Code Plugins

Production-ready plugins for Claude Code providing specialized agents for development workflows, code review, documentation, and UI development.

## Summary

This collection extends Claude Code with domain-expert agents that understand systematic workflows, evidence-based documentation, and multi-dimensional code analysis. Each plugin adds specific capabilities while following consistent patterns for reliability.

## Plugins

| Plugin | Description |
|--------|-------------|
| **dev-toolkit** | Codebase analysis, pattern discovery, web research, and development methodologies |
| **docs-manager** | AI-optimized documentation with git-based staleness tracking |
| **git-workflow** | Structured commits and pull request creation |
| **review-toolkit** | Multi-agent code review with confidence/impact scoring |
| **mcp-shadcn** | shadcn/ui component documentation via MCP |
| **ui-dev** | Frontend design generation and browser automation |

## Installation

Claude Code discovers plugins via marketplace.json. Add this repository to your Claude Code plugins directory.

## Quick Start

```bash
# Generate documentation for your repository
/docs-manager:onboard

# Run multi-agent code review on current PR
/review-toolkit:review-pr

# Create a structured git commit
/git-workflow:commit
```

## Documentation

- [Architecture](docs/architecture.md) - System design
- [Domain](docs/domain.md) - Concepts and terminology
- [Patterns](docs/patterns.md) - Code conventions
- [Development](docs/development.md) - Contributing and setup
