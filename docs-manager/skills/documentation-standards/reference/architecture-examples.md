# Architecture Examples

Good/bad examples for writing docs/architecture.md.

## Purpose

Architecture documentation helps developers understand the system's design - major components, how they interact, and key decisions. It should be stable (not needing frequent updates) and focused on concepts, not implementation details.

**Audience:** Developers working on the codebase (Claude-optimized context)

---

## Required Sections

### Overview (Required)

**Good Example:**
```markdown
## Overview

This is a web application that manages user subscriptions for SaaS products. It handles user authentication, subscription lifecycle (creation, upgrades, cancellation), payment processing via Stripe, and usage tracking.

The system follows a layered architecture with clear separation between HTTP handlers, business logic, and data access.
```

**Why it's good:**
- Explains what the system does in 2-3 sentences
- Identifies the architectural style
- Gives orientation without overwhelming detail

**Bad Example:**
```markdown
## Overview

The application uses Express.js v4.18.2 with TypeScript 5.0. It connects to PostgreSQL 15 via Prisma ORM. Authentication uses JWT tokens stored in HTTP-only cookies. The Stripe SDK v12.4.0 handles payments...
```

**Why it's bad:**
- Lists technology versions (belongs in development.md or package.json)
- Too much implementation detail
- Doesn't explain what the system does or how it's organized

---

### Components (Required)

**Good Example:**
```markdown
## Components

### API Layer
**Location:** `src/api/`
**Responsibility:** HTTP request handling, input validation, response formatting
**Interacts with:** Services layer

Exposes REST endpoints for all user-facing operations. Each resource (users, subscriptions, payments) has its own router module.

### Services Layer
**Location:** `src/services/`
**Responsibility:** Business logic, orchestration, transaction management
**Interacts with:** Repositories, external integrations

Contains the core business rules. Each service handles one domain area (UserService, SubscriptionService, PaymentService).

### Repository Layer
**Location:** `src/repositories/`
**Responsibility:** Data access, query building, persistence
**Interacts with:** Database

Abstracts database operations behind interfaces. Business logic never accesses the database directly.
```

**Why it's good:**
- Clear structure: Location, Responsibility, Interactions
- Explains the role of each component
- Shows how components relate

**Bad Example:**
```markdown
## Components

- `src/api/users.ts` - User endpoints
- `src/api/subscriptions.ts` - Subscription endpoints
- `src/api/payments.ts` - Payment endpoints
- `src/services/userService.ts` - User business logic
- `src/services/subscriptionService.ts` - Subscription logic
- `src/services/paymentService.ts` - Payment logic
...
```

**Why it's bad:**
- Just lists files without explaining relationships
- No architectural insight
- Will need updating every time a file is added

---

## Optional Sections

### Data Flow (Include when non-trivial)

**Good Example:**
```markdown
## Data Flow

### Request Processing
```
HTTP Request → Router → Middleware (auth, validation) → Handler → Service → Repository → Database
                                                           ↓
                                                    External APIs (Stripe, Email)
```

### Event Flow
User actions trigger domain events that are processed asynchronously:
```
User Action → Service → Event Published → Queue → Event Handlers → Side Effects
```

Events include: `subscription.created`, `subscription.cancelled`, `payment.failed`
```

**Why it's good:**
- Visual representation aids understanding
- Shows different flows (sync request, async events)
- Identifies integration points

**When to skip:** Simple CRUD apps with straightforward request/response flow.

---

### External Dependencies (Include when external integrations exist)

**Good Example:**
```markdown
## External Dependencies

| Dependency | Purpose | Integration Point |
|------------|---------|-------------------|
| Stripe | Payment processing | `src/integrations/stripe/` |
| SendGrid | Transactional email | `src/integrations/email/` |
| Auth0 | User authentication | `src/middleware/auth.ts` |

### Stripe Integration
Handles all payment operations: charges, refunds, subscription billing. Uses webhooks for async updates (payment success/failure).

### SendGrid Integration
Sends transactional emails: welcome, password reset, subscription confirmations. Templates are managed in SendGrid dashboard.
```

**Why it's good:**
- Table gives quick reference
- Brief explanation of each integration's role
- Points to code location

**When to skip:** No external service integrations.

---

### Key Architectural Decisions (Include when decisions are documented or clearly evident)

**Good Example:**
```markdown
## Key Architectural Decisions

### Event Sourcing for Subscriptions
**Context:** Need complete audit trail of subscription changes for compliance and debugging.
**Decision:** Subscription state changes are stored as events, not just current state.
**Consequences:** More storage, but complete history. Replay capability for debugging.

### Repository Pattern
**Context:** Need to test business logic without database dependencies.
**Decision:** All data access goes through repository interfaces.
**Consequences:** More boilerplate, but testable services. Database can be swapped.
```

**Why it's good:**
- Context/Decision/Consequences format is clear
- Explains the "why" not just the "what"
- Helps future developers understand tradeoffs

**When to skip:** No significant architectural decisions to document, or decisions aren't evident from the code.

---

## Common Mistakes

### Mistake 1: Listing Every File

**Wrong:**
```markdown
## Project Structure
- src/
  - api/
    - users.ts
    - subscriptions.ts
    - payments.ts
    - webhooks.ts
    - health.ts
  - services/
    - userService.ts
    - subscriptionService.ts
    ...
```

**Right:** Describe the pattern, not every file:
```markdown
## Project Structure
- `src/api/` - HTTP handlers, one file per resource
- `src/services/` - Business logic, one service per domain area
- `src/repositories/` - Data access layer
```

### Mistake 2: Version Numbers

**Wrong:**
```markdown
The system uses PostgreSQL 15.2, Node.js 20.10.0, and Express 4.18.2.
```

**Right:** Version info belongs in package.json/requirements.txt. Architecture docs explain design:
```markdown
The system uses PostgreSQL for persistence with a repository pattern for data access.
```

### Mistake 3: Implementation Details That Change

**Wrong:**
```markdown
The UserService.createUser() method first validates the email format using the validateEmail() helper, then checks for duplicates by calling userRepository.findByEmail(), then hashes the password using bcrypt with 12 rounds...
```

**Right:** Describe the flow at a higher level:
```markdown
User creation validates input, checks for duplicates, and securely stores credentials. The service layer handles validation and orchestration while the repository handles persistence.
```

### Mistake 4: Duplicating README Content

**Wrong:** Including installation instructions, usage examples, or feature lists in architecture.md

**Right:** Architecture.md focuses on internal design. User-facing info goes in README.

### Mistake 5: No Relationships

**Wrong:** Listing components without explaining how they interact

**Right:** Every component should show what it interacts with and how
