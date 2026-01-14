---
scope:
  paths:
    - "*/.claude-plugin/plugin.json"
    - "*/agents/*.md"
    - "*/commands/*.md"
    - "*/skills/*/SKILL.md"
  summary: "System architecture and component relationships"
last_updated: 2026-01-13T23:12:02Z
---

# Architecture

## Overview

A monorepo of Claude Code plugins where each plugin provides specialized agents, commands, and skills. Plugins are discovered via marketplace.json and loaded on-demand by Claude Code.

## Components

### dev-toolkit (v2.1.0)
**Location:** `dev-toolkit/`
**Responsibility:** Codebase analysis, pattern discovery, web research, and development methodology
**Interacts with:** Used as foundation by other plugins for exploration tasks

### docs-manager (v2.2.0)
**Location:** `docs-manager/`
**Responsibility:** AI-optimized documentation generation and maintenance with git-based staleness tracking
**Interacts with:** dev-toolkit agents for codebase exploration

### git-workflow (v2.0.0)
**Location:** `git-workflow/`
**Responsibility:** Structured git commits and pull request creation
**Interacts with:** GitHub via `gh` CLI

### review-toolkit (v2.1.0)
**Location:** `review-toolkit/`
**Responsibility:** Multi-agent code review with parallel execution and confidence/impact scoring
**Interacts with:** git-workflow for PR operations, spawns 6 specialized review agents

### ui-dev (v1.2.0)
**Location:** `ui-dev/`
**Responsibility:** Frontend design generation, headless browser automation, and shadcn/ui component documentation via MCP
**Interacts with:** External shadcn/ui API via MCP protocol

### governor (v1.0.0)
**Location:** `governor/`
**Responsibility:** Project tenets management - discover, validate, and maintain guiding tenets in AGENTS.md
**Interacts with:** Reads/writes AGENTS.md files

## Data Flow

```
User invokes command (e.g., /review-toolkit:review-pr)
    ↓
Command loads skill instructions
    ↓
Command spawns agents via Task tool (subagent_type)
    ↓
Agents execute with restricted tool access
    ↓
Results collected, scored, filtered
    ↓
Final output returned to user
```

## External Dependencies

| Dependency | Purpose | Integration Point |
|------------|---------|-------------------|
| GitHub API | PR operations, releases | `gh` CLI in git-workflow, review-toolkit |
| semantic-release | Automated versioning | `.releaserc.yaml` |
| Trivy | Security scanning | `.github/workflows/pr-trivy.yaml` |
| Renovate | Dependency updates | `renovate.json` |
