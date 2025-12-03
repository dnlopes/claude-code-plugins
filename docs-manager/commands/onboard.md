---
description: Create CLAUDE.md and docs/claude/ documentation for a repository
---

# Repository Onboarding

You are onboarding a repository to create Claude-optimized documentation.

## Pre-flight Check

Check which documentation already exists:

```bash
# Check for existing documentation
ls CLAUDE.md 2>/dev/null
ls README.md 2>/dev/null
find docs/claude -name "*.md" -type f 2>/dev/null
```

Build an inventory of existing vs missing documentation:
- **CLAUDE.md**: exists / missing
- **README.md**: exists (with/without front-matter) / missing
- **docs/claude/architecture.md**: exists / missing
- **docs/claude/domain.md**: exists / missing
- **docs/claude/patterns.md**: exists / missing
- **docs/claude/development.md**: exists / missing

Determine onboarding state:

### Fully Onboarded
If all core documentation exists (CLAUDE.md + all expected docs/claude/*.md):
> This repository appears to be fully onboarded. Would you like to:
> 1. **Regenerate** - Replace all existing documentation
> 2. **Update** - Use `/docs-manager:update-docs` instead to update stale docs
> 3. **Cancel** - Keep existing documentation

### Partially Onboarded
If some documentation exists but other parts are missing:
> This repository is partially onboarded. Found:
> - CLAUDE.md: ✓ / ✗
> - README.md: ✓ / ✗
> - docs/claude/architecture.md: ✓ / ✗
> - docs/claude/domain.md: ✓ / ✗
> - docs/claude/patterns.md: ✓ / ✗
> - docs/claude/development.md: ✓ / ✗
>
> Would you like to:
> 1. **Complete** - Generate only the missing documentation
> 2. **Regenerate** - Replace all existing documentation
> 3. **Cancel** - Keep existing documentation

If user selects **Complete**, record which documents need to be generated and skip those that exist in Phase 4.

### Not Onboarded
If no documentation exists, proceed with full onboarding.

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

**Important**: If in **Complete mode** (partial onboarding), only explore what's needed for the missing documentation.

Determine exploration scope based on what needs to be generated:
- If **CLAUDE.md missing**: Need full exploration (all items below)
- If **any docs/claude/*.md missing**: Need exploration for those specific areas
- If **only README.md missing**: Need lighter README-focused exploration

### Partial Onboarding Exploration

If only specific docs are missing, tailor the exploration:

```
Explore this repository focusing on the missing documentation:
[Include only the relevant items below based on what's missing]

- For README.md: Project identity, features, installation, quick start, development workflow
- For architecture.md: Components, relationships, external dependencies, architectural decisions
- For domain.md: Domain concepts, terminology, entities, business rules
- For patterns.md: Project structure, naming conventions, error handling, testing patterns
- For development.md: Prerequisites, setup, build/test/run commands, environment variables
```

Then skip to Phase 4 and only generate the missing documents.

---

### Full Onboarding Exploration

For **full onboarding** (no existing docs), spawn a **codebase-explorer** agent to systematically analyze the repository:

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

**Skip this phase if in Complete mode (partial onboarding).** Go directly to Phase 4.

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

**Important**: If user selected **Complete** mode in pre-flight (partial onboarding), only generate the missing documents identified in pre-flight. Skip any documents that already exist.

Get the current timestamp:

```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

Create the directory structure if needed:

```bash
mkdir -p docs/claude/modules
```

### Generate CLAUDE.md

**Skip this section if CLAUDE.md already exists.**

Using the exploration findings and documentation-standards templates, create CLAUDE.md at the repository root.

Key requirements:
- Brief description (1-2 sentences)
- Quick start commands
- Principles section with the confirmed/adjusted principles
- `@` imports for docs/claude/ files (e.g., `@docs/claude/architecture.md`) - this ensures Claude Code loads all documentation at session start
- Front-matter with last_review_date and last_updated timestamp

### Generate docs/claude/architecture.md

**Skip this section if docs/claude/architecture.md already exists.**

Using findings, create architecture documentation:
- High-level overview
- Component descriptions with locations
- Data flow
- External dependencies
- Key architectural decisions (if evident)

Include proper front-matter with:
- scope.paths covering architectural files
- scope.summary
- last_review_date and last_updated

### Generate docs/claude/domain.md

**Skip this section if docs/claude/domain.md already exists.**

Using findings, create domain documentation:
- Glossary of terms
- Core entities and relationships
- Business rules

Include proper front-matter with:
- scope.paths covering domain/model files
- scope.summary
- last_review_date and last_updated

### Generate docs/claude/patterns.md

**Skip this section if docs/claude/patterns.md already exists.**

Using findings, create patterns documentation:
- Project structure
- Naming conventions
- Error handling (with 1 example)
- Testing patterns (with 1 example)
- Other common patterns (with examples)

Include proper front-matter with:
- scope.paths covering representative files
- scope.summary
- last_review_date and last_updated

### Generate docs/claude/development.md

**Skip this section if docs/claude/development.md already exists.**

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
- last_review_date and last_updated

### Generate Module Docs (If Warranted)

**Note**: Module docs are rarely needed and should only be created during full onboarding, not during partial completion.

Only create docs/claude/modules/<name>.md for modules that:
- Have non-obvious behavior
- Are complex enough to warrant separate documentation
- Cannot be adequately covered in architecture.md

Most repositories will NOT need module docs. Prefer keeping things in the main documents.

### Generate or Enhance README.md

**Skip this section if README.md already exists with proper front-matter.** Only generate/enhance if:
- README.md doesn't exist, OR
- README.md exists but is missing front-matter

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
- last_review_date and last_updated

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

Present to the user what was actually generated/modified:

```markdown
## Onboarding Complete

**Generated documentation:**
[List only the documents that were actually created or modified in this run]
- `README.md` - <"Created new" / "Enhanced existing" / "Skipped (already exists)">
- `CLAUDE.md` - <"Created new" / "Skipped (already exists)">
- `docs/claude/architecture.md` - <"Created new" / "Skipped (already exists)">
- `docs/claude/domain.md` - <"Created new" / "Skipped (already exists)">
- `docs/claude/patterns.md` - <"Created new" / "Skipped (already exists)">
- `docs/claude/development.md` - <"Created new" / "Skipped (already exists)">
[Only list module docs if they were created]

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
