---
name: test-driven-development
description: Use this skill when implementing new features, fixing bugs, or writing tests. It provides the TDD process, testing philosophy, and rules for mocking and test output.
---

# Test Driven Development

Standards for test-driven development, testing philosophy, and test quality.

## The TDD Process

For EVERY new feature or bugfix, follow this cycle:

1. **Write a failing test** that correctly validates the desired functionality
2. **Run the test** to confirm it fails as expected
3. **Write ONLY enough code** to make the failing test pass
4. **Run the test** to confirm success
5. **Refactor if needed** while keeping tests green

## Testing Philosophy

### Ownership

- ALL test failures are YOUR responsibility, even if they're not your fault
- The Broken Windows theory is real - fix failing tests immediately
- Never delete a test because it's failing - raise the issue instead

### Coverage

- Tests MUST comprehensively cover ALL functionality
- Every code path should have corresponding test coverage

## Mocking Rules

### What NOT to Mock

- NEVER write tests that "test" mocked behavior - tests should test real logic
- NEVER implement mocks in end-to-end tests - always use real data and real APIs

### When Mocking is Appropriate

- External services that are slow, unreliable, or costly to call
- Third-party APIs outside your control
- System boundaries (file system, network, time)

### Warning Signs

If you notice tests that test mocked behavior instead of real logic, this is a problem that needs to be raised and addressed.

## Test Output Standards

### Pristine Output

- Test output MUST BE PRISTINE TO PASS
- Never ignore system or test output - logs and messages often contain CRITICAL information

### Error Handling in Tests

- If logs are expected to contain errors, these MUST be captured and tested
- If a test is intentionally triggering an error, you MUST capture and validate that the error output is as expected

### What to Watch For

- Unexpected warnings or deprecation notices
- Error messages that indicate real problems
- Stack traces in otherwise passing tests
