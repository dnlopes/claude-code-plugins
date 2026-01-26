---
scope:
  paths:
    - .claude-plugin/marketplace.json
    - AGENTS.md
    - "*/commands/*.md"
    - "*/skills/*/SKILL.md"
    - "*/agents/*.md"
    - "*/.claude-plugin/plugin.json"
    - .releaserc.yaml
  summary: "Code patterns and conventions"
last_updated: 2026-01-26T00:50:34Z
---

# Patterns

## Project Structure

```
claude-code-plugins/
├── .claude-plugin/
│   └── marketplace.json      # Registry of all plugins
├── <plugin>/
│   ├── .claude-plugin/
│   │   └── plugin.json       # Plugin metadata
│   ├── commands/
│   │   └── <command>.md      # Workflow orchestrators
│   ├── skills/
│   │   └── <skill>/
│   │       ├── SKILL.md      # Entry point
│   │       └── reference/    # Supporting docs
│   ├── agents/
│   │   └── <agent>.md        # Autonomous workers
│   └── .mcp.json             # Optional MCP config
├── docs/                     # Repository documentation
└── .github/workflows/        # CI/CD pipelines
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Plugin directories | `kebab-case` | `docs-manager`, `git-workflow` |
| Command files | `kebab-case.md` | `setup.md`, `review-pr.md` |
| Skill directories | `kebab-case` | `tenet-governance`, `committing-work` |
| Skill entry point | `SKILL.md` (uppercase) | `SKILL.md` |
| Agent files | `kebab-case.md` | `tenet-verifier.md`, `security-auditor.md` |

## Frontmatter Patterns

### Commands
Commands require `description` and must NOT have a `name` field.
**Example:** `governor/commands/setup.md:1-12`

```yaml
---
description: "Discover architectural constraints and create tenets..."
allowed-tools:
  - Bash
  - Read
  - Write
  - Task(governor:tenet-verifier)
argument-hint: "[optional-path-to-focus]"
---
```

### Skills
Skills require both `name` and `description` fields.
**Example:** `governor/skills/tenet-governance/SKILL.md:1-4`

```yaml
---
name: tenet-governance
description: "Architectural tenet format and verification patterns"
---
```

### Agents
Agents require `name`, `description`, and `color` fields.
**Example:** `governor/agents/tenet-verifier.md:1-6`

```yaml
---
name: tenet-verifier
description: "Verifies code against tenets with confidence scoring"
color: red
---
```

## Workflow Checklist Pattern

Commands include visual progress indicators.
**Example:** `governor/commands/setup.md:22-30`

```markdown
## Progress

- [ ] Analyzing codebase for architectural constraints
- [ ] Identifying enforced patterns
- [ ] Drafting tenets with evidence
- [ ] Writing to AGENTS.md
```

## Agent Spawning Pattern

Commands spawn agents via Task tool with structured prompts.
**Example:** `docs-manager/commands/onboard.md:34-38`

```markdown
Spawn agent `docs-manager:codebase-explorer` with:
- Task: Explore the codebase at <path>
- Return: Structured findings for documentation
```

## Evidence-Based Claims

All tenets, patterns, and violations must include `file:line` references.
**Example:** `AGENTS.md:16-18`

```markdown
**Evidence:**
- `marketplace.json:7-36` - Each plugin is defined as a separate source
- `governor/.claude-plugin/plugin.json:1-8` - Plugin metadata contained within
```

## Conventional Commits

Use Angular commit convention for all commits and PR titles.
**Example:** `git-workflow/skills/committing-work/SKILL.md:13-26`

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change (no feature/fix) |
| `chore` | Maintenance tasks |

Format: `<type>(<scope>): <description>`

## Skills vs Commands Separation

| Commands (Imperative) | Skills (Declarative) |
|-----------------------|----------------------|
| Orchestrate workflows | Provide patterns and formats |
| Spawn agents | Document conventions |
| Execute actions | Define guidelines |
| "Do X, then Y, then Z" | "X should look like this" |

Skills inform commands; they never execute actions directly.
