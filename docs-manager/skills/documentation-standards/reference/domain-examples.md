# Domain Examples

Good/bad examples for writing docs/domain.md.

## Purpose

Domain documentation explains the business concepts, terminology, and rules that the code implements. It helps developers understand WHAT the system is modeling, not HOW it's implemented.

**Audience:** Developers working on the codebase (Claude-optimized context)

**Note:** For utility libraries, infrastructure tools, or purely technical projects, this document may be minimal or even skipped. Domain.md is most valuable for applications with business logic.

---

## Required Sections

### Glossary (Required)

**Good Example:**
```markdown
## Glossary

| Term | Definition |
|------|------------|
| Subscription | A recurring agreement where a user pays periodically for access to a product |
| Plan | A predefined subscription configuration with specific features and pricing |
| Billing Cycle | The recurring period (monthly, yearly) when charges occur |
| Seat | A unit of access within a subscription, typically representing one user |
| Churn | When a subscriber cancels or fails to renew |
| MRR | Monthly Recurring Revenue - total predictable monthly income from subscriptions |
```

**Why it's good:**
- Defines domain-specific terms that might be ambiguous
- Helps developers use consistent terminology
- Distinguishes business terms from technical terms

**Bad Example:**
```markdown
## Glossary

| Term | Definition |
|------|------------|
| API | Application Programming Interface |
| REST | Representational State Transfer |
| JWT | JSON Web Token |
| ORM | Object-Relational Mapping |
```

**Why it's bad:**
- These are technical terms, not domain terms
- Developers already know these (or can easily look them up)
- Doesn't help understand the business domain

---

## Optional Sections

### Core Entities (Include when domain model exists)

**Good Example:**
```markdown
## Core Entities

### User
**Purpose:** Represents a person with an account in the system
**Key attributes:**
- `email`: Unique identifier and login credential
- `organizationId`: Links to the user's organization
- `role`: Determines permissions (admin, member, viewer)

**Relationships:**
- Belongs to one Organization
- Can own multiple Subscriptions
- Has many ActivityLogs

### Subscription
**Purpose:** Represents an active or past subscription to a plan
**Key attributes:**
- `status`: Current state (active, cancelled, past_due, trialing)
- `currentPeriodEnd`: When the current billing period ends
- `cancelAtPeriodEnd`: Whether subscription will cancel at period end

**Relationships:**
- Belongs to one User
- Has one Plan
- Has many Invoices

### Plan
**Purpose:** Defines a subscription offering with pricing and features
**Key attributes:**
- `interval`: Billing frequency (month, year)
- `amount`: Price per interval in cents
- `features`: Array of feature flags included

**Relationships:**
- Has many Subscriptions
```

**Why it's good:**
- Explains what each entity represents in business terms
- Lists meaningful attributes (not every database column)
- Shows relationships between entities

**Bad Example:**
```markdown
## Core Entities

### User
- id: number
- email: string
- password_hash: string
- created_at: timestamp
- updated_at: timestamp
- deleted_at: timestamp | null
- organization_id: number | null
- role: 'admin' | 'member' | 'viewer'
- email_verified: boolean
- last_login_at: timestamp
```

**Why it's bad:**
- Lists database columns, not domain concepts
- Includes technical details (password_hash, timestamps)
- No explanation of business meaning
- This is a schema dump, not domain documentation

**When to skip:** Technical libraries, utilities, or projects without a domain model.

---

### Business Rules (Include when business constraints exist)

**Good Example:**
```markdown
## Business Rules

### Subscription Rules
1. **One active subscription per user**: A user cannot have multiple active subscriptions simultaneously
2. **Downgrade restrictions**: Cannot downgrade to a plan with fewer seats than currently used
3. **Cancellation timing**: Cancellations take effect at the end of the current billing period
4. **Trial eligibility**: Each user gets one trial period, ever (tracked across accounts by email)

### Billing Rules
1. **Proration**: Mid-cycle plan changes prorate charges to the day
2. **Failed payment retry**: Failed payments retry 3 times over 7 days before suspension
3. **Grace period**: 3-day grace period after failed payment before feature access is revoked

### Access Rules
1. **Organization admins**: Can manage all subscriptions within their organization
2. **Seat limits**: Feature access denied when seat count exceeded (soft limit with warning)
```

**Why it's good:**
- Captures rules that aren't obvious from code
- Explains business decisions
- Helps developers understand edge cases

**Bad Example:**
```markdown
## Business Rules

1. Users must have valid email addresses
2. Passwords must be at least 8 characters
3. API requests require authentication
4. Deleted records are soft-deleted
```

**Why it's bad:**
- These are technical/validation rules, not business rules
- #4 is implementation detail, not business constraint
- Doesn't capture domain-specific logic

**When to skip:** Projects without business logic constraints.

---

### Domain Patterns (Include when domain-specific patterns exist)

**Good Example:**
```markdown
## Domain Patterns

### Subscription State Machine
Subscriptions follow a defined state machine:

```
                     ┌──────────────┐
                     │   trialing   │
                     └──────┬───────┘
                            │ trial ends / payment succeeds
                            ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   past_due   │◄────│    active    │────►│  cancelled   │
└──────┬───────┘     └──────────────┘     └──────────────┘
       │                    ▲
       │ payment succeeds   │
       └────────────────────┘
```

Valid transitions:
- `trialing` → `active` (payment succeeds or trial converts)
- `active` → `cancelled` (user cancels)
- `active` → `past_due` (payment fails)
- `past_due` → `active` (payment succeeds)
- `past_due` → `cancelled` (max retries exceeded)

### Billing Events
Key events in the billing domain:
- `subscription.created` - New subscription started
- `subscription.renewed` - Successful recurring charge
- `subscription.cancelled` - User initiated cancellation
- `invoice.paid` - Payment received
- `invoice.payment_failed` - Payment attempt failed
```

**Why it's good:**
- Visualizes complex domain logic
- Documents state transitions explicitly
- Lists important domain events

**When to skip:** No complex domain logic or state machines.

---

## Common Mistakes

### Mistake 1: Documenting Technical Implementation

**Wrong:** Explaining how data is stored, what ORM is used, database schema details

**Right:** Explaining what concepts the data represents and their business meaning

### Mistake 2: Generic Terms

**Wrong:**
```markdown
| Term | Definition |
|------|------------|
| User | A user of the system |
| Data | Information stored in the database |
```

**Right:** Only include terms that have specific meaning in YOUR domain or might be ambiguous

### Mistake 3: Exhaustive Entity Lists

**Wrong:** Listing every database table as an entity

**Right:** Focus on core domain entities that developers need to understand. Skip technical entities (sessions, audit logs, etc.) unless they have business significance.

### Mistake 4: Outdated Business Rules

If business rules change frequently, consider:
- Are these actually rules or just current implementation?
- Should this be in code comments instead?
- Is the abstraction level right?

### Mistake 5: Mixing Architecture with Domain

**Wrong:** Including component diagrams, API endpoints, or system architecture in domain.md

**Right:** Domain.md focuses on business concepts. Architecture goes in architecture.md.

---

## When to Skip or Minimize domain.md

Some projects don't need extensive domain documentation:

| Project Type | Domain.md Approach |
|--------------|-------------------|
| Business application | Full documentation |
| API with business logic | Full documentation |
| Utility library | Minimal or skip |
| Infrastructure tool | Minimal or skip |
| Framework/toolkit | Focus on key abstractions only |
| CLI tool | Depends on complexity |

If your glossary would only contain technical terms, and you have no business entities or rules, consider skipping this document or keeping it very minimal.
