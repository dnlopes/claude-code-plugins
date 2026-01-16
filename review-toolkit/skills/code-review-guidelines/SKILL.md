---
name: code-review-guidelines
description: Use when reviewing code changes or pull requests. Provides the foundational rules, principles, and checklists for all code review agents.
---

# Code Review Guidelines

Reference knowledge for code review agents. Load this skill to understand review scope, filtering rules, and quality standards.

## The Changed Lines Rule

**This rule is non-negotiable for all review agents.**

Review scope is LIMITED to lines that were ADDED or MODIFIED in the diff:

- `+` lines (additions) - reviewable
- Modified lines - reviewable
- Unchanged lines - NOT reviewable (context only)
- Pre-existing issues - NOT reviewable

**Silent filtering**: Skip pre-existing issues without mention. Do not say "I found X but it's pre-existing." Simply omit them entirely.

**Verification**: Before reporting any issue, confirm the line appears in the diff as an addition or modification.

## Review Principles

1. **Signal over noise** - Report issues that matter, skip nitpicks
2. **Actionable feedback** - Every issue includes a concrete fix
3. **Evidence-based** - Cite file paths and line numbers
4. **Context-aware** - Check project guidelines (CLAUDE.md, README.md) first
5. **Pragmatic** - Consider cost/benefit of each finding

## Output Standards

All review agents use consistent output:

| File | Line | Type | Issue | Fix |
|------|------|------|-------|-----|
| `path/file.ts` | 42 | Type | 10 words max | 10 words max |

**Type labels**:
- Bug - Logic errors, crashes, data issues
- Security - Vulnerabilities, auth issues
- Quality - Maintainability, patterns
- Test - Missing coverage
- Contract - API/type design issues
- Context - Historical patterns

## Reference Checklists

Detailed checklists are available in `references/`:

- `code-quality-checklist.md` - Clean code, SOLID, naming, architecture
- `security-checklist.md` - OWASP-aligned security checks
- `contracts-checklist.md` - API and type design checks
- `test-coverage-checklist.md` - Test quality and coverage checks

Load specific checklists only when needed for that review type.

## Severity Classification

| Level | Criteria | Action |
|-------|----------|--------|
| Critical | Data loss, security breach, production outage | Block merge |
| High | Core feature broken, significant bug | Should fix before merge |
| Medium | Edge case issues, maintainability | Consider fixing |
| Low | Minor improvements, style | Optional |

## Confidence Thresholds

Issues must meet minimum confidence for their impact level:

| Impact | Min Confidence | Rationale |
|--------|---------------|-----------|
| Critical (81-100) | 50% | Investigate even with moderate confidence |
| High (61-80) | 65% | Avoid false alarms on important issues |
| Medium (41-60) | 75% | Need high confidence to justify effort |
| Low (21-40) | 85% | Only report if very confident |
| Minor (0-20) | 95% | Only if nearly certain |
