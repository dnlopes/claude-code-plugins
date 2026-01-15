# Governor Plugin: Verify Tenets Enhancement

## Overview

Extend the governor plugin with flexible tenet verification capabilities and simplify by removing script generation.

## Changes Summary

| Component | Action | Description |
|-----------|--------|-------------|
| `verify-compliance` skill | MODIFY | Add mode parameter for flexible scope control |
| `verify-tenets` command | CREATE | Human-friendly verification interface |
| `setup-hooks` command | DELETE | Remove script generation, let users compose their own |

## Design

### Skill: `verify-compliance` (modified)

**Location:** `governor/skills/verify-compliance/SKILL.md`

**Purpose:** Deep, thorough tenet compliance analysis with structured JSON output. Analysis depth is always thorough; performance is controlled by scope.

**Inputs (via prompt):**

| Parameter | Values | Description |
|-----------|--------|-------------|
| `mode` | `files` \| `changed` \| `all` \| `paths` | How to determine files to check |
| `files` | file list | Explicit file list (for `files` mode) |
| `base_ref` | branch name | Branch to compare against (for `changed` mode, default: main) |
| `paths` | directory list | Directories to scan (for `paths` mode) |
| `confidence_threshold` | 0-100 | Minimum confidence to report (default: 50) |

**Mode behavior:**

| Mode | Scope | Use Case |
|------|-------|----------|
| `files` | Explicit file list | Pre-commit hooks, CI on specific files |
| `changed` | Files changed vs base branch | PR reviews, feature branch validation |
| `paths` | Specific directories | Targeted audits |
| `all` | Entire codebase | Full audits, periodic health checks |

**Process:**
1. Read AGENTS.md, extract all tenets (T1, T2, etc.)
2. Determine files to check based on mode:
   - `files`: use provided file list
   - `changed`: `git diff --name-only <base_ref>...HEAD`
   - `paths`: glob for code files in provided paths
   - `all`: glob for all code files (respecting .gitignore)
3. For each file, read content and analyze against each tenet
4. Assign confidence scores to violations
5. Output JSON

**Output schema:**

```json
{
  "summary": {
    "compliant": false,
    "total_files_checked": 42,
    "total_violations": 5
  },
  "tenets": [
    {
      "id": "T1",
      "name": "Domain layer has no infrastructure dependencies",
      "status": "violated",
      "violations": [
        {
          "file": "src/domain/user.go",
          "line": 12,
          "reason": "imports database/sql package",
          "confidence": 95
        }
      ]
    },
    {
      "id": "T2",
      "name": "All public APIs must be documented",
      "status": "compliant",
      "violations": []
    }
  ],
  "scope": {
    "mode": "changed",
    "base_ref": "main"
  }
}
```

### Command: `/governor:verify-tenets` (new)

**Location:** `governor/commands/verify-tenets.md`

**Purpose:** Human-friendly interface to invoke verify-compliance skill and display formatted results.

**Usage:**
```bash
/governor:verify-tenets --mode changed                              # changed files vs main
/governor:verify-tenets --mode changed --base develop               # changed files vs develop
/governor:verify-tenets --mode all                                  # entire codebase
/governor:verify-tenets --mode files --files src/a.go src/b.go      # specific files
/governor:verify-tenets --mode paths --paths src/domain             # specific directories
/governor:verify-tenets --mode changed --confidence 80              # higher confidence threshold
```

**Flow:**
1. **Pre-flight:** Check AGENTS.md exists with tenets
2. **Execute:** Invoke `verify-compliance` skill with appropriate parameters
3. **Format:** Parse JSON response, display formatted summary

**Example output:**
```
✗ Tenet Verification Failed

Checked 42 files (changed vs main)
Found 5 violations across 2 tenets

─────────────────────────────────────
T1. Domain layer has no infrastructure dependencies
   VIOLATED (3 violations)

   • src/domain/user.go:12 (95%)
     imports database/sql package

   • src/domain/order.go:8 (87%)
     imports redis client directly
─────────────────────────────────────
T2. All public APIs must be documented
   COMPLIANT
─────────────────────────────────────
```

### Command: `/governor:setup-hooks` (delete)

**Reason:** Removing script generation simplifies the plugin. Users can compose their own CI/hook integrations using the skill directly:

```bash
# Example: user's pre-commit hook
claude -p "Invoke governor:verify-compliance skill. Mode: files. Files: $(git diff --cached --name-only)" \
  --output-format json

# Example: CI pipeline
claude -p "Invoke governor:verify-compliance skill. Mode: changed. Base: main" \
  --output-format json
```

## Final Plugin Structure

```
governor/
├── .claude-plugin/
│   └── plugin.json              # v1.2.0
├── agents/
│   └── tenet-validator.md       # unchanged
├── commands/
│   ├── manage.md                # unchanged
│   ├── setup.md                 # unchanged
│   └── verify-tenets.md         # NEW
└── skills/
    └── verify-compliance/
        └── SKILL.md             # MODIFIED
```

## Implementation Tasks

1. Modify `governor/skills/verify-compliance/SKILL.md` - add mode parameter and expanded logic
2. Create `governor/commands/verify-tenets.md` - human-friendly command
3. Delete `governor/commands/setup-hooks.md` - remove script generation
4. Update `governor/.claude-plugin/plugin.json` - bump version to 1.2.0
5. Update `.claude-plugin/marketplace.json` - bump governor version to 1.2.0
