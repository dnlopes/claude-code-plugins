---
description: Validate documentation system integrity - check front-matter, scope paths, cross-references
argument-hint: "[--fix]"
---

# Validate Documentation

Check documentation system integrity and optionally fix issues.

## Workflow Checklist

```
- [ ] Inventory: Find all documentation files
- [ ] Front-matter: Validate YAML structure
- [ ] Scope paths: Verify paths exist
- [ ] Cross-references: Check links work
- [ ] Orphans: Find unreferenced docs
- [ ] Report: Present findings
- [ ] Fix (optional): Apply automatic fixes
```

## Inventory

Find all documentation files:

```bash
find . -name "AGENTS.md" -type f
find . -name "CLAUDE.md" -type f
find docs -name "*.md" -type f 2>/dev/null
ls README.md 2>/dev/null
```

## Validation Checks

### 1. Front-matter Validation

For each doc file, check:

| Check | Valid | Invalid |
|-------|-------|---------|
| YAML syntax | Parses without error | Syntax errors |
| Required fields | Has `last_updated` | Missing timestamp |
| Timestamp format | ISO 8601 (`2025-01-15T10:30:00Z`) | Other formats |
| Scope paths (if present) | Array of strings | Wrong type |

**README.md special case:** Front-matter must be in HTML comment wrapper:
```markdown
<!--
---
scope:
  paths: [...]
last_updated: ...
---
-->
```

### 2. Scope Path Validation

For each scope path in front-matter:

```bash
# Check if path/pattern matches any files
ls <path> 2>/dev/null || find . -path "<glob_pattern>" -type f | head -1
```

| Result | Status |
|--------|--------|
| Matches files | Valid |
| No matches | Warning - scope may be stale |

### 3. Cross-Reference Validation

Check all references in AGENTS.md:

```bash
# Extract @references and markdown links
grep -E '@docs/|@AGENTS\.md|\[.*\]\(docs/' AGENTS.md
```

For each reference, verify target exists.

### 4. CLAUDE.md Validation

Each CLAUDE.md should contain only `@AGENTS.md` pointing to a sibling AGENTS.md:

```bash
cat <path>/CLAUDE.md
ls <path>/AGENTS.md
```

### 5. Orphan Detection

Find docs not referenced from AGENTS.md:

```bash
# List all docs
find docs -name "*.md" -type f

# Check each against AGENTS.md references
grep -l "<doc-name>" AGENTS.md
```

## Report

```markdown
## Validation Report

### Summary
| Check | Passed | Failed | Warnings |
|-------|--------|--------|----------|
| Front-matter | <n> | <n> | <n> |
| Scope paths | <n> | <n> | <n> |
| Cross-references | <n> | <n> | <n> |
| CLAUDE.md | <n> | <n> | <n> |
| Orphans | <n> | <n> | <n> |

### Issues Found

#### Critical (must fix)
- <file>: <issue>

#### Warnings (should review)
- <file>: <issue>

### Auto-fixable
- <file>: <what can be fixed>
```

## Fix Mode

If `--fix` argument provided or user confirms:

| Issue | Auto-fix |
|-------|----------|
| Missing `last_updated` | Add current timestamp |
| Invalid timestamp format | Convert to ISO 8601 |
| CLAUDE.md wrong content | Replace with `@AGENTS.md` |
| Orphaned doc | Offer to add reference to AGENTS.md |

**NOT auto-fixable:**
- Invalid YAML syntax (requires manual edit)
- Scope paths matching nothing (requires understanding intent)
- Missing AGENTS.md (use /onboard)

## Summary

```markdown
## Validation Complete

**Status:** All passed / <n> issues found

### Fixed
- <file>: <what was fixed>

### Remaining Issues
- <file>: <issue requiring manual fix>

### Next Steps
1. Fix remaining issues manually
2. Run `/validate-docs` again to confirm
```

## Guidelines

- **Non-destructive by default** - Report only unless --fix
- **Conservative fixes** - Only fix obvious issues
- **Preserve content** - Never delete user content
