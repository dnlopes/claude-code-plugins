# Examples

Concrete examples of tenets, AGENTS.md structure, and verification output.

## Good vs Bad Tenets

### Good Tenets

**T1. Domain Isolation**
> Domain packages must not import from infrastructure packages. This ensures the domain layer remains portable, testable, and free from external dependencies like databases or HTTP frameworks.

Why it's good:
- Specific: "Domain packages" and "infrastructure packages" are identifiable
- Actionable: "must not import" is verifiable
- Rationale included: explains WHY (portability, testability)
- Architectural: about structure, not style

**T2. Handler Delegation**
> HTTP handlers must delegate business logic to service layer functions. Handlers should only handle request parsing, response formatting, and error translation.

Why it's good:
- Clear boundary: handlers vs service layer
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
- Too vague - what is "clean"?
- Not verifiable
- No specific constraint

**Bad: "Use good naming conventions"**
- Subjective - what is "good"?
- No specific pattern to check
- Style, not architecture

**Bad: "Don't write bad code"**
- Completely subjective
- Impossible to verify
- No actionable guidance

**Bad: "Services should be small"**
- How small? No threshold
- What is a "service"?
- Vague and unverifiable

### Borderline Tenets

**"Functions should be under 50 lines"**
- Verifiable but better as linting rule
- Style rather than architecture
- Machine-checkable, doesn't need human judgment

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

Domain packages (`internal/domain/`) must not import from infrastructure packages (`internal/infrastructure/`). This ensures the domain layer remains portable and testable without external dependencies.

**Severity:** critical

**Evidence:**
- `internal/domain/order/order.go:1` - No infrastructure imports in package header
- `internal/domain/user/user.go:1` - Pure domain types with no DB dependencies
- `internal/domain/product/repository.go:5` - Repository interface defined in domain

### T2. Handler Delegation

HTTP handlers in `internal/api/` must delegate business logic to service layer functions. Handlers should only perform request parsing, response formatting, and error translation.

**Severity:** high

**Evidence:**
- `internal/api/orders.go:25` - Handler calls `orderService.Create()` for logic
- `internal/api/users.go:18` - Handler validates input then delegates to service
- `internal/api/products.go:42` - No SQL or business rules in handler

### T3. Error Wrapping

All errors returned from internal packages must be wrapped with context using `fmt.Errorf("context: %w", err)`. This ensures error chains are traceable to their origin.

**Severity:** medium

**Evidence:**
- `internal/domain/order/service.go:67` - Errors wrapped with operation context
- `internal/infrastructure/postgres/repository.go:34` - DB errors wrapped with query context

## Tenet Exceptions

Approved exceptions to tenets. Each must have justification.

| File | Tenet | Reason | Approved |
|------|-------|--------|----------|
| `internal/domain/legacy/adapter.go` | T1 | Legacy integration layer, scheduled for removal in Q3 | 2024-01-15 |
| `internal/api/health.go` | T2 | Health check endpoint has no business logic to delegate | 2024-02-01 |

## Development

See docs/development.md for setup instructions.
```

## Example Verification Output

### Human Output - Compliant

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

### Human Output - Violations Found

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

Exit: FAIL (2 violations at severity >= critical)
```

### JSON Output

```json
{
  "summary": {
    "compliant": false,
    "files_checked": 12,
    "violations": 2,
    "exceptions_applied": 1
  },
  "options": {
    "mode": "changed",
    "base": "main",
    "confidence_threshold": 50,
    "severity_minimum": "low"
  },
  "tenets": [
    {
      "id": "T1",
      "name": "Domain Isolation",
      "severity": "critical",
      "status": "violated",
      "violations": [
        {
          "file": "internal/domain/order/service.go",
          "line": 45,
          "confidence": 95,
          "reason": "Imports \"internal/infrastructure/postgres\"",
          "exception": null
        },
        {
          "file": "internal/domain/user/validator.go",
          "line": 12,
          "confidence": 88,
          "reason": "Imports \"internal/infrastructure/cache\"",
          "exception": null
        }
      ]
    },
    {
      "id": "T2",
      "name": "Handler Delegation",
      "severity": "high",
      "status": "compliant",
      "violations": []
    },
    {
      "id": "T3",
      "name": "Error Wrapping",
      "severity": "medium",
      "status": "exception",
      "violations": [
        {
          "file": "internal/domain/legacy/adapter.go",
          "line": 78,
          "confidence": 82,
          "reason": "Error not wrapped with context",
          "exception": {
            "reason": "Legacy integration layer",
            "approved": "2024-01-15"
          }
        }
      ]
    }
  ],
  "exceptions": [
    {
      "file": "internal/domain/legacy/adapter.go",
      "tenet": "T1",
      "reason": "Legacy integration layer, scheduled for removal in Q3",
      "approved": "2024-01-15"
    },
    {
      "file": "internal/api/health.go",
      "tenet": "T2",
      "reason": "Health check endpoint has no business logic to delegate",
      "approved": "2024-02-01"
    }
  ],
  "exit_code": 1
}
```

## Example Validation Output (Setup/Manage)

When validating a new or edited tenet:

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
Evidence strength: Weak (pattern exists but not consistently applied)

Recommendation: This appears to be partially implemented. Consider:
1. Documenting which entities use event sourcing
2. Narrowing the tenet scope to specific domains
3. Marking as aspirational (severity: low)
```

### Not Supported

```
Validating: T6. CQRS Pattern

Searching for evidence...
  ✗ No separate read/write models found
  ✗ Single repository per entity
  ✗ No query handlers distinct from command handlers

Verdict: NOT_SUPPORTED
Evidence strength: None (pattern not found in codebase)

Recommendation: This tenet is aspirational, not descriptive. Options:
1. Remove (doesn't reflect current architecture)
2. Keep as goal with severity: low
3. Implement CQRS first, then add tenet
```

### Contradicted

```
Validating: T7. No Direct DB Access in Domain

Searching for evidence...
  ✗ Found 5 direct SQL queries in domain packages
  ✗ Found database/sql imports in 3 domain files
  ✓ Repository interfaces exist but implementations in domain

Verdict: CONTRADICTED
Evidence strength: Counter-evidence found

The codebase actively violates this proposed tenet.
This is NOT a valid tenet for the current architecture.

Options:
1. Fix violations first, then add tenet
2. Adjust tenet to match reality
3. Add as aspirational with plan to refactor
```
