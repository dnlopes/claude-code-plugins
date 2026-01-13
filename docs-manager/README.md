# docs-manager

Repository documentation for AI agents, with git-based staleness tracking.

## Purpose

Creates and maintains documentation optimized for AI agents to understand your codebase. Uses AGENTS.md as the main documentation file (agent-agnostic) with CLAUDE.md as a loader for Claude Code.

## Core Principle

**Documentation captures patterns and concepts, not implementation details.**

If a document needs frequent updates, it's too detailed.

## What Gets Created

```
your-repo/
├── AGENTS.md                    # Main agent documentation
├── CLAUDE.md                    # Single line: @AGENTS.md
├── README.md                    # User-facing (optional tracking)
├── docs/
│   ├── architecture.md          # System design, components
│   ├── domain.md                # Business concepts, glossary
│   ├── patterns.md              # Code conventions, examples
│   └── development.md           # Build, test, run, contribute
└── src/
    └── <complex-module>/
        ├── AGENTS.md            # Module-specific docs
        └── CLAUDE.md            # @AGENTS.md
```

### AGENTS.md

Main documentation for AI agents:
- Project description
- Quick start commands (using build system)
- Principles (actionable developer guidance)
- Dual-format doc references (@ for Claude, links for others)

### CLAUDE.md

Single line pointing to AGENTS.md:
```markdown
@AGENTS.md
```

### Module Documentation

Complex modules get co-located AGENTS.md + CLAUDE.md with:
- Module purpose and key abstractions
- Internal architecture
- Non-obvious behaviors
- Dependencies

## Commands

### `/docs-manager:onboard`

Creates initial documentation:
1. Explores codebase systematically
2. Identifies complex modules
3. Generates AGENTS.md, CLAUDE.md, docs/
4. Creates module docs for complex modules
5. Enhances or creates README.md

### `/docs-manager:update-docs [path]`

Updates stale documentation:
1. Checks git log for changes since last review
2. Analyzes which documents need updates
3. Applies changes with user approval

### `/docs-manager:manage-principles`

Manages principles in AGENTS.md:
1. Add, remove, edit, or reorder principles
2. Validates new principles against codebase
3. Shows evidence for or against

## Installation

```bash
claude plugins add dnlopes/cloud-code-plugins/docs-manager
```

## Usage

```bash
# Initial setup
/docs-manager:onboard

# Periodic updates
/docs-manager:update-docs

# Update specific document
/docs-manager:update-docs docs/architecture.md

# Manage principles
/docs-manager:manage-principles
```

## Design Philosophy

1. **Agent-agnostic** - AGENTS.md works with any AI agent
2. **Evidence-based** - Documentation reflects actual code
3. **Right abstraction** - Stable over time
4. **Git-tracked** - Timestamp-based staleness detection
5. **Minimal maintenance** - If docs need constant updates, too detailed
