---
scope:
  paths:
    - review-toolkit/**
  summary: "Plugin overview and usage guide"
last_updated: 2026-01-16T23:30:15Z
---

# Review-Toolkit Plugin

Multi-agent code review system for comprehensive pull request analysis.

## Goals

The review-toolkit plugin orchestrates specialized review agents to conduct thorough code analysis:

- **Bug detection** through systematic root cause analysis
- **Security auditing** aligned with OWASP guidelines
- **Code quality** assessment against project standards
- **Contract review** for APIs, types, and data models
- **Test coverage** analysis for behavioral completeness
- **Historical context** from git history and past PRs

## Commands

| Command | Description |
|---------|-------------|
| `/review-toolkit:review-pr` | Orchestrate multi-agent code review for PRs or local branch changes. Coordinates context gathering, agent execution, issue scoring, and output formatting |

## Skills

| Skill | Description |
|-------|-------------|
| `code-review-guidelines` | Foundational rules for all review agents: "Changed Lines Rule" (only review added/modified lines), output standards, severity classification, and confidence thresholds |

## Agents

| Agent | Description |
|-------|-------------|
| `bug-hunter` | Identifies bugs through systematic root cause analysis. Prioritizes data loss, security breaches, silent failures, and race conditions |
| `code-quality-reviewer` | Reviews code for adherence to project guidelines and clean code principles (DRY, KISS, YAGNI, SOLID) |
| `security-auditor` | Identifies vulnerabilities using OWASP-aligned analysis. Focuses on exploitable issues, not theoretical risks |
| `contracts-reviewer` | Analyzes API design, data models, and type definitions. Assesses breaking changes and migration paths |
| `test-coverage-reviewer` | Reviews test coverage quality with focus on behavioral coverage, not line coverage |
| `historical-context-reviewer` | Code archaeologist that examines git history and past PRs for relevant patterns and decisions |

## Workflows

### PR Review Process

1. **Gather Context**
   - Detect review target (open PR or git diff)
   - Identify changed files by type
   - Collect project guidelines

2. **Run Review Agents** (parallel)
   - Always: bug-hunter, code-quality-reviewer, security-auditor, historical-context-reviewer
   - Conditional: test-coverage-reviewer (if tests changed), contracts-reviewer (if APIs/types changed)

3. **Score and Filter**
   - Each finding scored by confidence (0-100) and impact (0-100)
   - Progressive thresholds filter low-confidence issues
   - Critical issues require only 50% confidence; minor issues require 95%

4. **Post Results**
   - PR exists: post via `gh pr comment`
   - No PR: print to console

### Changed Lines Rule

All agents must only report issues on lines marked as additions or modifications in the diff. Pre-existing issues are silently filtered without mention.

### Output Format

```markdown
## Code Review

**Result**: PASS / FAIL

| File | Line | Type | Issue | Fix |
|------|------|------|-------|-----|
| `file.ts` | 42 | Bug | Description | Solution |
```

## Version

4.0.0
