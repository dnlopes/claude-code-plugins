---
description: Check and update stale Claude documentation based on git changes
argument-hint: "[doc-path]"
---

# Update Documentation

You are updating Claude documentation by checking for changes since each document was last updated.

## Arguments

- **No argument**: Check and update all docs
- **Specific path**: Only check/update that document (e.g., `docs/claude/architecture.md`)

## Pre-flight Check

Verify documentation exists:

```bash
ls CLAUDE.md docs/claude/*.md 2>/dev/null
```

If no documentation found:
> No Claude documentation found. Run `/docs-manager:onboard` first to create initial documentation.

## Phase 1: Inventory Documents

Find all Claude documentation files:

```bash
# List all doc files
find docs/claude -name "*.md" -type f 2>/dev/null
ls CLAUDE.md README.md 2>/dev/null
```

For each document, extract front-matter:
- `scope.paths` - Which files to check for changes
- `last_commit` - When doc was last updated

If a specific document was requested via argument, only process that one.

**Special handling:**
- README.md should be included in inventory if it exists and has front-matter
- If README.md exists but has no front-matter, ask user if they want to add it for tracking

## Phase 2: Format Validation

Check CLAUDE.md for outdated format (markdown links instead of `@` imports):

```bash
# Check for old-style markdown links to docs/claude/
grep -E '\[.*\]\(docs/claude/.*\.md\)' CLAUDE.md
```

If old-style links are found:

```markdown
## Format Migration Needed

CLAUDE.md uses markdown links instead of `@` imports:
- `[Architecture](docs/claude/architecture.md)` → `@docs/claude/architecture.md`

**Why this matters:** Claude Code automatically loads CLAUDE.md at session start. Using `@` imports ensures all documentation is loaded automatically, without requiring manual file reads.

Would you like to migrate to `@` imports? (Recommended)
```

If user confirms, note for update in Phase 6. The conversion is:
- Remove markdown link syntax: `[Title](docs/claude/X.md)` → `@docs/claude/X.md`
- Remove any trailing description text on the same line
- Keep one import per line

## Phase 3: Staleness Check

For each document, check if changes exist in its scope:

```bash
# Get changes since last_commit in scope paths
git diff --stat <last_commit>..HEAD -- <scope_paths>
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
Last commit: <commit from front-matter>

Determine:
1. What changed in the scope paths
2. Whether changes are significant enough for README updates
3. Which sections need updating and why
4. Specific recommendations for updates
5. Whether to preserve or enhance existing content
```

**For other documents (CLAUDE.md, docs/claude/*)**, use **doc-analyzer** agent:
```
Analyze this document for needed updates:

Document: <path>
Content: <current content>
Scope paths: <paths from front-matter>
Last commit: <commit from front-matter>

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
2. **Apply recommended changes** based on agent analysis
3. **Update front-matter**:
   - `last_commit`: Current HEAD commit
   - `last_updated`: Current timestamp

```bash
# Get current commit and timestamp
git rev-parse HEAD
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

### Update Guidelines

When modifying documents:

1. **Preserve structure** - Keep the same sections and format
2. **Minimal changes** - Only update what the analysis identified
3. **Maintain abstraction level** - Don't add detail that wasn't there before
4. **Update examples** - If a referenced example changed location, update the reference
5. **Don't expand scope** - If changes suggest the doc is covering too much, note it for user review

### CLAUDE.md Special Handling

CLAUDE.md doesn't have scope paths. To check if it needs updates:
- Check if any docs/claude/ files were updated
- Check if build/test commands changed
- Principles rarely need updating (they're invariants)

Only update CLAUDE.md if:
- **Format migration confirmed in Phase 2** - Convert markdown links to `@` imports
- Quick start commands changed
- New major component was added (update directory listing)
- A principle was violated and needs rewording

### README.md Special Handling

When updating README.md:
- **Preserve existing tone and style** - Match the voice of the current README
- **Preserve custom sections** - Don't remove user-added content
- **Enhance, don't replace** - Update outdated info, don't rewrite from scratch
- **Verify examples work** - Test commands and code examples
- **Be user-focused** - README is for end users and contributors, not internal context

## Phase 7: Validation

After updates:

```bash
# Verify front-matter is valid
head -20 docs/claude/*.md
head -20 README.md

# Verify commit hashes are current
git rev-parse HEAD
```

Check that:
- All updated docs (including README.md) have current commit hash in front-matter
- All updated docs have current timestamp
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

### Commit Info
All documents now reflect: `<current_commit>` (<date>)

### Next Run
Run `/docs-manager:update-docs` again after making more changes to the codebase.
```

## Edge Cases

### Document Missing Front-matter

If a document lacks proper front-matter:
> Document `<path>` is missing front-matter. Would you like me to:
> 1. Add front-matter based on content analysis
> 2. Skip this document

### Invalid Last Commit

If `last_commit` doesn't exist in history:
> Document `<path>` references commit `<hash>` which doesn't exist. Treating as fully stale.

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
