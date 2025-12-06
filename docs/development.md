---
scope:
  paths:
    - .github/workflows/**
    - .releaserc.yaml
    - labeler-config.yaml
    - trivy.yaml
    - renovate.json
  summary: "Build, test, and development workflow"
last_review_date: 2025-12-06T02:02:02Z
last_updated: 2025-12-06T02:02:02Z
---

# Development

## Prerequisites

- Claude Code CLI installed and configured
- Git
- GitHub CLI (`gh`) for PR operations
- Optional: `uvx` for Python MCP servers (mcp-serena)
- Optional: `npx` for Node MCP servers (mcp-sequential-thinking)
- Optional: macOS for notification hooks

## Setup

```bash
# Clone the repository
git clone https://github.com/dnlopes/cloud-code-plugins.git
cd cloud-code-plugins
```

## Install a Plugin

```bash
# Install from local path
claude plugins add /path/to/cloud-code-plugins/plugin-name

# Or install from GitHub
claude plugins add dnlopes/cloud-code-plugins/plugin-name
```

## Test Changes

Since plugins are declarative Markdown, testing involves:

1. Install the plugin locally
2. Invoke commands and verify behavior
3. Check agent spawning works correctly
4. Verify skill loading provides expected context

```bash
# Install local plugin for testing
claude plugins add /path/to/cloud-code-plugins/dev-toolkit

# Test a command
/dev-toolkit:create-plan
```

## Common Tasks

### Create a New Plugin

1. Create plugin directory at repository root
2. Add `.claude-plugin/plugin.json` with metadata
3. Add `README.md` for users
4. Add commands/, agents/, skills/, or hooks/ as needed

### Add a Command

1. Create `commands/command-name.md`
2. Add front-matter with `name` and `description`
3. Write command instructions in Markdown

### Add an Agent

1. Create `agents/agent-name.md`
2. Add front-matter with `name`, `description`, `tools`, and `model`
3. Write agent instructions in Markdown

### Add a Skill

1. Create `skills/skill-name/SKILL.md`
2. Add front-matter with `name` and `description`
3. Write skill content
4. Optionally add `reference/` subdirectory for supporting docs

## CI/CD

### Pull Request Checks

PRs automatically run:
- **Semantic PR validation** - PR titles must follow conventional commit format
- **Trivy security scanning** - Scans for vulnerabilities and secrets
- **Labeling** - Auto-labels based on changed files

### Releases

Releases are automated via semantic-release on merges to main:
- `feat:` commits trigger minor version bump
- `fix:` commits trigger patch version bump
- `feat!:` or `BREAKING CHANGE:` triggers major version bump

### Dependency Updates

Renovate automatically updates:
- MCP server versions in `.mcp.json` files
- GitHub Actions versions in workflows

## Contributing

### Commit Messages

Follow conventional commit format:
```
type(scope): description

Examples:
feat(dev-toolkit): add new research command
fix(git-workflow): correct PR template format
docs(readme): update installation instructions
```

### Pull Requests

1. Create a feature branch
2. Make changes following plugin conventions
3. Ensure PR title follows conventional commit format
4. Submit PR and wait for checks to pass
