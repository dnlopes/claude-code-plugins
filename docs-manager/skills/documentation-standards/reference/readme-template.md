# README Template

This template defines the structure for repository README.md files.

## Purpose

The README.md is **public-facing documentation** that serves end users, potential contributors, and anyone discovering the project. It should be:
- **Welcoming** - Clear, accessible language
- **Practical** - Focus on getting started quickly
- **Concise** - Essential information only, with links to detailed docs
- **Accurate** - Reflect the actual state of the project

**Key principle:** README is the entry point. Development details belong in `docs/`.

## Structure

### Required Sections

#### 1. Header
```markdown
# Project Name

Brief tagline (one sentence describing what it does)

[Optional: Badges for build status, version, coverage, etc.]
```

#### 2. Summary
```markdown
## Summary

2-3 sentences explaining:
- What the project does
- Who it's for
- Key value proposition
```

#### 3. Features
```markdown
## Features

- Feature 1 - Brief description
- Feature 2 - Brief description
- Feature 3 - Brief description

Focus on user-visible capabilities, not implementation details.
```

#### 4. Installation
```markdown
## Installation

Clear steps for installing/setting up:
- Package manager commands
- Docker setup
- Binary downloads
- Building from source

Include prerequisites if needed.
```

#### 5. Quick Start
```markdown
## Quick Start

Minimal example to get something running immediately:

\`\`\`bash
# Commands here
\`\`\`

Expected output or result.
```

#### 6. Usage
```markdown
## Usage

Common use cases with examples:

### Use Case 1
\`\`\`
Example code/commands
\`\`\`

### Use Case 2
\`\`\`
Example code/commands
\`\`\`

Include enough detail for users to accomplish typical tasks.
```

#### 7. Documentation Index
```markdown
## Documentation

Detailed documentation is available in `docs/`:

- [Architecture](docs/architecture.md) - System design and components
- [Domain](docs/domain.md) - Business concepts and terminology
- [Patterns](docs/patterns.md) - Code conventions and examples
- [Development](docs/development.md) - Build, test, and contribute
```

This section replaces detailed development content in the README. Point users to the appropriate documentation file for in-depth information.

#### 8. Contributing
```markdown
## Contributing

Brief guide on how to contribute:
- How to report issues
- How to submit PRs
- Link to docs/development.md for detailed setup

Keep this section concise - detailed contribution info goes in docs/development.md.
```

### Optional Sections

#### API Reference (for libraries)
```markdown
## API Reference

Key API functions/classes with examples.
Or: Link to full API documentation.
```

#### Troubleshooting
```markdown
## Troubleshooting

Common issues and solutions:

### Issue 1
**Problem:** Description
**Solution:** How to fix
```

#### Roadmap
```markdown
## Roadmap

Planned features or improvements:
- [ ] Future feature 1
- [ ] Future feature 2
```

### Sections NOT in README

The following content should NOT be in README.md - it belongs in `docs/`:

| Content | Location |
|---------|----------|
| Detailed development setup | `docs/development.md` |
| Build system details | `docs/development.md` |
| Architecture explanations | `docs/architecture.md` |
| Domain concepts/glossary | `docs/domain.md` |
| Code patterns/conventions | `docs/patterns.md` |
| Environment variables | `docs/development.md` |
| Deployment procedures | `docs/development.md` |

## Front-matter

README.md should include front-matter in HTML comment format for staleness tracking (to hide it from GitHub rendering):

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

**Important:** README.md must use HTML comment format (wrapped in `<!-- -->`), not standard YAML front-matter, to prevent it from appearing in GitHub's rendered view.

## Scope Paths Guidelines

README scope should track files that affect:
- Installation process (package manifests, setup scripts)
- Usage examples (if tied to specific entry points)
- Project metadata (version, description)

**Don't track:**
- Implementation files (covered by docs/)
- Internal documentation
- Test files
- Development-only configurations

## Tone and Style

- **User-facing** - Write for someone discovering the project
- **Action-oriented** - Focus on what users can do
- **Concrete** - Use real examples, not placeholders
- **Concise** - Respect the reader's time
- **Honest** - Don't oversell or make false claims

## Examples vs Implementation Details

**Good examples:**
```markdown
## Quick Start

\`\`\`bash
npm install myproject
myproject serve --port 3000
\`\`\`

Your app is now running at http://localhost:3000
```

**Avoid implementation details:**
```markdown
## Quick Start

The CLI uses Commander.js to parse arguments and starts an Express server
on the specified port. The server initializes middleware in the following order...
```

## Preserving Existing Content

When updating an existing README:
1. **Preserve custom sections** - Keep non-standard sections the user added
2. **Enhance, don't replace** - Improve existing content rather than rewriting
3. **Maintain voice** - Match the existing tone and style
4. **Keep examples** - Preserve working code examples
5. **Update outdated info** - Fix installation steps, commands, or examples that changed
6. **Add docs index** - If missing, add the Documentation section pointing to docs/

## When to Update

README should be updated when:
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
