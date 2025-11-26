# mcp-context7

Up-to-date library documentation and code examples via Context7 MCP server.

## Purpose

Provides access to current documentation for popular libraries and frameworks, ensuring Claude has accurate, up-to-date information for development tasks.

## Features

### MCP Tools

- **resolve-library-id** - Find the correct Context7 library identifier for a package
- **get-library-docs** - Fetch documentation for a library (API references or conceptual guides)

### Supported Content

- API references and code examples (mode='code')
- Conceptual guides and architecture documentation (mode='info')
- Pagination support for comprehensive results

## Installation

```bash
claude-code plugins install /path/to/cloud-code-plugins/mcp-context7
```

## Quick Example

```bash
# Context7 tools are automatically available after installation

# Claude will use these tools when you ask about libraries:
# "How do I use React hooks?"
# "Show me Next.js API route examples"
# "What's the latest MongoDB syntax?"
```

## How It Works

1. When you ask about a library, Claude uses `resolve-library-id` to find the correct identifier
2. Claude then fetches relevant documentation with `get-library-docs`
3. Results are used to provide accurate, current examples and guidance

No manual activation needed - tools are available as soon as the plugin is installed.
