# Front-matter Specification

Every document in `docs/claude/` MUST have YAML front-matter with the following fields.

## Required Fields

```yaml
---
scope:
  paths:
    - path/to/relevant/directory/**
    - path/to/specific/file.ts
  summary: "Brief description of what this document covers"
last_review_date: 2025-01-15T10:30:00Z
last_updated: 2025-01-15T10:30:00Z
---
```

## Field Definitions

### scope.paths
**Type:** Array of glob patterns
**Purpose:** Identifies which files/directories this document covers.

Used by `update-docs` to determine if the document is stale by running:
```bash
git log --since="<last_review_date>" --name-only -- <paths>
```

**Guidelines:**
- Use glob patterns: `src/auth/**` matches all files in auth and subdirectories
- Use specific files for targeted docs: `src/config/database.ts`
- Use wildcards: `src/*/index.ts` matches index files in immediate subdirectories
- Paths are relative to repository root

**Examples:**
```yaml
# Architecture doc - covers main structural directories
paths:
  - src/core/**
  - src/api/**
  - src/services/**

# Domain doc - covers business logic
paths:
  - src/domain/**
  - src/models/**
  - src/entities/**

# Patterns doc - covers representative files
paths:
  - src/**/*.test.ts
  - src/utils/**
  - src/middleware/**

# Development doc - covers build/config
paths:
  - Makefile
  - package.json
  - docker-compose.yml
  - .env.example
  - scripts/**
```

### scope.summary
**Type:** String
**Purpose:** Brief description of the document's coverage area.

Should be:
- One sentence
- Describe WHAT the doc covers, not WHAT the code does
- Help readers quickly understand if this doc is relevant

**Examples:**
```yaml
summary: "System architecture and component relationships"
summary: "Business domain concepts and terminology"
summary: "Code patterns and conventions with examples"
summary: "Build, test, and development workflow"
summary: "Authentication module internals and flows"
```

### last_review_date
**Type:** ISO 8601 timestamp with timezone
**Purpose:** Records when this document was last reviewed and verified accurate.

**Used for:**
- Staleness detection: `git log --since="<last_review_date>" --name-only -- <paths>`
- Audit trail: knowing when docs were last reviewed

**Update rule:** Update this field ONLY after:
1. Reviewing changes in scope paths since last_review_date
2. Updating document content if needed
3. Confirming document accurately reflects current code

**Why timestamp instead of commit hash:**
- Survives git squash merges (commit hashes become orphaned)
- Works naturally with feature branch → squash merge workflow
- Maintains git-based tracking while being more reliable

### last_updated
**Type:** ISO 8601 timestamp with timezone
**Purpose:** Human-readable timestamp of last update.

**Format:** `YYYY-MM-DDTHH:MM:SSZ` (UTC) or with offset `YYYY-MM-DDTHH:MM:SS+00:00`

## CLAUDE.md Front-matter

CLAUDE.md does NOT use scope-based front-matter since it covers the entire repository.

Instead, it uses a simpler format:

```yaml
---
last_review_date: 2025-01-15T10:30:00Z
last_updated: 2025-01-15T10:30:00Z
---
```

## Validation Rules

1. **paths must exist:** All paths in scope.paths should match at least one file in the repository
2. **last_review_date must be valid:** Must be a valid ISO 8601 timestamp, typically matching last_updated
3. **last_updated must be recent:** Should reflect when document was actually reviewed, not auto-generated

## Example Complete Front-matter

```yaml
---
scope:
  paths:
    - src/api/**
    - src/routes/**
    - src/middleware/**
  summary: "API layer architecture including routing and middleware"
last_review_date: 2025-01-15T10:30:00Z
last_updated: 2025-01-15T10:30:00Z
---

# API Architecture

...document content...
```
