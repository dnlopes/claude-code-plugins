---
description: Comprehensive pull request review using specialized agents
allowed-tools: ["Bash", "Glob", "Grep", "Read", "Task", "Bash(gh pr comment:*)", "Bash(gh pr diff:*)", "Bash(gh pr view:*)", "Bash(gh pr list:*)"]
argument-hint: "[review-aspects]"
---

# Pull Request Review

Orchestrates a multi-agent code review workflow for pull requests or local branch changes.

**Review Aspects (optional):** "$ARGUMENTS"

## Prerequisites

Load the `code-review-guidelines` skill for review rules, output standards, and confidence thresholds.

## Workflow

### Phase 1: Gather Context

1. **Detect Review Target**
   ```bash
   gh pr view  # Check if PR exists
   ```
   - PR exists → Use `gh pr diff`
   - No PR → Use `git diff main...HEAD`

2. **Identify Changed Files**
   ```bash
   gh pr diff --name-only  # or git diff main...HEAD --name-only
   ```
   Categorize by type (source, test, config, docs).

3. **Collect Project Guidelines** (Haiku agent)
   List paths to: CLAUDE.md, AGENTS.md, README.md, constitution.md (if they exist).

4. **Summarize Changes** (Haiku agent)
   Brief summary of what changed and why.

### Phase 2: Run Review Agents

Launch applicable agents **in parallel** (up to 6 Sonnet agents):

| Agent | When to Use |
|-------|-------------|
| `bug-hunter` | Always |
| `code-quality-reviewer` | Always |
| `security-auditor` | Always |
| `historical-context-reviewer` | Always |
| `test-coverage-reviewer` | Test files changed |
| `contracts-reviewer` | Types, APIs, or data models changed |

**For each agent, provide:**
- List of changed files
- Change summary
- Project guideline file paths
- Reminder: Only report issues on changed lines

### Phase 3: Score and Filter

1. **Score Each Issue** (parallel Haiku agents)

   For each issue from Phase 2, evaluate:

   **Confidence (0-100)**: How certain is this a real issue?
   - 0: False positive or pre-existing
   - 25: Might be real, might be false positive
   - 50: Verified real, but might be nitpick
   - 75: Double-checked, likely hit in practice
   - 100: Absolutely certain, will happen frequently

   **Impact (0-100)**: How severe if unfixed?
   - 0-20: Minor style issue
   - 21-40: Maintainability, no functional impact
   - 41-60: Edge case errors or performance
   - 61-80: Core feature broken, data corruption
   - 81-100: Runtime errors, data loss, security breach

2. **Apply Filter Thresholds**

   | Impact | Min Confidence | Rationale |
   |--------|---------------|-----------|
   | 81-100 (Critical) | 50 | Investigate even with moderate confidence |
   | 61-80 (High) | 65 | Avoid false alarms on important issues |
   | 41-60 (Medium) | 75 | Need high confidence to justify effort |
   | 21-40 (Low) | 85 | Only if very confident |
   | 0-20 (Minor) | 95 | Only if nearly certain |

   **Remove issues below threshold.**

3. **Post Results**
   - PR exists → `gh pr comment`
   - No PR → Print to console

## Output Format

```markdown
## Code Review

**Result**: ✅ PASS / ❌ FAIL

### Issues Found

| File | Line | Type | Issue | Fix |
|------|------|------|-------|-----|
| `path/file.ts` | 42 | 🔴 Bug | Description (10 words max) | Fix (10 words max) |

```

**Type labels:**
- 🔴 Bug - Logic errors, crashes, data issues
- 🟡 Security - Vulnerabilities, auth issues
- 🔵 Quality - Maintainability, patterns
- 🟢 Test - Missing coverage
- 🟣 Contract - API/type design

**Rules:**
- Max 5-7 issues
- Line numbers from diff only
- 10 words max per cell
- No verbose explanations

### If No Issues

```markdown
## Code Review

**Result**: ✅ PASS

No issues found.
```

## Filtering Rules

**Never report:**
- Pre-existing issues (not in diff)
- Linter/compiler issues (CI handles)
- Pedantic nitpicks
- Code with lint-ignore comments
- Intentional deliberate changes

**Skip folders:** `spec/`, `reports/` (unless specifically requested)
