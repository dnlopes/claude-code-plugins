---
description: Add, remove, or update principles in CLAUDE.md with evidence-based validation
---

# Manage Principles

You are helping the user manage the principles in their CLAUDE.md file.

## Pre-flight Check

First, verify CLAUDE.md exists:

```bash
test -f CLAUDE.md && echo "Found" || echo "Not found"
```

If CLAUDE.md doesn't exist:
> This repository doesn't have a CLAUDE.md file yet. Would you like to:
> 1. **Onboard** - Run `/docs-manager:onboard` to create documentation
> 2. **Cancel** - Exit without changes

## Phase 1: Parse Current Principles

Read CLAUDE.md and extract the current principles:

```bash
cat CLAUDE.md
```

Parse the `## Principles` section. Principles typically follow this format:
```markdown
## Principles

These rules MUST be followed when working on this codebase:

1. **Principle Name**: Description
2. **Principle Name**: Description
```

Present the current state:

```markdown
## Current Principles

<If principles exist:>
1. **<Name>**: <Description>
2. **<Name>**: <Description>
...

<If no principles section or empty:>
No principles currently defined.
```

## Phase 2: Choose Action

Ask the user what they want to do:

> **What would you like to do?**
> 1. **Add** - Add a new principle
> 2. **Remove** - Remove an existing principle
> 3. **Edit** - Modify an existing principle
> 4. **Reorder** - Change the order of principles
> 5. **Done** - Exit without further changes

Wait for user selection.

## Phase 3: Execute Action

### If Add:

Ask the user for the new principle:
> Please provide the new principle in the format:
> **Name**: Description
>
> Example: **No Magic Numbers**: All numeric constants must be named and documented.

Once provided, proceed to **Phase 4: Validation**.

### If Remove:

Ask which principle to remove:
> Which principle would you like to remove? (Enter the number)

Confirm before removing:
> You're about to remove:
> **<Principle Name>**: <Description>
>
> Are you sure? (yes/no)

If confirmed, skip validation and proceed to **Phase 5: Apply Changes**.

### If Edit:

Ask which principle to edit:
> Which principle would you like to edit? (Enter the number)

Show current text and ask for new version:
> Current: **<Name>**: <Description>
>
> Please provide the updated principle (or just the description if keeping the name):

If the edit is substantive (not just typo fixes), proceed to **Phase 4: Validation**.
If it's a minor edit (typos, clarification), skip to **Phase 5: Apply Changes**.

### If Reorder:

Show numbered list and ask for new order:
> Current order:
> 1. **<Name>**
> 2. **<Name>**
> 3. **<Name>**
>
> Enter the new order as comma-separated numbers (e.g., "3,1,2"):

Validate the input covers all principles, then skip to **Phase 5: Apply Changes**.

### If Done:

Exit the command with a summary of any changes made.

## Phase 4: Validation

For new or significantly edited principles, spawn a **principle-validator** agent:

```
Validate this principle against the codebase:

Principle: <the principle text>

Search for evidence that this principle is actually followed in the code. Look for:
- Consistent patterns across files
- Tests or linters that enforce it
- Documentation that mentions it
- Counter-examples that violate it

Return your assessment with specific file references.
```

Wait for the agent to return.

### Based on Validation Result:

**If SUPPORTED:**
> ✓ Evidence found for this principle:
> <summary of evidence>
>
> Proceeding to add/update the principle.

Proceed to **Phase 5: Apply Changes**.

**If WEAK_EVIDENCE:**
> ⚠ Limited evidence found:
> <summary of what was found>
>
> Would you like to:
> 1. **Add anyway** - Keep the principle as stated
> 2. **Modify** - Adjust the principle based on findings
> 3. **Cancel** - Don't add this principle

**If NOT_SUPPORTED:**
> ✗ No evidence found for this principle.
> <summary of search performed>
>
> This principle doesn't appear to be reflected in the current codebase. Would you like to:
> 1. **Add anyway** - This is an aspirational principle we want to enforce going forward
> 2. **Modify** - Adjust to match what's actually in the code
> 3. **Cancel** - Don't add this principle

**If CONTRADICTED:**
> ✗ Evidence contradicts this principle:
> <examples of contradictions>
>
> The codebase appears to follow a different pattern. Would you like to:
> 1. **Add anyway** - We want to change the codebase to follow this principle
> 2. **Modify** - Adjust to match the actual pattern: "<suggested rewording>"
> 3. **Cancel** - Don't add this principle

If user chooses "Modify", collect the new text and re-run validation (return to Phase 4).

## Phase 5: Apply Changes

Get current commit hash and timestamp:

```bash
git rev-parse HEAD
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

Update CLAUDE.md:

1. **Update front-matter** - Set `last_commit` and `last_updated` to current values
2. **Update principles section** - Apply the add/remove/edit/reorder changes
3. **Preserve all other content** - Don't modify anything outside the principles section and front-matter

Write the updated CLAUDE.md file.

Show the diff:
```bash
git diff CLAUDE.md
```

## Phase 6: Continue or Finish

Ask if the user wants to make more changes:
> Changes applied. Would you like to:
> 1. **Continue** - Make more changes to principles
> 2. **Done** - Finish

If Continue, return to **Phase 2: Choose Action**.

If Done, present final summary:

```markdown
## Summary

**Changes made:**
- <Added/Removed/Edited/Reordered>: <details>
- ...

**Current principles:**
1. **<Name>**: <Description>
2. ...

**CLAUDE.md updated** with commit `<short hash>` at `<timestamp>`
```

## Important Guidelines

1. **Preserve formatting** - Keep the exact markdown structure of CLAUDE.md
2. **Don't modify other sections** - Only touch front-matter and principles
3. **Validate meaningfully** - The agent should do real searches, not rubber-stamp
4. **Respect user decisions** - If they want to add an aspirational principle, let them
5. **Keep principles concise** - Each should be a clear, actionable rule
