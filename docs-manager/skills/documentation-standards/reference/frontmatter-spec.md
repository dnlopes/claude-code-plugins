# Front-matter Specification

Every document in `docs/` and tracked README.md files must have YAML front-matter for staleness tracking.

## Formats

### Standard Format (docs/)

```yaml
---
scope:
  paths:
    - path/to/directory/**
    - path/to/file.ts
  summary: "Brief description of coverage"
last_review_date: 2025-01-15T10:30:00Z
last_updated: 2025-01-15T10:30:00Z
---
```

### HTML Comment Format (README.md)

For documents rendered on GitHub where YAML would be visible:

```markdown
<!--
---
scope:
  paths:
    - README.md
    - package.json
  summary: "Project overview and installation"
last_review_date: 2025-01-15T10:30:00Z
last_updated: 2025-01-15T10:30:00Z
---
-->
```

### AGENTS.md Format

AGENTS.md at repository root does NOT use scope-based front-matter. Staleness is determined by checking if any docs/ files were updated.

```yaml
---
last_updated: 2025-01-15T10:30:00Z
---
```

## Field Definitions

### scope.paths

**Type:** Array of glob patterns
**Purpose:** Files/directories this document covers

Used for staleness detection:
```bash
git log --since="<last_review_date>" --name-only -- <paths>
```

**Examples:**
```yaml
# Architecture - structural directories
paths:
  - src/core/**
  - src/api/**

# Development - build/config files
paths:
  - Makefile
  - package.json
  - docker-compose.yml
```

### scope.summary

**Type:** String
**Purpose:** One sentence describing coverage area

### last_review_date

**Type:** ISO 8601 timestamp (UTC)
**Purpose:** When document was last reviewed and verified accurate

**Why timestamps instead of commit hashes:**
- Survives git squash merges (hashes become orphaned)
- Works with feature branch → squash merge workflow

### last_updated

**Type:** ISO 8601 timestamp (UTC)
**Purpose:** When document content was last modified

## Validation Rules

1. All paths in scope.paths should match at least one file
2. Timestamps must be valid ISO 8601 format
3. last_review_date typically matches last_updated
