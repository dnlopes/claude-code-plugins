---
scope:
  paths:
    - "*/README.md"
    - "*/.claude-plugin/plugin.json"
    - "*/agents/**"
    - "*/commands/**"
  summary: "Plugin system terminology, core entities, and conceptual framework"
last_review_date: 2025-12-03T00:28:11Z
last_updated: 2025-12-03T00:28:11Z
---

# Domain Concepts

## Glossary

### Plugin
A self-contained unit of functionality for Claude Code. Each plugin provides commands, agents, skills, MCP integrations, or hooks. Plugins are independently installable and operate without dependencies on other plugins.

### Command
A user-invokable slash command (e.g., `/git-workflow:commit`) that provides step-by-step natural language instructions for Claude to follow. Commands are defined as markdown files with YAML front-matter.

### Agent
A specialized sub-agent with focused expertise, invoked via the Task tool for parallel research or analysis. Agents have narrow, well-defined responsibilities and specific tool access (Grep, Glob, Read, etc.).

### Skill
Reusable knowledge and guidelines that inform Claude's behavior across tasks. Skills provide comprehensive best practices, patterns, and reference materials loaded on-demand.

### Hook
Event-driven automation triggered by Claude Code lifecycle events (session start/stop, tool execution, etc.). Hooks execute shell commands in response to matched events.

### MCP Server
External integration providing tools and resources via Model Context Protocol. Can be HTTP-based (URL endpoint) or command-based (executable with arguments).

### Front-matter
YAML metadata at the top of markdown files containing scope paths, timestamps, summaries, and other structured information. Used for staleness tracking and documentation organization.

### Scope Paths
Glob patterns defining which files a document covers. Used by docs-manager for git-based staleness detection to determine when documentation needs updates.

### Staleness Tracking
Git-based detection mechanism that compares document timestamps with file modification times to identify outdated documentation. Uses `git log` with timestamp filtering to survive squash merges.

### @ imports
Special syntax in CLAUDE.md (e.g., `@docs/claude/architecture.md`) that causes Claude Code to automatically load referenced files at session start, making all documentation immediately available.

### Parallel Agents
Multiple Task agents running concurrently for comprehensive research or analysis. Used by dev-toolkit and reviewer-toolkit to gather information from multiple perspectives simultaneously.

### Quality Gate
Review threshold in reviewer-toolkit that determines if a pull request can merge. High/Critical security issues are automatic merge blockers.

### Conventional Commits
Commit message format `<type>(<scope>): <description>` enforced by git-workflow following the Angular convention. Examples: `feat: add new feature`, `fix: resolve bug`.

## Core Entities

### Plugin Components

**Commands**
- **Purpose**: User-facing entry points for plugin functionality
- **Invocation**: `/plugin-name:command-name`
- **Format**: Markdown files with front-matter
- **Behavior**: Provide step-by-step workflows, may include user approval checkpoints
- **Examples**: `/dev-toolkit:create-plan`, `/git-workflow:commit`, `/docs-manager:onboard`

**Agents**
- **Purpose**: Specialized analysis and research tools
- **Invocation**: Via Task tool with `subagent_type` parameter
- **Format**: Markdown files with front-matter specifying tools and model
- **Behavior**: Execute focused tasks and return structured results
- **Examples**: `codebase-locator`, `security-auditor`, `bug-hunter`, `principle-validator`

**Skills**
- **Purpose**: Reusable guidelines and best practices
- **Invocation**: Via Skill tool with skill name
- **Format**: Markdown files in `skills/` directories with reference subdirectories
- **Behavior**: Provide context and patterns to inform Claude's decisions
- **Examples**: `committing-work`, `golang-dev-guidelines`, `documentation-standards`

**Hooks**
- **Purpose**: Automated responses to events
- **Invocation**: Automatic on event match
- **Format**: JSON configuration with matchers and shell commands
- **Behavior**: Execute side effects (notifications, logging, etc.)
- **Examples**: Session start/stop notifications in macos-notifications

### Plugin Categories

**Development Workflow Plugins**
- Focus: Software development lifecycle
- Examples: dev-toolkit, git-workflow, reviewer-toolkit
- Capabilities: Planning, implementation, version control, code review

**Documentation Plugins**
- Focus: Repository documentation management
- Examples: docs-manager
- Capabilities: Onboarding, staleness detection, maintenance, principle validation

**MCP Integration Plugins**
- Focus: External tool and data access
- Examples: mcp-serena, mcp-context7, mcp-shadcn, mcp-sequential-thinking
- Capabilities: Semantic analysis, up-to-date docs, structured reasoning

**System Integration Plugins**
- Focus: Operating system interactions
- Examples: macos-notifications
- Capabilities: Desktop notifications, system events

## Relationships

### Plugin → Command Relationship
- One plugin can have zero or more commands
- Commands are scoped to their plugin namespace
- Example: git-workflow plugin provides `/git-workflow:commit` and `/git-workflow:create-pr`

### Plugin → Agent Relationship
- One plugin can define zero or more agents
- Agents are invoked by commands or skills within their plugin
- Agents can also be used by other plugins via qualified names
- Example: dev-toolkit defines `codebase-locator` agent used by its commands

### Command → Agent Relationship
- Commands can spawn multiple agents in parallel
- Agents execute focused sub-tasks and report back
- Example: `/dev-toolkit:research-codebase` spawns multiple Explore agents in parallel

### Plugin → Skill Relationship
- One plugin can provide zero or more skills
- Skills can be referenced by commands or loaded independently
- Example: git-workflow provides `committing-work` skill loaded by `/git-workflow:commit`

### Plugin → MCP Server Relationship
- One plugin can configure zero or one MCP server
- MCP servers auto-activate when plugin is installed
- Example: mcp-serena configures Serena MCP server via `.mcp.json`

### Documentation → Scope Paths Relationship
- Each documentation file defines scope paths in front-matter
- Scope paths are glob patterns covering relevant files
- docs-manager uses scope paths + git timestamps to detect staleness
- Example: architecture.md covers `*/commands/**`, `*/agents/**`, etc.

## Business Rules

### Plugin Independence
Each plugin must be self-contained and functional without dependencies on other plugins. Users can install any subset of plugins.

### User Approval for State Changes
Commands that modify state (commits, PRs, file changes) must present a plan and get explicit user approval before execution.

### Agent Single Responsibility
Each agent must have a narrow, well-defined focus. Prefer multiple specialized agents over monolithic ones.

### Documentation Abstraction Level
Documentation captures patterns and concepts, not implementation details. If a document needs frequent updates, it's too detailed.

### Evidence-Based Documentation
Any principle or pattern documented must be backed by observable evidence in the codebase.

### Timestamp-Based Staleness
Documentation staleness is tracked via timestamps and `git log`, not commit hashes, to survive squash merges and rebases.

### Conventional Commit Enforcement
All commits must follow conventional commit format (Angular convention) as defined by git-workflow.

### Security Quality Gates
Security issues rated High or Critical severity are automatic merge blockers in reviewer-toolkit.

### Pre-commit Hook Enforcement
All commits must pass pre-commit hooks for JSON/YAML validation, trailing whitespace removal, and security scanning (private keys, AWS credentials).
