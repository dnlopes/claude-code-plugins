---
name: remove-doc
description: Remove obsolete documentation and clean up references
argument-hint: "<doc-path>"
---

# Remove Documentation

Safely remove obsolete documentation while maintaining system integrity.

## Workflow Checklist

```
- [ ] Identify: Verify document exists
- [ ] Analyze: Check for references to this doc
- [ ] Confirm: Present removal plan
- [ ] Remove: Delete file(s)
- [ ] Clean: Update references
- [ ] Validate: Verify system integrity
```

## Identify

Parse argument and verify document exists:

```bash
ls <doc-path>
```

**If path is a module directory** (contains AGENTS.md + CLAUDE.md):
- Will remove both files
- Will NOT remove the directory itself

**If path is a docs/*.md file:**
- Will remove single file
- Will update AGENTS.md references

**If path doesn't exist:**
> Document not found: <path>

## Analyze

Check what references this document:

```bash
# Find references in AGENTS.md
grep -l "<doc-name>" AGENTS.md */AGENTS.md 2>/dev/null

# Find @references
grep -r "@<doc-path>" --include="*.md"

# Find markdown links
grep -r "\[.*\](<doc-path>)" --include="*.md"
```

List all files that reference the target.

## Confirm

Present removal plan:

```markdown
## Removal Plan

**Target:** <doc-path>

### Files to Delete
- <file1>
- <file2> (if module)

### References to Update
| File | Reference | Action |
|------|-----------|--------|
| AGENTS.md | @docs/target.md | Remove line |
| AGENTS.md | [Link](docs/target.md) | Remove line |
| README.md | See docs/target.md | Remove mention |

### Impact
- <description of what will change>

Proceed with removal?
```

**If --auto flag:** Skip confirmation, proceed directly.

Wait for user confirmation.

## Remove

Delete the target file(s):

```bash
rm <doc-path>

# If module documentation
rm <module>/AGENTS.md <module>/CLAUDE.md
```

## Clean

Update all files that referenced the removed document:

### AGENTS.md Updates

Remove both @ reference and markdown link:

```markdown
# Before
@docs/removed.md

- [Removed](docs/removed.md) - Description

# After
(lines removed)
```

### Other References

For each file with references:
- Remove or update the reference
- Note the change for summary

## Validate

Run validation to ensure system integrity:

```bash
# Check AGENTS.md still valid
head -50 AGENTS.md

# Verify no broken references remain
grep -r "@<removed-doc>" --include="*.md"
```

## Summary

```markdown
## Removal Complete

### Deleted
- <file1>
- <file2>

### Updated References
| File | Change |
|------|--------|
| AGENTS.md | Removed @reference and link |
| README.md | Removed mention |

### Next Steps
1. Commit the changes
2. Review related documentation for accuracy
```

## Edge Cases

| Scenario | Action |
|----------|--------|
| Doc is AGENTS.md root | Refuse - use /onboard to regenerate |
| Doc is CLAUDE.md | Refuse - remove parent AGENTS.md instead |
| Doc has no references | Just delete, no cleanup needed |
| Multiple docs reference target | Update all, list in summary |

## Guidelines

- **Confirm before delete** - Unless --auto flag
- **Clean all references** - Don't leave broken links
- **Preserve unrelated content** - Only remove specific references
- **Run validation after** - Ensure system integrity
