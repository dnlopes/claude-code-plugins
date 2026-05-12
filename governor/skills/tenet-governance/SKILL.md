---
name: tenet-governance
description: Shared reference for tenet format, severity levels, validation criteria, and verification patterns. Loaded by governor-bootstrap, governor-manage, and governor-verify. Not user-invocable.
user-invocable: false
---

# Tenet Governance

Shared reference for the governor plugin. The three user-invocable skills (`governor-bootstrap`, `governor-manage`, `governor-verify`) load this for the tenet format spec and shared vocabulary.

## What tenets are

**Tenets** are architectural constraints that require human judgment to verify. They are not linting rules.

| Tenets | Linting Rules |
|--------|---------------|
| Architectural boundaries | Code style |
| "Domain must not import infrastructure" | "Use 2-space indentation" |
| Require judgment to verify | Machine-checkable |
| Few (3-7 per project) | Many (hundreds) |
| Project-specific decisions | Industry conventions |

## Tenet format in AGENTS.md

```markdown
## Tenets

CRITICAL: These tenets are MANDATORY and MUST be followed in all work on this codebase.

### T1. <Name>

<Description: 2-4 sentences explaining the constraint and rationale>

**Severity:** <critical | high | medium | low>

### T2. <Name>

<Description>

**Severity:** high

## Tenet Exceptions

Approved exceptions. Each must have justification.

| File | Tenet | Reason | Approved |
|------|-------|--------|----------|
| `src/legacy/adapter.go` | T1 | Legacy integration | 2024-01-15 |
```

**No evidence section.** Evidence is gathered at validation time and shown to the user for review, but never persisted. Persisted evidence rots quickly and provides little benefit — the codebase is the source of truth.

## Severity levels

| Level | Meaning | Default verification behavior |
|-------|---------|------------------------------|
| critical | Breaks system invariants | Always fail |
| high | Causes significant tech debt | Fail by default |
| medium | Reduces code quality | Warn by default |
| low | Guideline, not requirement | Info only |

Default if severity is omitted: `high`.

## Exception syntax

**Table (AGENTS.md):** See format above.

**Inline (in code):**
```
// governor:ignore T1 - Legacy adapter, tracking in #123
```

Language-specific comment syntax:
- Go/Java/C#/JS/TS: `// governor:ignore T1 - reason`
- Python: `# governor:ignore T1 - reason`
- HTML: `<!-- governor:ignore T1 - reason -->`
- CSS: `/* governor:ignore T1 - reason */`

## Two distinct operations

**Validation** (bootstrap/manage): "Is this proposed tenet grounded in reality?"
- Search the codebase for supporting/contradicting patterns
- Verdicts: SUPPORTED, WEAK_EVIDENCE, NOT_SUPPORTED, CONTRADICTED
- Run at add-time, and re-run on demand from the manage skill
- Findings are shown to the user, never written to AGENTS.md

**Verification** (verify): "Does this code follow the existing tenets?"
- Analyze code against tenets in AGENTS.md
- Output: COMPLIANT or VIOLATED with confidence scores

## Confidence scoring (verification)

| Score | Criteria | Example |
|-------|----------|---------|
| 90-100 | Explicit violation | Forbidden import present |
| 70-89 | Likely violation | Strong pattern match |
| 50-69 | Possible violation | Ambiguous code |
| 1-49 | Uncertain | Probably false positive |

## Good tenet characteristics

1. **Actionable** — "X must/must not Y" format
2. **Grounded** — A pattern actually present (or absent) in the codebase, not aspirational
3. **Architectural** — About structure, not style
4. **Persistent** — Unlikely to change frequently
5. **Verifiable** — Compliance determinable with reasonable effort

## Parsing rules

When parsing AGENTS.md:

1. Match `## Tenets` heading
2. Extract tenets matching `### T<N>. <Name>` headers
3. Per tenet:
   - Next paragraph = description
   - `**Severity:**` line = severity (default: high)
4. Match `## Tenet Exceptions` heading
5. Parse exception table rows: file, tenet, reason, approved

**Pre-flight check** (all operations):
```bash
test -f AGENTS.md && grep -q "^## Tenets" AGENTS.md && echo "ok" || echo "missing"
```

If missing, direct the user to run the bootstrap skill.

## Reference documentation

- **[Tenet Format](reference/tenets.md)** — Full format spec, parsing edge cases, malformed-file handling
- **[Verification Patterns](reference/verification-patterns.md)** — Language-specific detection patterns
- **[Examples](reference/examples.md)** — Good/bad tenets, example AGENTS.md, validation output samples
