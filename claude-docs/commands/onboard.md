---
description: Create CLAUDE.md and docs/claude/ documentation for a repository
---

# Repository Onboarding

You are onboarding a repository to create Claude-optimized documentation.

## Pre-flight Check

First, verify this is appropriate:

```bash
# Check if already onboarded
ls CLAUDE.md docs/claude/ 2>/dev/null
```

If CLAUDE.md or docs/claude/ already exists, ask the user:
> This repository appears to already have Claude documentation. Would you like to:
> 1. **Regenerate** - Replace existing documentation
> 2. **Update** - Use `/claude-docs:update-docs` instead
> 3. **Cancel** - Keep existing documentation

## Load Standards

Load the documentation-standards skill to ensure you follow the correct format:

```
Use the documentation-standards skill for format and template guidance.
```

## Phase 1: Exploration

Spawn a **codebase-explorer** agent to systematically analyze the repository:

```
Explore this repository comprehensively. I need:
1. Project identity (what it does, 1-2 sentences)
2. Tech stack with versions
3. Architecture (components and relationships)
4. Domain concepts and terminology
5. Code patterns with examples
6. Suggested principles/invariants
7. Development workflow (build, test, run)
8. Suggested scope paths for each document type
```

Wait for the agent to return structured findings.

## Phase 2: Review Findings

Present a summary to the user:

```markdown
## Repository Analysis Complete

**Project:** <name>
**Type:** <web app / CLI / library / etc.>
**Tech Stack:** <language> + <framework>

### Suggested Principles
Based on code analysis, these appear to be project invariants:

1. <principle> - Evidence: <what was observed>
2. <principle> - Evidence: <what was observed>
3. <principle> - Evidence: <what was observed>

### Would you like to:
- **Proceed** with these findings
- **Adjust** the principles before generating docs
- **Re-explore** with different focus
```

Wait for user confirmation or adjustments.

## Phase 3: Generate Documentation

Get the current commit hash and timestamp:

```bash
git rev-parse HEAD
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

Create the directory structure:

```bash
mkdir -p docs/claude/modules
```

### Generate CLAUDE.md

Using the exploration findings and documentation-standards templates, create CLAUDE.md at the repository root.

Key requirements:
- Brief description (1-2 sentences)
- Quick start commands
- Principles section with the confirmed/adjusted principles
- Links to docs/claude/
- Front-matter with commit hash and timestamp

### Generate docs/claude/architecture.md

Using findings, create architecture documentation:
- High-level overview
- Component descriptions with locations
- Data flow
- External dependencies
- Key architectural decisions (if evident)

Include proper front-matter with:
- scope.paths covering architectural files
- scope.summary
- last_commit and last_updated

### Generate docs/claude/domain.md

Using findings, create domain documentation:
- Glossary of terms
- Core entities and relationships
- Business rules

Include proper front-matter with:
- scope.paths covering domain/model files
- scope.summary
- last_commit and last_updated

### Generate docs/claude/patterns.md

Using findings, create patterns documentation:
- Project structure
- Naming conventions
- Error handling (with 1 example)
- Testing patterns (with 1 example)
- Other common patterns (with examples)

Include proper front-matter with:
- scope.paths covering representative files
- scope.summary
- last_commit and last_updated

### Generate docs/claude/development.md

Using findings, create development documentation:
- Prerequisites
- Setup steps
- Build commands
- Test commands
- Run locally
- Environment variables

Include proper front-matter with:
- scope.paths covering build/config files
- scope.summary
- last_commit and last_updated

### Generate Module Docs (If Warranted)

Only create docs/claude/modules/<name>.md for modules that:
- Have non-obvious behavior
- Are complex enough to warrant separate documentation
- Cannot be adequately covered in architecture.md

Most repositories will NOT need module docs. Prefer keeping things in the main documents.

## Phase 4: Validation

After generating all documents:

1. **Verify front-matter** - All docs have proper scope paths and commit info
2. **Check cross-references** - Links between docs work
3. **Verify examples** - File:line references are accurate

```bash
# List created files
find docs/claude -name "*.md" | head -20
cat CLAUDE.md | head -30
```

## Phase 5: Summary

Present to the user:

```markdown
## Onboarding Complete

Created:
- `CLAUDE.md` - Entry point with <N> principles
- `docs/claude/architecture.md` - System overview
- `docs/claude/domain.md` - Business concepts
- `docs/claude/patterns.md` - Code conventions
- `docs/claude/development.md` - Build & test workflow
<- `docs/claude/modules/X.md` - if any created>

### Next Steps
1. Review the generated documentation
2. Adjust principles in CLAUDE.md if needed
3. Run `/claude-docs:update-docs` periodically to keep docs current

### To Update Later
```
/claude-docs:update-docs
```
This will check for changes since last update and refresh stale docs.
```

## Important Guidelines

1. **Don't invent information** - Only document what was actually found in the code.

2. **Stay at the right abstraction** - If something would need frequent updates, it's too detailed.

3. **Principles must be evidence-based** - Every suggested principle should come from observed patterns in the code.

4. **One good example per pattern** - Don't list every instance.

5. **Verify before documenting** - Read actual files, don't assume from names.

6. **Ask when uncertain** - If you're not sure about a principle or pattern, ask the user rather than guessing.
