---
description: Check and update stale documentation based on git changes
argument-hint: "[doc-path] [--auto]"
---

# Update Documentation

Check documentation staleness and apply updates using specialized agents.

## Pre-flight

Verify tracked documentation exists by checking for any markdown file with `last_updated` frontmatter:

```bash
find . -name "*.md" -type f \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*" \
  ! -path "*/vendor/*" \
  ! -path "*/.claude/*" \
  2>/dev/null | head -50 | xargs -I {} sh -c 'head -20 "{}" 2>/dev/null | grep -q "last_updated" && echo "{}"' | head -1
```

**If no tracked documentation found:**
> No tracked documentation found. Run `/docs-manager:onboard` or `/docs-manager:add-doc` first.

## Phase 1: Inventory

Find all tracked documentation files. A document is tracked if it has YAML frontmatter with `last_updated` field.

```bash
# Find all markdown files (excluding node_modules, .git, vendor)
find . -name "*.md" -type f \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*" \
  ! -path "*/vendor/*" \
  ! -path "*/.claude/*" \
  2>/dev/null
```

For each markdown file found, check if it has valid frontmatter:
1. Read first 20 lines
2. Check for YAML frontmatter (starts with `---`, ends with `---`)
3. Check for `last_updated` field (required for tracking)
4. Optionally extract `scope.paths` for staleness detection

**Include document if:**
- Has valid YAML frontmatter AND
- Has `last_updated` field

For each tracked document, extract:
- `scope.paths` - Files to check for changes (if present)
- `last_updated` - When last reviewed

If specific document requested via argument, only process that one.

## Phase 2: Staleness Check

For each document with scope paths:

```bash
git log --since="<last_updated>" --name-only --pretty=format: -- <scope_paths> | sort -u | grep -v '^$'
```

Categorize as **Current** (no changes) or **Stale** (changes detected).

Present summary:

```markdown
## Documentation Status

| Document | Last Updated | Status | Changes |
|----------|--------------|--------|---------|
| AGENTS.md | <date> | Current/Stale | <count> |
| docs/architecture.md | <date> | Current/Stale | <count> |

**Stale documents:** <N>
```

**If all current:**
> All documentation is up to date.

Stop here.

## Phase 3: Analyze

For each stale document, launch `docs-manager:doc-analyzer` agent:
- **Description**: "Analyze doc staleness"
- **Prompt**: "Analyze whether <document_path> needs updating. Front-matter: <front-matter>. Check git changes since <last_updated> in scope paths: <scope_paths>. Categorize changes and determine if documentation update is needed."

**Capture**: Analysis with verdict (NEEDS_UPDATE or CURRENT) and recommended changes.

## Phase 4: Review

Compile analysis results:

```markdown
## Update Recommendations

### <document_path>
**Verdict:** <NEEDS_UPDATE / CURRENT>
**Reason:** <explanation>

<If NEEDS_UPDATE:>
**Sections to update:**
- <section>: <what to change>

**Priority:** <HIGH / MEDIUM / LOW>

---
```

**If --auto flag**: Skip confirmation, proceed with updates.

Otherwise:
> Proceed with recommended updates?

## Phase 5: Apply Updates

For each document needing updates:

1. Read current document
2. Apply recommended changes
3. Update `last_updated` timestamp:
   ```bash
   date -u +"%Y-%m-%dT%H:%M:%SZ"
   ```
4. Write updated document

**Guidelines:**
- Minimal changes - only what was recommended
- Preserve structure
- Maintain abstraction level
- Don't expand scope

## Summary

```markdown
## Update Complete

### Documents Updated
| Document | Changes Made |
|----------|--------------|
| <path> | <summary> |

### Documents Unchanged
| Document | Reason |
|----------|--------|
| <path> | No changes in scope |
| <path> | Changes not significant |

**Review date:** <timestamp>
```

## Edge Cases

| Issue | Action |
|-------|--------|
| Missing front-matter | Offer to add it |
| Invalid timestamp | Treat as fully stale |
| Scope paths match nothing | Suggest fixing scope |
| Frequent updates needed | Suggest narrowing scope |
