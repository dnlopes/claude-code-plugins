# ui-dev

UI development toolkit with shadcn/ui component documentation and browser automation.

**Version:** 1.3.0

## Skills

| Skill | Activated When |
|-------|----------------|
| `agent-browser` | Troubleshooting UI issues, testing UI changes, or writing bash-based e2e tests |

## MCP Servers

| Server | Purpose |
|--------|---------|
| `shadcn` | Access shadcn/ui component documentation |

## Agent Browser

Headless browser automation CLI for AI agents.

### Quick Start

```bash
agent-browser open example.com
agent-browser snapshot                    # Get accessibility tree with refs
agent-browser click @e2                   # Click by ref from snapshot
agent-browser fill @e3 "test@example.com" # Fill by ref
agent-browser screenshot page.png
agent-browser close
```

### Core Commands

| Command | Description |
|---------|-------------|
| `open <url>` | Navigate to URL |
| `snapshot` | Accessibility tree with refs (best for AI) |
| `click <sel>` | Click element |
| `fill <sel> <text>` | Clear and fill |
| `screenshot [path]` | Take screenshot |
| `get text/html/value <sel>` | Get element info |
| `wait <selector/ms>` | Wait for element or time |
| `close` | Close browser |

### Selectors

**Refs (recommended for AI):**
```bash
agent-browser snapshot      # Get refs
agent-browser click @e2     # Use ref
```

**CSS/Text/XPath:**
```bash
agent-browser click "#submit"
agent-browser click "text=Submit"
```

**Semantic:**
```bash
agent-browser find role button click --name "Submit"
agent-browser find label "Email" fill "test@test.com"
```

### Optimal AI Workflow

```bash
agent-browser open example.com
agent-browser snapshot -i --json   # Interactive elements only
# AI identifies target refs
agent-browser click @e2
agent-browser fill @e3 "input"
agent-browser snapshot -i --json   # Get new state
```
