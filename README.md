# Claude Code Plugins

A collection of modular Claude Code plugins for enhanced development workflows.

## Quick Start

Install plugins by referencing their directory path in your Claude Code configuration:

```bash
# Install a single plugin
claude-code plugins install /path/to/cloud-code-plugins/dev-toolkit

# Or install multiple plugins
claude-code plugins install /path/to/cloud-code-plugins/git-workflow
claude-code plugins install /path/to/cloud-code-plugins/mcp-serena
```

## Available Plugins

### Development Workflow

- **[dev-toolkit](./dev-toolkit/)** - Complete development lifecycle: planning, research, implementation, and codebase analysis
- **[git-workflow](./git-workflow/)** - Git operations and GitHub PR management
- **[reviewer-toolkit](./reviewer-toolkit/)** - Comprehensive code review with security, quality, and test coverage analysis

### Documentation

- **[project-documenter](./project-documenter/)** - Project documentation maintenance and repository onboarding

### MCP Integrations

- **[mcp-serena](./mcp-serena/)** - Semantic code analysis via Serena MCP server
- **[mcp-context7](./mcp-context7/)** - Up-to-date library documentation and examples
- **[mcp-atlassian](./mcp-atlassian/)** - Jira and Confluence integration
- **[mcp-shadcn](./mcp-shadcn/)** - shadcn/ui component documentation

### System

- **[macos-notifications](./macos-notifications/)** - Desktop notifications for Claude Code events

## Plugin Structure

Each plugin is self-contained and may include:

- **Commands** - Slash commands like `/commit` or `/create-plan`
- **Skills** - Reusable workflows and best practices
- **Agents** - Specialized sub-agents for focused tasks
- **Hooks** - Event-driven automation
- **MCP Servers** - External tool integrations

## Migration Notes

This repository was created by decomposing a monolithic `core-dev` plugin into focused, modular plugins. See [MIGRATION.md](./MIGRATION.md) for details.

## Contributing

Each plugin follows the standard Claude Code plugin structure. To add or modify functionality:

1. Navigate to the relevant plugin directory
2. Add/modify commands in `commands/`, skills in `skills/`, or agents in `agents/`
3. Test your changes with Claude Code
4. Submit a pull request

See [.github/PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md) for PR guidelines.
