---
last_updated: 2026-01-16T23:58:07Z
scope:
  paths:
    - marketplace.json
    - "*/.claude-plugin/plugin.json"
    - "*/commands/*.md"
    - "*/skills/*/SKILL.md"
    - "*/agents/*.md"
---

# Claude Code Plugins

A collection of production-ready Claude Code plugins providing specialized agents for development workflows, code review, documentation management, and UI development.

## Quick Start

```bash
# No build required - plugins are markdown-based configuration
# Clone to your Claude Code plugins directory and they auto-discover via marketplace.json
```

## Tenets

CRITICAL: These tenets are MANDATORY and MUST be followed in all work on this codebase.

### T1. Plugin Isolation

Each plugin must be self-contained within its own directory with no cross-plugin dependencies. Plugins must not reference commands, skills, or agents from other plugins. This ensures plugins can be versioned, distributed, and installed independently.

**Severity:** critical

**Evidence:**
- `marketplace.json:7-36` - Each plugin is defined as a separate source directory
- `governor/.claude-plugin/plugin.json:1-8` - Plugin metadata is contained within plugin directory
- `docs-manager/commands/onboard.md:35` - Commands reference only their own plugin's agents (`docs-manager:codebase-explorer`)

### T2. File Type Separation

Commands, skills, and agents must be organized into distinct directories (`commands/`, `skills/`, `agents/`) within each plugin. Commands orchestrate workflows, skills provide reusable knowledge, and agents are autonomous workers.

**Severity:** medium

**Evidence:**
- `governor/commands/setup.md:1` - Command files in `commands/` directory
- `governor/skills/tenet-governance/SKILL.md:1` - Skills in `skills/` directory with `SKILL.md` as entry point
- `governor/agents/tenet-verifier.md:1` - Agents in `agents/` directory

### T3. Required Frontmatter

All command, skill, and agent files must include YAML frontmatter. Commands must have a `description` field and must NOT have a `name` field. Skills must have `name` and `description` fields. Agents must have `name`, `description`, and `color` fields.

**Severity:** high

**Evidence:**
- `governor/commands/setup.md:1-12` - Command with `description` and `allowed-tools` in frontmatter (no `name` field)
- `governor/skills/tenet-governance/SKILL.md:1-4` - Skill with `name` and `description`
- `governor/agents/tenet-verifier.md:1-6` - Agent with `name`, `description`, `model`, and `color`

### T4. Skills Provide Reference, Not Action

Skills must contain declarative knowledge (guidelines, formats, patterns) that inform agent behavior, but must not contain imperative workflow steps. Commands orchestrate actions; skills provide context for those actions.

**Severity:** medium

**Evidence:**
- `governor/skills/tenet-governance/SKILL.md:22-35` - Declarative format specification, not workflow
- `docs-manager/skills/documenting-repositories/SKILL.md:8-77` - Standards and formats, no action steps
- `governor/commands/setup.md:14-191` - Command contains workflow steps, references skill for format knowledge

### T5. Version Consistency

Plugin versions in `marketplace.json` must match versions in individual `plugin.json` files. This ensures the marketplace index accurately represents distributed plugin versions.

**Severity:** critical

**Evidence:**
- `marketplace.json:33-35` - governor version 2.1.0
- `governor/.claude-plugin/plugin.json:4` - governor version 2.1.0 (matches)
- `marketplace.json:14-16` - docs-manager version 3.1.0
- `docs-manager/.claude-plugin/plugin.json:4` - docs-manager version 3.1.0 (matches)

### T6. Version Bump on Change

Any modification to functional plugin files (commands, skills, agents, or `plugin.json`) must be accompanied by a version bump in that plugin's `plugin.json`. Documentation files like README.md are excluded. This ensures all functional changes are versioned and trackable.

**Severity:** high

**Evidence:**
- `452281a` - docs-manager command changes with version bump
- `04d1866` - review-toolkit changes with version bump
- `f4a5a91` - ui-dev changes with version bump
- `4526a4a` - governor revamp with version bump

## Tenet Exceptions

Approved exceptions to tenets. Each must have justification.

| File | Tenet | Reason | Approved |
|------|-------|--------|----------|
| (none) | | | |

## Documentation

@docs/architecture.md
@docs/patterns.md
@docs/development.md

- [Architecture](docs/architecture.md) - System design and components
- [Patterns](docs/patterns.md) - Code conventions and examples
- [Development](docs/development.md) - Build, test, and development

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `docs-manager/` | AI-optimized documentation with git-based staleness tracking |
| `git-workflow/` | Structured commits and PR creation |
| `governor/` | Project tenets management with validation |
| `review-toolkit/` | Multi-agent code review with confidence scoring |
| `ui-dev/` | Frontend design, browser automation, and shadcn/ui MCP server |
