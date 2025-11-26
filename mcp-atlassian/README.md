# mcp-atlassian

Jira and Confluence integration via Atlassian MCP server.

## Purpose

Enables Claude to interact with Atlassian services, allowing seamless integration of Jira issues and Confluence pages into development workflows.

## Features

### MCP Tools

Access to Atlassian APIs for:

- Jira issue management (create, read, update issues)
- Confluence page operations (read, create, update pages)
- Project and workspace queries
- Comment and attachment handling

## Installation

```bash
claude-code plugins install /path/to/cloud-code-plugins/mcp-atlassian
```

## Configuration

The plugin requires MCP server configuration. Check `.mcp.json` for setup details and ensure you have:

- Atlassian API credentials configured
- Access to your Jira and Confluence instances
- Proper permissions for the operations you need

## Quick Example

```bash
# Tools are automatically available after installation and configuration

# Claude can now:
# - Fetch Jira ticket details
# - Update issue status
# - Read Confluence documentation
# - Link code changes to tickets
```

## Use Cases

- Fetch ticket requirements during planning
- Update ticket status as work progresses
- Reference Confluence documentation in implementation
- Create tickets from code review findings
