# README Template

This template defines the structure for repository README.md files.

## Purpose

The README.md is user-facing documentation that serves both end users and potential contributors. It should be:
- **Welcoming** - Clear, accessible language
- **Practical** - Focus on getting started quickly
- **Complete** - Cover both usage and development
- **Accurate** - Reflect the actual state of the project

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

#### 7. Development
```markdown
## Development

Information for contributors:

### Prerequisites
- Required tools and versions
- System dependencies

### Setup
\`\`\`bash
# Clone and install
\`\`\`

### Building
\`\`\`bash
# Build commands
\`\`\`

### Testing
\`\`\`bash
# Test commands
\`\`\`

### Running Locally
\`\`\`bash
# Development server/commands
\`\`\`
```

#### 8. Contributing
```markdown
## Contributing

Brief guide on how to contribute:
- How to report issues
- How to submit PRs
- Code style/conventions (brief)
- Link to CONTRIBUTING.md if it exists

Keep this section concise.
```

### Optional Sections

#### Architecture (for complex projects)
```markdown
## Architecture

High-level overview:
- Main components and how they interact
- Data flow
- External dependencies

Can include a simple diagram if helpful.
```

#### API Reference (for libraries)
```markdown
## API Reference

Key API functions/classes with examples.
Or: Link to full API documentation.
```

#### Deployment (for applications)
```markdown
## Deployment

How to deploy to production:
- Deployment options
- Environment setup
- Configuration requirements
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

## Front-matter

README.md should include front-matter for staleness tracking:

```yaml
---
scope:
  paths:
    - package.json          # Version, dependencies
    - Dockerfile           # Docker setup
    - Makefile            # Build commands
    - .env.example        # Config examples
    - src/main.*          # Entry points
    - .github/workflows/* # CI/CD
  summary: "User-facing documentation for installation, usage, and development"
last_commit: abc123def456789...
last_updated: 2025-01-15T10:30:00Z
---
```

## Scope Paths Guidelines

README scope should track files that affect:
- Installation process (package manifests, setup scripts)
- Usage examples (if tied to specific entry points)
- Development workflow (build tools, test configs)
- Project metadata (version, description)

**Don't track:**
- Implementation files that don't affect user-facing behavior
- Internal documentation
- Test files (unless they demonstrate usage)

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

## When to Update

README should be updated when:
- Installation process changes
- New major features are added
- Usage examples become outdated
- Development setup changes
- Project description/scope evolves

**Don't update for:**
- Internal refactoring
- Bug fixes that don't affect usage
- Minor version bumps
- Code reorganization that doesn't impact users
