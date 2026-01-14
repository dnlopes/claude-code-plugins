# Governor Plugin Design

## Overview

Decouple principles management from docs-manager into a new dedicated plugin called "governor". Rename "principles" to "tenets" and adopt a richer format.

## Plugin Structure

```
governor/
├── .claude-plugin/
│   └── plugin.json
├── agents/
│   └── tenet-validator.md
└── commands/
    ├── setup.md
    └── manage.md
```

**plugin.json:**
```json
{
    "name": "governor",
    "description": "Project tenets management - discover, validate, and maintain guiding principles",
    "version": "1.0.0",
    "author": {
        "name": "David Lopes"
    }
}
```

## Tenet Format

```markdown
## Tenets

CRITICAL: These tenets are MANDATORY and MUST be followed in all work on this codebase.

### T1. <Name>

<Description explaining the tenet. Include the rationale - why this matters.
Add examples if they clarify the expected behavior. 2-4 sentences typical,
but can be longer if examples are needed.>

### T2. <Name>

<Description with rationale and examples as appropriate.>
```

## AGENTS.md Handling

| Scenario | Behavior |
|----------|----------|
| AGENTS.md exists with Tenets section | Update the section in place |
| AGENTS.md exists without Tenets section | Insert `## Tenets` section after first heading or at top |
| AGENTS.md doesn't exist | Create new file with only the `## Tenets` section |

Section placement when inserting: After the project description but before other sections like Quick Start, Documentation, etc.

## Commands

### `/governor:setup`

Discover and create initial tenets for a project by analyzing the codebase.

**Workflow:**

1. **Pre-flight**
   - Check if AGENTS.md exists
   - Check if Tenets section already exists
   - If tenets exist, offer: Replace / Add to existing / Cancel

2. **Explore**
   - Analyze codebase for patterns and conventions
   - Check existing documentation, test patterns, linter configs
   - Generate 3-5 suggested tenets based on evidence

3. **Review**
   - Present discovered tenets with supporting evidence
   - User can: Accept / Edit / Remove / Add custom

4. **Generate**
   - Create or update AGENTS.md with Tenets section
   - Number tenets sequentially (T1, T2, ...)

5. **Summary**
   - Show created/updated tenets
   - Suggest `/governor:manage` to refine later

### `/governor:manage`

Add, remove, edit, or reorder tenets in an existing AGENTS.md.

**Workflow:**

1. **Pre-flight**
   - Check AGENTS.md exists
   - If not found: suggest `/governor:setup` first

2. **Parse**
   - Read AGENTS.md and extract current tenets
   - Present current state with T-numbers and names

3. **Choose**
   - Add - Add a new tenet
   - Remove - Remove a tenet (renumbers remaining)
   - Edit - Modify a tenet's name or description
   - Reorder - Change tenet order (renumbers all)
   - Done - Exit

4. **Execute**
   - Add/Edit: Prompt for name and description, then validate
   - Remove: Confirm, skip validation
   - Reorder: Accept new order, renumber all tenets

5. **Validate** (for Add/Edit only)
   - Use `tenet-validator` agent to search for evidence
   - Present verdict: SUPPORTED / WEAK_EVIDENCE / NOT_SUPPORTED / CONTRADICTED
   - User decides: Accept / Modify / Cancel

6. **Apply**
   - Update AGENTS.md Tenets section only
   - Preserve all other content untouched
   - Show diff

7. **Loop**
   - Offer to continue or finish

## Agent

### `tenet-validator`

Validates proposed tenets by searching codebase for evidence.

**Frontmatter:**
```yaml
---
name: tenet-validator
description: Validates proposed tenets by searching codebase for evidence
tools: Read, Grep, Glob, LS, Bash
model: sonnet
---
```

**Process:**
1. Parse the tenet to identify key concepts/patterns
2. Generate search terms
3. Search for supporting evidence
4. Search for counter-examples

**Output:**
```markdown
## Validation Result

**Tenet:** <the tenet>

**Verdict:** SUPPORTED | WEAK_EVIDENCE | NOT_SUPPORTED | CONTRADICTED

### Supporting Evidence
1. `<file:line>` - <observation>

### Counter-Evidence
1. `<file:line>` - <observation>

**Summary:** <2-3 sentences>

**Recommendation:** Accept as-is | Accept with modification | Discuss | Reject
```

## docs-manager Changes

**Version:** 2.1.0 → 2.2.0

**Files to delete:**
- `agents/principle-validator.md`
- `commands/manage-principles.md`

**Files to update:**
- `commands/onboard.md` - Remove all principles/tenets references
- `plugin.json` - Bump version to 2.2.0

**Onboard command changes:**
- Remove from Explore: "Suggested principles" instruction
- Remove from Explore: "Principles are 'do X' not 'X exists'"
- Remove from Review: "Suggested Principles" section
- Remove from Review: "Adjust principles" option
- Remove from Generate checklist: "Actionable principles only"
- Remove from Validate checklist: "Principles are actionable"
- Remove Guideline #4 about actionable principles

## Marketplace Updates

- Add `governor: 1.0.0`
- Update `docs-manager: 2.2.0`
