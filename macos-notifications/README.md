# macos-notifications

Desktop notifications for Claude Code events on macOS.

## Purpose

Provides system-level desktop notifications for Claude Code lifecycle events, keeping you informed when long-running operations complete.

## Features

### Event Hooks

- **Stop Event** - Notification when Claude stops processing
- **Notification Event** - Custom notification triggers for workflow events

Uses `terminal-notifier` for native macOS notification center integration.

## Installation

```bash
claude-code plugins install /path/to/cloud-code-plugins/macos-notifications
```

## Requirements

- macOS system
- `terminal-notifier` installed (typically via Homebrew: `brew install terminal-notifier`)

## Configuration

Hooks are defined in `hooks/hooks.json` and trigger automatically based on Claude Code events. Customize notification behavior by editing the hook configuration.

## Use Cases

- Get notified when long-running tasks complete
- Stay informed about build/test results
- Receive alerts when Claude needs input
- Monitor background operations

## How It Works

The plugin registers hooks that execute `terminal-notifier` commands when specific Claude Code events occur, sending notifications to the macOS notification center.
