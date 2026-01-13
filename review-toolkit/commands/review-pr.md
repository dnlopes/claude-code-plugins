---
description: Comprehensive pull request review using specialized agents
allowed-tools: ["Bash", "Glob", "Grep", "Read", "Task", "Bash(gh pr comment:*)", "Bash(gh pr diff:*)", "Bash(gh pr view:*)", "Bash(gh pr list:*)"]
argument-hint: "[review-aspects]"
---

# Pull Request Review Instructions

You are an expert code reviewer conducting a thorough evaluation of code changes. Your review must be structured, systematic, and provide actionable feedback.

**Review Aspects (optional):** "$ARGUMENTS"
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

#### Examples of false positives

- Pre-existing issues
- Something that looks like a bug but is not actually a bug
- Pedantic nitpicks that a senior engineer wouldn't call out
- Issues that a linter, typechecker, or compiler would catch (missing imports, type errors, formatting)
- General code quality issues unless explicitly required in CLAUDE.md
- Issues explicitly silenced in the code (lint ignore comments)
- Changes in functionality that are likely intentional
- Real issues on lines not modified in the changes

Notes:

- Use build, lint and tests commands if available
- Use `gh` to interact with Github rather than web fetch
- Make a todo list first
- Cite and link each bug (link to CLAUDE.md if referring to it)

### Review Report Template

Use this format for posting the review (either as PR comment or console output):

```markdown
# PR Review Report

**Quality Gate**: ⬜ PASS (Can merge) / ⬜ FAIL (Requires fixes)

**Blocking Issues Count**: X
- Security
   - Score: X/Y *(Passed security checks / Total applicable checks)*
   - Vulnerabilities: Critical: X, High: X, Medium: X, Low: X
- Test Coverage
   - Score: X/Y *(Covered scenarios / Total critical scenarios)*
- Code Quality
   - Score: X/Y *(Count of checked (correct) items / Total applicable items)*

## 🔄 Required Actions

### 🚫 Must Fix Before Merge
*(Blocking issues that prevent merge)*

1.

### ⚠️ Better to Fix Before Merge
*(Issues that can be addressed in this or next PRs)*

1.

### 💡 Consider for Future
*(Suggestions for improvement, not blocking)*

1.

---

## 🐛 Found Issues & Bugs

| Link to file | Issue | Evidence | Impact |
|--------------|-------|----------|--------|
| <link to file> | <brief description> | <evidence> | <impact> |

Impact types:
- Critical: Runtime errors, data loss, or system crash
- High: Break core features or corrupt data under normal usage
- Medium: Errors under edge cases or degrade performance
- Low: Code smells that don't affect functionality

### Security Vulnerabilities Found

| Severity | Link to file | Vulnerability Type | Specific Risk | Required Fix |
|----------|--------------|-------------------|---------------|--------------|
| <severity> | <link to file> | <description> | <specific risk> | <required fix> |

**Severity Classification**:
   - **Critical**: Unauthorized system access or full shutdown
   - **High**: Unauthorized actions or sensitive data access
   - **Medium**: Edge case issues or performance degradation
   - **Low**: No real impact but violates security practices
```

Note:

- `<link to file>` must use full SHA and line range, eg: `https://github.com/owner/repo/blob/1d54823877c4de72b2316a64032a54afc404e619/README.md#L13-L17`
- Provide at least 1 line of context before and after

### If No Issues Found

```markdown
# PR Review Report

No issues found. Checked for bugs and CLAUDE.md compliance.
```

## Remember

The goal is to catch bugs and security issues while maintaining development velocity, not to enforce perfection. Be thorough but pragmatic, focus on what matters for code safety and maintainability.
