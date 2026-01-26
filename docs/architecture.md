---
scope:
  paths:
    - .claude-plugin/**
    - "*/.claude-plugin/**"
    - "*/commands/**"
    - "*/skills/**"
    - "*/agents/**"
  summary: "System architecture and component relationships"
last_updated: 2026-01-26T00:50:34Z
---

# Architecture

## Overview

The Claude Code Plugins Marketplace is a registry of self-contained plugins that extend Claude's capabilities. Each plugin provides commands (workflow orchestrators), skills (declarative knowledge), and agents (autonomous workers) following a consistent directory structure.

## Components

### Marketplace Registry
**Location:** `.claude-plugin/marketplace.json`
**Responsibility:** Declares available plugins with versions, sources, and descriptions
**Interacts with:** Claude Code plugin installer

### Plugin Containers
**Location:** `<plugin-name>/`
**Responsibility:** Self-contained extension packages with metadata and capabilities
**Interacts with:** Marketplace registry for discovery, Claude Code for execution

### Commands
**Location:** `<plugin>/commands/<command>.md`
**Responsibility:** Orchestrate multi-step workflows using skills and agents
**Interacts with:** Skills for knowledge, agents via Task tool spawning

### Skills
**Location:** `<plugin>/skills/<skill>/SKILL.md`
**Responsibility:** Provide declarative knowledge, patterns, and formats
**Interacts with:** Commands that load them for context

### Agents
**Location:** `<plugin>/agents/<agent>.md`
**Responsibility:** Execute specialized tasks autonomously when spawned
**Interacts with:** Commands that spawn them via Task tool

## Data Flow

```
Marketplace Registry
       │
       ▼
Plugin Container ──────────────────────────────┐
       │                                       │
       ▼                                       ▼
   Commands ──────────────────────────► Skills (knowledge)
       │
       ▼
   Agents (spawned via Task tool)
```

1. User invokes a command (e.g., `/governor:setup`)
2. Command loads relevant skills for patterns and formats
3. Command spawns agents for specialized subtasks
4. Agents execute autonomously and return results
5. Command synthesizes agent outputs into final result

## Plugin Catalog

| Plugin | Purpose |
|--------|---------|
| `dev-toolkit` | Development tools and build system skills |
| `docs-manager` | Documentation generation and staleness tracking |
| `git-workflow` | Git commit and PR workflows with conventions |
| `governor` | Architectural tenet management and verification |
| `review-toolkit` | Multi-agent pull request review |
| `ui-dev` | UI development with shadcn/ui integration |

## External Dependencies

| Dependency | Purpose | Integration Point |
|------------|---------|-------------------|
| MCP shadcn server | UI component documentation | `ui-dev/.mcp.json` |
| GitHub Actions | CI/CD and releases | `.github/workflows/` |
| semantic-release | Automated versioning | `.releaserc.yaml` |
