# Go Core Principles and Development Guidelines

This document provides comprehensive Go development standards and best practices based on Go proverbs, SOLID principles, and industry-standard design approaches.

## Go Proverbs

Follow these core Go philosophy principles when writing code:

### Communication and Concurrency

- **Don't communicate by sharing memory, share memory by communicating**: Use channels to pass data between goroutines instead of shared variables.
- **Concurrency is not parallelism**: Concurrency structures code; parallelism executes multiple computations simultaneously.
- **Channels orchestrate; mutexes serialize**: Channels coordinate goroutines; mutexes protect shared state access.

### Design and Abstraction

- **The bigger the interface, the weaker the abstraction**: Small interfaces with fewer methods are more flexible and powerful. Prefer small, focused interfaces (ideally 1-3 methods).
- **Make the zero value useful**: Design types so their zero value is ready to use without initialization.
- **interface{} says nothing**: Empty interfaces provide no type information or guarantees about behavior. Use specific types or generic constraints instead.

### Code Quality

- **Gofmt's style is no one's favorite, yet gofmt is everyone's favorite**: Consistent formatting matters more than personal style preferences. Always run `gofmt` or use editor integration.
- **A little copying is better than a little dependency**: Duplicate small code rather than adding unnecessary external dependencies.
- **Clear is better than clever**: Write readable, straightforward code over smart but obscure solutions.
- **Reflection is never clear**: Reflection makes code harder to understand and reason about. Avoid unless absolutely necessary.

### Platform and Safety

- **Syscall must always be guarded with build tags**: Platform-specific system calls need build constraints for portability.
- **Cgo must always be guarded with build tags**: C interop code should be conditionally compiled for platform compatibility.
- **Cgo is not Go**: C code integration loses Go's safety, simplicity, and performance guarantees.
- **With the unsafe package there are no guarantees**: Unsafe bypasses type safety and memory protection mechanisms. Avoid unless absolutely necessary and document thoroughly.

### Error Handling and Documentation

- **Errors are values**: Treat errors as regular values that can be examined and handled.
- **Don't just check errors, handle them gracefully**: Add context and appropriate responses when processing errors. Wrap errors with context using `fmt.Errorf("context: %w", err)`.
- **Don't panic**: Reserve panic for truly exceptional, unrecoverable situations; prefer returning errors.

### Architecture and Documentation

- **Design the architecture, name the components, document the details**: Focus design on structure, naming on clarity, documentation on specifics.
- **Documentation is for users**: Write docs explaining how to use code, not implementation details.

## SOLID Principles

Apply these software design principles to create maintainable, extensible code:

### Single Responsibility Principle (SRP)

Each struct, function, or package should have only one reason to change. Keep responsibilities focused and well-defined.

**Example**: Separate concerns clearly:

- HTTP handlers process requests and responses only
- Services contain business logic and orchestration
- Repositories handle data persistence
- Clients manage external API interactions

### Open/Closed Principle (OCP)

Software entities should be open for extension but closed for modification. Use interfaces to allow behavior extension without changing existing code.

**Example**: Define client interfaces that can be implemented differently for testing, mocking, or production environments without modifying consumer code.

### Liskov Substitution Principle (LSP)

Subtypes must be substitutable for their base types without breaking functionality. Ensure interface implementations fully honor the contract.

**Example**: Any implementation of a `Logger` interface should behave correctly when substituted for another implementation, whether it's a file logger, stdout logger, or no-op logger.

### Interface Segregation Principle (ISP)

Clients shouldn't depend on interfaces they don't use; prefer specific interfaces. Break large interfaces into smaller, focused ones.

**Example**: Instead of one large `Storage` interface, create separate focused interfaces:

```go
type Reader interface {
    Read(ctx context.Context, key string) ([]byte, error)
}

type Writer interface {
    Write(ctx context.Context, key string, data []byte) error
}

type Deleter interface {
    Delete(ctx context.Context, key string) error
}
```

Functions can then depend only on the capabilities they need (e.g., a cache invalidator only needs `Deleter`).

### Dependency Inversion Principle (DIP)

Depend on abstractions, not concrete implementations; high-level modules shouldn't depend on low-level modules.

**Example**: Business logic should depend on repository interfaces, not concrete database implementations. HTTP handlers should depend on service interfaces, not concrete service structs.

## Additional Design Principles

### Don't Repeat Yourself (DRY)

Avoid duplicating logic; abstract common functionality into reusable components. However, remember: "A little copying is better than a little dependency."

**Balance**: Duplicate simple code rather than creating premature abstractions. Extract when patterns emerge across 3+ locations.

### You Aren't Gonna Need It (YAGNI)

Don't add functionality until it's actually needed; avoid premature features. Implement what's required now, not what might be needed later.

### Keep It Simple, Stupid (KISS)

Favor simple solutions over complex ones; avoid unnecessary complexity. Choose the straightforward approach unless complexity is justified.

### Composition over Inheritance

Build functionality by composing objects rather than using deep inheritance hierarchies. Go naturally encourages this through struct embedding and interfaces.

**Example**: Compose functionality by embedding specialized components:

```go
// Instead of inheritance, compose capabilities
type UserService struct {
    repo   UserRepository
    cache  Cache
    logger Logger
    mailer EmailSender
}

// Struct embedding for shared behavior
type BaseHandler struct {
    logger Logger
}

type UserHandler struct {
    BaseHandler  // Embedded for shared logging
    userService  *UserService
}
```

## Applying These Guidelines

### When Writing Code

1. **Start with interfaces**: Define what behavior is needed before implementing
2. **Keep functions small**: Each function should do one thing well
3. **Use meaningful names**: Names should reveal intent without needing comments
4. **Handle errors explicitly**: Don't ignore errors; add context when wrapping
5. **Write tests first (TDD)**: Define expected behavior through tests
6. **Refactor continuously**: Improve code structure as understanding evolves
7. **Review against proverbs**: Check code against Go proverbs before committing
8. **Document public APIs**: Add godoc comments for exported types and functions

### When Reviewing Code

1. Check adherence to Go proverbs
2. Verify SOLID principles are followed
3. Ensure tests cover happy paths and edge cases
4. Look for unnecessary complexity
5. Validate error handling is graceful with context
6. Confirm interfaces are small and focused
7. Check that zero values are useful where applicable

### When Creating Plans or Researching Go Topics

1. Identify relevant Go proverbs and principles that apply to the topic
2. Outline how these guidelines influence design decisions
3. Provide examples demonstrating best practices
4. Suggest testing strategies aligned with the guidelines
