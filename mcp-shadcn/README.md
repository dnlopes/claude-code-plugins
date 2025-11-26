# mcp-shadcn

shadcn/ui component documentation via MCP server.

## Purpose

Provides instant access to shadcn/ui component documentation, enabling Claude to accurately implement and customize shadcn components.

## Features

### MCP Tools

- **getComponents** - List all available shadcn/ui components
- **getComponent** - Get detailed documentation for a specific component

### Component Coverage

Access to documentation for all shadcn/ui components including:

- Form components (input, select, checkbox, etc.)
- Layout components (card, separator, tabs, etc.)
- Feedback components (alert, toast, dialog, etc.)
- Data display (table, badge, avatar, etc.)
- Navigation components (menu, breadcrumb, pagination, etc.)

## Installation

```bash
claude-code plugins install /path/to/cloud-code-plugins/mcp-shadcn
```

## Quick Example

```bash
# Tools are automatically available after installation

# Claude can now:
# - List all available shadcn components
# - Fetch component usage examples
# - Get installation and customization instructions
# - Provide accurate implementation guidance
```

## Use Cases

- Implement shadcn components correctly
- Customize component themes and variants
- Understand component props and usage patterns
- Get copy-paste ready component code
