---
name: onboarding-repository
description: Use when bootstrapping documentation for a repository for the first time — generates AGENTS.md, CLAUDE.md, README.md, and docs/*.md from codebase analysis using staged exploration, user review, and generation. Supports --auto to skip review.
---

# Onboarding Repository

> Plugin root: `${CLAUDE_PLUGIN_ROOT}` (Claude Code and the OpenCode adapter both set this in the shell environment).

Generate the full documentation suite for a repository in three stages: explore → review → generate → validate.

## Critical Guidelines

- **You MUST load the `documenting-repositories` skill first** for format standards, abstraction rules, and frontmatter spec.
- **You MUST follow the steps in order** — pre-flight, explore, review, generate, validate, summary.
- **You MUST create TodoWrite todos for each step in the Workflow section** — one todo per Step, marked `in_progress` on entry and `completed` on exit. Multi-step workflows silently skip steps without explicit tracking.
- **You MUST get user confirmation before generating files** unless the user invocation includes `--auto`.
- **You MUST NOT overwrite existing documentation without explicit user choice** (Regenerate / Complete / Cancel).
- **You MUST treat `README.md` as a separate decision** from the rest (Replace / Merge / Skip) — never replace silently.
- **You MUST verify generated outputs** in Step 4 before reporting success.

## When to Use

- **Use this skill** when a repository has no documentation, or partial documentation that needs filling in.
- **Use `adding-documentation`** instead for focused docs on a specific module / file / topic in an already-onboarded repo.
- **Use `updating-documentation`** instead when existing docs need refreshing based on code changes.

## Invocation

User invokes via `/curator:onboarding-repository [--auto]`.

- `--auto` — skip user review (Step 2); with an existing `README.md`, defaults to **Skip** (non-destructive).

## Workflow

### Step 0 — Pre-flight

Check which standard documents already exist:

```bash
ls AGENTS.md CLAUDE.md README.md docs/architecture.md docs/domain.md docs/patterns.md docs/development.md 2>/dev/null
```

Branch based on the result:

| State | Action |
|-------|--------|
| All standard docs exist | Present options: **Regenerate** (replace all), **Use updating-documentation instead**, **Cancel** |
| Some standard docs exist | Present options: **Complete** (generate missing only), **Regenerate** (replace all), **Cancel** |
| No standard docs | Proceed to Step 1 |

**`README.md` handling is a separate question** (always ask, even with `--auto`):

| README state | With `--auto` | Without `--auto` |
|--------------|----------------|------------------|
| Exists | Default to **Skip** | Ask: Replace / Merge / Skip |
| Does not exist | Generate from template | Generate from template |

Store the README action (`replace` / `merge` / `skip`) — needed in Step 3.

### Step 1 — Explore

Launch the `curator:codebase-explorer` (OpenCode: `codebase-explorer`) agent via the Task tool (OpenCode: `task`):

```
Description: Explore codebase for documentation
Prompt: Explore this repository and extract documentation-relevant information.
Return structured findings: project overview, tech stack, architecture,
patterns (as rules + rationale, anchored by file path or exported symbol —
NEVER line numbers, NEVER code snippets), invariants and gotchas,
complex modules, and scope paths for each document type.

Capture durable, non-derivable knowledge only. Skip anything an agent could
discover in seconds with `grep` or `ls` (function lists, parameter lists,
file listings, dependency lists, version numbers).
```

**Capture** the structured findings — needed in Steps 2 and 3.

### Step 2 — Review

**Skip this step if the user invoked with `--auto`.**

Present a concise summary to the user. Use this template:

```markdown
## Repository Analysis

**Project:** <name from findings>
**Type:** <type from findings>
**Tech Stack:** <stack from findings>

### Complex Modules
<List paths and reasons, or "None identified">

### Documentation Plan
Will generate:
- `README.md` — <Replace | Merge | Skip>
- `AGENTS.md`, `CLAUDE.md`
- `docs/architecture.md`
- `docs/domain.md` <or "Skipped — technical project with no business domain">
- `docs/patterns.md`
- `docs/development.md`
<For each complex module:>
- `<path>/AGENTS.md`, `<path>/CLAUDE.md`

### Scope Tracking
Each document will track specific file patterns for staleness detection.

---

**Options:**
1. **Proceed** — Generate with these findings
2. **Re-explore** — Gather more information about a specific area
3. **Adjust** — Modify findings before generating
4. **Cancel** — Stop onboarding
```

Handle the user's choice:

- **Proceed** → continue to Step 3
- **Re-explore** → ask what area needs more exploration, then return to Step 1 with a focused target
- **Adjust** → ask what to change, incorporate, re-present
- **Cancel** → stop and report cancellation

### Step 3 — Generate

Launch the `curator:doc-generator` (OpenCode: `doc-generator`) agent via the Task tool (OpenCode: `task`):

```
Description: Generate documentation files
Prompt: Generate documentation files from these findings:

<paste the full findings from Step 1>

README action: <action from Step 0 — replace | merge | skip>

Read templates from:
${CLAUDE_PLUGIN_ROOT}/skills/documenting-repositories/reference/templates.md

Generate (in order):
1. README.md (only if action is replace or merge)
2. AGENTS.md (root)
3. CLAUDE.md (root)
4. docs/architecture.md
5. docs/domain.md (skip for purely technical projects)
6. docs/patterns.md
7. docs/development.md
8. Module AGENTS.md / CLAUDE.md pairs for complex modules listed in findings
```

**Capture** the agent's summary (created files, skipped files, open TODOs).

### Step 4 — Validate

Verify outputs locally:

```bash
# Files exist
ls README.md AGENTS.md CLAUDE.md docs/*.md 2>/dev/null

# Frontmatter is HTML-wrapped (first line should be <!-- for all except CLAUDE.md)
for f in AGENTS.md docs/*.md README.md; do
  [ -f "$f" ] && echo "$f: $(head -1 "$f")"
done

# CLAUDE.md is single-line @AGENTS.md
[ -f CLAUDE.md ] && cat CLAUDE.md
```

Self-check:

- [ ] All tracked docs start with `<!--` (HTML-wrapped frontmatter)
- [ ] `CLAUDE.md` contains only `@AGENTS.md`
- [ ] Build commands use the build system, not raw commands
- [ ] `README.md` links to `docs/` resolve (if generated/merged)

If any check fails, report it in Step 5 as a follow-up rather than silently retrying.

### Step 5 — Summary

Report back to the user:

```markdown
## Onboarding Complete

### Generated
- `README.md` — Project overview <or "Skipped" / "Merged">
- `AGENTS.md` — Main agent documentation
- `CLAUDE.md` — Redirect
- `docs/architecture.md` — System design
- `docs/domain.md` — Business concepts <or "Skipped — technical project">
- `docs/patterns.md` — Code conventions
- `docs/development.md` — Build/test/run
<Module docs if any>

### Open TODOs
<List from doc-generator's output, or "None">

### Next Steps
1. Review generated documentation
2. Run `/curator:validating-documentation` (OpenCode skill: `validating-documentation`) to verify system integrity
3. Commit the documentation
```

## Edge Cases

| Scenario | Approach |
|----------|----------|
| Monorepo | Root-level docs; only complex sub-projects get their own `AGENTS.md` |
| No build system detected | Generate `development.md` with raw commands and a clearly-marked TODO |
| Empty or near-empty repo | Generate minimal docs; flag limited findings in the summary |
| Existing `CLAUDE.md` with content | Migrate content to `AGENTS.md`, then replace `CLAUDE.md` with `@AGENTS.md` |
| No `LICENSE` file | Omit the License section from `README.md` entirely |
| No `package.json` / `Makefile` | `README.md` Installation says `See [Development](docs/development.md)` |
| Malformed existing `README.md` during merge | Best-effort parse; append missing sections at end |
| `--auto` with existing `README.md` | Default to **Skip** (non-destructive) |
| User picks Re-explore in Step 2 | Re-run Step 1 with a focused exploration target, then return to Step 2 |

## What NOT to Do

- Don't regenerate without explicit user confirmation (unless `--auto`)
- Don't silently replace an existing `README.md`
- Don't generate `domain.md` for purely technical projects
- Don't create module `AGENTS.md` files for simple modules — be conservative
- Don't skip Step 4 validation — it catches the most common generation failures
