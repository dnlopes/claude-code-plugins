---
name: updating-documentation
description: Use when refreshing tracked documentation based on code changes — finds stale docs via git history against scope.paths, analyzes each with doc-analyzer, and applies recommended updates while preserving structure and abstraction level. Supports targeting a single doc and --auto to skip confirmation.
---

# Updating Documentation

Refresh tracked documentation that has fallen behind the code: inventory → staleness check → analyze → review → apply.

## Critical Guidelines

- **You MUST load the `docs-manager:documenting-repositories` skill first** for abstraction-level rules and frontmatter spec.
- **You MUST follow the steps in order** — pre-flight, inventory, staleness check, analyze, review, apply, summarize.
- **You MUST create TodoWrite todos for each step in the Workflow section** — one todo per Step, marked `in_progress` on entry and `completed` on exit. Multi-step workflows silently skip steps without explicit tracking.
- **You MUST get user confirmation before applying updates** unless the user invocation includes `--auto`.
- **You MUST apply only the changes recommended by `doc-analyzer`** — do not refactor unrelated sections.
- **You MUST update the `last_updated` timestamp** on every document you modify, using a single `date -u` value for the whole batch.
- **You MUST stay at the abstraction level** — if a recommendation drifts toward implementation detail, reject it.

## When to Use

- **Use this skill** when documentation may have fallen behind code changes.
- **Use `onboarding-repository`** instead when no documentation exists yet.
- **Use `adding-documentation`** when adding a new focused doc.
- **Use `validating-documentation`** to check format/integrity issues unrelated to code drift.

## Invocation

User invokes via `/docs-manager:updating-documentation [doc-path] [--auto]`.

- `[doc-path]` (optional) — limit the run to a single document
- `--auto` — skip the confirmation step (Step 4)

## Workflow

### Step 0 — Pre-flight

Verify tracked documentation exists in the repository:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/find-tracked-docs.sh" | head -1
```

If no output, no tracked documents exist:

```markdown
No tracked documentation found. Run `/docs-manager:onboarding-repository`
or `/docs-manager:adding-documentation` first.
```

Stop here.

### Step 1 — Inventory

Build the list of documents to process.

**If the user provided `[doc-path]`:**
- Verify the document exists, has HTML-wrapped frontmatter starting with `<!--`, and has a `last_updated` field
- Process only this document

**Otherwise, list every tracked document:**

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/find-tracked-docs.sh"
```

For each document in the list, read the file and extract from its frontmatter:

- `scope.paths` — paths to check for changes (skipped if missing — see Edge Cases)
- `last_updated` — when last reviewed

### Step 2 — Staleness Check

For each tracked document with `scope.paths`, query git for changes since `last_updated`:

```bash
git log --since="<last_updated>" --name-only --pretty=format: -- <scope_paths> \
  | sort -u | grep -v '^$'
```

Categorize each document:

| Result | Category |
|--------|----------|
| No matching commits | **Current** |
| One or more matching commits | **Stale** |

Present an inventory summary to the user:

```markdown
## Documentation Status

| Document | Last Updated | Status | Changed files |
|----------|--------------|--------|---------------|
| AGENTS.md | <date> | Current / Stale | <count> |
| docs/architecture.md | <date> | Current / Stale | <count> |
| docs/patterns.md | <date> | Current / Stale | <count> |

**Stale documents:** <N>
```

**If all documents are Current:**

```markdown
All tracked documentation is up to date.
```

Stop here.

### Step 3 — Analyze

For each **stale** document, launch the `docs-manager:doc-analyzer` agent via the Task tool:

```
Description: Analyze doc staleness
Prompt: Analyze whether <document_path> needs updating.

Frontmatter:
<paste the document's frontmatter block>

Scope paths: <list>
Last updated: <ISO timestamp>

Check git changes since <last_updated> in the scope paths above. Categorize
the changes (structural / pattern / implementation / cosmetic) and decide if
the documentation needs updating. If yes, list the specific sections and the
exact fixes, with evidence cited by file path or commit hash only — NEVER line
numbers. Recommendations must not introduce line numbers, code snippets, or
function/parameter listings into the doc.

Be conservative: when in doubt, return CURRENT.
```

**Capture** each analysis result. Each result will be one of:

- `CURRENT` — no update needed
- `NEEDS_UPDATE` — with a list of section-level recommended changes and a priority

### Step 4 — Review

Compile and present the recommendations to the user:

```markdown
## Update Recommendations

### <document_path>
**Verdict:** <NEEDS_UPDATE | CURRENT>
**Priority:** <HIGH | MEDIUM | LOW>
**Reason:** <one or two sentences from the analyzer>

**Sections to update:**
- <section name>: <what to change> (source: `<file path>`)
- <section name>: <what to change> (source: `<commit hash>`)

---
### <next document_path>
...
```

**Skip this step if the user invoked with `--auto`.**

Otherwise ask:

```markdown
Proceed with the recommended updates?
1. **Apply all** — apply every recommendation above
2. **Apply selected** — choose which documents to update
3. **Cancel**
```

Handle the response. If the user cancels, stop and report.

### Step 5 — Apply Updates

Generate one shared timestamp for the whole batch:

```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

For each document the user approved (or all `NEEDS_UPDATE` docs if `--auto`):

1. Read the current document
2. Apply **only the recommended changes** — preserve structure, do not reorganize, do not add new sections, do not change abstraction level
3. Update the `last_updated` field in the HTML-wrapped frontmatter to the shared timestamp
4. Write the updated document

**Guidelines while applying:**

- **Minimal changes** — only what the analyzer recommended
- **Preserve structure** — keep section order, heading levels, formatting style
- **Maintain abstraction** — do NOT add implementation details, even if a recommendation drifts there
- **NEVER introduce forbidden content** — no line numbers, no illustrative code snippets, no function/parameter listings, no version numbers. If a recommendation would require any of these, reject it.
- **Replace existing forbidden content opportunistically** — if you encounter line numbers, snippets, or function listings in a section you are already editing, strip them. Do not refactor untouched sections.
- **Do NOT modify `scope.paths`** unless a recommendation explicitly says to

If a recommendation would require expanding scope, adding implementation detail, introducing forbidden content, or reorganizing — **reject it** and surface it in Step 6 as a follow-up rather than applying.

### Step 6 — Summarize

```markdown
## Update Complete

**Review date:** <shared timestamp>

### Documents Updated
| Document | Sections changed |
|----------|------------------|
| <path> | <list of sections> |

### Documents Unchanged
| Document | Reason |
|----------|--------|
| <path> | Verdict was CURRENT |
| <path> | User declined |

### Rejected Recommendations
<For any recommendation that drifted toward implementation detail / scope expansion:>
- <path> / <section>: <reason rejected>

### Next Steps
1. Review the changes (`git diff`)
2. Commit the updated documentation
```

## Edge Cases

| Scenario | Approach |
|----------|----------|
| Document has no `scope.paths` (root `AGENTS.md`) | Treat as "tracking the whole repo"; query `git log --since` without a path filter |
| Document has `last_updated` but it's not ISO 8601 | Treat the document as fully stale; flag for manual frontmatter fix in summary |
| `scope.paths` matches no existing files | Treat as **Current** for this run; flag for `/docs-manager:validating-documentation` |
| Recommendation drifts toward implementation detail | Reject during Step 5; surface in Step 6 — do NOT apply |
| Recommendation says to expand `scope.paths` | Apply only if user confirms via Step 4 review (call it out explicitly there) |
| Many docs are stale (>10) | Process anyway, but warn the user in Step 4 and offer "Apply selected" |
| Single-doc invocation with a `CURRENT` verdict | Report and stop — no changes made |
| `--auto` with `NEEDS_UPDATE` but no recommended changes | Should not happen; treat as analyzer bug and skip the doc with a warning |

## What NOT to Do

- Don't add new sections that weren't recommended
- Don't refactor or reorganize the document
- Don't apply implementation-detail recommendations — reject and surface
- Don't apply recommendations that require line numbers, code snippets, or function/parameter listings — reject and surface
- Don't modify `scope.paths` without an explicit recommendation
- Don't update `last_updated` on a document you didn't change
- Don't process `CURRENT` documents — they're up to date by definition
