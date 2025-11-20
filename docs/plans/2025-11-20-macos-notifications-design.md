# macOS Notifications Plugin Design

**Date**: 2025-11-20
**Author**: David Lopes
**Status**: Approved

## Overview

A Claude Code plugin that provides native macOS desktop notifications using `osascript`, requiring zero external dependencies. The plugin notifies users when Claude Code needs attention or completes tasks, enabling users to work in other applications while waiting for Claude.

## Goals

- Notify users when Claude Code is waiting for input
- Notify users when Claude Code completes tasks
- Use only tools bundled with macOS (no homebrew/external installations)
- Simple, maintainable implementation
- Clear, distinct audio and visual feedback for different event types

## Technical Approach

### Technology Choice: osascript

We selected `osascript` (AppleScript command-line interface) as the notification mechanism because:

1. **Native to macOS**: Bundled with every macOS installation
2. **Full-featured**: Supports both visual notifications and system sounds in a single command
3. **Notification Center integration**: Uses the native macOS Notification Center
4. **Zero setup**: No installation or configuration required

### Plugin Structure

```
macos-notifications/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata
└── hooks/
    └── hooks.json           # Hook definitions
```

This follows the standard Claude Code plugin pattern used throughout the repository.

## Implementation Details

### Plugin Metadata (plugin.json)

```json
{
  "name": "macos-notifications",
  "description": "Native macOS notification hooks using osascript - zero dependencies",
  "version": "1.0.0",
  "author": {
    "name": "David Lopes"
  }
}
```

### Hook Definitions (hooks.json)

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Your attention needed\" with title \"Claude Code\" sound name \"Glass\"'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Task complete\" with title \"Claude Code\" sound name \"Purr\"'"
          }
        ]
      }
    ]
  }
}
```

### Hook Behavior

**Notification Hook** (Claude waiting for user input):
- **Trigger**: When Claude Code needs user attention
- **Message**: "Your attention needed"
- **Sound**: "Glass" - distinct, attention-grabbing
- **Purpose**: Alert user to return to Claude Code window

**Stop Hook** (Claude finished working):
- **Trigger**: When Claude Code completes a task
- **Message**: "Task complete"
- **Sound**: "Purr" - subtle, pleasant confirmation
- **Purpose**: Inform user task is done (less urgent)

Both notifications:
- Display "Claude Code" as the title
- Appear in macOS Notification Center
- Persist until dismissed by user
- Work regardless of whether Claude Code window has focus

### Empty Matcher Strategy

The `"matcher": ""` configuration means hooks trigger on ALL events of that type without filtering. This ensures:
- Maximum reliability - never miss a notification
- Simple configuration - no complex regex patterns
- Predictable behavior - users know exactly when notifications appear

## User Experience

### Installation
1. Copy plugin directory to Claude Code plugins location
2. Register in marketplace.json (if applicable)
3. Claude Code auto-loads on next session

### Runtime
- No configuration needed
- Works immediately after installation
- Notifications appear in Notification Center
- Sounds play through system audio

### Customization Options

Users can easily modify `hooks.json` to customize:

**Change sounds**: Replace `"Glass"` or `"Purr"` with any macOS system sound:
- Available sounds in `/System/Library/Sounds/`
- Examples: Basso, Blow, Bottle, Frog, Funk, Hero, Morse, Ping, Pop, Sosumi, Submarine, Tink

**Change messages**: Edit notification text strings

**Add filtering**: Use `matcher` field with regex patterns to trigger only on specific events

## Advantages Over Existing terminal-notifications Plugin

1. **Zero dependencies**: No need to install `terminal-notifier` via homebrew
2. **Native integration**: Uses macOS Notification Center directly
3. **Simpler setup**: Works immediately on any macOS system
4. **Learning opportunity**: Clean implementation to understand Claude Code hooks

## System Requirements

- macOS (any version with osascript support)
- Claude Code with hooks support

## Future Enhancements (YAGNI - not implementing now)

Possible future additions if needed:
- Configurable notification duration
- Custom notification icons
- Conditional notifications based on task complexity
- Integration with macOS Focus modes
