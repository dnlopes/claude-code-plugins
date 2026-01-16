---
name: add-doc
description: Generate ad-hoc documentation for specific code locations with staleness tracking
argument-hint: "<path-or-topic> [--auto]"
---

# Add Documentation

Generate documentation for a specific path or topic with automatic staleness tracking.

## Pre-flight

Parse argument to determine target:

**If path provided** (e.g., `src/auth`, `lib/utils.ts`):
```bash
ls -la <path>
```
Verify path exists, determine if file or directory.

**If topic provided** (e.g., "authentication flow"):
```bash
grep -r "<keywords>" --include="*.ts" -l | head -20
```
Identify relevant files.

**If no argument:**
> What would you like to document?
> - A directory: `src/auth/`
> - A file: `lib/utils.ts`
> - A topic: "authentication flow"

## Phase 1: Explore

Launch `docs-manager:codebase-explorer` agent:
- **Description**: "Explore target for documentation"
- **Prompt**: "Explore <target> and extract documentation-relevant information. Focus on: purpose, key abstractions, public interfaces, dependencies, and usage context. This is for a focused document, not full repository onboarding."

**Capture**: Findings about the target.

## Phase 2: Propose

Determine output location:

| Target Type | Output Location |
|-------------|-----------------|
| Directory/Module | `<path>/AGENTS.md` + `<path>/CLAUDE.md` |
| File | `docs/<filename>.md` |
| Topic/Feature | `docs/<topic-name>.md` |

Present plan:

```markdown
## Documentation Plan

**Target:** <path or topic>
**Output:** <output location>

### Content Overview
- Purpose: <what this documents>
- Key sections: <list>

### Scope Tracking
Files to monitor:
- <path1>
- <path2>

**Options:**
1. **Proceed** - Generate documentation
2. **Adjust** - Change scope or location
3. **Cancel**
```

**If --auto flag**: Skip confirmation.

## Phase 3: Generate

Get timestamp:
```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

Launch `docs-manager:doc-generator` agent:
- **Description**: "Generate focused documentation"
- **Prompt**: "Generate documentation for <target> based on these findings: <findings>. Output to <location>. Include proper front-matter with scope paths: <scope_paths>. If creating module documentation, also create CLAUDE.md with content `@AGENTS.md`."

**Capture**: Created file(s).

## Phase 4: Update References

If creating docs/*.md file, check if AGENTS.md should reference it:

```bash
head -50 AGENTS.md
```

If AGENTS.md has Documentation section, offer to add:
```markdown
@docs/<new-file>.md

- [<Title>](docs/<new-file>.md) - <description>
```

## Phase 5: Validate

```bash
cat <output-path> | head -40
```

Check:
- [ ] Front-matter is valid YAML
- [ ] Scope paths match existing files
- [ ] Content matches target scope

## Summary

```markdown
## Documentation Created

**File:** <output-path>
**Scope:** <what it covers>

### Staleness Tracking
Monitored paths:
- <path1>
- <path2>

### Next Steps
1. Review generated content
2. Run `/docs-manager:validate-docs`
3. Commit the documentation
```

## Edge Cases

| Issue | Action |
|-------|--------|
| Path doesn't exist | Ask user to verify |
| Already documented | Offer to update or create separate |
| Too broad scope | Suggest splitting |
| No clear structure | Ask for guidance |
