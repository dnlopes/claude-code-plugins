# ui-dev

UI development toolkit with headless browser automation and shadcn/ui component documentation.

**Version:** 1.3.0

## What's Included

| Component | Type | Purpose |
|-----------|------|---------|
| `agent-browser` | Skill | Headless browser CLI for UI testing and automation |
| `shadcn` | MCP Server | Access shadcn/ui component documentation |

## Skills

### agent-browser

Headless browser automation optimized for AI agents. Uses accessibility snapshots with deterministic refs for reliable element selection.

**Activated when:** Troubleshooting UI issues, testing UI changes, writing e2e tests, or automating browser interactions.

**Quick example:**
```bash
agent-browser open example.com
agent-browser snapshot -i        # Get interactive elements with refs
agent-browser click @e2          # Click by ref
agent-browser fill @e3 "text"    # Fill by ref
agent-browser close
```

See the full skill documentation for complete command reference.

## MCP Servers

### shadcn

Provides access to shadcn/ui component documentation via MCP.

**Usage:** Use the `mcp__plugin_ui-dev_shadcn__getComponents` and `mcp__plugin_ui-dev_shadcn__getComponent` tools to browse available components and get detailed documentation.
