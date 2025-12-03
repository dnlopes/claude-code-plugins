---
scope:
  paths:
    - .claude-plugin/**
    - "*/README.md"
    - "*/commands/**"
    - "*/agents/**"
    - "*/skills/**"
    - "*/hooks/**"
    - .mcp.json
  summary: "Plugin system architecture, component relationships, and plugin structure patterns"
last_review_date: 2025-12-03T00:28:11Z
last_updated: 2025-12-03T00:28:11Z
---

# Architecture

## System Overview

cloud-code-plugins is a modular collection of Claude Code plugins that extend Claude's capabilities through declarative markdown-based configuration. The architecture is built around independent, self-contained plugins that provide specialized functionality without code compilation - everything is defined through configuration files and natural language instructions.

## Plugin Categories

### 1. Development Workflow Plugins

**Location**: `/dev-toolkit`, `/git-workflow`, `/reviewer-toolkit`

- **dev-toolkit**: Provides comprehensive development lifecycle tools including research commands (`/research-codebase`), planning commands (`/create-plan`), implementation commands (`/implement-plan`), and specialized agents for codebase analysis, locating components, and finding patterns
- **git-workflow**: Handles git operations and GitHub integration with commands for creating commits (`/commit`) and pull requests (`/create-pr`), enforcing conventional commit format with emojis
- **reviewer-toolkit**: Offers multi-perspective code review through parallel specialized agents that analyze security, bugs, code quality, API contracts, test coverage, and historical context

### 2. Documentation Plugin

**Location**: `/docs-manager`

- **docs-manager**: Manages repository documentation with commands for onboarding (`/onboard`), updating stale docs (`/update-docs`), and managing principles (`/manage-principles`). Uses git-based staleness tracking via timestamps to detect when documentation needs refreshing.

### 3. MCP Integration Plugins

**Location**: `/mcp-serena`, `/mcp-context7`, `/mcp-shadcn`, `/mcp-sequential-thinking`

- **mcp-serena**: Integrates Serena MCP server for semantic code analysis (symbol search, finding references, pattern matching)
- **mcp-context7**: Provides access to up-to-date library documentation and examples via HTTP-based MCP server
- **mcp-shadcn**: Offers shadcn/ui component documentation
- **mcp-sequential-thinking**: Enables structured problem-solving through step-by-step reasoning

### 4. System Integration Plugin

**Location**: `/macos-notifications`

- **macos-notifications**: Provides desktop notifications for Claude Code lifecycle events (session start/stop) via macOS notification center using `osascript`

## Plugin Structure

Each plugin follows a consistent, self-contained directory structure:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json              # Plugin metadata (name, description, version, author)
├── .mcp.json                    # Optional: MCP server configuration
├── README.md                    # User-facing documentation
├── commands/                    # Optional: Slash commands (/plugin:command-name)
│   └── command-name.md          # Natural language instructions for Claude
├── agents/                      # Optional: Specialized sub-agents
│   └── agent-name.md            # Agent definition with tools and instructions
├── skills/                      # Optional: Reusable workflows and guidelines
│   └── skill-name/
│       ├── SKILL.md             # Skill definition and guidelines
│       └── reference/           # Supporting documentation
├── hooks/                       # Optional: Event-driven automation
│   └── hooks.json               # Hook definitions with matchers and commands
```

### Component Types

#### Commands (`commands/`)
Slash commands are markdown files with YAML front-matter that provide step-by-step instructions for Claude to follow. Users invoke them via `/plugin-name:command-name` syntax.

**Key characteristics:**
- Natural language instructions
- Step-by-step workflows
- User approval checkpoints for destructive operations
- Front-matter specifies command name and description

#### Agents (`agents/`)
Specialized sub-agents with focused expertise, invoked via the Task tool for parallel research or analysis. Each agent has a narrow, well-defined responsibility.

**Key characteristics:**
- YAML front-matter specifies allowed tools (Grep, Glob, Read, etc.)
- Model specification (sonnet, opus, haiku)
- Single-purpose design
- Return structured results

#### Skills (`skills/`)
Reusable knowledge and guidelines that inform Claude's behavior across tasks. Skills are loaded to provide context and best practices.

**Key characteristics:**
- Comprehensive guidelines and patterns
- Best practices documentation
- Reference materials in subdirectories
- Loaded on-demand via Skill tool

#### Hooks (`hooks/`)
Event-driven automation triggered by Claude Code lifecycle events (session start, stop, tool execution, etc.).

**Key characteristics:**
- JSON configuration with matchers and shell commands
- Event-based triggers
- Integration with system tools (e.g., osascript for notifications)

#### MCP Configuration (`.mcp.json`)
Defines Model Context Protocol server connections for external integrations. Supports both HTTP-based and command-based servers.

**Key characteristics:**
- HTTP servers: URL endpoint
- Command servers: executable with arguments
- Auto-activated when plugin is installed

## Data Flow

### 1. Command Invocation Flow
```
User types /plugin:command
  → Claude Code loads command markdown
  → Claude follows natural language instructions
  → Command may spawn agents via Task tool
  → Results returned to user
```

### 2. Agent Execution Flow
```
Command/Skill spawns agent via Task tool
  → Agent receives focused prompt
  → Agent uses allowed tools (Grep, Glob, Read, etc.)
  → Agent performs specialized analysis
  → Structured results returned to parent
```

### 3. Skill Application Flow
```
Command references skill via Skill tool
  → Claude Code loads skill markdown
  → Guidelines and patterns available to Claude
  → Claude applies knowledge to current task
```

### 4. MCP Integration Flow
```
Plugin with .mcp.json installed
  → MCP server automatically activated
  → Tools become available to Claude
  → Claude can invoke MCP tools during tasks
```

### 5. Hook Execution Flow
```
Claude Code lifecycle event fires
  → Hook matcher evaluates event
  → If match, shell command executes
  → Side effect occurs (e.g., notification displayed)
```

## External Dependencies

### Required
- **Claude Code CLI**: Host environment for all plugins

### Optional (per plugin)
- **Git + GitHub CLI (`gh`)**: Required by git-workflow and reviewer-toolkit
- **uvx**: Required by mcp-serena for Python-based MCP server
- **macOS**: Required by macos-notifications (uses osascript)

## Key Architectural Decisions

### Declarative Over Imperative
Plugins are entirely declarative - functionality is defined through markdown-based natural language instructions rather than executable code. This makes plugins easy to create, modify, and understand without traditional software development.

### Plugin Independence
Each plugin is self-contained and independently installable. There are no cross-plugin dependencies, allowing users to install only what they need.

### Agent Specialization
The system uses multiple specialized agents (each with narrow scope) rather than monolithic agents. This enables parallel execution and clearer separation of concerns.

### Git-Based Staleness Tracking
docs-manager uses timestamps and `git log` rather than commit hashes for staleness detection. This survives squash merges and rebases, making documentation maintenance more robust.

### User Approval for State Changes
Commands that modify state (commits, PRs, file changes) require explicit user approval after presenting a plan. This prevents unintended destructive operations.
