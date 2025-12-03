<!--
---
scope:
  paths:
    - README.md
    - .pre-commit-config.yaml
    - renovate.json
    - .github/workflows/**
    - "*/README.md"
    - "*/.claude-plugin/plugin.json"
  summary: "Project overview, plugin catalog, installation instructions, and quick start guide"
last_review_date: 2025-12-03T00:28:11Z
last_updated: 2025-12-03T00:28:11Z
---
-->

# cloud-code-plugins

A modular collection of Claude Code plugins that enhance development workflows through specialized commands, agents, skills, MCP integrations, and event hooks.

## Features

- **Modular Plugin System**: Install only what you need - each plugin is independently functional
- **Development Workflow Automation**: Commands for planning, research, implementation, committing, and PR creation
- **Multi-Perspective Code Review**: Parallel specialized agents analyze security, bugs, quality, contracts, tests, and history
- **Documentation Maintenance**: Git-based staleness tracking with automatic generation and smart README enhancement
- **Semantic Code Analysis**: MCP integration with Serena for symbol-level navigation and pattern matching
- **Up-to-Date Library Docs**: Context7 integration for current framework and library documentation
- **Structured Problem Solving**: Sequential thinking for complex debugging and design decisions
- **Desktop Notifications**: macOS notification center integration for task completion alerts
- **Quality Enforcement**: Pre-commit hooks and conventional commits with emoji prefixes
- **Evidence-Based Documentation**: Principle validation backed by codebase analysis

## Plugin Catalog

### Development Workflow

#### dev-toolkit
Complete development lifecycle with:
- `/dev-toolkit:create-plan` - Interactive planning with parallel research agents
- `/dev-toolkit:implement-plan` - Phase-by-phase implementation with verification
- `/dev-toolkit:research-codebase` - Comprehensive codebase research and documentation
- Specialized agents: codebase-analyzer, codebase-locator, codebase-pattern-finder

**Install:**
```bash
claude-code plugins install /path/to/cloud-code-plugins/dev-toolkit
```

#### git-workflow
Git operations and GitHub PR management:
- `/git-workflow:commit` - Create well-structured commits with user approval
- `/git-workflow:create-pr` - Branch, push, and create PR with comprehensive summary
- `committing-work` skill - Conventional commit guidelines with emojis

**Install:**
```bash
claude-code plugins install /path/to/cloud-code-plugins/git-workflow
```

**Prerequisites:** Git, GitHub CLI (`gh`)

#### reviewer-toolkit
Multi-perspective code review with parallel agents:
- `/reviewer-toolkit:review-pr [review-aspects]` - Review GitHub pull requests
- `/reviewer-toolkit:review-local-changes [review-aspects]` - Review uncommitted changes
- Specialized agents: security-auditor, bug-hunter, code-reviewer, contracts-reviewer, test-coverage-reviewer, historical-context-reviewer

**Install:**
```bash
claude-code plugins install /path/to/cloud-code-plugins/reviewer-toolkit
```

**Prerequisites:** Git, GitHub CLI (`gh`)

### Documentation

#### docs-manager
Repository documentation with git-based staleness tracking:
- `/docs-manager:onboard` - Generate CLAUDE.md and docs/claude/ documentation
- `/docs-manager:update-docs [doc-path]` - Update stale documentation based on git changes
- `/docs-manager:manage-principles` - Add, remove, or validate principles with evidence
- `documentation-standards` skill - Guidelines for Claude-optimized docs

**Install:**
```bash
claude-code plugins install /path/to/cloud-code-plugins/docs-manager
```

### MCP Integrations

#### mcp-serena
Semantic code analysis via Serena MCP server:
- Symbol search and navigation
- Finding references and implementations
- Pattern matching across codebase
- Type and interface analysis

**Install:**
```bash
claude-code plugins install /path/to/cloud-code-plugins/mcp-serena
```

**Prerequisites:** `uvx` (Python package manager)

#### mcp-context7
Up-to-date library documentation and examples:
- Current framework documentation
- Library API references
- Code examples and snippets
- Best practices

**Install:**
```bash
claude-code plugins install /path/to/cloud-code-plugins/mcp-context7
```

#### mcp-shadcn
shadcn/ui component documentation:
- Component API references
- Usage examples
- Styling guidelines
- Accessibility patterns

**Install:**
```bash
claude-code plugins install /path/to/cloud-code-plugins/mcp-shadcn
```

#### mcp-sequential-thinking
Structured problem-solving through step-by-step reasoning:
- Break down complex problems
- Document reasoning process
- Validate assumptions
- Track decision points

**Install:**
```bash
claude-code plugins install /path/to/cloud-code-plugins/mcp-sequential-thinking
```

### System Integration

#### macos-notifications
Desktop notifications for Claude Code events:
- Session start notifications
- Task completion alerts
- Customizable sounds
- Native macOS notification center

**Install:**
```bash
claude-code plugins install /path/to/cloud-code-plugins/macos-notifications
```

**Prerequisites:** macOS

## Installation

### Prerequisites

**Required:**
- Claude Code CLI - Install from https://github.com/anthropics/claude-code

**Optional** (per plugin):
- Git + GitHub CLI (`gh`) - For git-workflow and reviewer-toolkit
- `uvx` - For mcp-serena
- macOS - For macos-notifications

### Install Individual Plugins

```bash
# Clone repository
git clone https://github.com/dnlopes/cloud-code-plugins.git
cd cloud-code-plugins

# Install plugins
claude-code plugins install /path/to/cloud-code-plugins/<plugin-name>
```

### Quick Setup - Essential Workflow

Install core development workflow:

```bash
# Development lifecycle
claude-code plugins install /path/to/cloud-code-plugins/dev-toolkit

# Git and PR management
claude-code plugins install /path/to/cloud-code-plugins/git-workflow

# Code review
claude-code plugins install /path/to/cloud-code-plugins/reviewer-toolkit

# Documentation
claude-code plugins install /path/to/cloud-code-plugins/docs-manager
```

### Quick Setup - Enhanced Experience

Add MCP integrations and notifications:

```bash
# Semantic code analysis (requires uvx)
claude-code plugins install /path/to/cloud-code-plugins/mcp-serena

# Up-to-date library docs
claude-code plugins install /path/to/cloud-code-plugins/mcp-context7

# Desktop notifications (macOS only)
claude-code plugins install /path/to/cloud-code-plugins/macos-notifications
```

## Quick Start

### Feature Development Workflow

```bash
# 1. Research and plan
/dev-toolkit:create-plan
# - Ask for requirements
# - Research codebase with parallel agents
# - Present findings and design options
# - Create detailed implementation plan

# 2. Implement changes iteratively
# - Follow the generated plan
# - Make code changes

# 3. Commit your work
/git-workflow:commit
# - Analyzes changes
# - Drafts conventional commit message
# - Gets approval
# - Creates commit

# 4. Create pull request
/git-workflow:create-pr
# - Creates branch if needed
# - Pushes to remote
# - Creates PR with summary

# 5. Review the PR
/reviewer-toolkit:review-pr <pr-number>
# - Parallel agents check security, bugs, quality, tests
# - Results posted as GitHub comments
```

### Repository Onboarding

```bash
# Install docs-manager
claude-code plugins install /path/to/cloud-code-plugins/docs-manager

# Generate comprehensive documentation
/docs-manager:onboard
# Creates:
# - CLAUDE.md (entry point with @ imports)
# - docs/claude/architecture.md
# - docs/claude/domain.md
# - docs/claude/patterns.md
# - docs/claude/development.md
# - README.md (if missing)

# Update documentation when stale
/docs-manager:update-docs
# - Checks git timestamps
# - Identifies stale docs
# - Updates affected sections
```

### Code Review Automation

```bash
# Review a GitHub PR
/reviewer-toolkit:review-pr 123

# Review local uncommitted changes
/reviewer-toolkit:review-local-changes

# Review specific aspects only
/reviewer-toolkit:review-pr 123 "security,bugs"
/reviewer-toolkit:review-local-changes "quality,tests"
```

### Enhanced Code Navigation

```bash
# Activate Serena (if not auto-active)
/mcp-serena:activate-serena

# Use Serena tools in Claude Code session:
# - Search for symbols
# - Find references
# - Match patterns
# - Analyze types

# Get up-to-date library docs (auto-active)
# Ask Claude: "What's the latest API for React hooks?"
# Context7 provides current documentation
```

## Usage Examples

### Example 1: Plan and Implement Feature

```bash
# Start Claude Code session
claude-code

# Create implementation plan
/dev-toolkit:create-plan

# Describe feature when prompted
# Agent researches codebase, presents findings, creates plan

# Implement the plan
/dev-toolkit:implement-plan
# Executes plan phase by phase with verification

# Commit changes
/git-workflow:commit

# Create PR
/git-workflow:create-pr
```

### Example 2: Comprehensive Code Review

```bash
# Review PR with all aspects
/reviewer-toolkit:review-pr 456

# Parallel agents analyze:
# - Security vulnerabilities
# - Potential bugs
# - Code quality issues
# - API contract changes
# - Test coverage gaps
# - Historical context

# Results filtered by confidence/impact scoring
# Posted as line-specific GitHub comments
```

### Example 3: Documentation Maintenance

```bash
# Initial onboarding
/docs-manager:onboard
# Generates complete documentation

# Later, after making code changes...
/docs-manager:update-docs

# Agent checks git timestamps
# Identifies docs/claude/patterns.md is stale
# Updates affected sections based on git changes

# Add new principle
/docs-manager:manage-principles
# Select "Add principle"
# Provide principle description
# Agent validates against codebase
# Adds to CLAUDE.md with evidence
```

## Development

### Prerequisites

- Claude Code CLI
- Git (for version control)
- Pre-commit (optional, for local hook execution)

### Setup

```bash
# Clone repository
git clone https://github.com/dnlopes/cloud-code-plugins.git
cd cloud-code-plugins

# Install plugins locally
claude-code plugins install /path/to/cloud-code-plugins/<plugin-name>

# Make changes to plugin files
# - commands/*.md
# - agents/*.md
# - skills/*/SKILL.md

# Test changes
# Reload plugin and test commands/agents
```

### Creating a New Plugin

```bash
# Create plugin structure
mkdir -p my-plugin/.claude-plugin
mkdir -p my-plugin/commands
mkdir -p my-plugin/agents

# Create plugin.json
cat > my-plugin/.claude-plugin/plugin.json <<EOF
{
  "name": "my-plugin",
  "description": "Brief description",
  "version": "1.0.0",
  "author": "Your Name"
}
EOF

# Create README.md
# Document plugin purpose and usage

# Add commands, agents, skills as needed

# Install and test
claude-code plugins install /path/to/my-plugin
```

### Quality Checks

**Pre-commit hooks** (automatic in CI):
- JSON/YAML syntax validation
- Trailing whitespace removal
- Private key detection
- AWS credentials detection

**GitHub Actions**:
- PR pre-commit validation
- Semantic PR title checking
- Automated dependency updates via Renovate

### Commit Guidelines

**Format:** `<emoji> <type>(<scope>): <description>`

**Examples:**
```bash
git commit -m "✨ feat(dev-toolkit): add implementation plan command"
git commit -m "🐛 fix(git-workflow): resolve commit message formatting"
git commit -m "📝 docs(readme): update installation instructions"
```

**Common emoji prefixes:**
- ✨ `:sparkles:` - feat
- 🐛 `:bug:` - fix
- ♻️ `:recycle:` - refactor
- 📝 `:memo:` - docs
- ✅ `:white_check_mark:` - test

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes following existing patterns
4. Test thoroughly
5. Commit with conventional format
6. Create a pull request

See [docs/claude/development.md](docs/claude/development.md) for detailed contribution guidelines.

## Migration Notes

This repository was created by decomposing a monolithic `core-dev` plugin into focused, modular plugins. See [MIGRATION.md](./MIGRATION.md) for details.

## License

MIT License - See LICENSE file for details

## Resources

- [Claude Code Documentation](https://github.com/anthropics/claude-code)
- [Plugin Development Guide](https://docs.claudecode.com)
- [GitHub CLI](https://cli.github.com)
- [Conventional Commits](https://www.conventionalcommits.org)

## Support

- **Issues**: https://github.com/dnlopes/cloud-code-plugins/issues
- **Discussions**: https://github.com/dnlopes/cloud-code-plugins/discussions
