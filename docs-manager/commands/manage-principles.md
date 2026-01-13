---
name: manage-principles
description: Add, remove, or update principles in AGENTS.md
---

# Manage Principles

Manage principles in AGENTS.md.

## Pre-flight

Check AGENTS.md exists:

```bash
test -f AGENTS.md && echo "Found" || echo "Not found"
```

**If not found:**
> No AGENTS.md found. Run `/docs-manager:onboard` first.

## Parse

Read AGENTS.md and extract current principles:

```bash
cat AGENTS.md
```

Principles are in the `## Principles` section, typically:
```markdown
## Principles

These rules MUST be followed:

1. **Name**: Description
2. **Name**: Description
```

Present current state:

```markdown
## Current Principles

1. **<Name>**: <Description>
2. **<Name>**: <Description>

<Or: "No principles defined">
```

## Choose

Ask user:

> **What would you like to do?**
> 1. **Add** - Add a new principle
> 2. **Remove** - Remove a principle
> 3. **Edit** - Modify a principle
> 4. **Reorder** - Change order
> 5. **Done** - Exit

## Execute

### If Add:

> Provide the new principle:
> **Name**: Description
>
> Example: **No Magic Numbers**: All numeric constants must be named.

Proceed to **Validate**.

### If Remove:

> Which principle to remove? (Enter number)

Confirm:
> Remove **<Name>**: <Description>?

Skip validation, proceed to **Apply**.

### If Edit:

> Which principle to edit? (Enter number)

Show current:
> Current: **<Name>**: <Description>
>
> Provide updated version:

If substantive edit, proceed to **Validate**.
If minor (typos), proceed to **Apply**.

### If Reorder:

> Current order:
> 1. **<Name>**
> 2. **<Name>**
>
> Enter new order (e.g., "2,1,3"):

Proceed to **Apply**.

### If Done:

Go to **Summary**.

## Validate

For new or edited principles, use the Task tool with subagent_type='principle-validator' to validate the principle:

```
Validate this principle:

Principle: <text>

Search for evidence this is followed in the codebase.
Look for counter-examples.
Return verdict with file references.
```

**If SUPPORTED:**
> ✓ Evidence found: <summary>
> Proceeding.

**If WEAK_EVIDENCE:**
> ⚠ Limited evidence: <summary>
>
> 1. **Add anyway**
> 2. **Modify** based on findings
> 3. **Cancel**

**If NOT_SUPPORTED:**
> ✗ No evidence found.
>
> 1. **Add anyway** (aspirational)
> 2. **Modify** to match code
> 3. **Cancel**

**If CONTRADICTED:**
> ✗ Evidence contradicts: <examples>
>
> 1. **Add anyway** (want to change codebase)
> 2. **Modify**: "<suggestion>"
> 3. **Cancel**

If **Modify**, collect new text and re-validate.

## Apply

Get timestamp:
```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

Update AGENTS.md:
1. Update front-matter `last_updated`
2. Apply principle changes
3. Preserve all other content

Show diff:
```bash
git diff AGENTS.md
```

## Loop

> Changes applied. Would you like to:
> 1. **Continue** - More changes
> 2. **Done** - Finish

If Continue, return to **Choose**.

## Summary

```markdown
## Summary

**Changes made:**
- <Added/Removed/Edited/Reordered>: <details>

**Current principles:**
1. **<Name>**: <Description>

**AGENTS.md updated:** <timestamp>
```

## Guidelines

1. **Preserve formatting** - Keep exact structure
2. **Don't modify other sections** - Only principles and front-matter
3. **Validate meaningfully** - Real searches, not rubber stamps
4. **Respect user decisions** - Aspirational principles are valid
5. **Keep principles concise** - Clear, actionable rules
