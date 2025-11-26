# project-documenter

Project documentation maintenance and repository onboarding.

## Purpose

Creates and maintains living documentation that serves real user needs while avoiding documentation bloat and maintenance overhead.

## Features

### Commands

- `/project-documenter:onboard-repo` - Create CLAUDE.md and docs/claude/ onboarding documentation for a repository
- `/project-documenter:update-docs` - Update and maintain project documentation (docs/, READMEs, API docs)

### Skills

- **onboard-repository** - Systematic codebase exploration for creating comprehensive onboarding documentation

## Installation

```bash
claude-code plugins install /path/to/cloud-code-plugins/project-documenter
```

## Quick Example

```bash
# Create onboarding documentation for a new repository
/project-documenter:onboard-repo

# Update existing project documentation
/project-documenter:update-docs

# Update specific documentation type
/project-documenter:update-docs api
```

## Documentation Philosophy

The plugin follows these principles:

- **User-focused** - Documentation must help users accomplish real tasks
- **Minimal but sufficient** - Avoid documentation bloat and maintenance debt
- **Living documentation** - Prefer generated docs over manually maintained ones
- **Discoverable** - Information should be where users expect it

## What Gets Created

**Repository Onboarding:**
- CLAUDE.md with project overview and setup
- docs/claude/ with architecture and contribution guides

**Documentation Updates:**
- Root and module READMEs
- API documentation (manual or generated)
- Architecture decision records
- Setup and troubleshooting guides
