---
scope:
  paths:
    - ui-dev/**
  summary: "Plugin overview and usage guide"
last_updated: 2026-01-16T23:30:15Z
---

# UI-Dev Plugin

UI development toolkit with headless browser automation and shadcn/ui component documentation.

## Goals

The ui-dev plugin provides specialized tools for UI development workflows:

- **Headless browser automation** optimized for AI agents
- **Accessibility-first element selection** using deterministic refs
- **shadcn/ui integration** via MCP server for component documentation
- **Bash-based e2e testing** patterns

## Commands

None. This plugin provides knowledge resources rather than workflow commands.

## Skills

| Skill | Description |
|-------|-------------|
| `agent-browser` | Comprehensive headless browser CLI reference for troubleshooting UI issues, testing UI changes, writing e2e tests, and automating browser interactions |

## Agents

None. The skill is intended for use by agents from other plugins or user-created agents.

## MCP Integration

Connects to the shadcn/ui MCP server for component documentation access:

```json
{
  "mcpServers": {
    "shadcn": {
      "type": "http",
      "url": "https://www.shadcn.io/api/mcp"
    }
  }
}
```

## Workflows

### Snapshot-First Browser Automation

1. Navigate to target URL with `open <url>`
2. Take snapshot to get accessibility tree with refs
3. Identify target elements from ref output
4. Interact using refs (`@e1`, `@e2`) instead of CSS selectors
5. Re-snapshot after DOM changes

### Use Cases

- **Troubleshooting UI issues**: Visual inspection, element state
- **Testing UI changes**: Before/after comparisons
- **Writing e2e tests**: Bash-based automation scripts
- **Automating workflows**: Form submissions, multi-step processes
- **Debugging**: Visibility, focus, or interaction problems

### Element Selection

| Method | Example | Use Case |
|--------|---------|----------|
| Refs | `@e1` | AI-friendly, deterministic |
| CSS | `#submit` | Standard selectors |
| Text | `text=Submit` | Visible text matching |
| Role | `role button` | Accessibility queries |

## Version

2.0.0
