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
├── README.md                    # User-facing documentation (public, concise)
├── CLAUDE.md                    # Entry point + principles for Claude
└── docs/
    ├── architecture.md          # System design, components
    ├── domain.md                # Business concepts, glossary
    ├── patterns.md              # Code conventions, examples
    ├── development.md           # Build, test, run, contribute
    └── modules/                 # Optional deep-dives
        └── [complex].md
```

### README.md

Public-facing documentation for end users and contributors. Contains:
- Project summary and features
- Installation instructions
- Quick start guide with examples
- Usage examples for common scenarios
- Documentation index (links to docs/)
- Brief contributing guidelines

**Key principle:** README is concise and user-focused. Development details go in docs/development.md.

### CLAUDE.md

The entry point for Claude. Contains:
- Brief project description
- Quick start commands
- **Principles** - invariants that must be followed
- `@` imports for docs/ files (Claude Code auto-loads these at session start)

### docs/

Each document has front-matter tracking:
- **scope.paths** - Which files/directories the doc covers
- **last_review_date** - Timestamp when doc was last verified
- **last_updated** - Timestamp of last update

This enables git-based staleness detection.

## Commands

### `/docs-manager:onboard`

Creates initial documentation for a repository.

1. Explores the codebase systematically
2. Extracts architecture, patterns, domain concepts, and user-facing features
3. Infers principles from code analysis
4. Generates or enhances README.md (public-facing, concise)
5. Generates CLAUDE.md and docs/
6. Sets up front-matter for future updates

### `/docs-manager:update-docs [path]`

Checks and updates stale documentation (including README.md).

1. Reads front-matter from each document
2. Checks for changes since last review using `git log`
3. Identifies documents with changes in their scope
4. Analyzes whether changes warrant doc updates
5. Updates documents and refreshes front-matter

### `/docs-manager:manage-principles`

Add, remove, or update principles in CLAUDE.md.

1. Displays current principles
2. Offers actions: add, remove, edit, reorder
3. Validates new/edited principles against codebase
4. Discusses findings if evidence is weak
5. Updates CLAUDE.md with new timestamp

## Agents

### codebase-explorer

Systematically explores a codebase to extract:
- Project identity and tech stack
- Architecture and components
- Domain concepts
- Code patterns with examples
- Suggested principles
- README-specific information (features, use cases, installation)

### doc-analyzer

Analyzes git changes against a document's scope to determine:
- Whether updates are needed
- Which sections to update
- Specific recommendations

### readme-analyzer

Specialized agent for README.md updates:
- Analyzes user-facing impact of changes
- Determines which README sections need updating
- Preserves existing tone and custom content
- Recommends moving dev content to docs/development.md

### principle-validator

Validates proposed principles against the codebase:
- Searches for evidence supporting the principle
- Identifies counter-examples
- Returns verdict: SUPPORTED, WEAK_EVIDENCE, NOT_SUPPORTED, or CONTRADICTED

## Skills

### documentation-standards

Defines the format and abstraction level for documentation:
- Front-matter specification
- Document templates
- README template (public-facing focus)
- Guidelines for right-level abstraction

## Installation

```bash
claude plugins add dnlopes/cloud-code-plugins/docs-manager
```

## Usage

```bash
# Initial setup (creates/enhances README + CLAUDE.md + docs/)
/docs-manager:onboard

# Periodic updates (checks all docs including README)
/docs-manager:update-docs

# Update specific document
/docs-manager:update-docs docs/architecture.md
/docs-manager:update-docs README.md

# Manage principles
/docs-manager:manage-principles
```

## Documentation

Detailed documentation is available in this plugin's reference files:

- [Documentation Standards](skills/documentation-standards/SKILL.md) - Core philosophy and guidelines
- [README Template](skills/documentation-standards/reference/readme-template.md) - README structure
- [Document Templates](skills/documentation-standards/reference/document-templates.md) - Templates for docs/
- [Front-matter Spec](skills/documentation-standards/reference/frontmatter-spec.md) - Staleness tracking format

## Design Philosophy

1. **Evidence-based** - Documentation reflects what's actually in the code, not assumptions

2. **Right abstraction** - High enough to be stable, detailed enough to be useful

3. **Git-tracked** - Staleness detection through timestamp tracking

4. **Minimal maintenance** - If docs need constant updates, they're too detailed

5. **Principles over rules** - CLAUDE.md captures invariants, not style guides

6. **README is public-facing** - Development details go in docs/development.md
