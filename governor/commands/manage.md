---
description: Add, remove, edit, or reorder tenets in AGENTS.md with validation and evidence tracking
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
  - Write
  - Edit
  - AskUserQuestion
---

# Manage Tenets

Modify tenets in AGENTS.md with validation to ensure changes are grounded in codebase reality.

**Load skill `tenet-governance`** for tenet format, validation criteria, and good tenet characteristics.

## Workflow

```
Manage Progress:
- [ ] Step 1: Pre-flight
- [ ] Step 2: Show current tenets
- [ ] Step 3: Get user action
- [ ] Step 4: Validate changes
- [ ] Step 5: Apply changes
- [ ] Step 6: Summary
```

## Step 1: Pre-flight

```bash
test -f AGENTS.md && echo "AGENTS.md: Found" || echo "AGENTS.md: Not found"
grep -n "^## Tenets" AGENTS.md 2>/dev/null && echo "Tenets: Found" || echo "Tenets: Not found"
```

**If not found:** `No tenets found. Run /governor:setup first.`

Parse AGENTS.md to extract current tenets.

## Step 2: Show Current Tenets

Display existing tenets with key info:

```markdown
## Current Tenets

| ID | Name | Severity | Evidence |
|----|------|----------|----------|
| T1 | Domain Isolation | critical | 3 refs |
| T2 | Handler Delegation | high | 2 refs |
| T3 | Error Wrapping | medium | 2 refs |

**Exceptions:** 2 approved
```

## Step 3: Get User Action

Present menu:

1. **Add** - Create new tenet
2. **Edit** - Modify existing tenet
3. **Remove** - Delete tenet
4. **Reorder** - Change tenet sequence
5. **Exception** - Add/remove exception
6. **Done** - Exit manage mode

Repeat until user selects Done.

### Add Action

1. Ask for tenet name and description
2. Ask for severity level
3. Proceed to Step 4 (Validate)
4. If validated, search for evidence
5. Add to AGENTS.md with evidence

### Edit Action

1. Ask which tenet to edit (by ID)
2. Show current values
3. Ask what to change (name, description, severity, evidence)
4. If description changed significantly, proceed to Step 4 (Validate)
5. Update in AGENTS.md

**Important:** Preserve existing evidence unless explicitly changed.

### Remove Action

1. Ask which tenet to remove (by ID)
2. Confirm removal
3. Remove from AGENTS.md
4. Renumber remaining tenets (T1, T2, T3...)
5. Update any references in Tenet Exceptions table

### Reorder Action

1. Show current order
2. Ask for new order (e.g., "T3, T1, T2")
3. Renumber to maintain sequence (T1, T2, T3...)
4. Update AGENTS.md

### Exception Action

**Add exception:**
1. Ask for file path
2. Ask which tenet (by ID)
3. Ask for justification
4. Add to Tenet Exceptions table with current date

**Remove exception:**
1. Show current exceptions
2. Ask which to remove
3. Remove from table

## Step 4: Validate Changes

For new or significantly edited tenets, validate against codebase.

**Validation process:**
1. Search codebase for evidence supporting the tenet
2. Search for counter-evidence (violations)
3. Determine verdict

**Verdicts:**

| Verdict | Meaning | Action |
|---------|---------|--------|
| SUPPORTED | Consistent patterns across files | Proceed |
| WEAK_EVIDENCE | Only 1-2 instances | Warn, ask to proceed |
| NOT_SUPPORTED | No pattern found | Warn strongly, suggest alternatives |
| CONTRADICTED | Found violations | Block, require resolution |

**Validation output:**

```markdown
### Validating: T4. <Name>

**Searching for evidence...**
- Found: <N> files following pattern
- Counter-evidence: <N> files violating pattern

**Verdict:** SUPPORTED / WEAK_EVIDENCE / NOT_SUPPORTED / CONTRADICTED
**Evidence strength:** Strong / Moderate / Weak / None

**Recommendation:** <guidance based on verdict>
```

For WEAK_EVIDENCE or NOT_SUPPORTED, ask user:
- **Proceed anyway** - Add as aspirational (suggest severity: low)
- **Edit tenet** - Adjust to match reality
- **Cancel** - Don't add

For CONTRADICTED, user must either:
- **Fix violations first** - Then retry
- **Adjust tenet** - Narrow scope to avoid contradictions
- **Cancel** - Don't add

## Step 5: Apply Changes

After validation passes:

1. Update AGENTS.md with changes
2. Ensure sequential numbering (T1, T2, T3...)
3. Update Tenet Exceptions if tenets were renumbered
4. Show diff: `git diff AGENTS.md`

## Step 6: Summary

```markdown
## Changes Applied

**Actions performed:**
- Added: T4. <Name>
- Edited: T2. <Name> (description updated)
- Removed: T5. <Name>

**Validation results:**
- T4: SUPPORTED (strong evidence)

**Renumbering:** T5 → T4 (after removal)

**AGENTS.md:** Updated

**Next steps:**
- Review changes in AGENTS.md
- Use `/governor:verify` to check compliance
```
