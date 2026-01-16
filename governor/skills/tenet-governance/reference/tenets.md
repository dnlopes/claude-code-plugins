# Tenet Format Specification

Complete specification for tenet format, AGENTS.md structure, and parsing rules.

## AGENTS.md Structure

Tenets live in a dedicated section of AGENTS.md:

```markdown
# Project Name

[Other sections...]

## Tenets

CRITICAL: These tenets are MANDATORY and MUST be followed in all work on this codebase.

### T1. <Name>

<Description: 2-4 sentences explaining the constraint and rationale>

**Severity:** <critical | high | medium | low>

**Evidence:**
- `<file:line>` - <observation>
- `<file:line>` - <observation>

### T2. <Name>

<Description>

**Severity:** high

**Evidence:**
- `<file:line>` - <observation>

## Tenet Exceptions

Approved exceptions to tenets. Each must have justification.

| File | Tenet | Reason | Approved |
|------|-------|--------|----------|
| `src/legacy/adapter.go` | T1 | Legacy integration, scheduled for removal | 2024-01-15 |

[Other sections...]
```

## Tenet Header Format

```
### T<N>. <Name>
```

- `T<N>`: Sequential identifier (T1, T2, T3...)
- `<Name>`: Short descriptive name (2-5 words)
- Numbers must be sequential; gaps trigger warning on save

## Description Requirements

- 2-4 sentences
- Explains WHAT the constraint is
- Explains WHY it exists (rationale)
- Uses active voice
- Specific enough to verify

**Good:** "Domain modules must not import from infrastructure packages. This ensures the domain layer remains portable and testable without external dependencies."

**Bad:** "Keep things separate." (too vague, no rationale)

## Severity Levels

| Level | Meaning | When to Use | Default Behavior |
|-------|---------|-------------|------------------|
| `critical` | Violation breaks system invariants | Security boundaries, data integrity | Always fail CI |
| `high` | Violation causes significant technical debt | Core architecture decisions | Fail CI by default |
| `medium` | Violation reduces code quality | Best practices, conventions | Warn only |
| `low` | Guideline, not hard requirement | Preferences, suggestions | Info only |

**Default:** If severity is omitted, treat as `high`.

## Evidence Format

```markdown
**Evidence:**
- `<file>:<line>` - <observation>
```

- Each evidence entry references a specific file and line
- Observation explains what was found at that location
- Minimum 1 evidence entry per tenet
- Recommended 2-3 entries for pattern confirmation

## Exception Table Format

```markdown
## Tenet Exceptions

| File | Tenet | Reason | Approved |
|------|-------|--------|----------|
| `<file-path>` | T<N> | <justification> | <YYYY-MM-DD> |
```

- File path should be relative to repository root
- Tenet ID references the tenet being excepted
- Reason must justify why exception is necessary
- Approved date documents when exception was granted

## Inline Exception Syntax

For code-level exceptions:

```
// governor:ignore T<N> - <reason>
```

Language-specific comment syntax:
- Go/Java/C#/JS/TS: `// governor:ignore T1 - reason`
- Python: `# governor:ignore T1 - reason`
- HTML: `<!-- governor:ignore T1 - reason -->`
- CSS: `/* governor:ignore T1 - reason */`

Inline exceptions should also be registered in the Tenet Exceptions table.

## Parsing Rules

When parsing AGENTS.md:

1. **Find Tenets section**: Match `## Tenets` heading
2. **Extract tenets**: Match `### T<N>. <Name>` headers
3. **Parse each tenet**:
   - Next paragraph = description
   - `**Severity:**` line = severity (default: high)
   - `**Evidence:**` block = evidence list
4. **Find Exceptions section**: Match `## Tenet Exceptions` heading
5. **Parse exception table**: Extract file, tenet, reason, approved columns

## Handling Malformed Files

| Issue | Handling |
|-------|----------|
| Missing severity | Default to "high" |
| Missing evidence | Warn but continue |
| Non-sequential numbering (T1, T3) | Warn, renumber on save |
| Missing Tenets section | Error: "Run governor:setup first" |
| Malformed exception table | Warn, skip malformed rows |

## Validation vs Verification

Two distinct operations use this format:

**Validation** (during setup/manage):
- Question: "Is this tenet grounded in reality?"
- Process: Search codebase for evidence supporting the tenet
- Verdicts: SUPPORTED, WEAK_EVIDENCE, NOT_SUPPORTED, CONTRADICTED

**Verification** (during verify):
- Question: "Does this code follow the tenets?"
- Process: Analyze code against existing tenets
- Output: COMPLIANT or VIOLATED with confidence scores

## Pre-flight Checks

All operations should verify AGENTS.md exists with tenets:

```bash
test -f AGENTS.md && echo "AGENTS.md: Found" || echo "AGENTS.md: Not found"
grep -n "^## Tenets" AGENTS.md 2>/dev/null && echo "Tenets: Found" || echo "Tenets: Not found"
```

If either check fails, direct user to `/governor:setup`.
