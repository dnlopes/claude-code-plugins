---
name: tenet-governance
description: Use when working with architectural tenets - project constraints that require human judgment to verify. This skill provides guidance on tenet format, severity levels, validation criteria, and verification patterns. Load when setting up, managing, or verifying tenets in AGENTS.md.
user-invocable: false
---

# Tenet Governance

Guidance for managing architectural tenets - constraints that must be followed in all work on a codebase.

## Overview

**Tenets** are architectural constraints that require human judgment to verify. They differ from linting rules:

| Tenets | Linting Rules |
|--------|---------------|
| Architectural boundaries | Code style |
| "Domain must not import infrastructure" | "Use 2-space indentation" |
| Require judgment to verify | Machine-checkable |
| Few (3-7 per project) | Many (hundreds) |
| Project-specific decisions | Industry conventions |

## Quick Reference

### Tenet Format

```markdown
### T<N>. <Name>

<Description: 2-4 sentences explaining constraint and rationale>

**Severity:** <critical | high | medium | low>

**Evidence:**
- `<file:line>` - <observation>
```

### Severity Levels

| Level | Meaning | Verification Behavior |
|-------|---------|----------------------|
| critical | Breaks system invariants | Always fail |
| high | Causes significant tech debt | Fail by default |
| medium | Reduces code quality | Warn by default |
| low | Guideline, not requirement | Info only |

### Exception Syntax

**Table (in AGENTS.md):**
```markdown
## Tenet Exceptions

| File | Tenet | Reason | Approved |
|------|-------|--------|----------|
| `src/legacy/adapter.go` | T1 | Legacy integration | 2024-01-15 |
```

**Inline (in code):**
```go
// governor:ignore T1 - Legacy adapter, tracking in #123
import "infrastructure/db"
```

## Two Operations

**Validation** (setup/manage): Is this tenet grounded in reality?
- Search codebase for evidence supporting the tenet
- Output: SUPPORTED, WEAK_EVIDENCE, NOT_SUPPORTED, CONTRADICTED

**Verification** (verify): Does this code follow the tenets?
- Analyze code against existing tenets
- Output: COMPLIANT or VIOLATED with confidence scores

## Confidence Scoring

| Score | Criteria | Example |
|-------|----------|---------|
| 90-100 | Explicit violation | Forbidden import present |
| 70-89 | Likely violation | Pattern suggests violation |
| 50-69 | Possible violation | Ambiguous code |
| 1-49 | Uncertain | Probably false positive |

## Good Tenet Characteristics

1. **Actionable**: "X must/must not Y" format
2. **Evidence-based**: Grounded in actual codebase patterns
3. **Architectural**: About structure, not style
4. **Persistent**: Unlikely to change frequently
5. **Verifiable**: Can determine compliance with reasonable effort

## Reference Documentation

For detailed specifications and examples:

- **[Tenet Format Specification](reference/tenets.md)**: Complete format, parsing rules, AGENTS.md structure
- **[Verification Patterns](reference/verification-patterns.md)**: Language-specific detection patterns
- **[Examples](reference/examples.md)**: Good/bad tenets, example AGENTS.md, sample output
