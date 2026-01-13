---
scope:
  paths:
    - .github/workflows/*.yaml
    - .releaserc.yaml
    - renovate.json
    - trivy.yaml
  summary: "Build, test, and development workflow"
last_updated: 2026-01-13T23:12:02Z
---

# Development

## Prerequisites

- Claude Code CLI installed
- Git
- `gh` CLI (for GitHub operations)

## Setup

```bash
# Clone the repository
git clone <repo-url>

# No additional setup required - plugins are markdown-based
```

## Build

No build step required. Plugins are markdown-based configuration files that Claude Code reads directly.

## Test

No automated tests. Validation happens at runtime when Claude Code loads and executes plugins.

Manual testing:
```bash
# Test a command
/docs-manager:onboard

# Test an agent via Task tool
# (done within Claude Code conversation)
```

## CI/CD

### Pull Request Checks

- **Semantic PR Title** (`.github/workflows/pr-semantic.yaml`): Enforces conventional commit format in PR titles
- **Trivy Security Scan** (`.github/workflows/pr-trivy.yaml`): Scans for vulnerabilities and misconfigurations

### Release Process

Releases are automated via semantic-release (`.releaserc.yaml`):

1. Merge PR to main with conventional commit message
2. semantic-release determines version bump from commit type
3. Release created automatically with changelog

### Dependency Updates

Renovate (`renovate.json`) monitors and updates dependencies automatically.

## Common Tasks

### Adding a New Agent

1. Create `<plugin>/agents/<name>.md`
2. Add frontmatter: name, description, tools, model
3. Write agent instructions in markdown body
4. Bump plugin version in both locations

### Adding a New Command

1. Create `<plugin>/commands/<name>.md`
2. Write workflow phases: Pre-flight, Execute, Summary
3. Bump plugin version in both locations

### Adding a New Skill

1. Create `<plugin>/skills/<name>/SKILL.md`
2. Optionally add `reference/` for supporting docs
3. Bump plugin version in both locations

### Bumping Version

Update both files:
```bash
# Plugin's own version
<plugin>/.claude-plugin/plugin.json

# Marketplace listing
.claude-plugin/marketplace.json
```
