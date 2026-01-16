# review-toolkit

Code review toolkit with multi-agent PR analysis and specialized reviewers.

**Version:** 2.1.0

## Commands

| Command | Description |
|---------|-------------|
| `/review-toolkit:review-pr` | Comprehensive pull request review using specialized agents |

## Agents

| Agent | Focus Area |
|-------|------------|
| `security-auditor` | Security vulnerabilities and risks |
| `bug-hunter` | Bugs, logic errors, silent failures |
| `code-quality-reviewer` | Project guidelines, maintainability, quality |
| `contracts-reviewer` | Type design, API changes, data modeling |
| `test-coverage-reviewer` | Test coverage quality and completeness |
| `historical-context-reviewer` | Git blame, previous changes, patterns |

## Workflow

### Phase 1: Determine Context

- Check for open PR with `gh pr view`
- If no PR: review current branch vs `main`
- Identify changed files and gather project context

### Phase 2: Search for Issues

Launch up to 6 parallel agents to review all changes:
- **Always run:** bug-hunter, code-quality-reviewer, security-auditor, historical-context-reviewer
- **If test files changed:** test-coverage-reviewer
- **If types/API changed:** contracts-reviewer

### Phase 3: Confidence & Impact Scoring

Each issue gets two scores:
- **Confidence (0-100):** How certain the issue is real
- **Impact (0-100):** Severity if left unfixed

Issues are filtered using progressive thresholds:

| Impact | Min Confidence |
|--------|----------------|
| Critical (81-100) | 50 |
| High (61-80) | 65 |
| Medium (41-60) | 75 |
| Low (0-20) | 95 |

### Output

If PR exists: posts comment via `gh pr comment`
If no PR: prints to console

## Critical Rule

**Only review changed lines.** Never report issues on pre-existing code.
