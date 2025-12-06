# README Examples

Good/bad examples for writing README.md.

## Purpose

README is the **public-facing entry point** for users discovering your project. It should quickly answer: "What is this? Why should I use it? How do I get started?"

**Audience:** Users of the repository's output (not developers of the repository itself)

**Key principle:** README is human-focused and user-facing. Development details belong in docs/development.md.

---

## Required Sections

### Header (Required)

**Good Example:**
```markdown
# MyProject

A fast, type-safe database migration tool for PostgreSQL.

[![Build Status](https://github.com/org/myproject/workflows/ci/badge.svg)](https://github.com/org/myproject/actions)
[![npm version](https://badge.fury.io/js/myproject.svg)](https://www.npmjs.com/package/myproject)
```

**Why it's good:**
- Clear project name
- One-sentence description of what it does
- Badges provide quick status info

**Bad Example:**
```markdown
# MyProject

## Introduction

MyProject is a project that was created to solve the problem of database migrations. It was developed by the team at Company X using TypeScript and PostgreSQL. The project started in 2023 and has been continuously improved since then...
```

**Why it's bad:**
- No tagline (have to read paragraph)
- Irrelevant history
- Doesn't quickly convey what it does

---

### Summary (Required)

**Good Example:**
```markdown
## Summary

MyProject makes database migrations simple and safe. Define your schema changes in TypeScript, and MyProject handles the rest - generating SQL, tracking applied migrations, and rolling back safely.

Built for teams who want type-checked migrations without the complexity of full ORMs.
```

**Why it's good:**
- 2-3 sentences max
- Explains what it does AND why you'd use it
- Identifies target audience

**Bad Example:**
```markdown
## Summary

MyProject is a database migration tool. It uses TypeScript. It supports PostgreSQL. It can apply migrations. It can rollback migrations. It tracks which migrations have been applied.
```

**Why it's bad:**
- Just lists features without explaining value
- Reads like a bullet list forced into sentences
- No "why should I care?"

---

### Installation (Required)

**Good Example:**
```markdown
## Installation

### npm
```bash
npm install myproject
```

### Homebrew (macOS)
```bash
brew install myproject
```

### From source
```bash
git clone https://github.com/org/myproject.git
cd myproject
make install
```

**Requirements:** Node.js 18+ or Go 1.21+ (for building from source)
```

**Why it's good:**
- Multiple installation methods
- Clear commands
- Prerequisites stated

**Bad Example:**
```markdown
## Installation

Install the package using your preferred package manager.
```

**Why it's bad:**
- No actual commands
- Users have to figure it out themselves

---

### Quick Start (Required)

**Good Example:**
```markdown
## Quick Start

1. Initialize in your project:
   ```bash
   myproject init
   ```

2. Create your first migration:
   ```bash
   myproject create add_users_table
   ```

3. Edit the generated file at `migrations/001_add_users_table.ts`:
   ```typescript
   export async function up(db: Database) {
     await db.createTable('users', {
       id: 'serial primary key',
       email: 'varchar(255) not null unique',
       created_at: 'timestamp default now()'
     });
   }
   ```

4. Apply migrations:
   ```bash
   myproject migrate
   ```

That's it! Your database now has a `users` table.
```

**Why it's good:**
- Minimal steps to something working
- Shows actual code/commands
- Clear expected outcome

**Bad Example:**
```markdown
## Quick Start

See the [documentation](https://docs.example.com) for getting started.
```

**Why it's bad:**
- Forces user to leave the page
- No immediate value
- Frustrating experience

---

### Documentation Index (Required)

**Good Example:**
```markdown
## Documentation

Detailed documentation is available in `docs/`:

- [Architecture](docs/architecture.md) - System design and internals
- [Domain](docs/domain.md) - Concepts and terminology
- [Patterns](docs/patterns.md) - Code conventions and examples
- [Development](docs/development.md) - Contributing and development setup
```

**Why it's good:**
- Points to detailed docs
- Brief description of each
- Keeps README concise

---

## Optional Sections

### Features (Include when user-visible capabilities exist)

**Good Example:**
```markdown
## Features

- **Type-safe migrations** - Write migrations in TypeScript with full type checking
- **Automatic rollback** - Each migration includes auto-generated down migration
- **Dry run mode** - Preview SQL without applying changes
- **Team-friendly** - Lock mechanism prevents concurrent migration conflicts
- **Fast** - Only loads migrations that need to run, not the entire history
```

**Why it's good:**
- User-visible benefits
- Brief, scannable
- Focuses on value, not implementation

**Bad Example:**
```markdown
## Features

- Uses TypeScript
- PostgreSQL driver
- Command-line interface
- Configuration file support
- Logging
```

**Why it's bad:**
- Technical details, not user benefits
- "Uses TypeScript" isn't a feature for users
- Doesn't explain why these matter

**When to skip:** The project is simple enough that Summary covers it.

---

### Usage (Include when more examples are helpful)

**Good Example:**
```markdown
## Usage

### Creating Migrations

```bash
myproject create <name>        # Create a new migration
myproject create add_users_table --sql   # Generate SQL instead of TypeScript
```

### Applying Migrations

```bash
myproject migrate              # Apply all pending migrations
myproject migrate --to 005     # Migrate to specific version
myproject migrate --dry-run    # Preview SQL without applying
```

### Rolling Back

```bash
myproject rollback             # Rollback last migration
myproject rollback --to 003    # Rollback to specific version
```

### Status

```bash
myproject status               # Show migration status
```

Output:
```
Applied migrations:
  ✓ 001_create_users_table
  ✓ 002_add_email_index

Pending migrations:
  ○ 003_add_posts_table
```
```

**Why it's good:**
- Common operations covered
- Shows expected output where helpful
- Real, working examples

**When to skip:** Quick Start is sufficient.

---

### Contributing (Include brief version)

**Good Example:**
```markdown
## Contributing

Contributions are welcome! Please see [docs/development.md](docs/development.md) for setup instructions and guidelines.

Quick version:
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request
```

**Why it's good:**
- Brief and welcoming
- Points to detailed docs
- Quick steps for reference

**Bad Example:**
```markdown
## Contributing

### Setting Up Development Environment

First, install the following prerequisites:
- Node.js 18+
- PostgreSQL 15+
- Docker...

[500 more lines of development setup]
```

**Why it's bad:**
- Development setup belongs in docs/development.md
- Makes README too long
- Mixes user and developer concerns

---

## Sections NOT in README

Move this content to the appropriate location:

| Content | Location |
|---------|----------|
| Development environment setup | docs/development.md |
| Build system details | docs/development.md |
| Architecture explanations | docs/architecture.md |
| Domain concepts/glossary | docs/domain.md |
| Code patterns/conventions | docs/patterns.md |
| All environment variables | docs/development.md |
| Detailed deployment procedures | docs/development.md |
| API internals | docs/architecture.md |

---

## Common Mistakes

### Mistake 1: Developer-Focused Instead of User-Focused

**Wrong:** README full of build commands, test procedures, contribution guidelines

**Right:** README focuses on USING the project. Development info goes in docs/development.md.

### Mistake 2: No Quick Win

**Wrong:** Pages of documentation before showing how to use it

**Right:** Users should see working code within 60 seconds of reading

### Mistake 3: Implementation Details

**Wrong:**
```markdown
Uses Express.js for routing with middleware for authentication. Database queries use Prisma ORM with PostgreSQL...
```

**Right:**
```markdown
Handles authentication, authorization, and data persistence out of the box.
```

Users care about what it does, not how.

### Mistake 4: Outdated Examples

README examples break trust when they don't work. Mitigate by:
- Using real, tested commands
- Keeping examples minimal (less to break)
- Automating example testing if possible

### Mistake 5: Wall of Text

**Wrong:** Long paragraphs explaining everything

**Right:** Scannable format with headers, code blocks, and bullet points

### Mistake 6: No Clear "What Is This?"

**Wrong:** Jumping into installation without explaining what the project does

**Right:** Clear tagline and summary before any setup instructions

---

## Tone and Style

- **Welcoming** - Assume the reader is encountering this for the first time
- **Practical** - Focus on getting things done, not theory
- **Honest** - Don't oversell or make claims you can't back up
- **Concise** - Respect the reader's time
- **Example-driven** - Show, don't just tell
