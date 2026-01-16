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

**Include document if:**
- Has valid YAML frontmatter AND
- Has `last_updated` field

**Special cases:**
- CLAUDE.md files: Validate content is `@AGENTS.md` (no frontmatter required)
- README.md: Frontmatter may be wrapped in HTML comments

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

Find tracked documents not referenced from any AGENTS.md:

For each tracked document (has frontmatter with `last_updated`):
1. Skip if it IS an AGENTS.md file
2. Check if referenced from nearest AGENTS.md (via `@path` or markdown link)

```bash
# For each tracked doc, check if referenced
grep -l "<doc-path>" */AGENTS.md AGENTS.md 2>/dev/null
```

**Note:** Orphaned docs are warnings, not errors. Ad-hoc documents may intentionally exist without AGENTS.md references.

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
