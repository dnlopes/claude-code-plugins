---
description: Check code against tenets in AGENTS.md with confidence scoring. Supports JSON output for CI/CD
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
  - Task
argument-hint: "mode:<files|changed|paths|all> [options]"
---

# Verify Tenets

Check code compliance against tenets defined in AGENTS.md.

**Load skill `tenet-governance`** for tenet format, confidence scoring, and verification patterns.

## Workflow

```
Verification Progress:
- [ ] Step 1: Pre-flight and parse tenets
- [ ] Step 2: Determine scope and options
- [ ] Step 3: Load exceptions
- [ ] Step 4: Spawn verification agent
- [ ] Step 5: Collect and output results
```

## Step 1: Pre-flight and Parse Tenets

```bash
test -f AGENTS.md && echo "AGENTS.md: Found" || echo "AGENTS.md: Not found"
grep -n "^## Tenets" AGENTS.md 2>/dev/null && echo "Tenets: Found" || echo "Tenets: Not found"
```

**If not found:** `No tenets found. Run /governor:setup first.`

Parse AGENTS.md to extract:
- Tenet ID, name, description, severity
- Evidence references (for context)

## Step 2: Determine Scope and Options

Extract from user prompt or use defaults:

| Parameter | Values | Default |
|-----------|--------|---------|
| mode | `files`, `changed`, `paths`, `all` | required |
| files | explicit file list | (for files mode) |
| paths | directory list | (for paths mode) |
| base | branch name | main |
| confidence | 0-100 | 50 |
| severity | minimum level | low |
| output | `human`, `json` | human |

**File discovery by mode:**

| Mode | Method |
|------|--------|
| `files` | Use explicit list from prompt |
| `changed` | `git diff --name-only <base>...HEAD` |
| `paths` | Glob for code files in specified directories |
| `all` | Glob all code files (respect .gitignore) |

Filter to code files only (exclude images, configs, etc.).

## Step 3: Load Exceptions

Parse `## Tenet Exceptions` section from AGENTS.md:

```markdown
| File | Tenet | Reason | Approved |
|------|-------|--------|----------|
| `src/legacy/adapter.go` | T1 | Legacy integration | 2024-01-15 |
```

Build exception map: `{ "src/legacy/adapter.go": ["T1"], ... }`

## Step 4: Spawn Verification Agent

Use the Task tool to spawn `governor:tenet-verifier` agent:

```markdown
Verify compliance of the following files against these tenets.

**Tenets:**
<For each tenet: ID, name, description, severity>

**Files to verify:**
<List of files from scope>

**Exceptions:**
<Exception map>

**Thresholds:**
- Confidence minimum: <N>%
- Severity minimum: <level>

Return findings in structured format with file:line, confidence score, and reason for each violation.
```

The agent will:
1. Read each file
2. Check against each applicable tenet
3. Score confidence for any violations
4. Respect exceptions
5. Return structured findings

## Step 5: Collect and Output Results

### Human Output (default)

**If compliant:**
```
✓ Tenet Verification Passed

Scope: <N> files (<mode description>)
Tenets checked: <N> (severity >= <level>)
Confidence threshold: <N>%

─────────────────────────────────────
T1. <Name> [<severity>]
   ✓ COMPLIANT
─────────────────────────────────────
T2. <Name> [<severity>]
   ✓ COMPLIANT
─────────────────────────────────────
```

**If violations found:**
```
✗ Tenet Verification Failed

Scope: <N> files (<mode description>)
Found <N> violations across <N> tenets

─────────────────────────────────────
T1. <Name> [<severity>]
   ✗ VIOLATED (<N> violations)

   • <file>:<line> (<confidence>%)
     <reason>

   • <file>:<line> (<confidence>%)
     <reason>

─────────────────────────────────────
T2. <Name> [<severity>]
   ✓ COMPLIANT
─────────────────────────────────────
T3. <Name> [<severity>]
   ⚠ EXCEPTION (<N> approved)

   • <file>:<line>
     Exception: <reason>
─────────────────────────────────────

Exit: FAIL (<N> violations at severity >= <level>)
```

### JSON Output (for CI/CD)

When `output:json` specified:

```json
{
  "summary": {
    "compliant": false,
    "files_checked": 42,
    "violations": 2,
    "exceptions_applied": 1
  },
  "options": {
    "mode": "changed",
    "base": "main",
    "confidence_threshold": 50,
    "severity_minimum": "low"
  },
  "tenets": [
    {
      "id": "T1",
      "name": "Domain Isolation",
      "severity": "critical",
      "status": "violated",
      "violations": [
        {
          "file": "src/api/handler.go",
          "line": 45,
          "confidence": 92,
          "reason": "Imports infrastructure/db directly",
          "exception": null
        }
      ]
    }
  ],
  "exceptions": [
    {
      "file": "src/legacy/adapter.go",
      "tenet": "T1",
      "reason": "Legacy integration",
      "approved": "2024-01-15"
    }
  ],
  "exit_code": 1
}
```

### Exit Codes (for CI)

| Code | Meaning |
|------|---------|
| 0 | All tenets compliant |
| 1 | Violations at severity >= high |
| 2 | Violations at severity >= critical only |

## Usage Examples

```bash
# Check changed files against main
/governor:verify mode:changed

# Check changed files against specific branch
/governor:verify mode:changed base:develop

# Check specific files
/governor:verify mode:files files:src/api/handler.go,src/domain/user.go

# Check all code in specific paths
/governor:verify mode:paths paths:src/domain,src/api

# Check entire codebase
/governor:verify mode:all

# Higher confidence threshold
/governor:verify mode:changed confidence:75

# Only check critical tenets
/governor:verify mode:changed severity:critical

# JSON output for CI
/governor:verify mode:changed output:json
```

## Scope Descriptions

| Mode | Description in Output |
|------|----------------------|
| all | "entire codebase" |
| changed | "changed vs <base>" |
| files | "<N> specified files" |
| paths | "in <paths>" |
