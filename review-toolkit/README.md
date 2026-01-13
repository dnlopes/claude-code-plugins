# review-toolkit

Comprehensive code review with security, quality, and test coverage analysis.

## Purpose

Provides multi-perspective code review through specialized agents that examine security, code quality, test coverage, contracts, and historical context.

## Features

### Commands

- `/review-toolkit:review-pr` - Review code changes with multiple specialized agents (works with PRs or current branch vs main)

### Agents

- **security-auditor** - Security vulnerability detection and assessment
- **code-quality-reviewer** - Code quality, maintainability, and best practices
- **test-coverage-reviewer** - Test coverage analysis and recommendations
- **contracts-reviewer** - API contracts and interface validation
- **bug-hunter** - Potential bug identification and edge case analysis
- **historical-context-reviewer** - Review changes in context of project history

## Installation

```bash
claude-code plugins install /path/to/cloud-code-plugins/review-toolkit
```

## Quick Example

```bash
# Review a GitHub PR
/review-toolkit:review-pr

# Review current branch against main (when no PR exists)
/review-toolkit:review-pr
```

## How It Works

The review process:

1. Determines context (PR diff or branch diff against main)
2. Spawns specialized review agents in parallel
3. Each agent analyzes from their perspective
4. Issues are scored for confidence and impact
5. Results are filtered and posted as PR comment or console output

## Review Perspectives

Each agent provides focused analysis:

- **Security** - Vulnerabilities, injection risks, auth issues
- **Quality** - Readability, maintainability, design patterns
- **Testing** - Coverage gaps, test quality, edge cases
- **Contracts** - Breaking changes, API consistency
- **Bugs** - Logic errors, race conditions, null handling
- **History** - Consistency with codebase patterns and decisions
