# mcp-serena

Semantic code analysis and navigation via the Serena MCP server.

## Purpose

Provides advanced code understanding capabilities through symbol-level analysis, semantic search, and intelligent code navigation.

## Features

### Commands

- `/mcp-serena:activate-serena` - Activate Serena MCP semantic code analysis for the current project

### MCP Tools

Once activated, Serena provides tools for:

- **Symbol Discovery** - Find classes, functions, and methods by name or pattern
- **Reference Finding** - Locate all references to a symbol
- **Pattern Search** - Search for code patterns across the codebase
- **Symbol Editing** - Modify code at the symbol level (replace, insert before/after)
- **Memory System** - Store and retrieve project-specific knowledge

## Installation

```bash
claude-code plugins install /path/to/cloud-code-plugins/mcp-serena
```

## Requirements

Serena requires `uvx` to be installed. The MCP server will be automatically fetched when activated.

## Quick Example

```bash
# Activate Serena for your project
/mcp-serena:activate-serena

# Serena tools are now available for semantic code operations
# Example: Find all implementations of an interface
# Example: Get symbol overview of a file
# Example: Search for specific patterns
```

## Configuration

The plugin uses Serena v0.1.4 with IDE assistant context and web dashboard disabled. Configuration is in `.mcp.json`.
