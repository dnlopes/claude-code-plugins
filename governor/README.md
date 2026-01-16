# governor

Project tenets management with evidence tracking, severity levels, and CI/CD integration.

**Version:** 2.1.0

## Commands

| Command | Description |
|---------|-------------|
| `/governor:setup` | Discover architectural constraints and create tenets in AGENTS.md |
| `/governor:verify` | Check code compliance against tenets with confidence scoring |
| `/governor:manage` | Add, remove, edit, or reorder tenets with validation |

## Skills

| Skill | Activated When |
|-------|----------------|
| `tenet-governance` | Working with architectural tenets (format, severity, verification patterns) |

## Agents

| Agent | Description |
|-------|-------------|
| `tenet-verifier` | Verify code compliance against tenets |

## Workflows

### Setup Tenets

1. Pre-flight check for existing AGENTS.md and tenets
2. Detect project type (Go, Node/TypeScript, Python, C#, Rust)
3. Explore codebase for architectural patterns
4. Review discovered tenets with user
5. Generate AGENTS.md with approved tenets

### Verify Compliance

Modes: `files`, `changed`, `paths`, `all`

```bash
/governor:verify mode:changed              # Check changed files vs main
/governor:verify mode:all output:json      # Full codebase, JSON for CI
/governor:verify mode:changed severity:critical  # Only critical tenets
```

Output includes confidence scores (0-100%) and respects approved exceptions.

### Manage Tenets

Actions: Add, Edit, Remove, Reorder, Exception

Changes are validated against the codebase before applying:
- **SUPPORTED** - Consistent patterns found
- **WEAK_EVIDENCE** - Only 1-2 instances
- **NOT_SUPPORTED** - No pattern found
- **CONTRADICTED** - Found violations (blocks change)

## Tenet Format

```markdown
### T1. Name

Description of the constraint and rationale.

**Severity:** critical | high | medium | low

**Evidence:**
- `file:line` - observation
```
