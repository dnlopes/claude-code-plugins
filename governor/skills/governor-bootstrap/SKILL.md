---
name: governor-bootstrap
description: Use when a project has no tenets yet and the user wants to discover architectural constraints and create an initial `## Tenets` section in AGENTS.md. Spawns the constraint-explorer agent to map the codebase, presents discovered constraints with supporting evidence for the user to review, and writes only approved tenet text — no evidence is persisted. Use the governor-manage skill instead when tenets already exist.
---

# Governor Bootstrap

Discover architectural constraints in a codebase and seed AGENTS.md with an initial set of tenets.

**REQUIRED:** Load the `tenet-governance` skill for the tenet format spec, severity levels, and validation vocabulary. The rest of this skill assumes you have it.

## When to use

- A project has no `## Tenets` section in AGENTS.md, and the user wants to establish one
- The user explicitly asks to "bootstrap" or "discover" tenets

**Don't use when:**
- Tenets already exist — use `governor-manage` to add, edit, or remove
- The user wants to verify compliance — use `governor-verify`

## Critical guidelines

- **You MUST never persist evidence (file:line refs) to AGENTS.md.** Evidence is shown to the user during review, then discarded. The codebase is the source of truth; stored evidence rots within weeks.
- **You MUST get explicit user approval for each tenet before writing.** Don't bulk-write what the explorer agent returned.
- **You MUST preserve other content in AGENTS.md.** Only the `## Tenets` and `## Tenet Exceptions` sections are yours.

## Workflow

Copy this checklist and track progress as you execute:

```
Bootstrap Progress:
- [ ] Step 1: Pre-flight (check AGENTS.md state)
- [ ] Step 2: Explore codebase (spawn constraint-explorer)
- [ ] Step 3: Review constraints with user
- [ ] Step 4: Write approved tenets to AGENTS.md
- [ ] Step 5: Summary
```

### Step 1: Pre-flight

```bash
test -f AGENTS.md && echo "AGENTS.md: found" || echo "AGENTS.md: missing"
grep -q "^## Tenets" AGENTS.md 2>/dev/null && echo "Tenets: exist" || echo "Tenets: none"
```

**If tenets already exist**, present three options to the user:
1. **Replace** — Remove existing tenets, discover new ones
2. **Add** — Keep existing, discover additional tenets to merge in
3. **Cancel** — Switch to `governor-manage` instead

**If no tenets**, proceed to Step 2.

### Step 2: Explore codebase

Spawn the `governor:constraint-explorer` agent via the Task tool:

```
Task:
  description: "Discover architectural constraints"
  subagent_type: governor:constraint-explorer
  prompt: |
    Explore the codebase at: <project-path>

    Focus on discovering architectural constraints that could become tenets.
    Return findings with supporting evidence (file:line references) for the user
    to review. The evidence will NOT be persisted to AGENTS.md — it is for the
    user's in-chat review only.
```

The agent returns:
- Project profile (language, structure, architecture style)
- Discovered constraints with consistency percentages, evidence refs, confidence levels
- Additional observed patterns (below the constraint threshold)

### Step 3: Review constraints with user

Present each discovered constraint with its evidence. Format:

```markdown
## Discovered Tenets

### T1. <Name>

<Description: 2-4 sentences explaining the constraint and rationale>

**Severity:** <critical | high | medium | low>
**Consistency:** <X>% (<N>/<M> applicable files)
**Confidence:** <HIGH | MEDIUM | LOW>

**Evidence** (for your review — will NOT be saved):
- `<file>:<line>` — <observation>
- `<file>:<line>` — <observation>
- `<file>:<line>` — <observation>

### T2. <Name>
...
```

For each tenet, ask the user:
- **Accept** — Add as-is
- **Edit** — Modify name, description, or severity before adding
- **Skip** — Don't include this one

Then ask if the user wants to add any tenets the explorer missed.

### Step 4: Write approved tenets to AGENTS.md

After the user finalizes the list, write AGENTS.md using this exact section template:

```markdown
## Tenets

CRITICAL: These tenets are MANDATORY and MUST be followed in all work on this codebase.

### T1. <Name>

<Description>

**Severity:** <severity>

### T2. <Name>

<Description>

**Severity:** <severity>

## Tenet Exceptions

Approved exceptions to tenets. Each must have justification.

| File | Tenet | Reason | Approved |
|------|-------|--------|----------|
| (none) | | | |
```

**Placement rules:**
- **New AGENTS.md** — create the file with a `# <Project Name>` heading, then the Tenets section
- **Existing AGENTS.md, no Tenets section** — insert the Tenets and Tenet Exceptions sections after the first `## ` heading
- **Existing AGENTS.md with Tenets (user chose Replace)** — replace from `## Tenets` to the next `## ` heading (which is `## Tenet Exceptions` if present, or some other section)
- **Existing AGENTS.md with Tenets (user chose Add)** — append new tenets to the existing list, renumber sequentially

**Never write `**Evidence:**` blocks. Never write file:line references.**

Show the diff: `git diff AGENTS.md`

### Step 5: Summary

```markdown
## Bootstrap Complete

**Tenets created:** <N>
- T1. <Name> (<severity>)
- T2. <Name> (<severity>)
- T3. <Name> (<severity>)

**AGENTS.md:** Created / Updated

**Next steps:**
- Use `governor-manage` to modify, add, or remove tenets later
- Use `governor-verify` to check code compliance
```

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Writing `**Evidence:**` blocks under each tenet | Never persist evidence. Show it once in chat, discard after approval. |
| Bulk-accepting all discovered constraints | Each tenet must be individually reviewed and approved by the user. |
| Overwriting AGENTS.md sections other than Tenets/Tenet Exceptions | Preserve unrelated content. Only touch the two governor-owned sections. |
| Reporting non-sequential tenet IDs (T1, T3, T5) | Renumber sequentially after approval. |
| Adding "evidence" to AGENTS.md because the user asked you to | Push back. Evidence rots. The codebase is the source of truth. If the user insists, explain the tradeoff and only proceed with explicit confirmation. |

## Reference

- **[tenet-governance](../tenet-governance/SKILL.md)** — tenet format spec, severity levels, exception syntax
