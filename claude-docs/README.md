# claude-docs

Repository onboarding and documentation maintenance for Claude context.

## Purpose

Creates and maintains documentation optimized for Claude to understand your codebase. Uses git-based tracking to detect when documentation becomes stale.

## Core Principle

**Documentation should capture patterns and concepts, not implementation details.**

If a document needs frequent updates, it's probably too detailed. Documentation should be useful for orientation and understanding, not a mirror of the code.

## What Gets Created

```
your-repo/
├── CLAUDE.md                    # Entry point + principles
└── docs/
    └── claude/
        ├── architecture.md      # System design, components
        ├── domain.md            # Business concepts, glossary
        ├── patterns.md          # Code conventions, examples
        ├── development.md       # Build, test, run
        └── modules/             # Optional deep-dives
            └── [complex].md
```

### CLAUDE.md

The entry point. Contains:
- Brief project description
- Quick start commands
- **Principles** - invariants that must be followed
- Links to detailed docs

### docs/claude/

Each document has front-matter tracking:
- **scope.paths** - Which files/directories the doc covers
- **last_commit** - Git commit when doc was last verified
- **last_updated** - Timestamp of last update

This enables git-based staleness detection.

## Commands

### `/claude-docs:onboard`

Creates initial documentation for a repository.

1. Explores the codebase systematically
2. Extracts architecture, patterns, domain concepts
3. Infers principles from code analysis
4. Generates CLAUDE.md and docs/claude/
5. Sets up front-matter for future updates

### `/claude-docs:update-docs [path]`

Checks and updates stale documentation.

1. Reads front-matter from each document
2. Checks `git diff <last_commit>..HEAD -- <scope_paths>`
3. Identifies documents with changes in their scope
4. Analyzes whether changes warrant doc updates
5. Updates documents and refreshes front-matter

## Agents

### codebase-explorer

Systematically explores a codebase to extract:
- Project identity and tech stack
- Architecture and components
- Domain concepts
- Code patterns with examples
- Suggested principles

### doc-analyzer

Analyzes git changes against a document's scope to determine:
- Whether updates are needed
- Which sections to update
- Specific recommendations

## Skills

### documentation-standards

Defines the format and abstraction level for documentation:
- Front-matter specification
- Document templates
- Guidelines for right-level abstraction

## Installation

```bash
claude plugins add dnlopes/cloud-code-plugins/claude-docs
```

## Usage

```bash
# Initial setup
/claude-docs:onboard

# Periodic updates
/claude-docs:update-docs

# Update specific document
/claude-docs:update-docs docs/claude/architecture.md
```

## Front-matter Format

```yaml
---
scope:
  paths:
    - src/api/**
    - src/routes/**
  summary: "API layer architecture"
last_commit: abc123def456789...
last_updated: 2025-01-15T10:30:00Z
---
```

## Design Philosophy

1. **Evidence-based** - Documentation reflects what's actually in the code, not assumptions

2. **Right abstraction** - High enough to be stable, detailed enough to be useful

3. **Git-tracked** - Staleness detection through commit tracking

4. **Minimal maintenance** - If docs need constant updates, they're too detailed

5. **Principles over rules** - CLAUDE.md captures invariants, not style guides
