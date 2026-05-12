---
name: governor-manage
description: Use when the user wants to add, edit, remove, reorder, or revalidate tenets in AGENTS.md, or manage tenet exceptions. Validates new and edited tenets against the codebase at add-time, surfaces evidence for the user to review, but never persists evidence to AGENTS.md. Use the governor-bootstrap skill instead when no tenets exist yet.
---

# Governor Manage

Modify tenets and exceptions in AGENTS.md. Validates changes against the codebase to ensure tenets stay grounded in reality.

**REQUIRED:** Load the `tenet-governance` skill for tenet format spec, severity levels, validation verdicts, and exception syntax.

## When to use

- The user wants to add a new tenet
- The user wants to edit an existing tenet (name, description, severity)
- The user wants to remove a tenet
- The user wants to reorder tenets
- The user wants to add or remove an exception
- The user wants to re-validate an existing tenet against the current codebase

**Don't use when:**
- No tenets exist yet — use `governor-bootstrap`
- The user wants to verify code compliance — use `governor-verify`

## Critical guidelines

- **You MUST never persist evidence (file:line refs) to AGENTS.md.** Validation surfaces evidence in chat for the user; AGENTS.md only stores tenet text.
- **You MUST validate at add-time for new tenets and at edit-time for description changes.** Skip validation for trivial edits (typos, severity bumps without scope changes).
- **You MUST renumber tenets sequentially after removal.** If T2 is removed, T3 becomes T2, T4 becomes T3, etc. Update the Tenet Exceptions table accordingly.
- **You MUST preserve unrelated AGENTS.md content.** Only the `## Tenets` and `## Tenet Exceptions` sections are yours.

## Workflow

```
Manage Progress:
- [ ] Step 1: Pre-flight (parse current tenets)
- [ ] Step 2: Show current state and get user action
- [ ] Step 3: Execute action (validate if needed)
- [ ] Step 4: Apply changes to AGENTS.md
- [ ] Step 5: Summary
```

### Step 1: Pre-flight

```bash
test -f AGENTS.md && grep -q "^## Tenets" AGENTS.md && echo "ok" || echo "missing"
```

**If missing:** `No tenets found. Run the governor-bootstrap skill first.`

Parse AGENTS.md to extract current tenets (ID, name, description, severity) and exceptions (file, tenet, reason, approved).

### Step 2: Show current state and get action

Display existing tenets:

```markdown
## Current Tenets

| ID | Name | Severity |
|----|------|----------|
| T1 | Domain Isolation | critical |
| T2 | Handler Delegation | high |
| T3 | Error Wrapping | medium |

**Exceptions:** <N> approved
```

Present action menu:
1. **Add** — Create a new tenet (triggers validation)
2. **Edit** — Modify an existing tenet
3. **Remove** — Delete a tenet
4. **Reorder** — Change tenet sequence
5. **Exception** — Add or remove an exception
6. **Revalidate** — Check an existing tenet against the current codebase
7. **Done** — Exit

Repeat until the user selects Done.

### Step 3: Execute action

#### Add

1. Ask for tenet name, description, severity
2. **Validate** against the codebase (see Validation Process below)
3. Show validation verdict and evidence in chat
4. Confirm with user, then add to the in-memory tenet list
5. Loop back to Step 2

#### Edit

1. Ask which tenet to edit (by ID)
2. Show current values
3. Ask what to change: name / description / severity
4. **If the description changed materially**, validate the edited tenet against the codebase
5. Show the verdict, confirm with user
6. Update the in-memory tenet list
7. Loop back to Step 2

Trivial edits (typos, severity bumps without scope changes) skip validation.

#### Remove

1. Ask which tenet to remove (by ID)
2. Confirm removal
3. Remove from the in-memory list
4. **Renumber remaining tenets sequentially** (T1, T2, T3, …)
5. Update any references in the Tenet Exceptions table (e.g., if T3 was removed and T4→T3, update exception rows pointing to T4)
6. Loop back to Step 2

#### Reorder

1. Show current order
2. Ask for new order (e.g., "T3, T1, T2")
3. Renumber sequentially after reorder (the third tenet listed becomes T3, etc.)
4. Update Tenet Exceptions references to match
5. Loop back to Step 2

#### Exception

**Add:**
1. Ask for file path (relative to repo root)
2. Ask which tenet (by ID)
3. Ask for justification
4. Add row to Tenet Exceptions with today's date (YYYY-MM-DD)

**Remove:**
1. Show current exceptions
2. Ask which row to remove
3. Remove from table

Loop back to Step 2.

#### Revalidate

1. Ask which tenet to revalidate
2. Run validation against the current codebase
3. Show verdict
4. If verdict is now NOT_SUPPORTED or CONTRADICTED, offer to edit or remove the tenet
5. Loop back to Step 2

### Step 4: Apply changes to AGENTS.md

After the user selects Done, write the updated `## Tenets` and `## Tenet Exceptions` sections.

**Tenet format (no evidence):**

```markdown
### T<N>. <Name>

<Description>

**Severity:** <severity>
```

**Exception format:**

```markdown
| File | Tenet | Reason | Approved |
|------|-------|--------|----------|
| `<file>` | T<N> | <reason> | <YYYY-MM-DD> |
```

If no exceptions remain, leave a single `| (none) | | | |` row.

Show the diff: `git diff AGENTS.md`

### Step 5: Summary

```markdown
## Changes Applied

**Actions performed:**
- Added: T4. <Name>
- Edited: T2. <Name> (description updated)
- Removed: T5. <Name> (renumbered T6 → T5)

**Validation results:**
- T4: SUPPORTED (8/8 files conform)

**AGENTS.md:** Updated

**Next steps:**
- Review changes in AGENTS.md
- Use `governor-verify` to check compliance against the new tenet set
```

## Validation Process

For Add and material Edit actions:

1. **Search for positive evidence** — files that follow the proposed pattern
2. **Search for counter-evidence** — files that violate it
3. **Determine verdict:**

| Verdict | Meaning | Action |
|---------|---------|--------|
| SUPPORTED | Consistent pattern across ≥80% of applicable files | Proceed |
| WEAK_EVIDENCE | Only 1-2 instances of the pattern | Warn, ask to proceed |
| NOT_SUPPORTED | Pattern not found in the codebase | Strong warning, suggest dropping or marking aspirational |
| CONTRADICTED | Counter-evidence found | Block; user must fix violations, adjust scope, or cancel |

4. **Surface findings to the user in chat:**

```markdown
### Validating: T<N>. <Name>

Searching for evidence...
- <N> files follow the pattern
- <N> files violate the pattern

**Verdict:** <SUPPORTED | WEAK_EVIDENCE | NOT_SUPPORTED | CONTRADICTED>

**Evidence** (for review only — not saved):
- `<file>:<line>` — <observation>
- `<file>:<line>` — <observation>

**Recommendation:** <guidance based on verdict>
```

For WEAK_EVIDENCE or NOT_SUPPORTED, ask:
- **Proceed anyway** — Add as aspirational (suggest severity: low)
- **Edit tenet** — Adjust to match reality
- **Cancel** — Don't add

For CONTRADICTED:
- **Fix violations first** — Cancel for now, user fixes, retries
- **Adjust tenet** — Narrow scope to avoid contradictions
- **Cancel**

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Writing evidence into AGENTS.md after validation | Evidence is for in-chat review only. Strip it from any output that goes to AGENTS.md. |
| Forgetting to renumber after removal | After any removal, renumber T1..TN sequentially AND update Tenet Exceptions references. |
| Re-running validation for a typo fix | Skip validation when only the name changes or severity bumps without scope changes. |
| Adding an exception without a date | Exceptions must always include the approval date in YYYY-MM-DD format. |
| Validating against an unrelated codebase location | Verify the working directory matches the project before searching for evidence. |
| Bulk-applying changes without showing the diff | Always show `git diff AGENTS.md` before finalizing. |

## Reference

- **[tenet-governance](../tenet-governance/SKILL.md)** — tenet format spec, severity levels, validation verdicts, exception syntax
