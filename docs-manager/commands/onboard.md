---
name: onboard
description: Create AGENTS.md, CLAUDE.md, and docs/ documentation for a repository
---

# Onboarding

Create documentation for a repository.

## Pre-flight

Check what documentation exists:

```bash
ls AGENTS.md CLAUDE.md README.md 2>/dev/null
find docs -name "*.md" -type f 2>/dev/null
```

Build inventory:

- **AGENTS.md**: exists / missing
- **CLAUDE.md**: exists / missing
- **README.md**: exists / missing
- **docs/**: exists / partial / missing

**If fully onboarded:**
> This repository is fully onboarded. Would you like to:
>
> 1. **Regenerate** - Replace all documentation
> 2. **Update** - Use `/docs-manager:update-docs` instead
> 3. **Cancel**

**If partially onboarded:**
> Found partial documentation. Would you like to:
>
> 1. **Complete** - Generate missing docs only
> 2. **Regenerate** - Replace all
> 3. **Cancel**

## Explore

**IMPORTANT:** Load skill `documentation-standards` for templates and format.

Use the Task tool with subagent_type='codebase-explorer' to explore the repository:

```text
Explore this repository comprehensively:

1. Repository purpose and audiences
2. Tech stack with versions
3. Architecture and components
4. Domain concepts
5. Code patterns with file:line examples
6. Development workflow using BUILD SYSTEM interfaces
7. README information (user-facing)
8. Complex modules warranting dedicated docs
9. Suggested scope paths for each document

Remember:
- Use build system (make test) not raw commands (go test)
```

Wait for structured findings.

## Review

Present summary to user:

```markdown
## Repository Analysis

**Project:** <name>
**Type:** <web app / CLI / library>
**Tech Stack:** <language> + <framework>

### Complex Modules
<List modules that will get dedicated AGENTS.md, or "None identified">

### README Status
<Existing / Will create new / Will enhance existing>

### Would you like to:
- **Proceed** with these findings
- **Re-explore** with different focus
```

Wait for user confirmation.

## Generate

Get timestamp:
```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

Create structure:
```bash
mkdir -p docs
```

### Generate AGENTS.md

Create AGENTS.md at repository root using template from `documentation-standards` skill.

**Checklist:**
- [ ] Brief description (1-2 sentences)
- [ ] Quick start with BUILD SYSTEM commands
- [ ] Dual-format doc references (`@docs/file.md` for Claude Code imports, `[text](docs/file.md)` for human readers)

### Generate CLAUDE.md

Claude Code reads `CLAUDE.md` by convention. Create it as a single-line redirect to keep all documentation in `AGENTS.md` (which other tools and humans can also use):

```markdown
@AGENTS.md
```

### Generate docs/

Create each document using templates:
- `docs/architecture.md` - Components with Location/Responsibility/Interacts
- `docs/domain.md` - Glossary (skip if purely technical project)
- `docs/patterns.md` - Structure and naming conventions
- `docs/development.md` - Build/test/run using build system

Include front-matter with scope paths and timestamp.

### Generate Module Docs

For each complex module identified:

1. Create `<module-path>/AGENTS.md` with:
   - Module purpose
   - Key abstractions
   - Internal architecture
   - Gotchas
   - Dependencies

2. Create `<module-path>/CLAUDE.md` with:
   ```markdown
   @AGENTS.md
   ```

### Enhance README.md

**If README exists:**
- Add front-matter in HTML comment format
- Add Documentation section linking to docs/
- Update outdated information
- Preserve custom sections

**If no README:**
- Create using template
- Focus on user-facing content
- Include Documentation section

## Validate

```bash
# List created files
find . -name "AGENTS.md" -o -name "CLAUDE.md" | head -20
find docs -name "*.md"
head -30 AGENTS.md
head -20 README.md
```

Verify:
- [ ] All docs have proper front-matter
- [ ] Cross-references work
- [ ] File:line references are accurate
- [ ] Build commands use build system

## Summary

```markdown
## Onboarding Complete

**Generated:**
- `AGENTS.md` - Created
- `CLAUDE.md` - Created
- `docs/architecture.md` - Created
- `docs/domain.md` - Created / Skipped (not applicable)
- `docs/patterns.md` - Created
- `docs/development.md` - Created
- `README.md` - Created / Enhanced
<For each module:>
- `<path>/AGENTS.md` - Created
- `<path>/CLAUDE.md` - Created

### Next Steps
1. Review generated documentation
2. Test README examples
3. Run `/docs-manager:update-docs` periodically
```

## Edge Cases

- **Monorepo**: Focus on root-level docs; modules get their own AGENTS.md
- **No build system**: Document raw commands but note this
- **Empty/new repo**: Generate minimal docs, note limited findings
- **Existing CLAUDE.md**: Migrate content to AGENTS.md, replace CLAUDE.md

## Guidelines

1. **Purpose first** - Understand repository purpose before documenting
2. **Don't invent** - Only document what was found
3. **Right abstraction** - If it needs frequent updates, too detailed
4. **Build system interfaces** - `make test` not `go test`
5. **One example per pattern** - Not every instance
6. **Ask when uncertain** - Don't guess
7. **Skip empty sections** - No filler content
