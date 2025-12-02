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
> 2. **Update** - Use `/docs-manager:update-docs` instead
> 3. **Cancel** - Keep existing documentation

## Load Standards

Load the documentation-standards skill to ensure you follow the correct format:

```
Use the documentation-standards skill for format and template guidance.
```

## Phase 1: Check Existing README

Before starting, check if README.md exists:

```bash
ls README.md 2>/dev/null
```

If README.md exists:
- Set `has_existing_readme = true`
- Read the existing README to understand its structure and content
- Note any custom sections or unique organization
- This will be enhanced rather than replaced

## Phase 2: Exploration

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
8. README-specific information (features, value proposition, use cases, installation methods)
9. Suggested scope paths for each document type (including README.md)
```

Wait for the agent to return structured findings.

## Phase 3: Review Findings

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

### README Status
<If has_existing_readme:>
**Existing README found** - Will be enhanced with:
- Updated features section
- Improved installation steps
- Current development workflow
- Custom sections will be preserved

<If no README:>
**No README found** - Will create new README with:
- Project summary and features
- Installation and quick start
- Usage examples
- Development guide
- Contributing guidelines

### Would you like to:
- **Proceed** with these findings
- **Adjust** the principles before generating docs
- **Re-explore** with different focus
```

Wait for user confirmation or adjustments.

## Phase 4: Generate Documentation

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
- `@` imports for docs/claude/ files (e.g., `@docs/claude/architecture.md`) - this ensures Claude Code loads all documentation at session start
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

### Generate or Enhance README.md

**If no existing README (has_existing_readme = false):**

Create a new README.md at repository root using the README template from documentation-standards.

Required sections:
- Header with project name and tagline
- Summary (2-3 sentences)
- Features (user-visible capabilities)
- Installation (all methods: package manager, Docker, source)
- Quick Start (minimal working example)
- Usage (2-3 common use cases with examples)
- Development (setup, build, test, run)
- Contributing (brief guide)

Include front-matter with:
- scope.paths covering package files, config files, entry points, CI configs
- scope.summary
- last_commit and last_updated

**If existing README (has_existing_readme = true):**

Enhance the existing README by:
1. Reading current content completely
2. Identifying what sections exist
3. Adding front-matter if missing
4. Updating outdated information:
   - Installation steps that changed
   - Commands that changed
   - Features that are missing
   - Prerequisites that are outdated
5. Preserving:
   - Custom sections
   - Existing tone and style
   - Working examples
   - User-added content

Add missing required sections if they don't exist, but maintain the existing structure and voice.

**Guidelines for both:**
- Use concrete examples, not placeholders
- Match the project's actual capabilities
- Include real commands that work
- Reference actual file paths where relevant
- Keep tone user-facing and welcoming
- Don't oversell or make false claims

## Phase 5: Validation

After generating all documents:

1. **Verify front-matter** - All docs (including README.md) have proper scope paths and commit info
2. **Check cross-references** - Links between docs work
3. **Verify examples** - File:line references are accurate
4. **Verify README** - Commands work, paths are correct, examples are valid

```bash
# List created files
find docs/claude -name "*.md" | head -20
cat CLAUDE.md | head -30
head -50 README.md
```

## Phase 6: Summary

Present to the user:

```markdown
## Onboarding Complete

Created:
- `README.md` - <"Created new" or "Enhanced existing"> user-facing documentation
- `CLAUDE.md` - Entry point with <N> principles
- `docs/claude/architecture.md` - System overview
- `docs/claude/domain.md` - Business concepts
- `docs/claude/patterns.md` - Code conventions
- `docs/claude/development.md` - Build & test workflow
<- `docs/claude/modules/X.md` - if any created>

### Next Steps
1. Review the generated documentation
2. Test the README examples to ensure they work
3. Adjust principles in CLAUDE.md if needed
4. Run `/docs-manager:update-docs` periodically to keep docs current

### To Update Later
```
/docs-manager:update-docs
```
This will check for changes since last update and refresh stale docs (including README.md).
```

## Important Guidelines

1. **Don't invent information** - Only document what was actually found in the code.

2. **Stay at the right abstraction** - If something would need frequent updates, it's too detailed.

3. **Principles must be evidence-based** - Every suggested principle should come from observed patterns in the code.

4. **One good example per pattern** - Don't list every instance.

5. **Verify before documenting** - Read actual files, don't assume from names.

6. **Ask when uncertain** - If you're not sure about a principle or pattern, ask the user rather than guessing.
