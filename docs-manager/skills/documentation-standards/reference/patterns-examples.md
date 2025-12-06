# Patterns Examples

Good/bad examples for writing docs/patterns.md.

## Purpose

Patterns documentation shows HOW code is written in this repository - the conventions, idioms, and examples that developers should follow. It answers: "When I need to add X, how should I write it?"

**Audience:** Developers working on the codebase (Claude-optimized context)

---

## Required Sections

### Project Structure (Required)

**Good Example:**
```markdown
## Project Structure

```
myapp/
├── cmd/                    # Application entry points
│   └── server/            # Main server binary
├── internal/              # Private application code
│   ├── api/              # HTTP handlers
│   ├── service/          # Business logic
│   └── repository/       # Data access
├── pkg/                   # Public, reusable packages
├── migrations/            # Database migrations
└── tests/                 # Integration tests
```

### Conventions
- `cmd/` contains one directory per binary
- `internal/` is for code that shouldn't be imported by other projects
- Each layer (api, service, repository) has one file per domain area
- Test files live alongside the code they test (`*_test.go`)
```

**Why it's good:**
- Shows directory structure with purpose
- Explains conventions that aren't obvious
- Helps developers know where to put new code

**Bad Example:**
```markdown
## Project Structure

- cmd/server/main.go
- internal/api/users.go
- internal/api/subscriptions.go
- internal/api/payments.go
- internal/api/webhooks.go
- internal/service/user_service.go
- internal/service/subscription_service.go
...
```

**Why it's bad:**
- Lists every file instead of explaining patterns
- Will become outdated as files are added
- No insight into conventions

---

### Naming Conventions (Required)

**Good Example:**
```markdown
## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | snake_case | `user_service.go`, `payment_handler.ts` |
| Functions | camelCase | `getUserById`, `processPayment` |
| Types/Structs | PascalCase | `UserService`, `PaymentRequest` |
| Constants | SCREAMING_SNAKE | `MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT` |
| Database tables | snake_case, plural | `users`, `subscription_plans` |
| API endpoints | kebab-case, plural | `/api/v1/users`, `/api/v1/subscription-plans` |

### Specific Patterns
- Handlers end with `Handler`: `CreateUserHandler`, `GetPaymentHandler`
- Services end with `Service`: `UserService`, `PaymentService`
- Repositories end with `Repository`: `UserRepository`
- DTOs end with `Request`/`Response`: `CreateUserRequest`, `UserResponse`
```

**Why it's good:**
- Clear table format for quick reference
- Covers different contexts (files, code, database, API)
- Includes specific suffix conventions

**Bad Example:**
```markdown
## Naming Conventions

Use good names. Names should be descriptive and follow Go/JavaScript conventions.
```

**Why it's bad:**
- Too vague to be useful
- Doesn't capture project-specific conventions
- No examples

---

## Optional Sections

### Error Handling (Include when consistent pattern exists)

**Good Example:**
```markdown
## Error Handling

Errors are wrapped with context at each layer and include operation details.

### Pattern
```go
// From internal/service/user_service.go:45
func (s *UserService) GetUser(ctx context.Context, id string) (*User, error) {
    user, err := s.repo.FindByID(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("get user %s: %w", id, err)
    }
    return user, nil
}
```

### Guidelines
- Always wrap errors with `fmt.Errorf("operation: %w", err)`
- Include identifying information (IDs, names) in error context
- Use sentinel errors for expected conditions: `ErrNotFound`, `ErrUnauthorized`
- Don't log and return - do one or the other

### Error Types
```go
var (
    ErrNotFound     = errors.New("not found")
    ErrUnauthorized = errors.New("unauthorized")
    ErrValidation   = errors.New("validation failed")
)
```
```

**Why it's good:**
- Shows actual code from the codebase
- Includes file:line reference
- Provides clear guidelines
- Shows project-specific error types

**Bad Example:**
```markdown
## Error Handling

We handle errors properly. See the Go error handling documentation for best practices.
```

**Why it's bad:**
- No project-specific guidance
- No examples from the codebase
- Links to external docs instead of showing local patterns

**When to skip:** Error handling follows standard language idioms with no project-specific patterns.

---

### Testing Patterns (Include when tests exist with consistent approach)

**Good Example:**
```markdown
## Testing Patterns

Tests use table-driven tests with parallel execution.

### Unit Test Pattern
```go
// From internal/service/user_service_test.go:23
func TestUserService_GetUser(t *testing.T) {
    tests := []struct {
        name    string
        userID  string
        want    *User
        wantErr error
    }{
        {
            name:   "existing user",
            userID: "user-123",
            want:   &User{ID: "user-123", Name: "Test User"},
        },
        {
            name:    "non-existent user",
            userID:  "unknown",
            wantErr: ErrNotFound,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            t.Parallel()
            // test implementation
        })
    }
}
```

### Guidelines
- Use table-driven tests for multiple cases
- Run subtests in parallel with `t.Parallel()`
- Name test cases descriptively: "existing user", not "test1"
- Use testify/assert for assertions
- Mock external dependencies using interfaces

### Test File Organization
- Unit tests: `*_test.go` alongside source files
- Integration tests: `tests/integration/`
- Fixtures: `testdata/` directories
```

**Why it's good:**
- Shows actual test pattern from codebase
- Clear guidelines for consistency
- Explains organization

**When to skip:** No tests, or tests don't follow a consistent pattern.

---

### Common Patterns (Include when repeating patterns exist)

**Good Example:**
```markdown
## Common Patterns

### Repository Pattern
All data access goes through repository interfaces:

```go
// From internal/repository/interfaces.go:12
type UserRepository interface {
    FindByID(ctx context.Context, id string) (*User, error)
    FindByEmail(ctx context.Context, email string) (*User, error)
    Create(ctx context.Context, user *User) error
    Update(ctx context.Context, user *User) error
}
```

Implementation lives in `internal/repository/postgres/`.

### Request Validation
API handlers validate requests using struct tags:

```go
// From internal/api/users.go:15
type CreateUserRequest struct {
    Email    string `json:"email" validate:"required,email"`
    Name     string `json:"name" validate:"required,min=2,max=100"`
    Password string `json:"password" validate:"required,min=8"`
}
```

Validation runs automatically via middleware.

### Dependency Injection
Services receive dependencies via constructor injection:

```go
// From internal/service/user_service.go:12
func NewUserService(repo UserRepository, emailer Emailer) *UserService {
    return &UserService{
        repo:    repo,
        emailer: emailer,
    }
}
```

This enables easy testing with mock implementations.
```

**Why it's good:**
- Each pattern has a clear example
- Shows WHERE patterns are used
- Explains WHY (enables testing, automatic validation)

**When to skip:** No significant repeating patterns beyond standard language idioms.

---

## Common Mistakes

### Mistake 1: Generic Advice

**Wrong:**
```markdown
## Error Handling

Follow best practices for error handling. Use try/catch appropriately.
```

**Right:** Show YOUR project's specific patterns with real examples

### Mistake 2: No File References

**Wrong:** Code examples without indicating where they come from

**Right:** Include `// From filepath:line` comments so developers can find full context

### Mistake 3: Outdated Examples

**Wrong:** Examples that no longer match the codebase

**Right:** Use examples from stable, representative code. If examples need frequent updates, the abstraction level is wrong.

### Mistake 4: Every Possible Pattern

**Wrong:** Documenting every function and pattern in the codebase

**Right:** Focus on patterns that:
- Repeat throughout the codebase
- Aren't obvious from reading one file
- Developers need to follow for consistency

### Mistake 5: Missing the "Why"

**Wrong:**
```markdown
We use the repository pattern.
```

**Right:**
```markdown
We use the repository pattern to enable testing services without database dependencies. Services receive repository interfaces, and tests provide mock implementations.
```
