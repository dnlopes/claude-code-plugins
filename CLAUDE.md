# cloud-code-plugins

A modular collection of Claude Code plugins that enhance development workflows through specialized commands, agents, skills, MCP integrations, and event hooks.

## Quick Start

**Install a plugin:**
```bash
claude-code plugins install /path/to/cloud-code-plugins/<plugin-name>
```

**Example workflow:**
```bash
# Install development toolkit
claude-code plugins install /path/to/cloud-code-plugins/dev-toolkit

# Create an implementation plan
/dev-toolkit:create-plan

# Commit your work
claude-code plugins install /path/to/cloud-code-plugins/git-workflow
/git-workflow:commit
```

## Available Plugins

### Development Workflow
- **dev-toolkit**: Complete development lifecycle with planning, research, implementation, and codebase analysis
- **git-workflow**: Git operations and GitHub PR management with conventional commits
- **reviewer-toolkit**: Multi-perspective code review with specialized agents (security, bugs, quality, tests, contracts)

### Documentation
- **docs-manager**: Repository onboarding and documentation maintenance with git-based staleness tracking

### MCP Integrations
- **mcp-serena**: Semantic code analysis via Serena MCP server (symbol search, references, pattern matching)
- **mcp-context7**: Up-to-date library documentation and examples
- **mcp-shadcn**: shadcn/ui component documentation
- **mcp-sequential-thinking**: Structured problem-solving through step-by-step reasoning

### System Integration
- **macos-notifications**: Desktop notifications for Claude Code events (macOS only)

## Documentation

@docs/claude/architecture.md
@docs/claude/domain.md
@docs/claude/patterns.md
@docs/claude/development.md

## Resources

- [Claude Code Documentation](https://github.com/anthropics/claude-code)
- [Plugin Development Guide](https://docs.claudecode.com)
