# Examples

Concrete examples of tenets, AGENTS.md structure, and validation/verification output.

## Contents

- Good vs Bad Tenets (good, bad, borderline)
- Example AGENTS.md
- Example Verification Output (compliant, violations)
- Example Validation Output (supported, weak, not supported, contradicted)

## Good vs Bad Tenets

### Good Tenets

**T1. Domain Isolation**
> Domain packages must not import from infrastructure packages. This ensures the domain layer remains portable, testable, and free from external dependencies like databases or HTTP frameworks.

Why it's good:
- Specific — "Domain packages" and "infrastructure packages" are identifiable
- Actionable — "must not import" is verifiable
- Rationale included — explains WHY (portability, testability)
- Architectural — about structure, not style

**T2. Handler Delegation**
> HTTP handlers must delegate business logic to service layer functions. Handlers should only handle request parsing, response formatting, and error translation.

Why it's good:
- Clear boundary between handlers and service layer
- Specific responsibilities listed
- Verifiable by checking handler code content

**T3. Repository Pattern**
> Data access must go through repository interfaces defined in the domain layer. Concrete implementations live in infrastructure and are injected at startup.

Why it's good:
- Specifies WHERE interfaces live (domain)
- Specifies WHERE implementations live (infrastructure)
- Specifies HOW they connect (injection)

### Bad Tenets

**Bad: "Keep code clean"**
- Vague — what is "clean"?
- Not verifiable
- No specific constraint

**Bad: "Use good naming conventions"**
- Subjective — what is "good"?
- No specific pattern to check
- Style, not architecture

**Bad: "Don't write bad code"**
- Completely subjective
- Impossible to verify

**Bad: "Services should be small"**
- How small? No threshold
- What is a "service"?

### Borderline Tenets

**"Functions should be under 50 lines"**
- Verifiable, but a better fit as a linting rule
- Style rather than architecture
- Machine-checkable; doesn't need human judgment

**Better version:** "Complex business logic must be decomposed into named steps. Functions containing more than 3 distinct operations should be split into smaller, well-named functions that document intent."

## Example AGENTS.md

```markdown
# E-Commerce Platform

A scalable e-commerce backend built with Go.

## Quick Start

```bash
make run
```

## Tenets

CRITICAL: These tenets are MANDATORY and MUST be followed in all work on this codebase.

### T1. Domain Isolation

Domain packages (`internal/domain/`) must not import from infrastructure packages (`internal/infrastructure/`). This keeps the domain layer portable and testable without external dependencies.

**Severity:** critical

### T2. Handler Delegation

HTTP handlers in `internal/api/` must delegate business logic to service layer functions. Handlers should only perform request parsing, response formatting, and error translation.

**Severity:** high

### T3. Error Wrapping

All errors returned from internal packages must be wrapped with context using `fmt.Errorf("context: %w", err)`. This makes error chains traceable to their origin.

**Severity:** medium

## Tenet Exceptions

Approved exceptions to tenets. Each must have justification.

| File | Tenet | Reason | Approved |
|------|-------|--------|----------|
| `internal/domain/legacy/adapter.go` | T1 | Legacy integration layer, scheduled for removal in Q3 | 2024-01-15 |
| `internal/api/health.go` | T2 | Health check endpoint has no business logic to delegate | 2024-02-01 |

## Development

See docs/development.md for setup instructions.
```

Note: no `**Evidence:**` block per tenet. Evidence is gathered at validation time and shown to the user, but never persisted.

## Example Verification Output

### Compliant

```
✓ Tenet Verification Passed

Scope: 12 files (changed vs main)
Tenets checked: 3 (severity >= low)
Confidence threshold: 50%

─────────────────────────────────────
T1. Domain Isolation [critical]
   ✓ COMPLIANT
─────────────────────────────────────
T2. Handler Delegation [high]
   ✓ COMPLIANT
─────────────────────────────────────
T3. Error Wrapping [medium]
   ✓ COMPLIANT
─────────────────────────────────────
```

### Violations Found

```
✗ Tenet Verification Failed

Scope: 12 files (changed vs main)
Found 2 violations across 1 tenet

─────────────────────────────────────
T1. Domain Isolation [critical]
   ✗ VIOLATED (2 violations)

   • internal/domain/order/service.go:45 (95%)
     Imports "internal/infrastructure/postgres"

   • internal/domain/user/validator.go:12 (88%)
     Imports "internal/infrastructure/cache"

─────────────────────────────────────
T2. Handler Delegation [high]
   ✓ COMPLIANT
─────────────────────────────────────
T3. Error Wrapping [medium]
   ⚠ EXCEPTION (1 approved)

   • internal/domain/legacy/adapter.go:78
     Exception: Legacy integration layer (#Q3-removal)
─────────────────────────────────────

Result: FAIL (2 violations at severity >= critical)
```

Note: verification reports file:line refs for the violations it finds at runtime. That's runtime evidence, distinct from persisted evidence (which we don't store).

## Example Validation Output (Bootstrap / Manage)

When validating a proposed or edited tenet:

### Supported

```
Validating: T4. Interface Segregation

Searching for evidence...
  ✓ Found 8 interface definitions averaging 3 methods
  ✓ Found 12 implementations, each implementing 1-2 interfaces
  ✓ No "god interfaces" (>10 methods) found

Verdict: SUPPORTED
Evidence strength: Strong (consistent pattern across codebase)
```

### Weak Evidence

```
Validating: T5. Event Sourcing

Searching for evidence...
  ~ Found 2 event types in internal/domain/events/
  ~ Found 1 event store implementation
  ✗ Most entities use direct state mutation

Verdict: WEAK_EVIDENCE
Evidence strength: Weak (pattern exists but inconsistent)

Recommendation: Partially implemented. Options:
1. Narrow the tenet scope to specific domains
2. Mark as aspirational (severity: low)
3. Drop the tenet
```

### Not Supported

```
Validating: T6. CQRS Pattern

Searching for evidence...
  ✗ No separate read/write models found
  ✗ Single repository per entity
  ✗ No query handlers distinct from command handlers

Verdict: NOT_SUPPORTED
Evidence strength: None (pattern not found)

Recommendation: This tenet is aspirational, not descriptive. Options:
1. Drop it (doesn't reflect current architecture)
2. Keep with severity: low as a goal
3. Implement CQRS first, then add the tenet
```

### Contradicted

```
Validating: T7. No Direct DB Access in Domain

Searching for evidence...
  ✗ Found 5 direct SQL queries in domain packages
  ✗ Found database/sql imports in 3 domain files
  ✓ Repository interfaces exist but implementations also in domain

Verdict: CONTRADICTED
Evidence strength: Counter-evidence found

The codebase actively violates this proposed tenet.

Options:
1. Fix violations first, then add the tenet
2. Adjust the tenet to match reality
3. Add as aspirational with a plan to refactor
```
