---
description: Create CLAUDE.md and docs/ documentation for a repository
---

# Repository Onboarding

You are onboarding a repository to create documentation.

## Pre-flight Check

Check which documentation already exists:

```bash
# Check for existing documentation
ls CLAUDE.md 2>/dev/null
ls README.md 2>/dev/null
find docs -name "*.md" -type f 2>/dev/null
```

Build an inventory of existing vs missing documentation:
- **CLAUDE.md**: exists / missing
- **README.md**: exists (with/without front-matter) / missing
- **docs/architecture.md**: exists / missing
- **docs/domain.md**: exists / missing
- **docs/patterns.md**: exists / missing
- **docs/development.md**: exists / missing

Determine onboarding state:

### Fully Onboarded
If all core documentation exists (CLAUDE.md + all expected docs/*.md):
> This repository appears to be fully onboarded. Would you like to:
> 1. **Regenerate** - Replace all existing documentation
> 2. **Update** - Use `/docs-manager:update-docs` instead to update stale docs
> 3. **Cancel** - Keep existing documentation

### Partially Onboarded
If some documentation exists but other parts are missing:
> This repository is partially onboarded. Found:
> - CLAUDE.md: ✓ / ✗
> - README.md: ✓ / ✗
> - docs/architecture.md: ✓ / ✗
> - docs/domain.md: ✓ / ✗
> - docs/patterns.md: ✓ / ✗
> - docs/development.md: ✓ / ✗
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
Use the documentation-standards skill for format, templates, and good/bad examples.
```

**Critical references to read:**
- Document templates (Core + Optional structure)
- Principles examples (what makes a good principle)
- README examples (user-facing documentation)

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
- If **any docs/*.md missing**: Need exploration for those specific areas
- If **only README.md missing**: Need lighter README-focused exploration

### Partial Onboarding Exploration

If only specific docs are missing, tailor the exploration:

```
Explore this repository focusing on the missing documentation:
[Include only the relevant items below based on what's missing]

- For README.md: Project identity, features, installation, quick start (user audience)
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
Explore this repository comprehensively. Start with Phase 0 (Purpose Discovery) to establish:
1. Repository purpose - what does it provide?
2. User audience - who uses the output?
3. Developer audience - who contributes?

Then gather:
1. Project identity (what it does, 1-2 sentences)
2. Tech stack with versions
3. Architecture (components and relationships)
4. Domain concepts and terminology
5. Code patterns with examples (include file:line references)
6. Suggested principles - MUST be actionable developer guidance (what developers must DO)
7. Development workflow (build, test, run) - USE BUILD SYSTEM INTERFACES (make, npm scripts, etc.)
8. README-specific information (features, value proposition, use cases, installation methods)
9. Suggested scope paths for each document type

Remember:
- Principles must be actionable ("do X") not observations ("X exists")
- Use build system commands (make test) not raw commands (go test ./...)
- README info is for USERS, principles are for DEVELOPERS
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

### Repository Purpose
- **Provides:** <what this repo provides to users>
- **User Audience:** <who uses the output>
- **Developer Audience:** <who contributes>

### Suggested Principles
Based on code analysis, these are actionable rules for developers:

1. **<Principle>** - <What developers must do>
   Evidence: <what was observed>
2. **<Principle>** - <What developers must do>
   Evidence: <what was observed>
3. **<Principle>** - <What developers must do>
   Evidence: <what was observed>

### README Status
<If has_existing_readme:>
**Existing README found** - Will be enhanced with:
- Documentation index linking to docs/
- Updated features section if needed
- Custom sections will be preserved

<If no README:>
**No README found** - Will create new README with:
- Project summary and features
- Installation and quick start
- Usage examples
- Documentation index (linking to docs/)
- Brief contributing guidelines

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
mkdir -p docs/modules
```

### Generate CLAUDE.md

**Skip this section if CLAUDE.md already exists.**

Using the exploration findings and documentation-standards templates, create CLAUDE.md at the repository root.

Key requirements:
- Brief description (1-2 sentences)
- Quick start commands **using build system interfaces** (make, npm scripts, etc.)
- Principles section with **actionable developer guidance only**
- `@` imports for docs/ files (e.g., `@docs/architecture.md`)
- Front-matter with last_updated timestamp

**Principles checklist:**
- [ ] Each principle tells developers what to DO
- [ ] Each principle is an invariant that must be maintained
- [ ] No observations about infrastructure (e.g., "releases are automated")
- [ ] No tech stack descriptions (e.g., "we use TypeScript")
- [ ] 3-7 principles maximum

### Generate docs/architecture.md

**Skip this section if docs/architecture.md already exists.**

Using findings, create architecture documentation following the **Core + Optional** structure:

**Required sections:**
- Overview (2-3 sentences, high-level)
- Components (with Location, Responsibility, Interactions)

**Optional sections (include only if applicable):**
- Data Flow (if non-trivial flow exists)
- External Dependencies (if external integrations exist)
- Key Architectural Decisions (if evident from code)

Include proper front-matter with scope paths and timestamps.

### Generate docs/domain.md

**Skip this section if docs/domain.md already exists.**

Using findings, create domain documentation following the **Core + Optional** structure:

**Required sections:**
- Glossary (domain-specific terms only, not technical terms)

**Optional sections (include only if applicable):**
- Core Entities (if domain model exists)
- Business Rules (if business constraints exist)
- Domain Patterns (if complex domain logic exists)

**Note:** For utility libraries or purely technical projects, this document may be minimal. Don't force content that doesn't exist.

Include proper front-matter with scope paths and timestamps.

### Generate docs/patterns.md

**Skip this section if docs/patterns.md already exists.**

Using findings, create patterns documentation following the **Core + Optional** structure:

**Required sections:**
- Project Structure (directory layout with conventions)
- Naming Conventions (files, functions, types)

**Optional sections (include only if applicable):**
- Error Handling (if consistent pattern exists, with 1 example)
- Testing Patterns (if tests exist with consistent approach, with 1 example)
- Common Patterns (if repeating patterns observed, with examples)

Include file:line references for examples.
Include proper front-matter with scope paths and timestamps.

### Generate docs/development.md

**Skip this section if docs/development.md already exists.**

**Remember: This is human-focused documentation.**

Using findings, create development documentation following the **Core + Optional** structure:

**Required sections:**
- Prerequisites (with versions)
- Setup (step-by-step commands)
- Build (**using build system interfaces**)
- Test (**using build system interfaces**)
- Run Locally

**Optional sections (include only if applicable):**
- Environment Variables (if env vars are used)
- Common Tasks (if helpful shortcuts exist)
- Deployment (if deployment process exists)
- Contributing (if repo accepts contributions)

**Build system priority:**
- Use `make test` not `go test ./...`
- Use `npm test` not `jest`
- Use `docker-compose up` not `docker run ...`

Include proper front-matter with scope paths and timestamps.

### Generate Module Docs (If Warranted)

**Note**: Module docs are rarely needed and should only be created during full onboarding, not during partial completion.

Only create docs/modules/<name>.md for modules that:
- Have non-obvious behavior
- Are complex enough to warrant separate documentation
- Cannot be adequately covered in architecture.md

Most repositories will NOT need module docs. Prefer keeping things in the main documents.

### Generate or Enhance README.md

**Skip this section if README.md already exists with proper front-matter.** Only generate/enhance if:
- README.md doesn't exist, OR
- README.md exists but is missing front-matter

**Remember: README is for USERS of the repository's output (human-focused).**

**If no existing README (has_existing_readme = false):**

Create a new README.md at repository root following the **Core + Optional** structure from the README template.

**Required sections:**
- Header with project name and tagline
- Summary (2-3 sentences)
- Installation (all supported methods)
- Quick Start (minimal working example)
- Documentation index (linking to docs/)

**Optional sections (include based on project type):**
- Features (if multiple user-visible capabilities)
- Usage (if Quick Start isn't enough)
- API Reference (if library)
- CLI Reference (if CLI tool)
- Configuration (if significant config options)
- Contributing (if accepting contributions)

Include front-matter in HTML comment format (hidden from GitHub rendering).

**If existing README (has_existing_readme = true):**

Enhance the existing README by:
1. Reading current content completely
2. Identifying what sections exist
3. Adding front-matter in HTML comment format if missing
4. Adding Documentation index section if missing (linking to docs/)
5. Updating outdated information:
   - Installation steps that changed
   - Commands that changed
   - Features that are missing
   - Prerequisites that are outdated
6. Preserving:
   - Custom sections
   - Existing tone and style
   - Working examples
   - User-added content

**Development content should NOT be in README.** If the existing README has detailed development sections, note that this content now belongs in docs/development.md.

**Guidelines for both:**
- Use concrete examples, not placeholders
- Match the project's actual capabilities
- Include real commands that work
- Reference actual file paths where relevant
- Keep tone user-facing and welcoming
- Don't oversell or make false claims

## Phase 5: Validation

After generating all documents:

1. **Verify front-matter** - All docs (including README.md) have proper scope paths and timestamps
2. **Check cross-references** - Links between docs work
3. **Verify examples** - File:line references are accurate
4. **Verify README** - Commands work, paths are correct, examples are valid
5. **Verify build system usage** - Commands use make/npm/etc., not raw commands
6. **Verify principles are actionable** - Each principle tells developers what to DO

```bash
# List created files
find docs -name "*.md" | head -20
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
- `docs/architecture.md` - <"Created new" / "Skipped (already exists)">
- `docs/domain.md` - <"Created new" / "Skipped (already exists)" / "Skipped (not applicable)">
- `docs/patterns.md` - <"Created new" / "Skipped (already exists)">
- `docs/development.md` - <"Created new" / "Skipped (already exists)">
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

1. **Purpose first** - Always understand the repository's purpose and audiences before documenting.

2. **Audience matters** - README and development.md are human-focused. Other docs are Claude-optimized.

3. **Don't invent information** - Only document what was actually found in the code.

4. **Stay at the right abstraction** - If something would need frequent updates, it's too detailed.

5. **Principles must be actionable** - "Do X" not "X exists". Every principle should guide developer behavior.

6. **Use build system interfaces** - Document `make test` not `go test ./...`.

7. **One good example per pattern** - Don't list every instance.

8. **Verify before documenting** - Read actual files, don't assume from names.

9. **Ask when uncertain** - If you're not sure about a principle or pattern, ask the user rather than guessing.

10. **Skip empty sections** - Don't include optional sections with generic or filler content.
