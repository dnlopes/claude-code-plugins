---
name: onboard
description: Create AGENTS.md, CLAUDE.md, and docs/ documentation for a repository
argument-hint: "[--auto]"
---

# Onboard Repository

Create documentation for a repository using specialized agents.

## Pre-flight

Check existing documentation:

```bash
ls AGENTS.md CLAUDE.md README.md 2>/dev/null
find docs -name "*.md" -type f 2>/dev/null
```

**If fully onboarded:**
> Repository already has documentation. Options:
> 1. **Regenerate** - Replace all documentation
> 2. **Update** - Use `/docs-manager:update-docs` instead
> 3. **Cancel**

**If partially onboarded:**
> Found partial documentation. Options:
> 1. **Complete** - Generate missing docs only
> 2. **Regenerate** - Replace all
> 3. **Cancel**

## Phase 1: Explore

Launch `docs-manager:codebase-explorer` agent:
- **Description**: "Explore codebase for documentation"
- **Prompt**: "Explore this repository and extract documentation-relevant information. Return structured findings covering: project overview, tech stack, architecture, patterns with file:line references, actionable principles, complex modules, and scope paths for each document type."

**Capture**: Structured findings for review.

## Phase 2: Review

**If --auto flag**: Skip to Phase 3.

Present findings summary to user:

```markdown
## Repository Analysis

**Project:** <name from findings>
**Type:** <type from findings>
**Tech Stack:** <stack from findings>

### Identified Principles
<List from findings>

### Complex Modules
<List or "None identified">

### Documentation Plan
Will generate:
- AGENTS.md, CLAUDE.md
- docs/architecture.md, domain.md, patterns.md, development.md
<Module docs if any>

**Options:**
1. **Proceed** - Generate with these findings
2. **Re-explore** - Gather more information
3. **Cancel**
```

Wait for user confirmation.

## Phase 3: Generate

Launch `docs-manager:doc-generator` agent:
- **Description**: "Generate documentation files"
- **Prompt**: "Generate documentation files from these findings: <findings from Phase 1>. Create AGENTS.md, CLAUDE.md, docs/architecture.md, docs/patterns.md, docs/development.md, and docs/domain.md (if applicable). Also create module AGENTS.md/CLAUDE.md pairs for any complex modules identified."

**Capture**: List of created files.

## Phase 4: Validate

Verify outputs:

```bash
# Check files exist
ls AGENTS.md CLAUDE.md docs/*.md 2>/dev/null

# Verify front-matter
head -10 AGENTS.md
head -10 docs/architecture.md
```

Check:
- [ ] All docs have valid front-matter
- [ ] CLAUDE.md contains only `@AGENTS.md`
- [ ] Build commands use build system (make/npm)

## Summary

```markdown
## Onboarding Complete

**Generated:**
- `AGENTS.md` - Main agent documentation
- `CLAUDE.md` - Redirect
- `docs/architecture.md` - System design
- `docs/domain.md` - Business concepts (or skipped)
- `docs/patterns.md` - Code conventions
- `docs/development.md` - Build/test/run
<Module docs if any>

### Next Steps
1. Review generated documentation
2. Run `/docs-manager:validate-docs` to verify
3. Commit the documentation
```

## Edge Cases

| Scenario | Approach |
|----------|----------|
| Monorepo | Root-level docs; modules get own AGENTS.md |
| No build system | Document raw commands, note limitation |
| Empty/new repo | Minimal docs, note limited findings |
| Existing CLAUDE.md | Migrate content to AGENTS.md, replace |
