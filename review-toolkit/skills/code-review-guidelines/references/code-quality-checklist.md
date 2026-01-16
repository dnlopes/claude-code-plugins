# Code Quality Checklist

Binary evaluation checklist for code quality review. Mark each applicable item as passed or failed with evidence.

## Clean Code Principles

- [ ] **DRY**: No duplicated logic (2+ occurrences extracted)
- [ ] **KISS**: Simplest approach used, no over-engineering
- [ ] **YAGNI**: No speculative code for future requirements
- [ ] **Early Returns**: Guard clauses instead of nested if-else
- [ ] **Function Length**: Functions under 80 lines
- [ ] **File Size**: Files under 200 lines
- [ ] **Parameters**: 3 or fewer per function (use objects for more)
- [ ] **Complexity**: Cyclomatic complexity 10 or less
- [ ] **No Magic Numbers**: Named constants for all literals
- [ ] **No Dead Code**: No commented code, unused variables, unreachable blocks

## SOLID Principles

- [ ] **Single Responsibility (Class)**: One reason to change per class
- [ ] **Single Responsibility (Function)**: One task per function
- [ ] **Open/Closed**: Extensible without modification
- [ ] **Liskov Substitution**: Subtypes substitutable for base types
- [ ] **Interface Segregation**: No unused interface methods
- [ ] **Dependency Inversion**: Depend on abstractions

## Naming Conventions

- [ ] **Variables**: Full words (not `usrAcct`)
- [ ] **Functions**: Verb-first (`calculateTotal`, not `total`)
- [ ] **Classes**: Noun phrases in PascalCase
- [ ] **Booleans**: Prefixed with is/has/can/should/will
- [ ] **Constants**: UPPER_SNAKE_CASE
- [ ] **Collections**: Plural names (`users`, not `userList`)
- [ ] **Consistency**: Same convention throughout

## Architecture

- [ ] **Layer Boundaries**: No cross-layer violations
- [ ] **Dependency Direction**: Inward only (UI -> Domain -> Data)
- [ ] **No Circular Dependencies**: No bidirectional imports
- [ ] **Abstractions**: External dependencies behind interfaces
- [ ] **Pattern Consistency**: Single pattern throughout
- [ ] **Domain Isolation**: No framework code in business logic

## Error Handling

- [ ] **No Empty Catch**: All errors logged/handled/re-thrown
- [ ] **Specific Catches**: Typed exceptions, not catch-all
- [ ] **Recovery Strategy**: Explicit recovery or propagation
- [ ] **User Messages**: Actionable, not technical
- [ ] **Consistent Strategy**: Same pattern throughout
- [ ] **Typed Errors**: Error objects, not strings

## Performance

- [ ] **No N+1 Queries**: Batch loading used
- [ ] **Resource Cleanup**: All resources explicitly closed
- [ ] **No Memory Leaks**: Listeners removed, intervals cleared
- [ ] **Efficient Algorithms**: O(n) where possible
- [ ] **Lazy Loading**: Expensive operations deferred
- [ ] **Non-Blocking I/O**: Async in event-loop environments

## Frontend (if applicable)

- [ ] **No Inline Styles**: Styles in CSS/SCSS/styled-components
- [ ] **No Prop Drilling**: Max 2 levels (use context beyond)
- [ ] **Memoization**: Expensive computations cached
- [ ] **Key Props**: Unique, stable keys (not indices)
- [ ] **Event Naming**: Consistent handle*/on* pattern
- [ ] **Component Size**: Under 200 lines
- [ ] **No Direct DOM**: No getElementById in React/Vue/Angular
- [ ] **No Nested Components**: Components defined at file level

## Backend (if applicable)

- [ ] **Status Codes**: Correct HTTP codes
- [ ] **Idempotency**: PUT/DELETE produce same result
- [ ] **Request Validation**: Validated at boundary
- [ ] **No Logic in Controllers**: Logic in services/domain
- [ ] **Transaction Boundaries**: Multi-step ops wrapped
- [ ] **API Versioning**: Breaking changes versioned

## Database (if applicable)

- [ ] **Parameterized Queries**: No string concatenation
- [ ] **Indexed Columns**: WHERE/JOIN columns indexed
- [ ] **Batch Operations**: Bulk ops, not loops
- [ ] **Connection Pooling**: Connections pooled
- [ ] **Migration Safety**: Backward compatible changes
