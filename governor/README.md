---
scope:
  paths:
    - governor/**
  summary: "Plugin overview and usage guide"
last_updated: 2026-01-26T01:19:17Z
---

# Governor Plugin

Project tenets management with evidence tracking, severity levels, and CI/CD integration.

## Goals

The governor plugin provides a framework for managing **architectural tenets**—critical project constraints that embody architectural decisions. It enables teams to:

- **Discover** architectural constraints in existing codebases
- **Document** tenets with evidence and severity levels
- **Manage** tenet lifecycle (add, edit, remove, reorder)
- **Verify** code compliance against tenets with confidence scoring
- **Integrate** with CI/CD pipelines via JSON output

Tenets differ from linting rules by being architectural (not style-based), project-specific, and requiring human judgment to verify.

## Commands

| Command | Description |
|---------|-------------|
| `/governor:setup` | Discover architectural constraints and create tenets in AGENTS.md with evidence and severity levels |
| `/governor:verify` | Check code against tenets in AGENTS.md with confidence scoring. Supports JSON output for CI/CD |
| `/governor:manage` | Add, remove, edit, or reorder tenets in AGENTS.md with validation and evidence tracking |

## Skills

| Skill | Description |
|-------|-------------|
| `tenet-governance` | Comprehensive reference for tenet format, severity levels, validation criteria, and verification patterns across multiple languages |

## Agents

| Agent | Description |
|-------|-------------|
| `constraint-explorer` | Performs exhaustive codebase exploration to discover architectural constraints with comprehensive evidence for tenet creation |
| `tenet-verifier` | Analyzes code files against project tenets and reports violations with precise file:line references and confidence scores |

## Workflows

### Initial Tenet Discovery

1. Run `/governor:setup` in project directory
2. Command detects project type and explores codebase for patterns
3. Review discovered tenets (3-5 recommended)
4. Approve/edit/reject each tenet
5. AGENTS.md is created with evidenced tenets

### CI/CD Compliance Verification

1. Developer opens PR with code changes
2. CI pipeline runs: `/governor:verify mode:changed base:main output:json`
3. Verify command spawns tenet-verifier agent on changed files
4. JSON output feeds into CI report
5. PR blocks if critical violations found (exit code 2)

### Tenet Maintenance

1. Run `/governor:manage` to review current tenets
2. Select action (Add/Edit/Remove/Reorder/Exception)
3. System validates changes against codebase
4. Changes applied with renumbering and exception updates

## Version

3.1.0
