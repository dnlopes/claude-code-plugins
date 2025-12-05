---
scope:
  paths:
    - README.md
    - .pre-commit-config.yaml
    - renovate.json
    - .github/**
  summary: "Development setup, plugin installation, quality checks, and contribution workflow"
last_review_date: 2025-12-03T00:28:11Z
last_updated: 2025-12-03T00:28:11Z
---

# Development

## Prerequisites

### Required
- **Claude Code CLI**: Host environment for all plugins
  - Installation: Follow instructions at https://github.com/anthropics/claude-code

### Optional (per plugin)
- **Git + GitHub CLI (`gh`)**: Required by git-workflow and reviewer-toolkit
- **uvx**: Required by mcp-serena for Python-based MCP server installation
- **macOS**: Required by macos-notifications (uses `osascript`)
- **Pre-commit**: For local hook execution (optional, auto-installed by CI)

## Setup

### 1. Clone Repository
```bash
git clone https://github.com/dnlopes/cloud-code-plugins.git
cd cloud-code-plugins
```

### 2. Install Claude Code CLI
Follow installation instructions from Claude Code documentation:
https://github.com/anthropics/claude-code

### 3. Install Plugins
Install individual plugins as needed:

```bash
# Development workflow plugins
claude-code plugins install /path/to/cloud-code-plugins/dev-toolkit
claude-code plugins install /path/to/cloud-code-plugins/git-workflow
claude-code plugins install /path/to/cloud-code-plugins/reviewer-toolkit

# Documentation plugin
claude-code plugins install /path/to/cloud-code-plugins/docs-manager

# MCP integration plugins
claude-code plugins install /path/to/cloud-code-plugins/mcp-serena
claude-code plugins install /path/to/cloud-code-plugins/mcp-context7
claude-code plugins install /path/to/cloud-code-plugins/mcp-shadcn
claude-code plugins install /path/to/cloud-code-plugins/mcp-sequential-thinking

# System integration
claude-code plugins install /path/to/cloud-code-plugins/macos-notifications
```

### 4. Install Plugin-Specific Prerequisites

**For mcp-serena:**
```bash
# Install uvx for Python package management
pip install uvx
# or via pipx
pipx install uvx
```

**For git-workflow and reviewer-toolkit:**
```bash
# Install GitHub CLI
# macOS
brew install gh

# Linux
# See https://github.com/cli/cli/blob/trunk/docs/install_linux.md

# Authenticate with GitHub
gh auth login
```

## Plugin Development

### Creating a New Plugin

1. **Create plugin directory structure:**
```bash
mkdir -p my-plugin/.claude-plugin
mkdir -p my-plugin/commands
mkdir -p my-plugin/agents
mkdir -p my-plugin/skills/my-skill/reference
```

2. **Create plugin.json:**
```json
{
  "name": "my-plugin",
  "description": "Brief description of what this plugin does",
  "version": "1.0.0",
  "author": "Your Name"
}
```

3. **Create README.md:**
Document plugin purpose, features, commands, agents, skills, installation, and usage.

4. **Add components as needed:**
- Commands: `commands/command-name.md`
- Agents: `agents/agent-name.md`
- Skills: `skills/skill-name/SKILL.md`
- Hooks: `hooks/hooks.json`
- MCP config: `.mcp.json`

5. **Follow naming conventions:**
- Plugin name: kebab-case
- Command names: kebab-case
- Agent names: kebab-case
- File names: match component names

6. **Test locally:**
```bash
claude-code plugins install /path/to/my-plugin

# Test commands
/my-plugin:command-name

# Test agents (from within Claude Code session)
# Use Task tool with subagent_type: "my-plugin:agent-name"
```

### Modifying Existing Plugins

1. **Navigate to plugin directory:**
```bash
cd cloud-code-plugins/<plugin-name>
```

2. **Edit relevant files:**
- Commands: `commands/*.md`
- Agents: `agents/*.md`
- Skills: `skills/*/SKILL.md`
- Metadata: `.claude-plugin/plugin.json`

3. **Test changes:**
```bash
# Reload plugin (if already installed)
claude-code plugins install /path/to/cloud-code-plugins/<plugin-name>

# Test modified functionality
```

4. **Commit changes following conventional commit format:**
```bash
git add .
git commit -m "feat(plugin-name): add new feature"
# or
git commit -m "fix(plugin-name): resolve issue"
```

## Quality Checks

### Pre-commit Hooks

The repository uses pre-commit hooks for automated quality checks:

**.pre-commit-config.yaml** defines:
- **check-json**: Validate JSON syntax
- **check-yaml**: Validate YAML syntax
- **end-of-file-fixer**: Ensure files end with newline
- **trailing-whitespace**: Remove trailing whitespace
- **detect-private-key**: Prevent committing private keys
- **detect-aws-credentials**: Prevent committing AWS credentials

**Local setup (optional):**
```bash
pip install pre-commit
pre-commit install
```

Pre-commit hooks run automatically in CI even without local installation.

### GitHub Actions

**Workflows** (`.github/workflows/`):

1. **pr-pre-commit.yaml**: Runs pre-commit hooks on all PRs
   - Validates JSON/YAML syntax
   - Checks for security issues
   - Enforces code quality standards

2. **pr-semantic.yaml**: Validates PR titles follow conventional commit format
   - Enforces Angular conventional commit format
   - Ensures semantic versioning compatibility

### Automated Dependency Management

**renovate.json** configures Renovate bot for:
- MCP server version updates (e.g., Serena)
- Pre-commit hook updates
- GitHub Actions updates
- Automated PR creation for dependency updates

## Testing

### Plugin Testing

**Manual testing workflow:**

1. **Install plugin locally:**
```bash
claude-code plugins install /path/to/cloud-code-plugins/<plugin-name>
```

2. **Test commands:**
```bash
# In Claude Code session
/plugin-name:command-name
```

3. **Verify expected behavior:**
- Commands execute without errors
- Agents return structured results
- Skills load properly
- MCP servers activate correctly
- Hooks trigger on events

### Command Testing

Test each command's workflow:
- Step-by-step instruction execution
- User approval prompts (if applicable)
- Error handling
- Output format

### Agent Testing

Test agent invocations:
- Correct tool usage (Grep, Glob, Read, etc.)
- Focused, structured output
- Proper error handling
- Performance (response time)

### MCP Server Testing

Verify MCP integrations:
- Server activation on plugin install
- Tool availability in Claude Code
- Correct API responses
- Connection handling

## Contributing

### Contribution Workflow

1. **Fork repository:**
```bash
gh repo fork dnlopes/cloud-code-plugins --clone
cd cloud-code-plugins
```

2. **Create feature branch:**
```bash
git checkout -b feature/my-feature
```

3. **Make changes:**
- Follow existing patterns
- Update documentation
- Test thoroughly

4. **Commit with conventional format:**
```bash
git commit -m "feat(plugin-name): add new capability"
```

5. **Push and create PR:**
```bash
git push origin feature/my-feature
gh pr create --title "feat(plugin-name): add new capability" --body "Description of changes"
```

6. **Address review feedback:**
- Make requested changes
- Push additional commits
- Request re-review

### Commit Message Guidelines

**Format:** `<type>(<scope>): <description>`

Follows the [Angular Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

**Common types:**
- `feat`: New features
- `fix`: Bug fixes
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `test`: Test additions/modifications
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Other maintenance tasks

**Breaking changes:** Add `!` after type/scope (e.g., `feat!: breaking change`)

**Examples:**
```
feat(docs-manager): add README generation support
fix(git-workflow): resolve pre-commit hook bypass
refactor(dev-toolkit): simplify agent invocation
docs(readme): update installation instructions
```

### Documentation Guidelines

When modifying plugins:
1. Update plugin README.md if features change
2. Update CLAUDE.md if new plugins added
3. Update docs/claude/ files if patterns change
4. Include examples in documentation
5. Keep documentation at right abstraction level

## Environment Variables

**None required.** Plugins are declarative configuration and don't require environment variables.

Plugin-specific tools may require their own configuration:
- **GitHub CLI (`gh`)**: Requires authentication via `gh auth login`
- **MCP servers**: May require API keys (check individual plugin documentation)

## Troubleshooting

### Plugin Not Found
```bash
# Verify installation
claude-code plugins list

# Reinstall if needed
claude-code plugins install /path/to/cloud-code-plugins/<plugin-name>
```

### Command Not Working
```bash
# Check command syntax
/plugin-name:command-name

# Verify plugin is installed
claude-code plugins list | grep plugin-name
```

### MCP Server Not Activating
```bash
# Check .mcp.json syntax
cat <plugin-name>/.mcp.json | jq .

# For command-based servers, verify prerequisite installed
# Example for mcp-serena:
which uvx
```

### Pre-commit Hooks Failing
```bash
# Run pre-commit manually
pre-commit run --all-files

# Fix issues reported
# Common: JSON/YAML syntax, trailing whitespace, private keys
```

## Resources

- **Claude Code Documentation**: https://github.com/anthropics/claude-code
- **Plugin Development Guide**: https://docs.claudecode.com
- **GitHub CLI**: https://cli.github.com
- **Pre-commit**: https://pre-commit.com
- **Conventional Commits**: https://www.conventionalcommits.org
