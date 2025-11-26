# reviewer-toolkit

Comprehensive code review with security, quality, and test coverage analysis.

## Purpose

Provides multi-perspective code review through specialized agents that examine security, code quality, test coverage, contracts, and historical context.

## Features

### Commands

- `/reviewer-toolkit:review-pr` - Review a GitHub pull request with multiple specialized agents
- `/reviewer-toolkit:review-local-changes` - Review uncommitted local changes before committing

### Agents

- **security-auditor** - Security vulnerability detection and assessment
- **code-quality-reviewer** - Code quality, maintainability, and best practices
- **test-coverage-reviewer** - Test coverage analysis and recommendations
- **contracts-reviewer** - API contracts and interface validation
- **bug-hunter** - Potential bug identification and edge case analysis
- **historical-context-reviewer** - Review changes in context of project history

## Installation

```bash
claude-code plugins install /path/to/cloud-code-plugins/reviewer-toolkit
```

## Quick Example

```bash
# Review a GitHub PR
/reviewer-toolkit:review-pr 123

# Review local changes before committing
/reviewer-toolkit:review-local-changes
```

## How It Works

The review process:

1. Fetches changes (from PR or local diff)
2. Spawns specialized review agents in parallel
3. Each agent analyzes from their perspective
4. Results are synthesized into actionable feedback
5. Critical issues are prioritized

## Review Perspectives

Each agent provides focused analysis:

- **Security** - Vulnerabilities, injection risks, auth issues
- **Quality** - Readability, maintainability, design patterns
- **Testing** - Coverage gaps, test quality, edge cases
- **Contracts** - Breaking changes, API consistency
- **Bugs** - Logic errors, race conditions, null handling
- **History** - Consistency with codebase patterns and decisions
