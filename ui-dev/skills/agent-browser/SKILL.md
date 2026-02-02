---
name: agent-browser
description: Use when troubleshooting UI issues, testing UI changes, writing bash-based e2e tests, or automating browser interactions. Provides headless browser CLI with accessibility snapshots and deterministic refs for AI-friendly element selection.
user-invocable: false
---

# Agent Browser

Headless browser automation CLI optimized for AI agents.

## Overview

Agent Browser provides deterministic browser control through accessibility snapshots and refs. Instead of fragile CSS selectors, agents take snapshots to get refs (e.g., `@e2`) that point to exact elements. This snapshot-then-act workflow is optimal for LLM-based automation.

## When to Use

**Use for:**
- Troubleshooting UI issues (visual inspection, element state)
- Testing UI changes before/after comparisons
- Writing bash-based end-to-end tests
- Automating form submissions or multi-step workflows
- Debugging visibility, focus, or interaction problems

**Do NOT use for:**
- API testing (use curl or API tools)
- Non-visual backend operations
- Static file generation
- Tasks that don't require browser rendering

## Quick Reference

| Task | Command |
|------|---------|
| Open page | `agent-browser open <url>` |
| Get elements | `agent-browser snapshot` |
| Click element | `agent-browser click @e2` |
| Fill input | `agent-browser fill @e3 "text"` |
| Get text | `agent-browser get text @e1` |
| Screenshot | `agent-browser screenshot [path]` |
| Wait for element | `agent-browser wait <selector>` |
| Close browser | `agent-browser close` |

## Snapshot-First Pattern

The recommended interaction pattern follows a snapshot-first approach:

1. **Navigate** to the target URL
2. **Snapshot** to get accessibility tree with refs
3. **Identify** target elements from ref output
4. **Interact** using refs (not CSS selectors)
5. **Re-snapshot** after DOM changes

This pattern ensures deterministic element selection and avoids fragile selectors.

## Selectors

### Refs (Recommended)

Refs from snapshots provide deterministic element targeting:

```bash
agent-browser snapshot
# Output: - button "Submit" [ref=e2]
#         - textbox "Email" [ref=e3]

agent-browser click @e2       # Click button
agent-browser fill @e3 "x"    # Fill textbox
```

**Why refs?** Deterministic (exact element from snapshot), fast (no re-query), AI-friendly.

### CSS, Text, XPath

```bash
agent-browser click "#submit"
agent-browser click "text=Submit"
agent-browser click "xpath=//button"
```

### Semantic Locators

```bash
agent-browser find role button click --name "Submit"
agent-browser find label "Email" fill "test@test.com"
agent-browser find text "Sign In" click
```

**Actions:** `click`, `fill`, `check`, `hover`, `text`

## Command Reference

### Navigation

```bash
agent-browser open <url>          # Navigate (aliases: goto, navigate)
agent-browser back                # Go back
agent-browser forward             # Go forward
agent-browser reload              # Reload page
```

### Interaction

```bash
agent-browser click <sel>         # Click
agent-browser dblclick <sel>      # Double-click
agent-browser fill <sel> <text>   # Clear and fill
agent-browser type <sel> <text>   # Type into element
agent-browser press <key>         # Press key (Enter, Tab, Control+a)
agent-browser hover <sel>         # Hover
agent-browser focus <sel>         # Focus
agent-browser select <sel> <val>  # Select dropdown
agent-browser check <sel>         # Check checkbox
agent-browser uncheck <sel>       # Uncheck
agent-browser scroll <dir> [px]   # Scroll (up/down/left/right)
agent-browser drag <src> <tgt>    # Drag and drop
agent-browser upload <sel> <files> # Upload files
```

### Get Information

```bash
agent-browser get text <sel>      # Get text content
agent-browser get html <sel>      # Get innerHTML
agent-browser get value <sel>     # Get input value
agent-browser get attr <sel> <attr> # Get attribute
agent-browser get title           # Get page title
agent-browser get url             # Get current URL
agent-browser get count <sel>     # Count matching elements
agent-browser get box <sel>       # Get bounding box
```

### State Checks

```bash
agent-browser is visible <sel>    # Check visibility
agent-browser is enabled <sel>    # Check enabled state
agent-browser is checked <sel>    # Check checkbox state
```

### Wait

```bash
agent-browser wait <selector>     # Wait for element visible
agent-browser wait <ms>           # Wait milliseconds
agent-browser wait --text "text"  # Wait for text
agent-browser wait --url "**/path" # Wait for URL pattern
agent-browser wait --load networkidle # Wait for load state
agent-browser wait --fn "window.ready === true" # Wait for JS condition
```

### Snapshot Options

```bash
agent-browser snapshot            # Full accessibility tree
agent-browser snapshot -i         # Interactive elements only
agent-browser snapshot -c         # Compact (remove empty elements)
agent-browser snapshot -d 3       # Limit depth
agent-browser snapshot -s "#main" # Scope to selector
agent-browser snapshot --json     # Machine-readable output
```

### Screenshot & PDF

```bash
agent-browser screenshot [path]   # Screenshot (--full for full page)
agent-browser pdf <path>          # Save as PDF
```

### Browser Settings

```bash
agent-browser set viewport <w> <h> # Set viewport size
agent-browser set device <name>   # Emulate device ("iPhone 14")
agent-browser set geo <lat> <lng> # Set geolocation
agent-browser set offline [on|off] # Toggle offline
agent-browser set headers <json>  # Extra HTTP headers
agent-browser set media [dark|light] # Emulate color scheme
```

### Cookies & Storage

```bash
agent-browser cookies             # Get all cookies
agent-browser cookies set <n> <v> # Set cookie
agent-browser cookies clear       # Clear cookies
agent-browser storage local       # Get localStorage
agent-browser storage local set <k> <v> # Set value
agent-browser storage local clear # Clear all
```

### Network

```bash
agent-browser network route <url> # Intercept requests
agent-browser network route <url> --abort # Block requests
agent-browser network route <url> --body <json> # Mock response
agent-browser network unroute [url] # Remove routes
agent-browser network requests    # View tracked requests
```

### Tabs & Frames

```bash
agent-browser tab                 # List tabs
agent-browser tab new [url]       # New tab
agent-browser tab <n>             # Switch to tab
agent-browser tab close [n]       # Close tab
agent-browser frame <sel>         # Switch to iframe
agent-browser frame main          # Back to main frame
```

### Debug

```bash
agent-browser trace start [path]  # Start recording
agent-browser trace stop [path]   # Stop and save
agent-browser console             # View console messages
agent-browser errors              # View page errors
agent-browser highlight <sel>     # Highlight element
agent-browser state save <path>   # Save auth state
agent-browser state load <path>   # Load auth state
```

### Sessions

```bash
agent-browser --session name open url # Named session
agent-browser session list        # List active sessions
agent-browser session             # Show current session
```

### Setup

```bash
agent-browser install             # Download Chromium
agent-browser install --with-deps # With system deps (Linux)
```

## Common Mistakes

| Mistake | Solution |
|---------|----------|
| Using CSS selectors instead of refs | Take `snapshot` first, use `@eN` refs |
| Not waiting for page load | Add `wait --load networkidle` after navigation |
| Stale refs after page change | Take new `snapshot` after interactions that change DOM |
| Full snapshot on complex pages | Use `snapshot -i -c` for interactive/compact mode |
| Forgetting to close browser | Always `close` when done to free resources |
| Hard-coded waits | Use `wait <selector>` or `wait --text` instead of `wait <ms>` |
