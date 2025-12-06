---
scope:
  paths:
    - "*/.claude-plugin/**"
    - "*/commands/**"
    - "*/agents/**"
    - "*/skills/**"
    - "*/hooks/**"
    - "*/.mcp.json"
  summary: "Business domain concepts and terminology"
last_review_date: 2025-12-06T02:02:02Z
last_updated: 2025-12-06T02:02:02Z
---

# Domain

## Glossary

| Term | Definition |
|------|------------|
| Plugin | Self-contained package providing commands, agents, skills, hooks, or MCP integrations to Claude Code |
| Command | Interactive workflow invoked by user via `/plugin:command` syntax |
| Agent | Specialized AI persona spawned via Task tool for focused analysis tasks |
| Skill | Reusable knowledge document loaded via `@` import for context enhancement |
| Hook | Event-triggered automation that executes on Claude Code lifecycle events (Start, Stop, etc.) |
| MCP Server | External tool providing capabilities via Model Context Protocol |
| Front-matter | YAML metadata at document start defining configuration or tracking information |
| Scope Paths | File/directory glob patterns tracked by documentation for staleness detection |
| Conventional Commits | Commit message format: `type(scope): description` enabling semantic versioning |
| Build System Interface | Project's command abstraction layer (make, npm scripts) vs raw tool commands |

## Core Entities

### Plugin

**Purpose:** Extends Claude Code with new capabilities
**Key attributes:**
- `name`: Unique identifier for the plugin
- `description`: User-facing summary
- `version`: Semantic version number
- `author`: Plugin creator information

**Relationships:**
- Contains many Commands
- Contains many Agents
- Contains many Skills
- May have Hooks
- May configure MCP Servers

### Command

**Purpose:** User-invocable workflow for complex tasks
**Key attributes:**
- `name`: Command identifier (used in `/plugin:name`)
- `description`: What the command does

**Relationships:**
- Belongs to one Plugin
- May reference Skills
- May spawn Agents

### Agent

**Purpose:** Focused AI persona for specific analysis tasks
**Key attributes:**
- `name`: Agent identifier
- `description`: Agent's specialty
- `tools`: Explicitly allowed tool access
- `model`: LLM model to use (sonnet, opus, haiku)

**Relationships:**
- Belongs to one Plugin
- Spawned by Commands via Task tool

### Skill

**Purpose:** Reusable knowledge providing context for tasks
**Key attributes:**
- `name`: Skill identifier
- `description`: What knowledge it provides

**Relationships:**
- Belongs to one Plugin
- Referenced by Commands via `@` import
- May have reference subdirectory with supporting documents
