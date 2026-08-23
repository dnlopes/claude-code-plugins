---
name: adding-documentation
description: Use when adding focused documentation for a specific module, file, or topic to an already-onboarded repository — generates an ad-hoc doc or module AGENTS.md/CLAUDE.md with staleness tracking and optionally wires it into the root AGENTS.md. Supports --auto to skip confirmation.
---

# Adding Documentation

> Plugin root: `${CLAUDE_PLUGIN_ROOT}` (Claude Code and the OpenCode adapter both set this in the shell environment).

Generate a focused document for a specific target (path or topic) in a repo that already has core documentation.

## Critical Guidelines

- **You MUST load the `documenting-repositories` skill first** for format standards and the ad-hoc document template.
- **You MUST follow the steps in order** — identify, explore, propose, generate, link, validate, summary.
- **You MUST create TodoWrite todos for each step in the Workflow section** — one todo per Step, marked `in_progress` on entry and `completed` on exit. Multi-step workflows silently skip steps without explicit tracking.
- **You MUST get user confirmation** on the documentation plan unless the user invocation includes `--auto`.
- **You MUST ask before modifying `AGENTS.md`** to link the new doc — even with `--auto`, modifying the root index requires explicit confirmation.
- **You MUST include `scope.paths`, `scope.summary`, and `last_updated`** in every generated document — without these, `updating-documentation` cannot track it.

## When to Use

- **Use this skill** for focused documentation: a module, a file, a feature, a workflow.
- **Use `onboarding-repository`** instead when the repo has no documentation yet — that skill creates the full standard suite.
- **Use `updating-documentation`** when an existing tracked doc needs refreshing.

## Invocation

User invokes via `/curator:adding-documentation <path-or-topic> [--auto]`.

- `<path-or-topic>` — either a filesystem path (`src/auth/`, `lib/utils.ts`) or a free-text topic (`"authentication flow"`)
- `--auto` — skip the propose-and-confirm step (Step 2)
- If no argument is provided, ask the user what to document

## Workflow

### Step 0 — Identify Target

Parse the invocation argument:

**If a path is provided** (e.g., `src/auth`, `lib/utils.ts`):

```bash
ls -la <path>
```

Verify the path exists and determine whether it's a file or directory.

**If a topic is provided** (e.g., `"authentication flow"`):

Use Grep to find relevant files:

```bash
# Use Grep tool with relevant keywords
```

Identify the files most relevant to the topic — these become the scope.

**If no argument is provided:**

Ask the user:

```markdown
What would you like to document?
- A directory: `src/auth/`
- A file: `lib/utils.ts`
- A topic: "authentication flow"
```

### Step 1 — Explore

Launch the `curator:codebase-explorer` (OpenCode: `codebase-explorer`) agent via the Task tool (OpenCode: `task`) with a focused scope:

```
Description: Explore target for focused documentation
Prompt: Explore <target> and extract documentation-relevant information.
This is for a focused document, NOT full repository onboarding.

Focus on:
- Purpose of this code
- Key abstractions and public interfaces
- Dependencies (incoming and outgoing)
- Usage context (how is this code used)
- Patterns specific to this area

Return concise findings — only what's needed for a single focused document.
```

**Capture** the findings — needed in Steps 2 and 3.

### Step 2 — Propose

**Skip this step if the user invoked with `--auto`.**

Determine the output location based on target type:

| Target type | Output location |
|-------------|-----------------|
| Directory / module | `<path>/AGENTS.md` + `<path>/CLAUDE.md` |
| Single file | `docs/<filename-stem>.md` |
| Topic / feature | `docs/<kebab-case-topic>.md` |

Present the plan:

```markdown
## Documentation Plan

**Target:** <path or topic>
**Output:** <output location>
**Type:** <module-docs | ad-hoc-doc>

### Content Overview
- Purpose: <what this will document>
- Key sections: <list>

### Scope Tracking
Files to monitor for staleness:
- <path1>
- <path2>

### AGENTS.md Update
<For ad-hoc docs:>
Will offer to add reference to root AGENTS.md after generation.
<For module docs:>
Module-local AGENTS.md/CLAUDE.md pair — no root AGENTS.md change needed.

---

**Options:**
1. **Proceed** — Generate documentation
2. **Adjust** — Change scope, location, or sections
3. **Cancel**
```

Handle the response:

- **Proceed** → continue to Step 3
- **Adjust** → ask what to change, incorporate, re-present
- **Cancel** → stop and report

### Step 3 — Generate

Launch the `curator:doc-generator` (OpenCode: `doc-generator`) agent via the Task tool (OpenCode: `task`):

```
Description: Generate focused documentation
Prompt: Generate focused documentation for <target> using these findings:

<paste findings from Step 1>

Output location: <location from Step 2>
Document type: <module-docs | ad-hoc-doc>
Scope paths: <list>
Summary: <one-line description>

Read templates from:
${CLAUDE_PLUGIN_ROOT}/skills/documenting-repositories/reference/templates.md

For module-docs: use the "AGENTS.md (module)" template, plus generate a
CLAUDE.md containing only @AGENTS.md.

For ad-hoc-doc: use the "Ad-hoc document" template. Frontmatter MUST include
scope.paths, scope.summary, and last_updated.
```

**Capture** the agent's summary (created files, open TODOs).

### Step 4 — Link from AGENTS.md (ad-hoc docs only)

**Skip this step for module-docs** (they live alongside the code, no root linkage needed).

For ad-hoc docs (`docs/*.md`), check whether the root `AGENTS.md` has a Documentation section:

```bash
grep -A 20 "^## Documentation" AGENTS.md 2>/dev/null
```

If yes, present the proposed addition to the user:

```markdown
## Proposed AGENTS.md Update

Add to the Documentation section:

\`\`\`markdown
@docs/<new-file>.md

- [<Title>](docs/<new-file>.md) — <one-line description>
\`\`\`

Apply this change? (yes / no / edit)
```

**Always ask — even with `--auto`.** Modifying `AGENTS.md` is a separate decision from generating the new doc.

If the user approves, edit `AGENTS.md` to insert the dual-format reference (matching the existing style). If `AGENTS.md` has no Documentation section, skip the link step and note this in Step 6.

### Step 5 — Validate

Verify the new document:

```bash
# Frontmatter present and HTML-wrapped
head -1 <output-path>          # should be <!--

# Frontmatter contains required fields
head -10 <output-path>         # should include scope.paths, scope.summary, last_updated

# Scope paths point to real files
# (spot-check at least one path from scope.paths)
```

Self-check:

- [ ] First line is `<!--` (HTML-wrapped frontmatter)
- [ ] Frontmatter has `scope.paths`, `scope.summary`, `last_updated`
- [ ] `last_updated` is ISO 8601 UTC
- [ ] At least one path in `scope.paths` resolves to an existing file
- [ ] For module-docs: sibling `CLAUDE.md` contains only `@AGENTS.md`

**Critical:** Documents missing the required frontmatter fields will NOT be tracked by `/curator:updating-documentation` (OpenCode skill: `updating-documentation`). If validation fails, surface the issue in Step 6 rather than silently retrying.

### Step 6 — Summary

Report to the user:

```markdown
## Documentation Created

**File:** `<output-path>`
**Type:** <module-docs | ad-hoc-doc>
**Scope:** <summary>

### Staleness Tracking
Monitored paths:
- <path1>
- <path2>

### AGENTS.md
<One of:>
- Reference added to root AGENTS.md
- Reference declined by user
- Skipped (module-docs / no Documentation section in AGENTS.md)

### Open TODOs
<From doc-generator, or "None">

### Next Steps
1. Review the generated content
2. Run `/curator:validating-documentation` (OpenCode skill: `validating-documentation`) to verify system integrity
3. Commit
```

## Edge Cases

| Scenario | Approach |
|----------|----------|
| Target path doesn't exist | Ask the user to verify the path; offer topic-search as alternative |
| Target is already documented (tracked doc covers it) | Surface existing doc, ask: extend existing? create separate? cancel? |
| Topic is too broad (matches dozens of unrelated files) | Suggest narrowing — propose two or three sub-topics |
| No clear structural unit | Ask the user for guidance on scope boundaries |
| Repo has no `AGENTS.md` | Suggest running `/curator:onboarding-repository` (OpenCode skill: `onboarding-repository`) first; offer to continue creating just the ad-hoc doc anyway |
| Generated doc's `scope.paths` matches nothing | Treat as Step 5 failure; report to user with the offending pattern |
| Target is a single file in a large module | Default to ad-hoc-doc in `docs/`; offer module-docs as alternative |

## What NOT to Do

- Don't silently modify `AGENTS.md` — always confirm
- Don't generate a tracked doc without `scope.paths` / `scope.summary` / `last_updated`
- Don't create module-docs for simple modules — be conservative (same rule as `onboarding-repository`)
- Don't skip Step 5 validation — it catches missing-frontmatter failures
- Don't overwrite an existing tracked doc — offer to extend instead
