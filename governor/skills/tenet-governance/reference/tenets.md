# Tenet Format Specification

Complete specification for tenet format, AGENTS.md structure, and parsing rules.

## Contents

- AGENTS.md Structure
- Tenet Header Format
- Description Requirements
- Severity Levels
- Exception Table Format
- Inline Exception Syntax
- Parsing Rules
- Handling Malformed Files
- Validation vs Verification
- Pre-flight Checks

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

### T2. <Name>

<Description>

**Severity:** high

## Tenet Exceptions

Approved exceptions to tenets. Each must have justification.

| File | Tenet | Reason | Approved |
|------|-------|--------|----------|
| `src/legacy/adapter.go` | T1 | Legacy integration, scheduled for removal | 2024-01-15 |

[Other sections...]
```

**No evidence field.** Evidence is gathered at validation time (when adding/editing a tenet) and surfaced to the user in chat, but it is never written to AGENTS.md. The codebase is the source of truth — persisted evidence rots within weeks of any refactor.

## Tenet Header Format

```
### T<N>. <Name>
```

- `T<N>` — Sequential identifier (T1, T2, T3...)
- `<Name>` — Short descriptive name (2-5 words)
- Numbers must be sequential; gaps trigger a warning on save

## Description Requirements

- 2-4 sentences
- States WHAT the constraint is
- States WHY it exists (rationale)
- Active voice
- Specific enough to verify

**Good:** "Domain modules must not import from infrastructure packages. This keeps the domain layer portable and testable without external dependencies."

**Bad:** "Keep things separate." (vague, no rationale, not verifiable)

## Severity Levels

| Level | Meaning | When to use | Default verification behavior |
|-------|---------|-------------|------------------------------|
| `critical` | Violation breaks system invariants | Security boundaries, data integrity | Always fail |
| `high` | Violation causes significant technical debt | Core architecture decisions | Fail by default |
| `medium` | Violation reduces code quality | Best practices, conventions | Warn only |
| `low` | Guideline, not hard requirement | Preferences, suggestions | Info only |

**Default:** If severity is omitted, treat as `high`.

## Exception Table Format

```markdown
## Tenet Exceptions

| File | Tenet | Reason | Approved |
|------|-------|--------|----------|
| `<file-path>` | T<N> | <justification> | <YYYY-MM-DD> |
```

- File path is relative to repository root
- Tenet ID references the tenet being excepted
- Reason must justify why the exception is necessary
- Approved date documents when the exception was granted

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

Inline exceptions should also be registered in the Tenet Exceptions table for visibility.

## Parsing Rules

When parsing AGENTS.md:

1. **Find Tenets section** — match `## Tenets` heading
2. **Extract tenets** — match `### T<N>. <Name>` headers
3. **Parse each tenet:**
   - Next paragraph = description
   - `**Severity:**` line = severity (default: high)
4. **Find Exceptions section** — match `## Tenet Exceptions` heading
5. **Parse exception table** — extract file, tenet, reason, approved columns

## Handling Malformed Files

| Issue | Handling |
|-------|----------|
| Missing severity | Default to "high" |
| Non-sequential numbering (T1, T3) | Warn, renumber on save |
| Missing Tenets section | Error: "Run governor-bootstrap first" |
| Malformed exception table | Warn, skip malformed rows |
| Stale `**Evidence:**` block from old format | Strip on next save |

## Validation vs Verification

Two distinct operations:

**Validation** (during bootstrap/manage):
- Question: "Is this tenet grounded in reality?"
- Process: Search the codebase for evidence supporting/contradicting the tenet
- Verdicts: SUPPORTED, WEAK_EVIDENCE, NOT_SUPPORTED, CONTRADICTED
- Output: shown to the user in chat, not persisted

**Verification** (during verify):
- Question: "Does this code follow the existing tenets?"
- Process: Analyze code against tenets in AGENTS.md
- Output: COMPLIANT or VIOLATED with confidence scores

## Pre-flight Checks

All operations verify AGENTS.md exists with tenets:

```bash
test -f AGENTS.md && grep -q "^## Tenets" AGENTS.md && echo "ok" || echo "missing"
```

If the check fails, direct the user to `governor-bootstrap`.
