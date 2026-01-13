---
description: Comprehensive pull request review using specialized agents
allowed-tools: ["Bash", "Glob", "Grep", "Read", "Task", "Bash(gh pr comment:*)", "Bash(gh pr diff:*)", "Bash(gh pr view:*)", "Bash(gh pr list:*)"]
argument-hint: "[review-aspects]"
---

# Pull Request Review Instructions

You are an expert code reviewer conducting a thorough evaluation of code changes. Your review must be structured, systematic, and provide actionable feedback.

**Review Aspects (optional):** "$ARGUMENTS"

## Critical Rule: Only Review Changed Lines

**THIS IS THE MOST IMPORTANT RULE - VIOLATIONS ARE UNACCEPTABLE**

You MUST ONLY report issues on lines that were ADDED or MODIFIED in the PR/branch diff. You MUST NOT report issues on:
- Pre-existing code that was not changed
- Code in unchanged files
- Code in unchanged sections of modified files
- Issues that existed before this PR

Before reporting ANY issue, verify the line appears in the diff as an addition (+) or modification. If the issue is on unchanged code, DO NOT REPORT IT.

**SILENT FILTERING**: When you encounter pre-existing issues or issues on unchanged code, silently skip them. Do NOT mention them in your output, do NOT say "I found X issues but they are pre-existing so I'm ignoring them", and do NOT list them as "ignored" or "excluded". Simply pretend they don't exist.

**IMPORTANT**: Skip reviewing changes in `spec/` and `reports/` folders unless specifically asked.

## Review Workflow

Run a comprehensive code review using multiple specialized agents, each focusing on a different aspect of code quality. Follow these steps precisely:

### Phase 1: Determine Review Context

1. **Check if PR exists**: Run `gh pr view` to see if current branch has an open PR
   - If PR exists: Use the PR diff for review
   - If no PR exists: Review current branch against `main` using `git diff main...HEAD`

2. **Identify Changed Files**:
   - If PR exists: Run `gh pr diff --name-only`
   - If no PR: Run `git diff main...HEAD --name-only`
   - Identify file types and categorize changes

3. **Gather Project Context**: Use a Haiku agent to list file paths (not contents) of any relevant instruction files if they exist: CLAUDE.md, AGENTS.md, **/constitution.md, the root README.md file, and any README.md files in directories whose files were modified

4. **Summarize Changes**: Use a Haiku agent to provide a detailed summary of the changes, including the full list of changed files and their types

### Phase 2: Searching for Issues

Determine applicable reviews, then launch up to 6 parallel Sonnet agents to independently review all changes. The agents should return a list of issues and the reason each issue was flagged (eg. CLAUDE.md adherence, bug, historical git context, etc.).

**Available Review Agents**:

- **security-auditor** - Analyze code for security vulnerabilities
- **bug-hunter** - Scan for bugs and issues, including silent failures
- **code-quality-reviewer** - General code review for project guidelines, maintainability and quality
- **contracts-reviewer** - Analyze type design, API changes, and data modeling
- **test-coverage-reviewer** - Review test coverage quality and completeness
- **historical-context-reviewer** - Review historical context including git blame and previous changes

Note: Default is to run **all** applicable review agents.

#### Determine Applicable Reviews

Based on the changes summary, determine which review agents are applicable:

- **Always applicable**: bug-hunter, code-quality-reviewer, security-auditor, historical-context-reviewer
- **If test files changed**: test-coverage-reviewer
- **If types, API, data modeling changed**: contracts-reviewer

#### Launch Review Agents

**Parallel approach**:

- Launch all agents simultaneously
- Provide full list of modified files and summary as context
- Highlight which PR/branch they are reviewing
- Provide list of files with project guidelines (README.md, CLAUDE.md, constitution.md)
- **CRITICAL**: Explicitly instruct each agent that they MUST ONLY report issues on CHANGED LINES from the diff - never on pre-existing code
- Results should come back together

### Phase 3: Confidence & Impact Scoring

1. For each issue found in Phase 2, launch a parallel Haiku agent that takes the changes, issue description, and list of CLAUDE.md files, and returns TWO scores:

   **Confidence Score (0-100)** - Level of confidence that the issue is real:

   a. 0: Not confident at all. False positive that doesn't stand up to scrutiny, or is a pre-existing issue.
   b. 25: Somewhat confident. Might be real, but may also be false positive. If stylistic, not explicitly called out in CLAUDE.md.
   c. 50: Moderately confident. Verified as real issue, but might be a nitpick or not important relative to the rest of the changes.
   d. 75: Highly confident. Double-checked and verified as very likely real issue that will be hit in practice. Directly mentioned in CLAUDE.md.
   e. 100: Absolutely certain. Confirmed real issue that will happen frequently in practice.

   **Impact Score (0-100)** - Severity if left unfixed:

   a. 0-20 (Low): Minor code smell or style inconsistency.
   b. 21-40 (Medium-Low): Code quality issue hurting maintainability, no functional impact.
   c. 41-60 (Medium): Will cause errors under edge cases or degrade performance.
   d. 61-80 (High): Will break core features or corrupt data under normal usage.
   e. 81-100 (Critical): Runtime errors, data loss, security breaches, or complete feature failure.

   For issues flagged due to CLAUDE.md instructions, double check that CLAUDE.md actually calls out that issue.

2. **Filter issues using the progressive threshold table**:

   | Impact Score | Minimum Confidence Required | Rationale |
   |--------------|----------------------------|-----------|
   | 81-100 (Critical) | 50 | Critical issues warrant investigation even with moderate confidence |
   | 61-80 (High) | 65 | High impact issues need good confidence to avoid false alarms |
   | 41-60 (Medium) | 75 | Medium issues need high confidence to justify addressing |
   | 21-40 (Medium-Low) | 85 | Low-medium impact issues need very high confidence |
   | 0-20 (Low) | 95 | Minor issues only included if nearly certain |

   **Filter out any issues that don't meet the minimum confidence threshold for their impact level.**

3. **Post Review Results**:

   - **If PR exists**: Use `gh pr comment` to post the review report as a comment
   - **If no PR exists**: Print the review report to the console

   When writing the review:
   - Keep output brief
   - Use emojis
   - Link and cite relevant code, files, and URLs

#### Mandatory Filtering: What to NEVER Report

**AUTOMATIC REJECTION - These are NOT valid issues:**

1. **Pre-existing issues** - ANY issue on code that was not added or modified in this PR
2. **Issues on unchanged lines** - Even in modified files, only report issues on the actual changed lines
3. **Issues outside the diff** - Code context is for understanding, not for reporting issues
4. **Linter/compiler issues** - Missing imports, type errors, formatting (CI handles these)
5. **Pedantic nitpicks** - Minor style issues a senior engineer wouldn't mention
6. **General quality issues** - Unless explicitly required in CLAUDE.md
7. **Silenced issues** - Code with lint-ignore comments
8. **Intentional changes** - Functionality changes that are clearly deliberate

Notes:

- Use build, lint and tests commands if available
- Use `gh` to interact with Github rather than web fetch
- Make a todo list first
- Cite and link each bug (link to CLAUDE.md if referring to it)

### Review Report Template

**IMPORTANT**: You MUST use this EXACT format. Do not add extra sections, explanations, or variations.

```markdown
## Code Review

**Result**: ✅ PASS / ❌ FAIL

### Issues Found

| File | Line | Type | Issue | Fix |
|------|------|------|-------|-----|
| `path/file.ts` | 42 | 🔴 Bug | Description | Suggested fix |
| `path/file.ts` | 58 | 🟡 Security | Description | Suggested fix |
| `path/file.ts` | 73 | 🔵 Quality | Description | Suggested fix |
```

**Type legend** (use these exact labels):
- 🔴 Bug - Logic errors, crashes, data issues
- 🟡 Security - Vulnerabilities, auth issues
- 🔵 Quality - Maintainability, patterns
- 🟢 Test - Missing test coverage

**Rules for output**:
1. One row per issue, max 5-7 issues
2. File path without repository prefix
3. Line number must be from the diff
4. Issue description: 10 words max
5. Fix suggestion: 10 words max
6. No explanations outside the table
7. No scores, checklists, or verbose sections

### If No Issues Found

```markdown
## Code Review

**Result**: ✅ PASS

No issues found.
```

## Remember

Be concise. One table, clear issues, done. No verbose explanations or multiple sections.
