---
name: update-docs
description: Check and update stale documentation based on git changes
argument-hint: "[doc-path]"
---

# Update Documentation

Check and update stale documentation.

## Pre-flight

Verify documentation exists:

```bash
ls AGENTS.md docs/*.md 2>/dev/null
```

**If no documentation:**
> No documentation found. Run `/docs-manager:onboard` first.

## Inventory

Find all documentation files:

```bash
find . -name "AGENTS.md" -type f
find docs -name "*.md" -type f
ls README.md 2>/dev/null
```

For each document, extract front-matter:
- `scope.paths` - Files to check for changes
- `last_review_date` - When last reviewed

If specific document requested via argument, only process that one.

**Special cases:**
- AGENTS.md without scope: Check if any docs/ files were updated
- README.md without front-matter: Ask if user wants to add tracking

## Staleness

For each document with scope paths:

```bash
git log --since="<last_review_date>" --name-only --pretty=format: -- <scope_paths> | sort -u
```

Categorize:
- **Current**: No changes in scope
- **Stale**: Changes detected

Present summary:

```markdown
## Documentation Status

| Document | Last Updated | Status |
|----------|--------------|--------|
| AGENTS.md | <date> | Current/Stale |
| docs/architecture.md | <date> | Current/Stale |
| ... | ... | ... |

**Stale documents:** <N>
```

**If all current:**
> All documentation is up to date.

Stop here.

## Analyze

**IMPORTANT:** Load skill `documentation-standards` for templates and proper abstraction levels.

For each stale document, use the Task tool with subagent_type='doc-analyzer' to analyze the document:

```
Analyze this document for needed updates:

Document: <path>
Content: <current content>
Scope paths: <paths>
Last review date: <date>
Document type: <technical (architecture, domain, patterns) or user-facing (README, development)>

Determine:
1. What changed in scope paths
2. Whether changes warrant updates
3. Which sections need updating
4. Specific recommendations
```

Run agents in parallel for efficiency.

## Review

Compile findings:

```markdown
## Update Recommendations

### <document_path>
**Changes:** <summary>
**Needs update:** Yes/No

<If Yes:>
**Sections to update:**
- <section>: <what needs to change>

---
```

For "No update needed":
> Changes are implementation details that don't affect documentation.

Ask user:
> Proceed with recommended updates?

## Update

For each document needing updates:

1. Read current content
2. Apply recommended changes
3. Update front-matter timestamps:
   ```yaml
   last_review_date: <current timestamp>
   last_updated: <current timestamp>
   ```

```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

**Guidelines:**
- Preserve structure
- Minimal changes
- Maintain abstraction level
- Update examples if locations changed
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

- **Missing front-matter**: Offer to add it
- **Invalid timestamp**: Treat as fully stale
- **Scope paths match nothing**: Suggest fixing scope paths
- **Too many changes**: Suggest narrowing scope if doc needs frequent updates

## Guidelines

1. **Conservative updates** - Only update what clearly needs it
2. **Preserve abstraction** - Don't add detail
3. **Don't expand scope** - Refresh existing, don't add new
4. **Watch for scope creep** - Frequent updates = too detailed
5. **User confirmation** - Show recommendations before applying
