# Go Testing Guidelines

This document provides comprehensive testing standards and best practices for writing maintainable, effective tests in Go.

## Testing Philosophy

Write comprehensive, maintainable tests that ensure code quality and prevent regressions. Focus on testing behavior, not implementation details.

## Test Coverage

- Write tests that cover both happy paths and edge cases
- Test error conditions and boundary values
- Aim for meaningful coverage, not just high percentages
- Focus on testing behavior, not implementation details

## Test Organization

### Table-Driven Tests

**Use table-driven tests** for better organization and readability. This pattern allows you to:
- Group related test cases in a single test function with subtests
- Name test cases descriptively to document expected behavior
- Easily add new test cases without duplicating test logic
- Run specific test cases using `-run` flag

**Example structure**:

```go
func TestFunctionName(t *testing.T) {
    tests := []struct {
        name     string
        input    InputType
        want     OutputType
        wantErr  bool
    }{
        {
            name:    "successful case with valid input",
            input:   validInput,
            want:    expectedOutput,
            wantErr: false,
        },
        {
            name:    "error case with invalid input",
            input:   invalidInput,
            want:    zeroValue,
            wantErr: true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := FunctionName(tt.input)
            if (err != nil) != tt.wantErr {
                t.Errorf("FunctionName() error = %v, wantErr %v", err, tt.wantErr)
                return
            }
            assert.Equal(t, tt.want, got)
        })
    }
}
```

### Test Naming

- Test function names should be clear and descriptive: `TestFunctionName`
- Subtest names (in table-driven tests) should describe the scenario being tested
- Use descriptive names that explain what is being tested and expected outcome

## Assertions

### Using Assertion Libraries

**Use assertion libraries** (like `testify/assert`) for clarity and better error messages:

```go
import "github.com/stretchr/testify/assert"

assert.NoError(t, err, "operation should not error")
assert.Equal(t, expected, actual, "values should match")
assert.True(t, condition, "condition should be true")
assert.Len(t, slice, 3, "should have exactly 3 elements")
assert.NotNil(t, obj, "object should not be nil")
assert.Contains(t, slice, item, "slice should contain item")
```

### Without Assertion Libraries

If not using an assertion library, follow these patterns:

```go
// Check for unexpected errors
if err != nil {
    t.Fatalf("unexpected error: %v", err)
}

// Compare values
if got != want {
    t.Errorf("got %v, want %v", got, want)
}

// Check error expectations
if err == nil {
    t.Error("expected error, got nil")
}

// Verify conditions
if !condition {
    t.Error("expected condition to be true")
}
```

### Best Practices for Assertions

- Provide descriptive assertion messages when failures need context
- Prefer explicit assertion methods over manual comparisons
- Use dedicated methods for error checking (`NoError`, `Error`)
- Use `t.Fatalf()` for fatal errors that prevent further test execution
- Use `t.Errorf()` for non-fatal errors to see all failures in a test

## Test Types and Organization

### Unit Tests

Test individual functions and methods in isolation:

- **Use mocks/stubs** for external dependencies
- **Focus on single units** of functionality
- **Fast execution** (milliseconds)
- **No external service dependencies**

**Example**: Testing a service function with mocked repository:

```go
func TestUserService_CreateUser(t *testing.T) {
    mockRepo := &MockUserRepository{}
    service := NewUserService(mockRepo)

    // Test the service logic in isolation
    user, err := service.CreateUser(context.Background(), userData)
    assert.NoError(t, err)
    assert.NotNil(t, user)
}
```

### Integration Tests

Test multiple components working together:

- **May use real database connections** or external services
- **Test actual integration points** and workflows
- **Slower execution** (seconds)
- **Often use test containers** or local services

**Example**: Testing database integration:

```go
//go:build integration
// +build integration

func TestUserRepository_Integration(t *testing.T) {
    db := setupTestDatabase(t)
    defer db.Close()

    repo := NewUserRepository(db)

    // Test actual database operations
    user, err := repo.Create(context.Background(), userData)
    assert.NoError(t, err)

    retrieved, err := repo.GetByID(context.Background(), user.ID)
    assert.NoError(t, err)
    assert.Equal(t, user.Email, retrieved.Email)
}
```

### Separating Test Types with Build Tags

**Consider using build tags** to separate test types:

```go
//go:build integration
// +build integration

package mypackage_test
```

Run different test types separately:
- Unit tests: `go test ./...`
- Integration tests: `go test -tags=integration ./...`
- All tests: `go test -tags=integration ./...`

## Mocking and Test Doubles

### Creating Mocks

For interfaces, create mock implementations:

```go
type MockUserRepository struct {
    CreateFunc func(ctx context.Context, user *User) error
    GetFunc    func(ctx context.Context, id string) (*User, error)
}

func (m *MockUserRepository) Create(ctx context.Context, user *User) error {
    if m.CreateFunc != nil {
        return m.CreateFunc(ctx, user)
    }
    return nil
}

func (m *MockUserRepository) Get(ctx context.Context, id string) (*User, error) {
    if m.GetFunc != nil {
        return m.GetFunc(ctx, id)
    }
    return nil, nil
}
```

### Using Mocking Libraries

Consider using mocking libraries for complex interfaces:
- `github.com/stretchr/testify/mock` - Popular mocking framework
- `github.com/golang/mock/gomock` - Official Go mocking library

## Test Setup and Teardown

### Test Helpers

Create helper functions for common setup:

```go
func setupTest(t *testing.T) (*Service, func()) {
    t.Helper()

    // Setup
    service := NewService(/* dependencies */)

    // Return cleanup function
    cleanup := func() {
        // Teardown code
    }

    return service, cleanup
}

func TestSomething(t *testing.T) {
    service, cleanup := setupTest(t)
    defer cleanup()

    // Test code
}
```

### Table Test Setup

For table-driven tests, use setup functions when needed:

```go
func TestWithSetup(t *testing.T) {
    tests := []struct {
        name  string
        setup func(t *testing.T) *Service
        // other fields
    }{
        {
            name: "test case 1",
            setup: func(t *testing.T) *Service {
                return NewService(/* specific config */)
            },
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            service := tt.setup(t)
            // test code
        })
    }
}
```

## Testing Best Practices

1. **Test behavior, not implementation**: Tests should verify outcomes, not internal mechanics
2. **Keep tests independent**: Each test should run in isolation without depending on others
3. **Use meaningful test data**: Test values should be realistic and representative
4. **Test edge cases**: Include boundary values, empty inputs, nil values
5. **Test error paths**: Verify error handling and error messages
6. **Keep tests maintainable**: Refactor tests as you refactor code
7. **Use t.Helper()**: Mark helper functions with `t.Helper()` for better error reporting
8. **Run tests frequently**: Run tests during development, not just before commits
9. **Keep tests fast**: Slow tests discourage frequent running
10. **Document complex test scenarios**: Add comments explaining non-obvious test setups

## Common Testing Patterns

### Testing with Context

```go
func TestWithContext(t *testing.T) {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    result, err := service.DoSomething(ctx)
    assert.NoError(t, err)
}
```

### Testing Concurrent Code

```go
func TestConcurrency(t *testing.T) {
    var wg sync.WaitGroup
    errors := make(chan error, 10)

    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            if err := service.DoWork(); err != nil {
                errors <- err
            }
        }()
    }

    wg.Wait()
    close(errors)

    for err := range errors {
        t.Errorf("concurrent operation failed: %v", err)
    }
}
```

### Testing Time-Dependent Code

Use time interfaces or dependency injection:

```go
type Clock interface {
    Now() time.Time
}

// In tests, use a fake clock
type FakeClock struct {
    current time.Time
}

func (f *FakeClock) Now() time.Time {
    return f.current
}
```

## Test Coverage Analysis

Run coverage analysis to identify untested code:

```bash
# Generate coverage report
go test -coverprofile=coverage.out ./...

# View coverage in browser
go tool cover -html=coverage.out

# Show coverage percentage
go test -cover ./...
```

Focus coverage efforts on:
- Critical business logic
- Complex algorithms
- Error handling paths
- Edge cases and boundary conditions
