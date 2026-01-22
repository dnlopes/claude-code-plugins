---
scope:
  paths:
    - dev-toolkit/**
  summary: "Plugin overview and usage guide"
last_updated: 2026-01-22T23:45:00Z
---

# Dev-Toolkit Plugin

Development tools and build system skills for modern workflows.

## Goals

The dev-toolkit plugin provides specialized knowledge for development tooling and build systems. It emphasizes:

- **Idiomatic patterns** for modern build tools
- **Migration guides** from legacy tools (e.g., Makefile to Taskfile)
- **Best practices** and common mistake avoidance
- **Comprehensive references** for tool primitives and APIs

## Commands

None currently. Skills are loaded automatically when relevant.

## Skills

| Skill | Description |
|-------|-------------|
| `taskfile-dev` | Taskfile authoring patterns, style conventions, Makefile translation, and detailed schema/templating references |

## Agents

None. This plugin provides declarative knowledge through skills.

## Workflows

### Creating a Taskfile

1. Request a Taskfile for your project
2. Skill provides patterns for common use cases (dev, Docker, CI/CD)
3. Claude generates idiomatic Taskfile following style conventions
4. References available for schema and templating details

### Translating Makefile to Taskfile

1. Provide existing Makefile or describe current build setup
2. Skill provides translation mapping (`.PHONY`, variables, targets)
3. Claude converts to equivalent Taskfile with improvements

## Version

1.0.0
