---
scope:
  paths:
    - "*/README.md"
    - "*/.claude-plugin/**"
    - "*/commands/**"
    - "*/agents/**"
    - "*/skills/**"
    - "*/.mcp.json"
  summary: "System architecture and component relationships"
last_review_date: 2025-12-06T02:02:02Z
last_updated: 2025-12-06T02:02:02Z
---

# Architecture

## Overview

cloud-code-plugins is a monorepo containing independent Claude Code plugins. Each plugin is a self-contained package that extends Claude Code with commands, agents, skills, hooks, or MCP integrations. Plugins are entirely declarative using Markdown and JSON configuration.

## Components

### Plugin Packages

**Location:** Individual directories at repository root (`dev-toolkit/`, `git-workflow/`, etc.)
**Responsibility:** Self-contained plugin packages providing specific functionality
**Interacts with:** Claude Code runtime, external MCP servers (for mcp-* plugins)

Each plugin follows a standard directory structure:
```
plugin-name/
├── .claude-plugin/
│   └── plugin.json       # Plugin metadata
├── commands/             # Interactive workflows
├── agents/               # Specialized AI agents
├── skills/               # Reusable knowledge documents
├── hooks/                # Event-triggered automations
├── .mcp.json            # MCP server configuration
└── README.md            # User documentation
```

### Development Toolkit (dev-toolkit)

**Location:** `dev-toolkit/`
**Responsibility:** Complete development lifecycle management including planning, research, implementation, and code review
**Interacts with:** Task tool for spawning analysis agents

Key commands:
- `create-plan` - Interactive planning with codebase research
- `implement-plan` - Phase-by-phase plan execution
- `research-codebase` - Parallel agent codebase analysis

### Git Workflow (git-workflow)

**Location:** `git-workflow/`
**Responsibility:** Git operations with conventional commit enforcement and PR management
**Interacts with:** Git CLI, GitHub API via `gh`

Key commands:
- `commit` - Conventional commit creation with approval workflow
- `create-pr` - Comprehensive PR creation with branch management

### Documentation Manager (docs-manager)

**Location:** `docs-manager/`
**Responsibility:** Repository documentation generation and maintenance with git-based staleness tracking
**Interacts with:** File system, git history for change detection

Key commands:
- `onboard` - Generate CLAUDE.md and docs/ for a repository
- `update-docs` - Refresh stale documentation based on git changes
- `manage-principles` - Add/remove principles with evidence validation

### Reviewer Toolkit (reviewer-toolkit)

**Location:** `reviewer-toolkit/`
**Responsibility:** Multi-perspective code review with specialized analysis agents
**Interacts with:** Task tool for parallel review agents

Key commands:
- `review-local-changes` - Review uncommitted changes
- `review-pr` - Comprehensive PR review

### MCP Integrations (mcp-*)

**Location:** `mcp-context7/`, `mcp-serena/`, `mcp-shadcn/`, `mcp-sequential-thinking/`
**Responsibility:** Bridge Claude Code to external MCP servers
**Interacts with:** External services via MCP protocol

| Plugin | MCP Server | Purpose |
|--------|------------|---------|
| mcp-context7 | Context7 | Library documentation access |
| mcp-serena | Serena | Semantic code analysis |
| mcp-shadcn | shadcn/ui | UI component documentation |
| mcp-sequential-thinking | Sequential Thinking | Structured reasoning |

### Platform Integration (macos-notifications)

**Location:** `macos-notifications/`
**Responsibility:** Native macOS notifications for Claude Code lifecycle events
**Interacts with:** macOS notification center via osascript

## Data Flow

```
User Command → Claude Code Runtime → Plugin Command
                                          ↓
                                    Task Tool (agents)
                                          ↓
                              Specialized Agent Analysis
                                          ↓
                                    Results → User
```

For MCP plugins:
```
Claude Code → .mcp.json config → MCP Server (external)
                                      ↓
                               Tool/Resource Response
```

## External Dependencies

| Dependency | Purpose | Integration Point |
|------------|---------|-------------------|
| GitHub CLI (`gh`) | PR operations | git-workflow commands |
| uvx | Python MCP servers | mcp-serena |
| npx | Node MCP servers | mcp-sequential-thinking |
| osascript | macOS notifications | macos-notifications hooks |
