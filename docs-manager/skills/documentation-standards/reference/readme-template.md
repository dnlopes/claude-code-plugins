# README Template

This template defines the **Core + Optional** structure for repository README.md files.

## Purpose

The README.md is **public-facing documentation** that serves users discovering the project. It should be:
- **Welcoming** - Clear, accessible language
- **Practical** - Focus on getting started quickly
- **Concise** - Essential information only, with links to detailed docs
- **Accurate** - Reflect the actual state of the project

**Key principle:** README is for USERS of the repository's output. Development details belong in `docs/development.md`.

**Audience:** Users of what the repository provides (library consumers, CLI users, app users, etc.)

---

## Required Sections

These sections should ALWAYS be included.

### 1. Header (Required)

```markdown
# Project Name

Brief tagline (one sentence describing what it does and who it's for)

[Optional: Badges for build status, version, coverage, etc.]
```

**Guidelines:**
- Project name is the h1
- Tagline immediately answers "what is this?"
- Badges are optional but helpful for project status

### 2. Summary (Required)

```markdown
## Summary

2-3 sentences explaining:
- What the project does
- Who it's for
- Key value proposition
```

**Guidelines:**
- Maximum 3 sentences
- Focus on value to users
- Avoid implementation details

### 3. Installation (Required)

```markdown
## Installation

### npm
\`\`\`bash
npm install project-name
\`\`\`

### Homebrew (if applicable)
\`\`\`bash
brew install project-name
\`\`\`

### From source (if applicable)
\`\`\`bash
git clone ...
make install
\`\`\`

**Requirements:** <prerequisites if any>
```

**Guidelines:**
- Include all supported installation methods
- Show actual commands, not placeholders
- List prerequisites if any

### 4. Quick Start (Required)

```markdown
## Quick Start

\`\`\`bash
# Minimal commands to get something working
\`\`\`

Expected output or result.
```

**Guidelines:**
- Should work in under 60 seconds
- Show expected outcome
- Use real, tested commands

### 5. Documentation Index (Required)

```markdown
## Documentation

Detailed documentation is available in `docs/`:

- [Architecture](docs/architecture.md) - System design and internals
- [Domain](docs/domain.md) - Concepts and terminology
- [Patterns](docs/patterns.md) - Code conventions and examples
- [Development](docs/development.md) - Contributing and development setup
```

**Guidelines:**
- Links to all docs/ files
- Brief description of each
- Keeps README concise by pointing to details elsewhere

---

## Optional Sections

Include these when the trigger condition is met. **Do not include optional sections with generic or filler content.**

### Features
**Include when:** Project has multiple user-visible capabilities worth highlighting

```markdown
## Features

- **Feature Name** - User benefit description
- **Feature Name** - User benefit description
- **Feature Name** - User benefit description
```

**Guidelines:**
- Focus on user benefits, not implementation
- Keep descriptions brief
- 3-7 features typically

**Skip when:** Summary already covers the main functionality adequately

### Usage / Examples
**Include when:** Quick Start isn't enough to show common use cases

```markdown
## Usage

### Common Use Case 1
\`\`\`
Example code/commands
\`\`\`

### Common Use Case 2
\`\`\`
Example code/commands
\`\`\`
```

**Guidelines:**
- Real, working examples
- Cover 2-3 most common scenarios
- Show expected output where helpful

**Skip when:** Quick Start is sufficient

### API Reference (for libraries)
**Include when:** Library has a public API users need to know

```markdown
## API Reference

### functionName(param1, param2)

Description of what it does.

\`\`\`javascript
// Example usage
const result = functionName('value', { option: true });
\`\`\`
```

**Guidelines:**
- Cover main functions/classes
- Include examples for each
- Link to full API docs if extensive

**Skip when:** Not a library, or API is self-explanatory

### CLI Reference (for CLI tools)
**Include when:** CLI tool has commands/flags users need to know

```markdown
## CLI Reference

\`\`\`
project-name <command> [options]

Commands:
  init          Initialize a new project
  build         Build the project
  deploy        Deploy to production

Options:
  --help        Show help
  --version     Show version
\`\`\`
```

**Guidelines:**
- Show command structure
- List main commands and options
- Link to --help for full details

**Skip when:** Not a CLI tool, or CLI is covered in Quick Start

### Configuration
**Include when:** Significant configuration options exist

```markdown
## Configuration

Create a `config.yaml` file:

\`\`\`yaml
option1: value
option2: value
\`\`\`

### Options

| Option | Default | Description |
|--------|---------|-------------|
| option1 | `value` | What it does |
```

**Guidelines:**
- Show example configuration
- Document important options
- Table format for scanability

**Skip when:** No configuration needed, or Quick Start covers it

### Troubleshooting
**Include when:** Common issues are known

```markdown
## Troubleshooting

### Issue: Error message X
**Solution:** How to fix it

### Issue: Y doesn't work
**Solution:** Steps to resolve
```

**Guidelines:**
- Address actually common issues
- Include specific error messages when possible

**Skip when:** No common issues known

### Contributing
**Include when:** Repository accepts contributions

```markdown
## Contributing

Contributions are welcome! See [docs/development.md](docs/development.md) for setup instructions.

Quick steps:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request
```

**Guidelines:**
- Keep brief - details go in docs/development.md
- Be welcoming
- Link to detailed guide

**Skip when:** Internal project not accepting contributions

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

---

## Front-matter

README.md should include front-matter in HTML comment format (hidden from GitHub rendering):

```markdown
<!--
---
scope:
  paths:
    - README.md
    - package.json          # Version, dependencies
    - Dockerfile           # Docker setup
    - Makefile            # Build commands
    - .env.example        # Config examples
    - src/main.*          # Entry points
    - .github/workflows/* # CI/CD
  summary: "User-facing documentation for installation, usage, and quick start"
last_review_date: 2025-01-15T10:30:00Z
last_updated: 2025-01-15T10:30:00Z
---
-->
```

**Important:** Use HTML comment format (`<!-- -->`) to hide front-matter from GitHub rendering.

### Scope Paths Guidelines

README scope should track files that affect:
- Installation process (package manifests, setup scripts)
- Usage examples (if tied to specific entry points)
- Project metadata (version, description)

**Don't track:**
- Implementation files (covered by docs/)
- Internal documentation
- Test files
- Development-only configurations

---

## Tone and Style

- **User-facing** - Write for someone discovering the project
- **Action-oriented** - Focus on what users can do
- **Concrete** - Use real examples, not placeholders
- **Concise** - Respect the reader's time
- **Honest** - Don't oversell or make false claims

---

## Preserving Existing Content

When updating an existing README:

1. **Preserve custom sections** - Keep non-standard sections the user added
2. **Enhance, don't replace** - Improve existing content rather than rewriting
3. **Maintain voice** - Match the existing tone and style
4. **Keep examples** - Preserve working code examples
5. **Update outdated info** - Fix installation steps, commands, or examples that changed
6. **Add docs index** - If missing, add the Documentation section pointing to docs/

---

## When to Update README

**Update when:**
- Installation process changes
- New major features are added
- Usage examples become outdated
- Project description/scope evolves

**Don't update for:**
- Internal refactoring
- Bug fixes that don't affect usage
- Minor version bumps
- Code reorganization that doesn't impact users
- Development workflow changes (those go in docs/development.md)
