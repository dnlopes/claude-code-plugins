---
scope:
  paths:
    - "*/agents/*.md"
    - "*/commands/*.md"
    - "*/skills/*/SKILL.md"
  summary: "Plugin concepts and terminology"
last_updated: 2026-01-15T10:02:21Z
---

# Domain

## Glossary

| Term | Definition |
|------|------------|
| Plugin | A collection of agents, commands, and skills packaged together with a plugin.json manifest |
| Agent | A specialized AI persona with constrained tools, defined in markdown with YAML frontmatter |
| Command | A user-invocable workflow (e.g., `/commit`) that orchestrates agents and skills |
| Skill | Reusable knowledge or methodology that can be loaded by commands or agents |
| Subagent | An agent spawned by a command via the Task tool's `subagent_type` parameter |
| Frontmatter | YAML metadata at the top of markdown files defining agent/command configuration |
| MCP Server | Model Context Protocol server providing external tool access |
| Staleness tracking | Git-based system for detecting when documentation needs updates |
| Scope paths | File patterns in frontmatter defining what changes should trigger doc review |
| Confidence scoring | Review finding classification (high/medium/low) to filter noise |
| Impact scoring | Review finding classification (critical/high/medium/low) for prioritization |
| Tenet | Architectural constraint or guiding principle defined in AGENTS.md that must be followed in all work on the codebase |
| Tenet validation | Process of verifying proposed tenets have codebase evidence or checking staged changes for violations using confidence-based scoring |

## Plugin Components

### Agents
Markdown files in `*/agents/` with frontmatter defining:
- `name`: Agent identifier
- `description`: What triggers this agent
- `tools`: Allowed tools (restricts agent capabilities)
- `model`: Which Claude model to use

### Commands
Markdown files in `*/commands/` containing:
- Step-by-step workflow instructions
- Decision trees for user interaction
- Agent spawning patterns

### Skills
Directories in `*/skills/<skill-name>/` containing:
- `SKILL.md`: Main skill definition
- `reference/`: Supporting documentation
