---
scope:
  paths:
    - "*/agents/*.md"
    - "*/commands/*.md"
    - "*/.claude-plugin/plugin.json"
  summary: "Code patterns and conventions"
last_updated: 2026-01-15T10:02:21Z
---

# Patterns

## Project Structure

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json       # Plugin metadata and version
├── agents/               # Specialized AI agents
│   └── <name>.md
├── commands/             # User-invocable workflows
│   └── <name>.md
└── skills/               # Reusable knowledge modules
    └── <name>/
        ├── SKILL.md
        └── reference/
```

Root level:
```
.claude-plugin/
└── marketplace.json      # Lists all plugins for discovery
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Plugins | kebab-case | `dev-toolkit`, `docs-manager` |
| Agents | kebab-case descriptive | `codebase-analyzer`, `bug-hunter` |
| Commands | kebab-case action | `update-docs`, `review-pr` |
| Skills | kebab-case domain | `test-driven-development` |

## Agent Definition Pattern

From `dev-toolkit/agents/codebase-analyzer.md:1-6`:
```yaml
---
name: codebase-analyzer
description: Analyzes codebase implementation details
tools: Read, Grep, Glob, LS
model: sonnet
---
```

## Command Workflow Pattern

Commands follow multi-phase structure:
1. **Pre-flight** - Check prerequisites, present status
2. **Execute** - Run main workflow with user confirmation
3. **Summary** - Report results, suggest next steps

From `docs-manager/commands/update-docs.md`:
- Check existing documentation
- Analyze git changes for staleness
- Present findings to user
- Execute updates with approval

## Agent Spawning Pattern

Commands orchestrate work by spawning specialized agents:

```markdown
Use the Task tool with subagent_type='<agent-name>' to <purpose>
```

**Fully qualified references:** When referencing agents from the same plugin, use `plugin-name:agent-name` format (e.g., `governor:tenet-validator`).

Example: `review-pr` spawns 6 agents in parallel:
- bug-hunter
- security-auditor
- code-quality-reviewer
- test-coverage-reviewer
- contracts-reviewer
- historical-context-reviewer

## Version Update Pattern

When modifying a plugin, update both:
1. `<plugin>/.claude-plugin/plugin.json` - Plugin's own version
2. `.claude-plugin/marketplace.json` - Marketplace listing version
