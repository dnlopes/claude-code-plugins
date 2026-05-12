<!--
---
scope:
  paths:
    - curator/**
  summary: "curator plugin technical documentation"
last_updated: 2026-05-12T23:14:02Z
---
-->

# curator

The curator plugin exists to keep repository documentation current for AI agent consumers. It generates structured documentation from codebase exploration, tracks staleness using git history against declared scope paths, and updates or validates docs on demand. It is self-hosting: curator documents this very repository, so changes to its internals directly affect future documentation runs.

## Responsibilities & Boundaries

**Owns:** Documentation generation, staleness detection, documentation update orchestration, and documentation validation for any repository it is applied to.

**Does NOT own:** Code quality enforcement (that's `governor`), code review (that's `review-toolkit`), or git workflow automation (that's `git-workflow`). Curator's output is documentation files — it does not modify source code.

**Hands off to:** The operator, after producing or validating documentation. Curator produces files and reports; it does not push commits or open PRs on its own.

## Key Abstractions

### Staleness Detection
**Represents:** The determination of whether a documentation file is out-of-date relative to the code it describes.
**Lives in:** `curator/scripts/find-tracked-docs.sh`, with supporting logic in `curator/agents/doc-analyzer.md`
**Invariants:** Staleness is computed by comparing the `last_updated` field in a doc's HTML-wrapped frontmatter against `git log` for the file paths listed in that doc's `scope.paths`. A doc with no `scope.paths` is considered untracked and will not be offered for update. Docs without HTML-wrapped frontmatter are invisible to the staleness system.

### HTML-Wrapped Frontmatter
**Represents:** The metadata block that makes a documentation file trackable — it carries `last_updated` and `scope.paths` in a YAML block wrapped in an HTML comment so it is invisible in rendered markdown.
**Lives in:** Declared in `curator/skills/documenting-repositories/reference/frontmatter-spec.md`; all generated docs must use this format.
**Invariants:** The opening `<!--` must be the literal first line of the file. The `last_updated` field must be ISO 8601 UTC. Missing or malformed frontmatter silently breaks staleness tracking — there is no error; the file is simply skipped.

### codebase-explorer Agent
**Represents:** The first-pass analysis agent that maps a repository's architecture, patterns, invariants, and complex modules before documentation is generated.
**Lives in:** `curator/agents/codebase-explorer.md`
**Invariants:** Its output is structured findings consumed by the doc-generator agent. It must produce scope paths for each document type. The quality of generated documentation is bounded by the quality of exploration findings.

### doc-generator Agent
**Represents:** The agent that transforms codebase-explorer findings into properly formatted documentation files on disk.
**Lives in:** `curator/agents/doc-generator.md`
**Invariants:** Must read templates from `curator/skills/documenting-repositories/reference/templates.md` — never from memory. All output files must use HTML-wrapped frontmatter. Must not include line numbers, code snippets, or function/parameter listings in generated output.

### doc-analyzer Agent
**Represents:** The agent that examines an existing documentation file and recommends updates based on code changes detected since `last_updated`.
**Lives in:** `curator/agents/doc-analyzer.md`
**Invariants:** Operates on a single document at a time. Reads the doc's `scope.paths` to determine which code paths to analyze. Produces a recommendation (update / no-change / review-needed), not a rewritten file — the operator decides whether to apply changes.

### Staleness-Reminder Hook
**Represents:** A passive, session-level trigger that nudges the model to refresh documentation when in-scope files are edited. Distinct from the agents (explicitly invoked) and the script (called by skills): the hook fires on its own as a background invariant-enforcer.
**Lives in:** `curator/hooks/` (registered via `hooks.json`; logic in `staleness-reminder.py`)
**Invariants:** Runs as a PostToolUse hook after write/edit tool uses. Matches the edited path against the `scope.paths` of every tracked doc and emits a reminder if any match. Deduplicates reminders per session so a single editing session never produces repeated noise. Respects a per-project opt-out and exposes an environment-variable mode switch that toggles between "suggest the updating-documentation workflow" and a more direct "update the docs now" nudge.

## Gotchas

- **Self-hosting risk:** Modifying curator skills changes how documentation will be generated on future runs. A broken skill may silently produce malformed docs. Test changes to curator against a non-critical repository before merging.
- **Frontmatter is load-bearing:** The `last_updated` and `scope.paths` fields in HTML-wrapped frontmatter are not decorative. Removing or malforming them breaks staleness tracking without any error — the doc simply disappears from the tracked set.
- **Template source is canonical:** The doc-generator agent must read templates from `curator/skills/documenting-repositories/reference/templates.md`. Using remembered or reconstructed templates will produce docs that drift from the spec, breaking future validation.
- **Exploration quality bounds output quality:** The codebase-explorer agent's findings are the sole input to documentation generation. If the explorer misses a pattern or invariant, the generated doc will omit it silently. There is no post-generation validation that checks completeness.
- **The hook installs itself into every session:** Once curator is installed, the staleness-reminder hook runs passively on every write/edit in matching scopes. Operators who find this intrusive need to know two knobs exist — a per-project opt-out, and an environment-variable mode switch that changes the hook from "suggest the workflow" to "nudge the model to update docs directly". Neither is discoverable from the skills themselves.

## Interactions

- **codebase-explorer → doc-generator:** Structured findings (architecture, patterns, scope paths, module list) flow from explorer to generator. These agents are decoupled by a handoff in the skill workflow — they do not call each other directly.
- **doc-analyzer → operator:** The analyzer produces a human-readable recommendation. The operator (or an orchestrating skill) decides whether to instruct doc-generator to rewrite the document.
- **find-tracked-docs.sh → staleness workflow:** The script queries git and the filesystem to produce a list of tracked docs with their staleness status. Skills that update docs invoke this script to determine which docs need attention.
- **Staleness-reminder hook → model:** The hook fires after the harness completes a write/edit, matches the edited path against tracked docs' `scope.paths`, and surfaces a reminder to the model in-session. Unlike the other interactions, this one is not driven by an operator-invoked skill — it operates passively at the session level, decoupled from the explicit workflows.
