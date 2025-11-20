# Plugin Migration Summary

The `core-dev` plugin has been decomposed into 7 focused, self-contained plugins for better modularity and control.

## New Plugin Structure

### 1. **dev-toolkit** - Complete Development Workflow
**Purpose:** End-to-end development lifecycle - planning, research, implementation, and code review

**Contents:**
- **10 Agents:** codebase-locator, codebase-analyzer, codebase-pattern-finder, web-search-researcher, pragmatic-code-review, api-designer, backend-developer, frontend-developer, devops-engineer, golang-pro
- **4 Commands:** create-plan, research-codebase, implement-plan, review-pr
- **1 Skill:** golang-dev-guidelines

### 2. **git-workflow** - Git/GitHub Operations
**Purpose:** Version control and PR management

**Contents:**
- **2 Commands:** commit, create-pr

### 3. **terminal-notifications** - System Notifications
**Purpose:** Desktop notification hooks

**Contents:**
- **Hooks:** Stop and Notification events (terminal-notifier)

### 4. **mcp-serena** - Serena Semantic Code Analysis
**Purpose:** Advanced code understanding via Serena MCP

**Contents:**
- **1 Command:** activate-serena
- **MCP Server:** serena

### 5. **mcp-context7** - Library Documentation
**Purpose:** Up-to-date library docs and examples

**Contents:**
- **MCP Server:** context7

### 6. **mcp-atlassian** - Atlassian Integration
**Purpose:** Jira/Confluence integration

**Contents:**
- **MCP Server:** atlassian

### 7. **mcp-shadcn** - shadcn/ui Components
**Purpose:** Access to shadcn component docs

**Contents:**
- **MCP Server:** shadcn

## Benefits

✅ **Fine-grained control** - Enable/disable individual features
✅ **Self-contained** - No cross-plugin dependencies
✅ **Modular MCP servers** - One MCP per plugin
✅ **Logical groupings** - Related functionality bundled together
✅ **Better maintainability** - Easier to update individual plugins

## Migration Status

- ✅ Directory structure created
- ✅ Plugin manifests (plugin.json) created
- ✅ MCP configurations (.mcp.json) created
- ✅ Files distributed from core-dev to new plugins
- ⏳ Testing in progress
- ⏳ core-dev deprecation pending

## Usage

To enable a plugin, install it in your Claude Code configuration:

```bash
# Example: Enable dev-toolkit
claude-code plugins install /path/to/dev-toolkit

# Example: Enable specific MCP
claude-code plugins install /path/to/mcp-context7
```

You can now selectively enable only the plugins you need for your workflow.
