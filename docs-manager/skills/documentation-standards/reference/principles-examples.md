# Principles Examples

Good/bad examples for writing principles in CLAUDE.md.

## What Makes a Good Principle

A principle is **actionable guidance for developers working on the repository**. It answers: "What must I do/not do when making changes?"

### The Three-Question Test

For each potential principle, ask:
1. Does this tell a developer what to DO?
2. Is this an invariant that must be maintained?
3. Would violating this cause problems?

If all three are yes, it's a principle. Otherwise, it's just an observation.

---

## Good Examples

### Example 1: Testing Requirement
```markdown
**Test-First Development**: Write tests before implementation. All new features must have tests that fail before the implementation is written.
```
**Why it's good:**
- Actionable: Tells developers exactly what to do
- Invariant: Must be maintained for all new features
- Consequence: Violating it means untested code enters the codebase

### Example 2: API Design
```markdown
**API-First Design**: API changes require updating the OpenAPI spec before implementing. The spec is the source of truth.
```
**Why it's good:**
- Actionable: Clear sequence of steps
- Invariant: All API changes must follow this
- Consequence: Violating it causes spec/implementation drift

### Example 3: Error Handling
```markdown
**Errors Must Have Context**: All error messages must include the operation being attempted and relevant identifiers (user ID, resource ID, etc.).
```
**Why it's good:**
- Actionable: Specific requirement for error messages
- Invariant: Applies to all error handling
- Consequence: Violating it makes debugging harder

### Example 4: Data Access
```markdown
**Repository Pattern**: All database access must go through repository interfaces. Direct database queries in business logic are not allowed.
```
**Why it's good:**
- Actionable: Clear architectural constraint
- Invariant: No exceptions allowed
- Consequence: Violating it couples business logic to database implementation

### Example 5: Code Organization
```markdown
**Feature Modules**: Each feature lives in its own module with its own routes, handlers, and tests. Cross-feature imports must go through the public API.
```
**Why it's good:**
- Actionable: Clear structure to follow
- Invariant: Applies to all features
- Consequence: Violating it creates coupling between features

---

## Bad Examples

### Bad Example 1: Observation, Not Guidance
```markdown
**Releases are fully automated**: release.yaml handles automatic semantic versioning.
```
**Why it's bad:**
- Not actionable: Describes what exists, not what to do
- Not an invariant: This is infrastructure, not a development rule
- No developer action: Developers don't need to do anything

**Better version (if relevant):**
```markdown
**Conventional Commits Required**: All commits must follow conventional commit format. Release versions are determined automatically from commit messages.
```

### Bad Example 2: Tech Stack Description
```markdown
**TypeScript**: The codebase uses TypeScript for type safety.
```
**Why it's bad:**
- Not actionable: Just states a fact
- Not guidance: Developers already know this from the code
- No consequence: What should developers do differently?

**Better version:**
```markdown
**Strict TypeScript**: No `any` types allowed. All function parameters and return types must be explicitly typed.
```

### Bad Example 3: Vague Statement
```markdown
**Code Quality**: We maintain high code quality standards.
```
**Why it's bad:**
- Not actionable: What does "high quality" mean?
- Not specific: What must developers do?
- Unmeasurable: How do you know if you're following it?

**Better version:**
```markdown
**Lint and Format Before Commit**: All code must pass `make lint` and `make fmt` before committing. Pre-commit hooks enforce this.
```

### Bad Example 4: CI/CD Fact
```markdown
**Tests run in CI**: All pull requests trigger the test suite.
```
**Why it's bad:**
- Not actionable: Describes infrastructure
- Developers don't control this: It happens automatically
- No guidance: What should developers do?

**Better version:**
```markdown
**All Tests Must Pass**: PRs cannot merge with failing tests. Fix test failures before requesting review.
```

### Bad Example 5: Internal Infrastructure
```markdown
**Docker-based deployment**: The application is deployed using Docker containers orchestrated by Kubernetes.
```
**Why it's bad:**
- Not actionable for most developers
- Infrastructure detail: Belongs in docs/development.md if relevant
- Not a development invariant

**Better version (if Docker knowledge is required):**
```markdown
**Local Development Uses Docker**: Run `docker-compose up` for local development. All dependencies are containerized.
```

---

## Common Mistakes

### Mistake 1: Confusing Repository Infrastructure with Development Principles

**Wrong:** Documenting how the repo's CI/CD works as principles
**Right:** Documenting what developers must do that CI/CD enforces

Example of confusion:
- BAD: "Releases are tagged automatically" (infrastructure fact)
- GOOD: "Use conventional commits - releases are versioned from commit messages" (developer action)

### Mistake 2: Stating the Obvious

**Wrong:** Principles that just describe what the code already shows
**Right:** Principles that guide decisions when the code doesn't make the answer obvious

Example:
- BAD: "We use React for the frontend" (obvious from package.json)
- GOOD: "Prefer function components with hooks over class components" (guides decisions)

### Mistake 3: Repository-Internal vs User-Facing Confusion

For a repository that provides something to users (library, CLI, reusable workflows, etc.):

**Wrong:** Principles about how the repo itself is maintained
**Right:** Principles about how to develop/extend what the repo provides

Example for a reusable GitHub Actions repo:
- BAD: "Releases are automated when merging to main" (internal)
- GOOD: "All reusable workflows must validate inputs and provide clear error messages" (guides development)

### Mistake 4: Too Many Principles

**Wrong:** 10+ principles covering every aspect of development
**Right:** 3-7 principles covering the most important invariants

If everything is a principle, nothing is. Focus on:
- Things that are easy to violate accidentally
- Things that cause significant problems when violated
- Things that aren't obvious from reading the code

### Mistake 5: Principles That Belong Elsewhere

Some content looks like principles but belongs in other documents:

| Content | Where It Belongs |
|---------|-----------------|
| Build commands | docs/development.md |
| Architecture overview | docs/architecture.md |
| Coding patterns with examples | docs/patterns.md |
| Domain terminology | docs/domain.md |
| Installation instructions | README.md |

Principles in CLAUDE.md should be short, memorable rules - not detailed explanations.
