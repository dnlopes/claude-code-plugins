# Test Coverage Checklist

Binary evaluation checklist for test coverage review. Mark each applicable item as passed or failed with evidence.

## Coverage Requirements

- [ ] **Public Methods Tested**: Every public method has at least one test
- [ ] **Happy Path Coverage**: All success scenarios have explicit tests
- [ ] **Error Path Coverage**: All error conditions have explicit tests
- [ ] **Boundary Testing**: Min/max/empty values tested for inputs
- [ ] **Null/Undefined Testing**: Optional parameters tested with null/undefined
- [ ] **Integration Tests**: External service calls have integration tests

## Test Quality

- [ ] **Behavior over Implementation**: Tests verify outcomes, not internals
- [ ] **Test Independence**: Tests can run in isolation, any order
- [ ] **Meaningful Assertions**: Tests verify specific values, not just "not null"
- [ ] **Descriptive Names**: Test names describe scenario and expected outcome
- [ ] **No Hardcoded Data**: Test data uses factories/builders
- [ ] **Mocking Boundaries**: External deps mocked, internal logic not mocked

## Critical Gap Identification

Focus on missing tests for:

1. **Error handling** - Silent failures, exception paths
2. **Edge cases** - Boundary conditions, empty inputs
3. **Business logic** - Core domain rules
4. **Validation** - Input validation logic
5. **Async behavior** - Race conditions, timing issues

## Criticality Rating

| Level | Criteria |
|-------|----------|
| Critical | Data loss, security issues, system failures if untested |
| Important | User-facing errors if untested |
| Medium | Edge case issues, confusion |
| Low | Completeness, nice-to-have |
| Optional | Minor improvements |

## Anti-Patterns to Flag

- Tests coupled to implementation details
- Tests that pass regardless of behavior
- Tests with no assertions
- Tests that depend on other tests
- Flaky tests with timing dependencies
- Over-mocking that hides real integration issues
