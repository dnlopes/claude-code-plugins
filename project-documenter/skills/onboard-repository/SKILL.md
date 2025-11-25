---
name: onboard-repository
description: Use when creating CLAUDE.md or docs/claude/ documentation for a new repository - ensures systematic codebase exploration instead of generic templates, extracting real architecture, actual tech stack, and concrete code patterns from the repository
---

# Onboard Repository

## Overview

**Repository onboarding creates documentation by systematically exploring the actual codebase, not by generating templates.**

Core principle: Documentation must reflect what's ACTUALLY in the repository, not what you assume is there.

## When to Use

Use this skill when:
- Creating CLAUDE.md for a new repository
- Setting up docs/claude/ documentation structure
- Onboarding multiple repositories systematically
- Someone asks to "document the codebase for Claude"

Do NOT use for:
- Adding to existing documentation (that's maintenance, not onboarding)
- Single file explanations (just read and explain)
- API documentation (that's a different skill)

## The Iron Law

```
NO DOCUMENTATION WITHOUT READING THE CODE FIRST
```

**Never:**
- Generate documentation from directory structure alone
- Create "likely includes..." or "probably has..." content
- Use placeholders like "(needs investigation)"
- Make assumptions about patterns or conventions
- Write TODO or "fill this in later" sections

**Always:**
- Read actual source files before documenting them
- Extract real examples from the codebase
- Document what IS there, not what SHOULD be there

## Systematic Onboarding Process

### Phase 1: Discovery (Required First)

**YOU MUST complete discovery before writing ANY documentation.**

1. **Identify the ecosystem:**
   - Read go.mod/package.json/pom.xml/requirements.txt for dependencies
   - Check for framework indicators (Spring Boot, React, Kubernetes operator, etc.)
   - Identify build system (Make, Gradle, npm, etc.)

2. **Map the architecture:**
   - Read main entry points (main.go, index.ts, Application.java)
   - Trace key initialization code
   - Identify major components and their responsibilities
   - Find configuration sources

3. **Extract patterns:**
   - Find 2-3 representative files that show typical structure
   - Identify testing approach (framework, patterns, location)
   - Note error handling patterns
   - Document actual naming conventions used

4. **Catalog specifics:**
   - List actual make/npm/gradle targets (from files, not assumptions)
   - Find environment variables and configuration
   - Identify external dependencies (databases, APIs, message queues)
   - Document deployment/build artifacts

### Phase 2: Documentation Structure

Create docs/claude/ with these files:

| File | Content | Source |
|------|---------|--------|
| **architecture.md** | System design, component relationships, data flow | From reading main entry points and key files |
| **tech-stack.md** | Languages, frameworks, tools, versions | From dependency files and build configs |
| **patterns.md** | Code organization, naming, common patterns with REAL examples | From analyzing representative files |
| **development.md** | Build commands, testing, local dev setup | From Makefile/package.json/build files |

### Phase 3: Create CLAUDE.md

CLAUDE.md is the entry point that:
1. Briefly describes what the repo does (1-2 sentences)
2. Lists key directories and their purposes
3. Points to docs/claude/ for details
4. Includes quick start commands

**Keep it short** - detailed content goes in docs/claude/, not CLAUDE.md.

## Documentation Content Requirements

### Architecture (docs/claude/architecture.md)

**Must include:**
- High-level component diagram or description
- Data flow through the system
- Key abstractions and their relationships
- Integration points (databases, external services, APIs)

**Must be based on:**
- Reading main.go/index.ts/Application.java
- Tracing initialization code
- Following import/require chains
- Reading configuration setup

**Example of good content:**
```markdown
## Request Processing Flow

1. HTTP request arrives at `pkg/server/handler.go:HandleRequest()`
2. Request validated using `pkg/validator/schema.go` Zod schemas
3. Business logic in `pkg/service/processor.go:ProcessOrder()`
4. Database writes via `pkg/repository/orders.go` using GORM
5. Event published to Kafka topic `order.processed` via `pkg/events/publisher.go`
```

**Example of bad content:**
```markdown
## Request Processing Flow

The system likely handles requests through handlers, processes them with business logic, and stores results in a database.
```

### Tech Stack (docs/claude/tech-stack.md)

**Must include:**
- Exact language versions (from go.mod, package.json, etc.)
- Framework with version (Spring Boot 3.2.1, React 18.2.0, etc.)
- Key libraries with brief purpose
- Build tools and versions
- Runtime requirements (Java 17, Node 20, Go 1.21)

**Must be based on:**
- Reading dependency files completely
- Checking .tool-versions or .nvmrc
- Reading Dockerfile for runtime requirements

### Patterns (docs/claude/patterns.md)

**Must include:**
- Project structure with explanations
- Actual code examples (2-4) from the repo
- Testing patterns with real test file examples
- Error handling patterns with actual code
- Configuration patterns

**Each pattern needs:**
1. Description of the pattern
2. REAL code example from the codebase
3. Location of the example (file:line)

**Example of good content:**
```markdown
## Error Handling Pattern

Errors are wrapped with context using pkg/errors:

```go
// From pkg/service/processor.go:45
func (s *Service) ProcessOrder(order *Order) error {
    if err := s.validator.Validate(order); err != nil {
        return fmt.Errorf("validating order %s: %w", order.ID, err)
    }
    // ...
}
```

This pattern provides error context for debugging while preserving the original error for type checking.
```

**Example of bad content:**
```markdown
## Error Handling Pattern

Errors should be handled appropriately with proper context and wrapping.
```

### Development (docs/claude/development.md)

**Must include:**
- Actual build commands from Makefile/package.json
- How to run tests (with actual command)
- Local development setup steps
- Environment variables needed
- How to run the application locally

**Must be based on:**
- Reading Makefile/package.json/build.gradle completely
- Reading .env.example or config files
- Reading README.md if it exists
- Checking docker-compose.yml

## Red Flags - STOP and Read Code

If you're writing any of these, STOP - you haven't read the code:

- "likely includes..."
- "probably uses..."
- "typically structured..."
- "common pattern is..."
- "(see X for details)" without reading X
- "(needs investigation)"
- "TODO: fill in..."
- Generic descriptions without specifics
- Zero code examples from the actual repo
- Assumed make targets without reading Makefile

**All of these mean: Stop writing. Start reading.**

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Directory structure tells me enough" | No. Assumptions are wrong. Read the files. |
| "I can fill in details later" | No later. Document what you found NOW. |
| "It's obviously a standard X pattern" | Nothing is standard. Read the actual implementation. |
| "Quick overview is fine for now" | Quick + accurate, not quick + wrong. |
| "User said to work fast" | Fast exploration is fine. Fast assumptions are not. |
| "It's just like other repos I've seen" | Each repo is different. Read this one. |

## Quality Checklist

Before considering onboarding complete:

- [ ] Read at least main entry point file completely
- [ ] Read actual dependency manifest (go.mod, package.json, etc.)
- [ ] Read actual build file (Makefile, package.json scripts, etc.)
- [ ] Extracted 2+ real code examples for patterns.md
- [ ] Listed specific versions for all major dependencies
- [ ] Documented actual make/npm/gradle targets with their real names
- [ ] Zero instances of "likely", "probably", "typically" in docs
- [ ] Zero TODO or placeholder sections
- [ ] Every pattern has real code example with file:line reference

## Time Investment

Proper onboarding takes 15-30 minutes for typical repository:
- 10-15 min: Reading key files
- 5-10 min: Extracting examples
- 5-10 min: Writing documentation

This is MUCH faster than:
- Developers guessing what's there (hours)
- Debugging misunderstood architecture (hours/days)
- Onboarding new team members (hours/days)

The investment pays off immediately.

## The Bottom Line

**Repository onboarding means reading the actual code and documenting what you find.**

Templates and assumptions create useless documentation. Systematic exploration creates valuable documentation.

If you didn't read it, don't document it.
