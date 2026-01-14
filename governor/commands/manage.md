---
name: manage
description: Add, remove, edit, or reorder tenets in AGENTS.md
---

# Manage Tenets

Manage tenets in AGENTS.md.

## Pre-flight

Check AGENTS.md exists:

```bash
test -f AGENTS.md && echo "Found" || echo "Not found"
```

**If not found:**
> No AGENTS.md found. Run `/governor:setup` first.

Check for Tenets section:

```bash
grep -n "^## Tenets" AGENTS.md 2>/dev/null
```

**If no Tenets section:**
> No Tenets section found. Run `/governor:setup` first.

## Parse

Read AGENTS.md and extract current tenets:

```bash
cat AGENTS.md
```

Tenets are in the `## Tenets` section with format:

```markdown
## Tenets

CRITICAL: These tenets are MANDATORY and MUST be followed in all work on this codebase.

### T1. <Name>

<Description>

### T2. <Name>

<Description>
```

Present current state:

```markdown
## Current Tenets

### T1. <Name>
<First line of description>

### T2. <Name>
<First line of description>

<Or: "No tenets defined">
```

## Choose

Ask user:

> **What would you like to do?**
> 1. **Add** - Add a new tenet
> 2. **Remove** - Remove a tenet
> 3. **Edit** - Modify a tenet
> 4. **Reorder** - Change order
> 5. **Done** - Exit

## Execute

### If Add:

> Provide the new tenet:
>
> **Name:** <short name>
>
> **Description:** <description with rationale, examples if needed>

Proceed to **Validate**.

### If Remove:

> Which tenet to remove? (Enter T-number, e.g., T2)

Confirm:
> Remove **T2. <Name>**?
>
> This will renumber remaining tenets.

Skip validation, proceed to **Apply**.

### If Edit:

> Which tenet to edit? (Enter T-number, e.g., T1)

Show current:
> **Current T1. <Name>**
>
> <Full description>
>
> What would you like to change?
> 1. **Name only**
> 2. **Description only**
> 3. **Both**

Collect new values.

If substantive edit (not just typos), proceed to **Validate**.
If minor edit (typos, formatting), proceed to **Apply**.

### If Reorder:

> Current order:
> - T1. <Name>
> - T2. <Name>
> - T3. <Name>
>
> Enter new order (e.g., "T2, T1, T3"):

Proceed to **Apply**.

### If Done:

Go to **Summary**.

## Validate

For new or substantively edited tenets, use the Task tool with subagent_type='tenet-validator':

```
Validate this tenet:

Name: <name>
Description: <description>

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
> 1. **Add anyway** (aspirational tenet)
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

Update AGENTS.md:
1. Apply tenet changes to Tenets section only
2. Renumber all tenets sequentially (T1, T2, T3...)
3. Preserve all other content in AGENTS.md

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

**Current tenets:**
- T1. <Name>
- T2. <Name>

**AGENTS.md updated**
```

## Guidelines

1. **Preserve formatting** - Keep exact structure of Tenets section
2. **Don't modify other sections** - Only touch Tenets section
3. **Validate meaningfully** - Real searches, not rubber stamps
4. **Respect user decisions** - Aspirational tenets are valid
5. **Keep tenets well-documented** - Name, description, rationale, examples
6. **Renumber consistently** - Always maintain T1, T2, T3... sequence
