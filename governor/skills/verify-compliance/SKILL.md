---
name: verify-compliance
description: This skill should be used when the user asks to "verify tenets", "check tenet compliance", "validate code against tenets", "run tenet verification", or needs to analyze code for tenet violations. Supports multiple scope modes for flexible verification.
---

# Verify Compliance

Deep, thorough tenet compliance analysis. Analysis depth is always thorough; performance is controlled by scope.

## Input

Parameters received in the prompt:

| Parameter | Values | Description |
|-----------|--------|-------------|
| `mode` | `files` \| `changed` \| `all` \| `paths` | How to determine files to check |
| `files` | file list | Explicit file list (for `files` mode) |
| `base_ref` | branch name | Branch to compare against (for `changed` mode, default: main) |
| `paths` | directory list | Directories to scan (for `paths` mode) |
| `confidence_threshold` | 0-100 | Minimum confidence to report (default: 50) |

## Process

1. **Read AGENTS.md** - Extract all tenets (T1, T2, etc.) with their names and descriptions
2. **Determine files to check** based on mode:
   - `files`: Use the explicit file list provided in the prompt
   - `changed`: Run `git diff --name-only <base_ref>...HEAD` to get changed files
   - `paths`: Glob for code files in the provided directories
   - `all`: Glob for all code files in the repository (respect .gitignore)
3. **Read each file** - Use Read tool to get content
4. **For each tenet, analyze all files** - Check whether any file violates the tenet
5. **Assess confidence** - Assign confidence score to each violation
6. **Filter by threshold** - Only include violations at or above confidence_threshold

## Guidelines

- **Be thorough** - Leave no stone unturned. Check imports, function contents, file locations, naming patterns, architectural boundaries
- **Be specific** - Include file path, line number, and what specifically violates the tenet
- **Be conservative** - When uncertain, assign lower confidence
- **Confidence scoring:**
  - **90-100**: Clear, unambiguous violation (e.g., forbidden import present, wrong layer dependency)
  - **70-89**: Likely violation, minor ambiguity
  - **50-69**: Possible violation, needs human review
  - **1-49**: Uncertain, might be false positive

## Output

Return JSON with this structure:

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

If fully compliant:

```json
{
  "summary": {
    "compliant": true,
    "total_files_checked": 42,
    "total_violations": 0
  },
  "tenets": [
    {
      "id": "T1",
      "name": "Domain layer has no infrastructure dependencies",
      "status": "compliant",
      "violations": []
    }
  ],
  "scope": {
    "mode": "all",
    "base_ref": null
  }
}
```
