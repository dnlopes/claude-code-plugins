# review-toolkit

Multi-agent code review toolkit that orchestrates specialized reviewers for comprehensive pull request analysis.

**Version:** 3.0.0

## Architecture

```
review-toolkit/
├── commands/
│   └── review-pr.md              # Orchestrator workflow
├── skills/
│   └── code-review-guidelines/   # Shared review knowledge
│       ├── SKILL.md              # Core rules and principles
│       └── references/           # Detailed checklists
│           ├── code-quality-checklist.md
│           ├── security-checklist.md
│           ├── contracts-checklist.md
│           └── test-coverage-checklist.md
└── agents/
    ├── bug-hunter.md             # Root cause analysis
    ├── security-auditor.md       # Vulnerability detection
    ├── code-quality-reviewer.md  # Maintainability review
    ├── contracts-reviewer.md     # API/type design review
    ├── test-coverage-reviewer.md # Test completeness review
    └── historical-context-reviewer.md  # Git history analysis
```

## Commands

| Command | Description |
|---------|-------------|
| `/review-toolkit:review-pr` | Comprehensive pull request review using specialized agents |

## Agents

| Agent | Focus Area |
|-------|------------|
| `bug-hunter` | Bugs, logic errors, silent failures |
| `security-auditor` | Security vulnerabilities and risks |
| `code-quality-reviewer` | Project guidelines, maintainability, quality |
| `contracts-reviewer` | Type design, API changes, data modeling |
| `test-coverage-reviewer` | Test coverage quality and completeness |
| `historical-context-reviewer` | Git blame, previous changes, patterns |

## Skills

| Skill | Purpose |
|-------|---------|
| `code-review-guidelines` | Shared rules, output formats, and confidence thresholds used by all agents |

## Workflow

### Phase 1: Gather Context

- Check for open PR with `gh pr view`
- If no PR: review current branch vs `main`
- Identify changed files and gather project guidelines

### Phase 2: Run Review Agents

Launch up to 6 parallel agents:
- **Always run:** bug-hunter, code-quality-reviewer, security-auditor, historical-context-reviewer
- **If test files changed:** test-coverage-reviewer
- **If types/API changed:** contracts-reviewer

### Phase 3: Score and Filter

Each issue gets two scores:
- **Confidence (0-100):** How certain the issue is real
- **Impact (0-100):** Severity if left unfixed

Issues are filtered using progressive thresholds:

| Impact | Min Confidence |
|--------|----------------|
| Critical (81-100) | 50 |
| High (61-80) | 65 |
| Medium (41-60) | 75 |
| Low (21-40) | 85 |
| Minor (0-20) | 95 |

### Output

- PR exists: posts comment via `gh pr comment`
- No PR: prints to console

## Critical Rule

**Only review changed lines.** Never report issues on pre-existing code. This rule is enforced by the `code-review-guidelines` skill loaded by all agents.
