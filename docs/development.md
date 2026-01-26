---
scope:
  paths:
    - .releaserc.yaml
    - .github/workflows/*.yaml
    - "*/.claude-plugin/plugin.json"
    - .github/PULL_REQUEST_TEMPLATE.md
  summary: "Build, test, and development workflow"
last_updated: 2026-01-26T00:50:34Z
---

# Development

## Prerequisites

- Claude Code CLI
- Git

## Setup

```bash
git clone <repository-url>
cd claude-code-plugins
```

No additional setup required. This is a Markdown-only repository.

## Build

No build step. Plugins are Markdown files consumed directly by Claude Code.

## Test

No automated tests. Validation happens through:
- PR semantic title check (`.github/workflows/pr-semantic.yaml`)
- Trivy security scan (`.github/workflows/pr-trivy.yaml`)
- Manual verification of plugin behavior

## Release

Releases are automatic via semantic-release on merge to `main`.

```bash
# Commits that trigger releases:
feat: ...    # → minor version bump
fix: ...     # → patch version bump
feat!: ...   # → major version bump (breaking change)
```

## Common Tasks

| Task | How |
|------|-----|
| Add a command | Create `<plugin>/commands/<name>.md` with required frontmatter |
| Add a skill | Create `<plugin>/skills/<name>/SKILL.md` with required frontmatter |
| Add an agent | Create `<plugin>/agents/<name>.md` with required frontmatter |
| Create new plugin | Create directory with `.claude-plugin/plugin.json`, add to `marketplace.json` |
| Update plugin version | Update both `marketplace.json` and `<plugin>/.claude-plugin/plugin.json` |

## Contributing

### PR Requirements

1. PR title must follow conventional commit format: `<type>(<scope>): <description>`
2. Security scan must pass
3. Version numbers must be consistent (marketplace.json and plugin.json)

### Plugin Creation Checklist

- [ ] Create plugin directory with kebab-case name
- [ ] Add `.claude-plugin/plugin.json` with name, version, description
- [ ] Add plugin entry to `.claude-plugin/marketplace.json`
- [ ] Create at least one command, skill, or agent
- [ ] Ensure all files have required frontmatter
- [ ] Test plugin locally with Claude Code

### Frontmatter Requirements

| File Type | Required Fields |
|-----------|-----------------|
| Commands | `description` (NO `name` field) |
| Skills | `name`, `description` |
| Agents | `name`, `description`, `color` |

## CI/CD Pipelines

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `pr-semantic.yaml` | Pull request | Validate PR title format |
| `pr-trivy.yaml` | Pull request | Security vulnerability scan |
| `release.yaml` | Merge to main | Automated versioning and release |
