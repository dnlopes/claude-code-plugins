---
description: Check and update stale Claude documentation based on git changes
argument-hint: "[doc-path]"
---

# Update Documentation

You are updating Claude documentation by checking for changes since each document was last updated.

## Arguments

- **No argument**: Check and update all docs
- **Specific path**: Only check/update that document (e.g., `docs/architecture.md`)

## Pre-flight Check

Verify documentation exists:

```bash
ls CLAUDE.md docs/*.md 2>/dev/null
```

If no documentation found:
> No Claude documentation found. Run `/docs-manager:onboard` first to create initial documentation.

## Phase 1: Inventory Documents

Find all Claude documentation files:

```bash
# List all doc files (new location)
find docs -name "*.md" -type f 2>/dev/null | grep -v docs/claude
# Check for legacy location
find docs/claude -name "*.md" -type f 2>/dev/null
ls CLAUDE.md README.md 2>/dev/null
```

### Legacy Path Migration

If documentation exists at `docs/claude/` instead of `docs/`:

> **Legacy path detected:** Documentation exists at `docs/claude/` instead of the new `docs/` location.
>
> Would you like to migrate the documentation to the new path?
> - Files will be moved from `docs/claude/` to `docs/`
> - CLAUDE.md `@` imports will be updated
> - Front-matter paths will remain unchanged (they're relative to repo root)

If user confirms migration:

```bash
# Create new structure
mkdir -p docs/modules

# Move files
mv docs/claude/*.md docs/ 2>/dev/null

# Move modules if they exist
if [ -d "docs/claude/modules" ]; then
  mv docs/claude/modules/* docs/modules/ 2>/dev/null
  rmdir docs/claude/modules 2>/dev/null
fi

# Remove empty legacy directory
rmdir docs/claude 2>/dev/null
```

Then update CLAUDE.md to change `@docs/claude/` imports to `@docs/`:
- `@docs/claude/architecture.md` → `@docs/architecture.md`
- `@docs/claude/domain.md` → `@docs/domain.md`
- `@docs/claude/patterns.md` → `@docs/patterns.md`
- `@docs/claude/development.md` → `@docs/development.md`

For each document, extract front-matter (supporting both standard and HTML comment formats):

**Standard format** (docs/):
```yaml
---
scope:
  paths: [...]
last_review_date: 2025-01-15T10:30:00Z
---
```

**HTML comment format** (README.md):
```markdown
<!--
---
scope:
  paths: [...]
last_review_date: 2025-01-15T10:30:00Z
---
-->
```

Extract:
- `scope.paths` - Which files to check for changes
- `last_review_date` - When doc was last reviewed
- `format` - Whether it's standard YAML or HTML comment format

If a specific document was requested via argument, only process that one.

**Special handling for README.md:**

1. **README.md with HTML comment front-matter**: Include in inventory for staleness checking
2. **README.md with standard YAML front-matter**: Migrate to HTML comment format (Phase 2)
3. **README.md without front-matter**: Ask user if they want to add front-matter for tracking
4. **README.md missing**: This is fine - not all repositories need a docs-manager-tracked README. Only the docs in `docs/` are required.

## Phase 2: Format Validation and Migration

### Check CLAUDE.md Format

Check CLAUDE.md for outdated format (markdown links instead of `@` imports, or legacy paths):

```bash
# Check for old-style markdown links to docs/
grep -E '\[.*\]\(docs/.*\.md\)' CLAUDE.md
# Check for legacy paths
grep -E '@docs/claude/' CLAUDE.md
```

If old-style links are found:

```markdown
## Format Migration Needed

CLAUDE.md uses markdown links instead of `@` imports:
- `[Architecture](docs/architecture.md)` → `@docs/architecture.md`

**Why this matters:** Claude Code automatically loads CLAUDE.md at session start. Using `@` imports ensures all documentation is loaded automatically, without requiring manual file reads.

Would you like to migrate to `@` imports? (Recommended)
```

If legacy paths are found:

```markdown
## Path Migration Needed

CLAUDE.md uses the legacy `docs/claude/` path:
- `@docs/claude/architecture.md` → `@docs/architecture.md`

Would you like to update to the new path? (Recommended)
```

If user confirms, note for update in Phase 6. The conversion is:
- Remove markdown link syntax: `[Title](docs/X.md)` → `@docs/X.md`
- Update legacy paths: `@docs/claude/X.md` → `@docs/X.md`
- Remove any trailing description text on the same line
- Keep one import per line

### Check README.md Front-matter Format

If README.md exists with standard YAML front-matter (not wrapped in HTML comments):

```markdown
## README.md Front-matter Migration

README.md currently uses standard YAML front-matter, which is visible in GitHub rendering:

```yaml
---
scope:
  paths: [...]
last_review_date: 2025-12-03T00:28:11Z
---
```

This should be migrated to HTML comment format to hide it from rendered views:

```markdown
<!--
---
scope:
  paths: [...]
last_review_date: 2025-12-03T00:28:11Z
---
-->
```

Would you like to migrate README.md front-matter? (Recommended)
```

If user confirms, note for migration in Phase 6.

## Phase 3: Staleness Check

For each document, check if changes exist in its scope:

```bash
# Get changes since last_review_date in scope paths
git log --since="<last_review_date>" --name-only --pretty=format: -- <scope_paths> | sort -u
```

Categorize each document:
- **Current**: No changes in scope paths
- **Stale**: Changes detected in scope paths

Present summary:

```markdown
## Documentation Status

| Document | Last Updated | Status |
|----------|--------------|--------|
| README.md | <date> | Current/Stale |
| CLAUDE.md | <date> | Current/Stale |
| architecture.md | <date> | Current/Stale |
| domain.md | <date> | Current/Stale |
| patterns.md | <date> | Current/Stale |
| development.md | <date> | Current/Stale |

**Stale documents:** <N>
```

If all documents are current:
> All documentation is up to date. No changes detected in scope paths since last update.

Stop here if nothing is stale.

## Phase 4: Analyze Stale Documents

For each stale document, spawn the appropriate analyzer agent:

**For README.md**, use **readme-analyzer** agent:
```
Analyze this README for needed updates:

Document: README.md
Content: <current content>
Scope paths: <paths from front-matter>
Last review date: <date from front-matter>

Determine:
1. What changed in the scope paths
2. Whether changes are significant enough for README updates
3. Which sections need updating and why
4. Specific recommendations for updates
5. Whether to preserve or enhance existing content
6. Whether the README has development content that should move to docs/development.md
```

**For other documents (CLAUDE.md, docs/*)**, use **doc-analyzer** agent:
```
Analyze this document for needed updates:

Document: <path>
Content: <current content>
Scope paths: <paths from front-matter>
Last review date: <date from front-matter>

Determine:
1. What changed in the scope paths
2. Whether changes are significant enough for doc updates
3. Which sections need updating and why
4. Specific recommendations for updates
```

Run agents in parallel for efficiency.

## Phase 5: Review Recommendations

Compile agent findings and present:

```markdown
## Update Recommendations

### <document_path>
**Changes detected:** <summary>
**Needs update:** Yes/No

<If Yes:>
**Sections to update:**
- <section>: <what needs to change>
- <section>: <what needs to change>

**New content to add:**
- <description>

---

### <next document>
...
```

For documents where agents recommend "No update needed":
> Changes in scope paths are implementation details that don't affect documentation.

Ask user:
> Would you like to proceed with the recommended updates?

## Phase 6: Apply Updates

For each document that needs updates:

1. **Read current content**
2. **Apply any format migrations first** (if user confirmed in Phase 2):
   - If CLAUDE.md: Convert markdown links to `@` imports, update legacy paths
   - If README.md with standard front-matter: Migrate to HTML comment format
3. **Apply recommended changes** based on agent analysis
4. **Update front-matter** (preserving format):
   - `last_review_date`: Current timestamp
   - `last_updated`: Current timestamp
   - Keep HTML comment format if document is README.md
   - Keep standard format if document is in docs/

```bash
# Get current timestamp
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

### Front-matter Format Migration

When migrating README.md from standard to HTML comment format:

**Before:**
```yaml
---
scope:
  paths:
    - README.md
  summary: "..."
last_review_date: 2025-12-03T00:28:11Z
last_updated: 2025-12-03T00:28:11Z
---

# Project Name
```

**After:**
```markdown
<!--
---
scope:
  paths:
    - README.md
  summary: "..."
last_review_date: 2025-12-03T00:28:11Z
last_updated: 2025-12-03T00:28:11Z
---
-->

# Project Name
```

Steps:
1. Read the entire front-matter block (from first `---` to second `---` including both delimiters)
2. Wrap it in HTML comment tags (`<!--` before, `-->` after)
3. Ensure there's a blank line after the closing `-->`

### Update Guidelines

When modifying documents:

1. **Preserve structure** - Keep the same sections and format
2. **Minimal changes** - Only update what the analysis identified
3. **Maintain abstraction level** - Don't add detail that wasn't there before
4. **Update examples** - If a referenced example changed location, update the reference
5. **Don't expand scope** - If changes suggest the doc is covering too much, note it for user review

### CLAUDE.md Special Handling

CLAUDE.md doesn't have scope paths. To check if it needs updates:
- Check if any docs/ files were updated
- Check if build/test commands changed
- Principles rarely need updating (they're invariants)

Only update CLAUDE.md if:
- **Format migration confirmed in Phase 2** - Convert markdown links to `@` imports or update legacy paths
- Quick start commands changed
- New major component was added (update directory listing)
- A principle was violated and needs rewording

### README.md Special Handling

When updating README.md:
- **Use HTML comment format for front-matter** - Ensures front-matter is hidden from GitHub rendering
- **Preserve existing tone and style** - Match the voice of the current README
- **Preserve custom sections** - Don't remove user-added content
- **Enhance, don't replace** - Update outdated info, don't rewrite from scratch
- **Verify examples work** - Test commands and code examples
- **Be user-focused** - README is for end users and contributors, not internal context
- **Development content should move to docs/development.md** - If README has detailed dev setup, suggest moving it

## Phase 7: Validation

After updates:

```bash
# Verify front-matter is valid
head -20 docs/*.md
head -25 README.md
```

Check that:
- All updated docs have current timestamp in front-matter
- Both last_review_date and last_updated are set to the same timestamp
- README.md uses HTML comment format for front-matter (wrapped in `<!-- -->`)
- docs/ files use standard YAML front-matter format
- CLAUDE.md uses `@docs/` imports (not `@docs/claude/`)
- No broken cross-references
- README examples are syntactically valid

## Phase 8: Summary

Present final summary:

```markdown
## Update Complete

### Documents Updated
| Document | Changes Made |
|----------|--------------|
| <path> | <brief summary> |
| <path> | <brief summary> |

### Documents Unchanged
| Document | Reason |
|----------|--------|
| <path> | No changes in scope |
| <path> | Changes not significant |

### Migrations Applied
[If any migrations were applied:]
- Moved docs from `docs/claude/` to `docs/`
- Updated CLAUDE.md imports to use `@docs/`
- Converted README.md front-matter to HTML comment format

### Review Date
All documents now reviewed as of: `<timestamp>`

### Next Run
Run `/docs-manager:update-docs` again after making more changes to the codebase.
```

## Edge Cases

### Document Missing Front-matter

If a document lacks proper front-matter:
> Document `<path>` is missing front-matter. Would you like me to:
> 1. Add front-matter based on content analysis
> 2. Skip this document

### Invalid Last Review Date

If `last_review_date` is invalid or malformed:
> Document `<path>` has invalid last_review_date. Treating as fully stale.

### Scope Paths Match No Files

If scope paths don't match any files:
> Document `<path>` has scope paths that match no files. This may indicate:
> - Files were deleted
> - Scope paths need updating
> Would you like to analyze and fix the scope paths?

### Too Many Changes

If a document has extensive changes in scope:
> Document `<path>` has significant changes (<N> files, <M> lines).
> Consider whether this document's scope is too broad.
> Would you like to proceed with analysis or narrow the scope first?

## Important Guidelines

1. **Conservative updates** - Only update what clearly needs updating. When in doubt, skip.

2. **Preserve abstraction level** - If the doc was high-level, keep it high-level.

3. **Don't expand scope** - Updates should refresh existing content, not add new detail.

4. **Watch for scope creep** - If docs need frequent updates, they might be too detailed.

5. **Parallel analysis** - Spawn doc-analyzer agents in parallel for efficiency.

6. **User confirmation** - Always show recommendations before applying updates.

7. **README is public-facing** - Development details belong in docs/development.md.
