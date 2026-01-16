# Task: Review Exploration Findings

Present exploration findings to user for approval before generating documentation.

## Input

You receive structured findings from codebase-explorer containing:
- Project overview
- Tech stack
- Architecture
- Patterns
- Principles
- Complex modules
- Scope paths

## Output Format

Present this summary:

```markdown
## Repository Analysis

**Project:** <name>
**Type:** <web app / CLI / library / API>
**Tech Stack:** <language> + <framework>

### Architecture
<Brief component overview>

### Identified Principles
1. <Principle 1>
2. <Principle 2>

### Complex Modules
<List modules that will get dedicated AGENTS.md, or "None identified">

### Documentation Plan
Will generate:
- `AGENTS.md` - Main agent documentation
- `CLAUDE.md` - Redirect to AGENTS.md
- `docs/architecture.md` - System design
- `docs/domain.md` - Business concepts <or "Skipped - technical project">
- `docs/patterns.md` - Code conventions
- `docs/development.md` - Build/test/run
<For each complex module:>
- `<path>/AGENTS.md` - Module documentation
- `<path>/CLAUDE.md` - Redirect

### Scope Tracking
Each document will track specific file patterns for staleness detection.

---

**Options:**
1. **Proceed** - Generate documentation with these findings
2. **Re-explore** - Gather more information about specific area
3. **Adjust** - Modify findings before generating
4. **Cancel** - Stop onboarding
```

## Decision Handling

**If user chooses "Proceed":** Return findings unchanged with `APPROVED: true`

**If user chooses "Re-explore":** Ask what area needs more exploration, return `NEEDS_MORE_EXPLORATION: <area>`

**If user chooses "Adjust":** Ask what to change, incorporate changes, return updated findings with `APPROVED: true`

**If user chooses "Cancel":** Return `CANCELLED: true`
