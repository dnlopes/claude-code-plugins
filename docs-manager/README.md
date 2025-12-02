# docs-manager

Repository onboarding and documentation maintenance for Claude context and user-facing READMEs.

## Purpose

Creates and maintains documentation optimized for Claude to understand your codebase, plus generates and maintains user-facing README.md files. Uses git-based tracking to detect when documentation becomes stale.

## Core Principle

**Documentation should capture patterns and concepts, not implementation details.**

If a document needs frequent updates, it's probably too detailed. Documentation should be useful for orientation and understanding, not a mirror of the code.

## What Gets Created

```
your-repo/
├── README.md                    # User-facing documentation (generated or enhanced)
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

### README.md

User-facing documentation for end users and contributors. Contains:
- Project summary and features
- Installation instructions (all methods)
- Quick start guide with examples
- Usage examples for common scenarios
- Development setup guide
- Contributing guidelines

**Smart generation:**
- If README exists: Enhances it while preserving tone, style, and custom sections
- If no README: Creates comprehensive documentation from scratch
- Always includes front-matter for git-based staleness tracking

### CLAUDE.md

The entry point. Contains:
- Brief project description
- Quick start commands
- **Principles** - invariants that must be followed
- `@` imports for docs/claude/ files (Claude Code auto-loads these at session start)

### docs/claude/

Each document has front-matter tracking:
- **scope.paths** - Which files/directories the doc covers
- **last_commit** - Git commit when doc was last verified
- **last_updated** - Timestamp of last update

This enables git-based staleness detection.

## Commands

### `/docs-manager:onboard`

Creates initial documentation for a repository.

1. Explores the codebase systematically
2. Extracts architecture, patterns, domain concepts, and user-facing features
3. Infers principles from code analysis
4. Generates or enhances README.md (preserves existing content if present)
5. Generates CLAUDE.md and docs/claude/
6. Sets up front-matter for future updates

### `/docs-manager:update-docs [path]`

Checks and updates stale documentation (including README.md).

1. Reads front-matter from each document (including README.md)
2. Checks `git diff <last_commit>..HEAD -- <scope_paths>`
3. Identifies documents with changes in their scope
4. Analyzes whether changes warrant doc updates
5. For README: preserves tone, style, and custom sections while updating outdated info
6. Updates documents and refreshes front-matter

### `/docs-manager:manage-principles`

Add, remove, or update principles in CLAUDE.md.

1. Displays current principles
2. Offers actions: add, remove, edit, reorder
3. For new/edited principles, validates against codebase
4. Discusses findings with user if evidence is weak or contradictory
5. Updates CLAUDE.md with new commit/timestamp

## Agents

### codebase-explorer

Systematically explores a codebase to extract:
- Project identity and tech stack
- Architecture and components
- Domain concepts
- Code patterns with examples
- Suggested principles
- README-specific information (features, use cases, installation methods)

### doc-analyzer

Analyzes git changes against a document's scope to determine:
- Whether updates are needed
- Which sections to update
- Specific recommendations

### readme-analyzer

Specialized agent for README.md updates:
- Analyzes user-facing impact of changes
- Determines which README sections need updating
- Preserves existing tone, style, and custom content
- Recommends enhancements while maintaining user voice

### principle-validator

Validates proposed principles against the codebase:
- Searches for evidence supporting the principle
- Identifies counter-examples
- Returns verdict: SUPPORTED, WEAK_EVIDENCE, NOT_SUPPORTED, or CONTRADICTED

## Skills

### documentation-standards

Defines the format and abstraction level for documentation:
- Front-matter specification
- Document templates (including README template)
- Guidelines for right-level abstraction
- README-specific standards and sections

## Installation

```bash
claude plugins add dnlopes/cloud-code-plugins/docs-manager
```

## Usage

```bash
# Initial setup (creates/enhances README + CLAUDE.md + docs/claude/)
/docs-manager:onboard

# Periodic updates (checks all docs including README)
/docs-manager:update-docs

# Update specific document
/docs-manager:update-docs docs/claude/architecture.md
/docs-manager:update-docs README.md

# Manage principles
/docs-manager:manage-principles
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

6. **Smart preservation** - Existing READMEs are enhanced, not replaced; tone and style are maintained
