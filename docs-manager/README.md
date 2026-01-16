---
scope:
  paths:
    - docs-manager/**
  summary: "Plugin overview and usage guide"
last_updated: 2026-01-16T23:30:15Z
---

# Docs-Manager Plugin

Repository documentation for AI agents, with git-based staleness tracking.

## Goals

The docs-manager plugin provides a comprehensive documentation lifecycle system:

- **Onboard** repositories with AI-optimized documentation structure
- **Add** targeted documentation for specific modules or topics
- **Update** stale documentation based on git change detection
- **Validate** documentation system integrity
- **Remove** obsolete documentation while maintaining references

Documentation is tracked at the abstraction level—implementation changes don't trigger updates, only changes to patterns or architecture do.

## Commands

| Command | Description |
|---------|-------------|
| `/docs-manager:onboard` | Create AGENTS.md, CLAUDE.md, and docs/ directory structure for a repository |
| `/docs-manager:add-doc` | Generate ad-hoc documentation for specific paths or topics with staleness tracking |
| `/docs-manager:update-docs` | Check and update stale documentation based on git changes |
| `/docs-manager:validate-docs` | Validate documentation system integrity—check front-matter, scope paths, and cross-references |
| `/docs-manager:remove-doc` | Remove obsolete documentation and clean up references |

## Skills

| Skill | Description |
|-------|-------------|
| `documenting-repositories` | Standards for agent-optimized documentation: front-matter format, abstraction level, audience split (human vs agent), and document templates |

## Agents

| Agent | Description |
|-------|-------------|
| `codebase-explorer` | Explores codebases to extract documentation-relevant information: purpose, tech stack, architecture, patterns with file:line references, and scope paths |
| `doc-analyzer` | Determines whether code changes require documentation updates by categorizing changes (structural, architectural, pattern, implementation, cosmetic) |
| `doc-generator` | Transforms exploration findings into properly formatted documentation with front-matter for staleness tracking |

## Workflows

### Onboard New Repository

1. Run `/onboard` (or `/onboard --auto`)
2. codebase-explorer analyzes repository structure
3. Review findings (skip with --auto)
4. doc-generator creates AGENTS.md, CLAUDE.md, and docs/
5. Validation confirms proper front-matter

### Add Module Documentation

1. Run `/add-doc src/auth`
2. codebase-explorer analyzes target module
3. Approve scope and output location
4. doc-generator creates module AGENTS.md + CLAUDE.md
5. Optional: update root AGENTS.md references

### Keep Documentation Current

1. Run `/update-docs` (or `/update-docs --auto`)
2. Command inventories all tracked docs (with `last_updated`)
3. Queries git since each doc's last update
4. doc-analyzer evaluates each stale document
5. Apply recommended updates with new timestamps

### Front-matter Contract

All tracked documents include:

```yaml
---
scope:
  paths:
    - path/to/track/**
  summary: "What this documents"
last_updated: 2025-01-15T10:30:00Z
---
```

This enables automatic staleness detection via git history.

## Version

4.1.0
