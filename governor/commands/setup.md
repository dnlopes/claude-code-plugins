---
description: Discover architectural constraints and create tenets in AGENTS.md with evidence and severity levels
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Task(governor:constraint-explorer)
  - AskUserQuestion
argument-hint: "[project-path]"
---

# Setup Tenets

Discover architectural constraints in a codebase and create tenets in AGENTS.md.

**Load skill `tenet-governance`** for tenet format, severity levels, and good tenet characteristics.

## Workflow

```
Setup Progress:
- [ ] Step 1: Pre-flight
- [ ] Step 2: Explore codebase (agent)
- [ ] Step 3: Review with user
- [ ] Step 4: Generate AGENTS.md
- [ ] Step 5: Summary
```

## Step 1: Pre-flight

Check current state:

```bash
test -f AGENTS.md && echo "AGENTS.md: Found" || echo "AGENTS.md: Not found"
grep -n "^## Tenets" AGENTS.md 2>/dev/null && echo "Tenets: Found" || echo "Tenets: Not found"
```

**If tenets exist**, ask user:
1. **Replace** - Remove existing tenets, discover new ones
2. **Add** - Keep existing, discover additional tenets
3. **Cancel** - Abort setup

**If no tenets**, proceed to Step 2.

## Step 2: Explore Codebase

Spawn `governor:constraint-explorer` agent to analyze the codebase:

```
Task:
  description: "Explore codebase for constraints"
  subagent_type: governor:constraint-explorer
  prompt: |
    Explore the codebase at: <project-path>

    Focus on discovering architectural constraints that could become tenets.
    Return structured findings with evidence.
```

The agent will:
- Detect project type (Go, TypeScript, Python, etc.)
- Map directory structure and boundaries
- Analyze import/dependency patterns
- Identify consistent architectural patterns
- Check existing architecture documentation
- Return structured constraint findings with file:line evidence

**Extract from agent results:**
- Discovered constraints with evidence
- Confidence levels for each
- Project profile information

## Step 3: Review with User

Present 3-5 discovered tenets for approval:

```markdown
## Discovered Tenets

### T1. <Name>

<Description: 2-4 sentences explaining constraint and rationale>

**Severity:** <critical | high | medium | low>
**Evidence:**
- `<file>:<line>` - <observation>
- `<file>:<line>` - <observation>

### T2. <Name>
...
```

For each tenet, ask user:
- **Accept** - Add as-is
- **Edit** - Modify before adding
- **Remove** - Don't include
- **Change severity** - Adjust importance

Ask if user wants to add custom tenets not discovered.

## Step 4: Generate AGENTS.md

Create or update AGENTS.md with approved tenets.

**Format** (from tenet-governance skill):

```markdown
## Tenets

CRITICAL: These tenets are MANDATORY and MUST be followed in all work on this codebase.

### T1. <Name>

<Description>

**Severity:** high

**Evidence:**
- `src/domain/user.go:1` - Domain package has no infrastructure imports

### T2. <Name>
...

## Tenet Exceptions

Approved exceptions to tenets. Each must have justification.

| File | Tenet | Reason | Approved |
|------|-------|--------|----------|
| (none) | | | |
```

**Placement rules:**
- New file: Create with Tenets section
- Existing without Tenets: Insert after first `## ` heading
- Replacing: Replace from `## Tenets` to next `## ` heading (preserve other content)

Show diff: `git diff AGENTS.md`

## Step 5: Summary

```markdown
## Setup Complete

**Tenets created:**
- T1. <Name> (severity: high)
- T2. <Name> (severity: medium)
- T3. <Name> (severity: high)

**AGENTS.md:** Created / Updated

**Evidence preserved:** Yes - each tenet includes file references

**Next steps:**
- Review tenets in AGENTS.md
- Use `/governor:manage` to modify tenets
- Use `/governor:verify` to check compliance
```
