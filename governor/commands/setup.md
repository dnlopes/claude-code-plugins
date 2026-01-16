---
description: Discover architectural constraints and create tenets in AGENTS.md with evidence and severity levels
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
  - Write
  - Edit
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
- [ ] Step 2: Detect project type
- [ ] Step 3: Explore codebase
- [ ] Step 4: Review with user
- [ ] Step 5: Generate AGENTS.md
- [ ] Step 6: Summary
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

## Step 2: Detect Project Type

Identify primary language and framework:

```bash
ls -la *.go go.mod 2>/dev/null && echo "Go project"
ls -la package.json 2>/dev/null && echo "Node/TypeScript project"
ls -la requirements.txt pyproject.toml setup.py 2>/dev/null && echo "Python project"
ls -la *.csproj *.sln 2>/dev/null && echo "C#/.NET project"
ls -la Cargo.toml 2>/dev/null && echo "Rust project"
```

Record detected type for language-specific exploration in Step 3.

## Step 3: Explore Codebase

Focus on **ARCHITECTURAL CONSTRAINTS**, not tooling or style.

### 3.1 Map Directory Structure

Use Glob and LS to understand the layout:
- Top-level directories
- Source code organization (`src/`, `pkg/`, `internal/`, `lib/`, `app/`)
- Potential architectural boundaries (`domain/`, `infrastructure/`, `api/`, `handlers/`)

### 3.2 Analyze Import Patterns

Use Grep with language-specific patterns to find:
- Import statements across files
- Internal vs external dependencies
- Cross-boundary imports

Look for **consistent patterns** that suggest intentional constraints.

### 3.3 Identify Architectural Patterns

Read 5-10 representative files to understand patterns:

| Pattern | Evidence to Look For |
|---------|---------------------|
| Layer separation | Domain code doesn't import infrastructure |
| Repository pattern | Data access through interfaces |
| Dependency injection | Constructors receive dependencies |
| Handler isolation | HTTP handlers delegate to services |
| Module boundaries | Clear separation between features |

For each pattern found, record:
- 2-3 file:line references as evidence
- The constraint implied by the pattern

### 3.4 Check Existing Documentation

```bash
ls -la ARCHITECTURE.md DESIGN.md docs/architecture* docs/design* 2>/dev/null
```

If architecture docs exist, read them for stated constraints.

## Step 4: Review with User

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

## Step 5: Generate AGENTS.md

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

## Step 6: Summary

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
