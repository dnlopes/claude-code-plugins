---
scope:
  paths:
    - "*/.claude-plugin/**"
    - "*/commands/**"
    - "*/agents/**"
    - "*/skills/**/SKILL.md"
    - "*/hooks/**"
    - "*/.mcp.json"
  summary: "Code patterns and conventions with examples"
last_review_date: 2025-12-06T02:02:02Z
last_updated: 2025-12-06T02:02:02Z
---

# Patterns

## Project Structure

```
cloud-code-plugins/
├── dev-toolkit/           # Development workflow plugin
├── git-workflow/          # Git operations plugin
├── docs-manager/          # Documentation plugin
├── reviewer-toolkit/      # Code review plugin
├── mcp-shadcn/            # shadcn/ui MCP integration
└── .github/               # CI/CD workflows
```

### Conventions

- Each plugin is a self-contained directory at repository root
- Plugin directories use kebab-case naming
- MCP integration plugins are prefixed with `mcp-`

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Plugin directories | kebab-case | `dev-toolkit`, `git-workflow` |
| Command files | kebab-case.md | `create-plan.md`, `commit.md` |
| Agent files | kebab-case.md | `codebase-locator.md` |
| Skill directories | kebab-case | `documentation-standards/` |
| Skill main file | SKILL.md (uppercase) | `skills/committing-work/SKILL.md` |

## Common Patterns

### Plugin Manifest

Every plugin declares metadata in `.claude-plugin/plugin.json`:

```json
// Example from dev-toolkit/.claude-plugin/plugin.json
{
    "name": "dev-toolkit",
    "description": "Complete development workflow toolkit",
    "version": "1.0.0",
    "author": {
        "name": "David Lopes"
    }
}
```

### Command Front-matter

Commands use YAML front-matter for metadata:

```yaml
# Example from git-workflow/commands/commit.md
---
name: commit
description: Create git commits with user approval and no Claude attribution
---
```

### Agent Declaration

Agents declare their specialty and allowed tools:

```yaml
# Example from dev-toolkit/agents/codebase-locator.md
---
name: codebase-locator
description: Locates files, directories, and components relevant to a feature or task
tools: Grep, Glob, LS
model: sonnet
---
```

### Skill Reference

Skills are organized with a main SKILL.md and optional reference directory:

```
skills/documentation-standards/
├── SKILL.md                    # Main skill content
└── reference/
    ├── frontmatter-spec.md     # Supporting documentation
    ├── document-templates.md
    └── principles-examples.md
```

### Agent Spawning in Commands

Commands spawn agents using the Task tool with specific subagent_type:

```markdown
Use the Task tool with subagent_type='codebase-locator' to find relevant files.
```

### Skill Loading in Commands

Commands reference skills for contextual knowledge:

```markdown
**IMPORTANT:** use skill `committing-work` to learn how to draft good commit messages.
```
