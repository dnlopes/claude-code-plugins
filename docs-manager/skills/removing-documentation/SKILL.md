---
name: removing-documentation
description: Use when removing an obsolete documentation file (ad-hoc doc or module AGENTS.md/CLAUDE.md pair) — finds all references, presents a removal plan, deletes the file(s), and cleans up references from root and module AGENTS.md. Requires confirmation; --auto skips it.
---

# Removing Documentation

Safely delete obsolete documentation and clean up every reference to it.

## Critical Guidelines

- **You MUST get user confirmation before deleting** unless the user invocation includes `--auto`. File deletion is irreversible from a Claude session.
- **You MUST create TodoWrite todos for each step in the Workflow section** — one todo per Step, marked `in_progress` on entry and `completed` on exit. Multi-step workflows silently skip steps without explicit tracking.
- **You MUST find and present all references** before deletion — incomplete cleanup creates broken cross-references that `validating-documentation` will flag.
- **You MUST refuse to remove core documentation** — root `AGENTS.md`, root `CLAUDE.md`, root `README.md` are not removed by this skill. Use `onboarding-repository` to regenerate instead.
- **You MUST treat module docs as a pair** — removing a module `AGENTS.md` always also removes the sibling `CLAUDE.md`.
- **You MUST clean references in all referring files** — the new `AGENTS.md` must not contain dangling `@` imports or markdown links to the removed doc.
- **You MUST preserve unrelated content** — when editing a referrer to remove a reference, change ONLY the reference lines.

## When to Use

- **Use this skill** to remove an ad-hoc doc (`docs/<name>.md`) or a module `AGENTS.md` + `CLAUDE.md` pair that is no longer relevant.
- **Do NOT use this skill** to remove root-level standard docs — those should be regenerated via `onboarding-repository`.

## Invocation

User invokes via `/docs-manager:removing-documentation <doc-path> [--auto]`.

- `<doc-path>` (required) — the document to remove. For module docs, pass either the `AGENTS.md` path or the module directory.
- `--auto` — skip the confirmation step (Step 2)

## Workflow

### Step 0 — Identify

Resolve the target:

```bash
ls <doc-path> 2>/dev/null
```

Classify into one of:

| Input | Classification | Files that will be removed |
|-------|----------------|----------------------------|
| `docs/<name>.md` | **Ad-hoc doc** | The single file |
| Module directory containing `AGENTS.md` + `CLAUDE.md` | **Module docs** | Both `AGENTS.md` and `CLAUDE.md` (NOT the directory) |
| Module's `AGENTS.md` path directly | **Module docs** | Both `AGENTS.md` and sibling `CLAUDE.md` |
| Root `AGENTS.md` / `CLAUDE.md` / `README.md` | **REFUSE** | None — surface refusal message |
| Path doesn't exist | **REFUSE** | None — report not found |

If the target is refused, stop and report:

```markdown
Cannot remove `<doc-path>`.

<For root docs:>
Root documentation is regenerated via `/docs-manager:onboarding-repository`,
not removed.

<For missing path:>
Document not found. Verify the path and try again.
```

### Step 1 — Analyze References

Find everything that references the target:

```bash
# @-imports
grep -rn "@<doc-path>" --include="*.md" . 2>/dev/null

# Markdown links
grep -rEn "\[[^]]+\]\(<doc-path>\)" --include="*.md" . 2>/dev/null

# Plain-text mentions (informational only)
grep -rn "<doc-name>" --include="*.md" . 2>/dev/null | grep -v -E "(@<doc-path>|\(<doc-path>\))"
```

Collect the results into three categories:

| Category | Action plan |
|----------|-------------|
| **Structured references** (`@` import or markdown link) | Will be removed during cleanup |
| **Plain-text mentions** | Will be listed but NOT auto-edited — user reviews after |
| **Self-references** (target file referring to itself) | Ignored — file will be deleted |

### Step 2 — Confirm

Present the removal plan:

```markdown
## Removal Plan

**Target:** `<doc-path>`
**Type:** <ad-hoc doc | module docs>

### Files to Delete
- `<file1>`
- `<file2>` <only for module docs>

### Structured References to Remove
| File | Reference | Action |
|------|-----------|--------|
| `AGENTS.md` | `@docs/target.md` | Remove line |
| `AGENTS.md` | `[Target](docs/target.md)` | Remove line |
| `<module>/AGENTS.md` | `@<relative>/target.md` | Remove line |

### Plain-Text Mentions (review after — NOT auto-edited)
- `<file>:<line>` — <surrounding context>

### Impact
<One-paragraph summary of what changes for users of the docs>

---

Proceed with removal?
```

**Skip this step if the user invoked with `--auto`.**

Otherwise wait for confirmation. If declined, stop and report.

### Step 3 — Remove Files

Delete the target file(s):

```bash
rm <doc-path>

# For module docs, also remove the sibling CLAUDE.md
rm <module>/CLAUDE.md
```

### Step 4 — Clean References

For each structured reference identified in Step 1, edit the referring file:

**Ad-hoc doc removed from root `AGENTS.md`:**

Remove both forms — the `@` import line and the markdown bullet — in the `## Documentation` section. Preserve blank-line spacing of surrounding entries.

```markdown
# Before
@docs/architecture.md
@docs/removed.md
@docs/patterns.md

- [Architecture](docs/architecture.md) — System design
- [Removed](docs/removed.md) — Description
- [Patterns](docs/patterns.md) — Code conventions

# After
@docs/architecture.md
@docs/patterns.md

- [Architecture](docs/architecture.md) — System design
- [Patterns](docs/patterns.md) — Code conventions
```

**Module docs removed:**

If anything references the module's `AGENTS.md` from the root `AGENTS.md` or any sibling-module `AGENTS.md`, remove those references using the same pattern.

For each edit, change ONLY the reference lines — do not reformat, do not reorganize surrounding sections.

### Step 5 — Validate

Verify the cleanup is complete:

```bash
# No dangling references remain
grep -rn "@<doc-path>" --include="*.md" . 2>/dev/null
grep -rEn "\[[^]]+\]\(<doc-path>\)" --include="*.md" . 2>/dev/null

# Root AGENTS.md still parses
head -50 AGENTS.md
```

If any dangling structured reference remains, surface it as an error in Step 6 — the cleanup is incomplete.

### Step 6 — Summary

```markdown
## Removal Complete

### Deleted
- `<file1>`
- `<file2>`

### Updated References
| File | Change |
|------|--------|
| `AGENTS.md` | Removed `@` import and markdown link |
| `<module>/AGENTS.md` | Removed `@` import |

### Plain-Text Mentions (not auto-edited)
- `<file>:<line>` — <context> — review and update manually if relevant

### Remaining Dangling References
<Empty if clean; otherwise list of refs that should have been removed but weren't>

### Next Steps
1. Review the plain-text mentions listed above
2. Run `/docs-manager:validating-documentation` to confirm no broken cross-references
3. Commit the changes
```

## Edge Cases

| Scenario | Approach |
|----------|----------|
| Target is root `AGENTS.md` | **Refuse** — direct user to `/docs-manager:onboarding-repository` |
| Target is root `CLAUDE.md` | **Refuse** — same as above |
| Target is root `README.md` | **Refuse** — same as above |
| Target is a module `CLAUDE.md` directly | Treat as request to remove the module pair (also remove `AGENTS.md`); ask user to confirm |
| Target has no references anywhere | Just delete; report "No references to clean" in Step 6 |
| Multiple files reference the target | Edit all of them; list each in Step 6 |
| Reference appears in a code block / example | Treat as plain-text mention (do NOT auto-edit) |
| Referring file is itself untracked / unrelated `.md` | Still edit if it contains a structured reference; list in Step 6 |
| User declines confirmation | Stop and report — nothing deleted, nothing edited |

## What NOT to Do

- Don't delete root standard documentation — refuse and redirect
- Don't auto-edit plain-text mentions (only structured `@` imports and markdown links)
- Don't reformat or reorganize referring files — change only the reference lines
- Don't delete the directory when removing module docs — only the two files
- Don't skip Step 5 validation — dangling references are easy to miss
- Don't proceed without confirmation (unless `--auto`)
